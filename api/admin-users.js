const {
  createClient,
} = require("@supabase/supabase-js");

const allowedMenuPermissions =
  new Set([
    "appointments",
    "clients",
    "loyalty",
    "giftClients",
    "referrals",
    "potentialClients",
    "inactiveClients",
    "availableAppointments",
    "giftCards",
    "printFrame",
    "invoices",
    "purchases",
    "finance",
    "incomeExpenses",
    "settings",
  ]);

const allowedActionPermissions =
  new Set([
    "add",
    "edit",
    "delete",
    "backup",
    "restore",
    "security",
    "server",
  ]);

const allowedRoles =
  new Set([
    "owner",
    "manager",
    "employee",
  ]);

const normalizePermissions = (
  value,
  allowedValues
) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return [
    ...new Set(
      value.filter(
        (permission) =>
          allowedValues.has(
            permission
          )
      )
    ),
  ];
};

module.exports =
  async function handler(
    request,
    response
  ) {
    response.setHeader(
      "Cache-Control",
      "no-store"
    );

    if (
      request.method !== "POST"
    ) {
      response.setHeader(
        "Allow",
        "POST"
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
      console.error(
        "Missing secure Supabase server environment variables."
      );

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
        error:
          authenticatedUserError,
      } =
        await adminSupabase.auth.getUser(
          accessToken
        );

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
        data: administratorAccount,
        error:
          administratorAccountError,
      } =
        await adminSupabase
          .from(
            "employee_accounts"
          )
          .select(
            [
              "id",
              "active",
              "is_super_admin",
            ].join(",")
          )
          .eq(
            "auth_user_id",
            authenticatedUser.id
          )
          .eq(
            "active",
            true
          )
          .eq(
            "is_super_admin",
            true
          )
          .maybeSingle();

      if (
        administratorAccountError
      ) {
        throw administratorAccountError;
      }

      if (
        !administratorAccount
      ) {
        return response
          .status(403)
          .json({
            error:
              "لا تملك صلاحية إنشاء الحسابات.",
          });
      }

      let requestBody =
        request.body || {};

      if (
        typeof requestBody ===
        "string"
      ) {
        try {
          requestBody =
            JSON.parse(
              requestBody
            );
        } catch {
          return response
            .status(400)
            .json({
              error:
                "بيانات الطلب غير صالحة.",
            });
        }
      }

      const username =
        String(
          requestBody.username ||
            ""
        )
          .trim()
          .toLowerCase();

      const displayName =
        String(
          requestBody
            .displayName || ""
        ).trim();

      const password =
        String(
          requestBody.password ||
            ""
        );

      const requestedRole =
        String(
          requestBody.role ||
            "employee"
        );

      const role =
        allowedRoles.has(
          requestedRole
        )
          ? requestedRole
          : "employee";

      const menuPermissions =
        normalizePermissions(
          requestBody
            .menuPermissions,
          allowedMenuPermissions
        );

      const actionPermissions =
        normalizePermissions(
          requestBody
            .actionPermissions,
          allowedActionPermissions
        );

      const active =
        requestBody.active !==
        false;

      if (
        !/^[a-z0-9._-]{3,32}$/.test(
          username
        )
      ) {
        return response
          .status(400)
          .json({
            error:
              "معرف الدخول يجب أن يكون من 3 إلى 32 حرفًا إنجليزيًا أو رقمًا.",
          });
      }

      if (!displayName) {
        return response
          .status(400)
          .json({
            error:
              "اسم الموظف مطلوب.",
          });
      }

      if (
        password.length < 8
      ) {
        return response
          .status(400)
          .json({
            error:
              "كلمة المرور يجب ألا تقل عن 8 خانات.",
          });
      }

      const loginEmail =
        `${username}@paradisespa.local`;

      const {
        data:
          existingEmployeeAccount,
        error:
          existingEmployeeError,
      } =
        await adminSupabase
          .from(
            "employee_accounts"
          )
          .select("id")
          .eq(
            "username",
            username
          )
          .maybeSingle();

      if (
        existingEmployeeError
      ) {
        throw existingEmployeeError;
      }

      if (
        existingEmployeeAccount
      ) {
        return response
          .status(409)
          .json({
            error:
              "معرف الدخول مستخدم مسبقًا.",
          });
      }

      const {
        data: createdAuthData,
        error: createAuthError,
      } =
        await adminSupabase
          .auth.admin.createUser(
            {
              email:
                loginEmail,

              password,

              email_confirm:
                true,

              user_metadata: {
                username,
                display_name:
                  displayName,
              },
            }
          );

      if (
        createAuthError ||
        !createdAuthData?.user?.id
      ) {
        console.error(
          "Supabase Auth user creation error:",
          createAuthError
        );

        const authErrorText =
          String(
            createAuthError
              ?.message || ""
          ).toLowerCase();

        const duplicateUser =
          authErrorText.includes(
            "already"
          ) ||
          authErrorText.includes(
            "registered"
          ) ||
          authErrorText.includes(
            "exists"
          );

        return response
          .status(
            duplicateUser
              ? 409
              : 500
          )
          .json({
            error:
              duplicateUser
                ? "يوجد حساب تسجيل دخول بهذا المعرف مسبقًا."
                : "تعذر إنشاء حساب تسجيل الدخول.",
          });
      }

      const createdAuthUser =
        createdAuthData.user;

      const {
        data:
          createdEmployeeAccount,
        error:
          createEmployeeError,
      } =
        await adminSupabase
          .from(
            "employee_accounts"
          )
          .insert({
            auth_user_id:
              createdAuthUser.id,

            username,

            display_name:
              displayName,

            role,

            menu_permissions:
              menuPermissions,

            action_permissions:
              actionPermissions,

            active,

            is_super_admin:
              false,

            permissions_version:
              1,

            created_at:
              new Date()
                .toISOString(),

            updated_at:
              new Date()
                .toISOString(),
          })
          .select(
            [
              "id",
              "auth_user_id",
              "username",
              "display_name",
              "role",
              "menu_permissions",
              "action_permissions",
              "active",
              "is_super_admin",
              "permissions_version",
            ].join(",")
          )
          .single();

      if (
        createEmployeeError
      ) {
        console.error(
          "Employee account creation error:",
          createEmployeeError
        );

        try {
          await adminSupabase
            .auth.admin.deleteUser(
              createdAuthUser.id
            );
        } catch (
          rollbackError
        ) {
          console.error(
            "Auth rollback error:",
            rollbackError
          );
        }

        return response
          .status(500)
          .json({
            error:
              "تعذر حفظ صلاحيات الحساب، وتم إلغاء مستخدم تسجيل الدخول.",
          });
      }

      return response
        .status(201)
        .json({
          success: true,

          account:
            createdEmployeeAccount,
        });
    } catch (error) {
      console.error(
        "Secure employee account API error:",
        error
      );

      return response
        .status(500)
        .json({
          error:
            "حدث خطأ داخلي أثناء إنشاء الحساب.",
        });
    }
  };
  