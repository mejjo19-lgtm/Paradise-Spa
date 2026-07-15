const {
  createClient,
} = require("@supabase/supabase-js");

const hasPermission = (
  account,
  permission
) =>
  Boolean(
    account?.is_super_admin ||
      account?.role === "owner" ||
      account?.action_permissions ===
        "all" ||
      (Array.isArray(
        account?.action_permissions
      ) &&
        account.action_permissions.includes(
          permission
        ))
  );

const parseRequestBody = (body) => {
  if (
    typeof body !== "string"
  ) {
    return body || {};
  }

  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
};

const callDeleteClientRpc = async ({
  supabaseUrl,
  serviceRoleKey,
  accessToken,
  clientId,
}) => {
  const rpcResponse = await fetch(
    `${supabaseUrl}/rest/v1/rpc/delete_client_safely`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization:
          `Bearer ${accessToken}`,
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        p_client_id: clientId,
      }),
    }
  );

  let data = {};

  try {
    data = await rpcResponse.json();
  } catch {
    data = {};
  }

  return {
    ok: rpcResponse.ok,
    data,
  };
};

const restoreReferralLinks = async (
  adminSupabase,
  referralLinks
) => {
  if (!referralLinks.length) {
    return null;
  }

  const {
    error,
  } = await adminSupabase
    .from("client_referral_links")
    .upsert(referralLinks, {
      onConflict: "id",
    });

  return error || null;
};

module.exports = async function handler(
  request,
  response
) {
  response.setHeader(
    "Cache-Control",
    "no-store"
  );

  if (request.method !== "DELETE") {
    response.setHeader(
      "Allow",
      "DELETE"
    );

    return response.status(405).json({
      error: "Method not allowed",
    });
  }

  const supabaseUrl =
    process.env.SUPABASE_URL;
  const serviceRoleKey =
    process.env
      .SUPABASE_SERVICE_ROLE_KEY;

  if (
    !supabaseUrl ||
    !serviceRoleKey
  ) {
    return response.status(500).json({
      error:
        "إعدادات الخادم غير مكتملة.",
    });
  }

  const authorization = String(
    request.headers.authorization || ""
  );
  const accessToken =
    authorization.startsWith("Bearer ")
      ? authorization.slice(7).trim()
      : "";

  if (!accessToken) {
    return response.status(401).json({
      error:
        "يجب تسجيل الدخول أولًا.",
    });
  }

  const requestBody =
    parseRequestBody(request.body);
  const clientId = Number(
    requestBody.clientId
  );

  if (
    !Number.isInteger(clientId) ||
    clientId <= 0
  ) {
    return response.status(400).json({
      error:
        "معرّف العميلة غير صالح.",
    });
  }

  const adminSupabase = createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  let deletedReferralLinks = [];

  try {
    const {
      data: userData,
      error: userError,
    } = await adminSupabase.auth.getUser(
      accessToken
    );
    const authUser = userData?.user;

    if (
      userError ||
      !authUser?.id
    ) {
      return response.status(401).json({
        error:
          "جلسة الدخول غير صالحة.",
      });
    }

    const {
      data: account,
      error: accountError,
    } = await adminSupabase
      .from("employee_accounts")
      .select(
        "active,role,is_super_admin,action_permissions"
      )
      .eq(
        "auth_user_id",
        authUser.id
      )
      .eq("active", true)
      .maybeSingle();

    if (
      accountError ||
      !account ||
      !hasPermission(
        account,
        "delete"
      )
    ) {
      return response.status(403).json({
        error:
          "لا تملك صلاحية حذف العميلات.",
      });
    }

    const {
      data: securityRow,
      error: securityError,
    } = await adminSupabase
      .from("app_data")
      .select("data")
      .eq(
        "data_key",
        "settingsSecurity"
      )
      .maybeSingle();

    if (securityError) {
      throw securityError;
    }

    const security =
      securityRow?.data || {};

    if (security.systemFrozen) {
      return response.status(423).json({
        error:
          "النظام مجمّد حاليًا.",
      });
    }

    if (security.deleteLocked) {
      return response.status(423).json({
        error:
          "الحذف مقفل حاليًا من إعدادات الأمان.",
      });
    }

    const {
      data: client,
      error: clientError,
    } = await adminSupabase
      .from("clients")
      .select("id")
      .eq("id", clientId)
      .maybeSingle();

    if (clientError) {
      throw clientError;
    }

    if (!client) {
      return response.status(404).json({
        error:
          "العميلة غير موجودة.",
      });
    }

    const referralFilter =
      `referred_client_id.eq.${clientId},source_client_id.eq.${clientId}`;

    const {
      data: referralLinks,
      error: referralLinksError,
    } = await adminSupabase
      .from("client_referral_links")
      .select("*")
      .or(referralFilter);

    if (referralLinksError) {
      throw referralLinksError;
    }

    if (!referralLinks?.length) {
      return response.status(409).json({
        error:
          "تعذر العثور على سجل الترشيح المرتبط بالعميلة.",
      });
    }

    const {
      data: removedLinks,
      error: removeLinksError,
    } = await adminSupabase
      .from("client_referral_links")
      .delete()
      .or(referralFilter)
      .select("*");

    if (removeLinksError) {
      throw removeLinksError;
    }

    deletedReferralLinks =
      removedLinks || [];

    if (
      deletedReferralLinks.length !==
      referralLinks.length
    ) {
      throw new Error(
        "Not all referral links were removed"
      );
    }

    const rpcResult =
      await callDeleteClientRpc({
        supabaseUrl,
        serviceRoleKey,
        accessToken,
        clientId,
      });

    if (
      rpcResult.ok &&
      rpcResult.data?.success
    ) {
      return response.status(200).json(
        rpcResult.data
      );
    }

    const restoreError =
      await restoreReferralLinks(
        adminSupabase,
        deletedReferralLinks
      );

    if (restoreError) {
      throw restoreError;
    }

    deletedReferralLinks = [];

    return response.status(409).json({
      error:
        rpcResult.data?.message ||
        "تعذر حذف العميلة بسبب بيانات محفوظة مرتبطة بها.",
    });
  } catch (error) {
    let rollbackError = null;

    if (deletedReferralLinks.length) {
      rollbackError =
        await restoreReferralLinks(
          adminSupabase,
          deletedReferralLinks
        );

      if (rollbackError) {
        console.error(
          "Client referral emergency rollback error:",
          rollbackError
        );
      } else {
        deletedReferralLinks = [];
      }
    }

    console.error(
      "Secure referred client delete error:",
      error
    );

    return response.status(500).json({
      error:
        rollbackError
          ? "لم يتم حذف العميلة، وتعذر استعادة سجل الترشيح تلقائيًا."
          : "تعذر حذف العميلة. لم يتم تغيير بياناتها.",
    });
  }
};
