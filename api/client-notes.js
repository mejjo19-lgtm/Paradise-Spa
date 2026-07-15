const {
  createClient,
} = require("@supabase/supabase-js");

const noteFields = [
  "id",
  "client_id",
  "note_text",
  "created_by_auth_user_id",
  "created_by_name",
  "source",
  "source_key",
  "created_at",
].join(",");

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

module.exports = async function handler(
  request,
  response
) {
  response.setHeader(
    "Cache-Control",
    "no-store"
  );

  if (
    request.method !== "PATCH" &&
    request.method !== "DELETE"
  ) {
    response.setHeader(
      "Allow",
      "PATCH, DELETE"
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
      error: "يجب تسجيل الدخول أولًا.",
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
        error: "جلسة الدخول غير صالحة.",
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
      .eq("auth_user_id", authUser.id)
      .eq("active", true)
      .maybeSingle();

    const requiredPermission =
      request.method === "DELETE"
        ? "delete"
        : "edit";

    if (
      accountError ||
      !account ||
      !hasPermission(
        account,
        requiredPermission
      )
    ) {
      return response.status(403).json({
        error:
          request.method === "DELETE"
            ? "لا تملك صلاحية حذف الملاحظات."
            : "لا تملك صلاحية تعديل الملاحظات.",
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

    if (
      request.method === "DELETE" &&
      security.deleteLocked
    ) {
      return response.status(423).json({
        error:
          "الحذف مقفل حاليًا من إعدادات الأمان.",
      });
    }

    const noteId = String(
      request.body?.noteId || ""
    ).trim();
    const clientId = Number(
      request.body?.clientId
    );

    if (
      !noteId ||
      !Number.isInteger(clientId) ||
      clientId <= 0
    ) {
      return response.status(400).json({
        error:
          "بيانات الملاحظة غير مكتملة.",
      });
    }

    const {
      data: existingNote,
      error: existingNoteError,
    } = await adminSupabase
      .from("client_notes")
      .select(noteFields)
      .eq("id", noteId)
      .eq("client_id", clientId)
      .maybeSingle();

    if (
      existingNoteError ||
      !existingNote
    ) {
      return response.status(404).json({
        error: "الملاحظة غير موجودة.",
      });
    }

    if (
      existingNote.source ===
      "legacy_clients_notes"
    ) {
      return response.status(409).json({
        error:
          "الملاحظة المستوردة لا يمكن تعديلها أو حذفها.",
      });
    }

    if (request.method === "PATCH") {
      const noteText = String(
        request.body?.noteText || ""
      ).trim();

      if (
        !noteText ||
        noteText.length > 5000
      ) {
        return response.status(400).json({
          error:
            "نص الملاحظة يجب أن يكون بين 1 و5000 حرف.",
        });
      }

      const {
        data: updatedNote,
        error: updateError,
      } = await adminSupabase
        .from("client_notes")
        .update({ note_text: noteText })
        .eq("id", noteId)
        .eq("client_id", clientId)
        .select(noteFields)
        .single();

      if (
        updateError ||
        !updatedNote
      ) {
        throw updateError;
      }

      return response.status(200).json({
        success: true,
        note: updatedNote,
      });
    }

    const {
      data: deletedNote,
      error: deleteError,
    } = await adminSupabase
      .from("client_notes")
      .delete()
      .eq("id", noteId)
      .eq("client_id", clientId)
      .select("id")
      .single();

    if (
      deleteError ||
      !deletedNote?.id
    ) {
      throw deleteError;
    }

    return response.status(200).json({
      success: true,
      deletedNoteId: deletedNote.id,
    });
  } catch (error) {
    console.error(
      "Secure client note mutation error:",
      error
    );
    return response.status(500).json({
      error:
        "تعذر حفظ التغيير على الملاحظة.",
    });
  }
};
