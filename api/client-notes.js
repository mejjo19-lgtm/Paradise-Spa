const {
  createClient,
} = require("@supabase/supabase-js");

const noteSelect = [
  "id",
  "client_id",
  "note_text",
  "created_by_auth_user_id",
  "created_by_name",
  "source",
  "source_key",
  "created_at",
].join(",");

const hasActionPermission = (
  account,
  action
) => {
  if (
    account?.is_super_admin ||
    account?.role === "owner"
  ) {
    return true;
  }

  if (
    account?.action_permissions ===
    "all"
  ) {
    return true;
  }

  return Array.isArray(
    account?.action_permissions
  ) &&
    account.action_permissions.includes(
      action
    );
};

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

    return response
      .status(405)
      .json({
        error:
          "Method not allowed",
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
    return response
      .status(500)
      .json({
        error:
          "إعدادات الخادم غير مكتملة.",
      });
  }

  const authorizationHeader =
    String(
      request.headers
        .authorization || ""
    );

  const accessToken =
    authorizationHeader.startsWith(
      "Bearer "
    )
      ? authorizationHeader
          .slice(7)
          .trim()
      : "";

  if (!accessToken) {
    return response
      .status(401)
      .json({
        error:
          "يجب تسجيل الدخول أولًا.",
      });
  }

  const adminSupabase =
    createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken:
            false,
          persistSession:
            false,
        },
      }
    );

  try {
    const {
      data: authenticatedUserData,
      error: authenticatedUserError,
    } = await adminSupabase.auth
      .getUser(accessToken);

    const authenticatedUser =
      authenticatedUserData?.user;

    if (
      authenticatedUserError ||
      !authenticatedUser?.id
    ) {
      return response
        .status(401)
        .json({
          error:
            "جلسة الدخول غير صالحة.",
        });
    }

    const {
      data: employeeAccount,
      error: employeeAccountError,
    } = await adminSupabase
      .from("employee_accounts")
      .select(
        [
          "id",
          "active",
          "role",
          "is_super_admin",
          "action_permissions",
        ].join(",")
      )
      .eq(
        "auth_user_id",
        authenticatedUser.id
      )
      .eq("active", true)
      .maybeSingle();

    if (
      employeeAccountError ||
      !employeeAccount
    ) {
      return response
        .status(403)
        .json({
          error:
            "الحساب غير نشط أو لا يملك صلاحية الوصول.",
        });
    }

    const requiredAction =
      request.method === "DELETE"
        ? "delete"
        : "edit";

    if (
      !hasActionPermission(
        employeeAccount,
        requiredAction
      )
    ) {
      return response
        .status(403)
        .json({
          error:
            request.method ===
            "DELETE"
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
      return response
        .status(500)
        .json({
          error:
            "تعذر التحقق من إعدادات الأمان.",
        });
    }

    const securitySettings =
      securityRow?.data || {};

    if (
      securitySettings.systemFrozen
    ) {
      return response
        .status(423)
        .json({
          error:
            "النظام مجمّد حاليًا؛ لا يمكن تعديل الملاحظات.",
        });
    }

    if (
      request.method === "DELETE" &&
      securitySettings.deleteLocked
    ) {
      return response
        .status(423)
        .json({
          error:
            "الحذف مقفل حاليًا من إعدادات الأمان.",
        });
    }

    const noteId =
      String(
        request.body?.noteId || ""
      ).trim();

    const clientId =
      Number(
        request.body?.clientId
      );

    if (
      !noteId ||
      noteId.length > 120 ||
      !Number.isInteger(clientId) ||
      clientId <= 0
    ) {
      return response
        .status(400)
        .json({
          error:
            "بيانات الملاحظة غير مكتملة.",
        });
    }

    const {
      data: existingNote,
      error: existingNoteError,
    } = await adminSupabase
      .from("client_notes")
      .select(noteSelect)
      .eq("id", noteId)
      .eq("client_id", clientId)
      .maybeSingle();

    if (
      existingNoteError ||
      !existingNote
    ) {
      return response
        .status(404)
        .json({
          error:
            "الملاحظة غير موجودة.",
        });
    }

    if (
      existingNote.source ===
      "legacy_clients_notes"
    ) {
      return response
        .status(409)
        .json({
          error:
            "الملاحظة المستوردة لا يمكن تعديلها أو حذفها من السجل الجديد.",
        });
    }

    if (
      request.method === "PATCH"
    ) {
      const noteText =
        String(
          request.body?.noteText ||
            ""
        ).trim();

      if (
        !noteText ||
        noteText.length > 5000
      ) {
        return response
          .status(400)
          .json({
            error:
              "نص الملاحظة يجب أن يكون بين 1 و5000 حرف.",
          });
      }

      const {
        data: updatedNote,
        error: updateError,
      } = await adminSupabase
        .from("client_notes")
        .update({
          note_text: noteText,
        })
        .eq("id", noteId)
        .eq("client_id", clientId)
        .select(noteSelect)
        .single();

      if (
        updateError ||
        !updatedNote
      ) {
        throw updateError ||
          new Error(
            "Client note update returned no row"
          );
      }

      return response
        .status(200)
        .json({
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
      throw deleteError ||
        new Error(
          "Client note delete returned no row"
        );
    }

    return response
      .status(200)
      .json({
        success: true,
        deletedNoteId:
          deletedNote.id,
      });
  } catch (error) {
    console.error(
      "Secure client note mutation error:",
      error
    );

    return response
      .status(500)
      .json({
        error:
          "تعذر حفظ التغيير على الملاحظة.",
      });
  }
};
