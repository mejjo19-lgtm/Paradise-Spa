const {
  createClient,
} = require("@supabase/supabase-js");

const backupTables =
  Object.freeze([
    "app_data",
    "client_last_order_backfill_audit",
    "clients",
    "daily_reports",
    "employee_accounts",
    "gift_clients",
    "invoice_audit_logs",
    "invoice_buyer_snapshots",
    "invoice_electronic_preparation_jobs",
    "invoice_fiscal_documents",
    "invoice_line_snapshots",
    "invoice_number_counter",
    "invoice_prelaunch_records",
    "invoice_prelaunch_sessions",
    "invoice_preparation_control",
    "invoices",
    "invoice_seller_profile",
    "invoice_seller_snapshots",
    "invoice_zatca_submissions",
    "potential_clients",
    "purchases",
    "referred_clients",
    "schedule_rows",
    "zatca_connection_status",
    "zatca_icv_counter",
  ]);

const parseRequestBody = (
  request
) => {
  if (
    !request.body
  ) {
    return {};
  }

  if (
    typeof request.body ===
    "object"
  ) {
    return request.body;
  }

  try {
    return JSON.parse(
      request.body
    );
  } catch {
    return null;
  }
};

const getAccessToken = (
  request
) => {
  const authorizationHeader =
    String(
      request.headers
        .authorization || ""
    );

  if (
    !authorizationHeader.startsWith(
      "Bearer "
    )
  ) {
    return "";
  }

  return authorizationHeader
    .slice(7)
    .trim();
};

const normalizeInteger = (
  value,
  fallback,
  minimum,
  maximum
) => {
  const parsedValue =
    Number(value);

  if (
    !Number.isFinite(
      parsedValue
    )
  ) {
    return fallback;
  }

  return Math.min(
    maximum,
    Math.max(
      minimum,
      Math.floor(
        parsedValue
      )
    )
  );
};

const sanitizeAuthUser = (
  user
) => ({
  id:
    user.id || "",

  email:
    user.email || "",

  phone:
    user.phone || "",

  role:
    user.role || "",

  aud:
    user.aud || "",

  created_at:
    user.created_at || "",

  updated_at:
    user.updated_at || "",

  last_sign_in_at:
    user.last_sign_in_at || "",

  confirmed_at:
    user.confirmed_at || "",

  email_confirmed_at:
    user.email_confirmed_at || "",

  phone_confirmed_at:
    user.phone_confirmed_at || "",

  banned_until:
    user.banned_until || "",

  deleted_at:
    user.deleted_at || "",

  is_anonymous:
    Boolean(
      user.is_anonymous
    ),

  app_metadata:
    user.app_metadata || {},

  user_metadata:
    user.user_metadata || {},

  identities:
    Array.isArray(
      user.identities
    )
      ? user.identities.map(
          (identity) => ({
            id:
              identity.id || "",

            user_id:
              identity.user_id || "",

            identity_data:
              identity.identity_data ||
              {},

            provider:
              identity.provider || "",

            created_at:
              identity.created_at || "",

            updated_at:
              identity.updated_at || "",

            last_sign_in_at:
              identity.last_sign_in_at ||
              "",
          })
        )
      : [],
});

module.exports =
  async function handler(
    request,
    response
  ) {
    response.setHeader(
      "Cache-Control",
      "no-store"
    );

    response.setHeader(
      "Content-Type",
      "application/json; charset=utf-8"
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
      process.env
        .SUPABASE_URL;

    const serviceRoleKey =
      process.env
        .SUPABASE_SERVICE_ROLE_KEY;

    if (
      !supabaseUrl ||
      !serviceRoleKey
    ) {
      console.error(
        "Backup API environment variables are missing."
      );

      return response
        .status(500)
        .json({
          error:
            "إعدادات خادم النسخ الاحتياطي غير مكتملة.",
        });
    }

    const accessToken =
      getAccessToken(
        request
      );

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
        data:
          authenticatedUserData,
        error:
          authenticatedUserError,
      } =
        await adminSupabase
          .auth.getUser(
            accessToken
          );

      const authenticatedUser =
        authenticatedUserData
          ?.user;

      if (
        authenticatedUserError ||
        !authenticatedUser?.id
      ) {
        return response
          .status(401)
          .json({
            error:
              "جلسة تسجيل الدخول غير صالحة.",
          });
      }

      const {
        data:
          administratorAccount,
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
              "لا تملك صلاحية إنشاء النسخ الاحتياطية.",
          });
      }

      const requestBody =
        parseRequestBody(
          request
        );

      if (!requestBody) {
        return response
          .status(400)
          .json({
            error:
              "بيانات الطلب غير صحيحة.",
          });
      }

      const action =
        String(
          requestBody.action ||
            ""
        ).trim();

      if (
        action === "manifest"
      ) {
        return response
          .status(200)
          .json({
            app:
              "Paradise Spa",

            formatVersion:
              "paradise-backup-v2",

            generatedAt:
              new Date()
                .toISOString(),

            publicTableCount:
              backupTables.length,

            tables:
              backupTables,

            includesAuthUserInventory:
              true,

            includesAuthPasswords:
              false,

            includesDatabaseSchema:
              false,

            storageCheckRequired:
              true,
          });
      }

      if (
        action === "table"
      ) {
        const tableName =
          String(
            requestBody.tableName ||
              ""
          ).trim();

        if (
          !backupTables.includes(
            tableName
          )
        ) {
          return response
            .status(400)
            .json({
              error:
                "الجدول المطلوب غير مسموح به.",
            });
        }

        const offset =
          normalizeInteger(
            requestBody.offset,
            0,
            0,
            100000000
          );

        const limit =
          normalizeInteger(
            requestBody.limit,
            500,
            1,
            1000
          );

        const {
          data,
          error,
          count,
        } =
          await adminSupabase
            .from(
              tableName
            )
            .select(
              "*",
              {
                count:
                  "exact",
              }
            )
            .range(
              offset,
              offset +
                limit -
                1
            );

        if (error) {
          console.error(
            `Backup table read error (${tableName}):`,
            error
          );

          return response
            .status(500)
            .json({
              error:
                `تعذر قراءة جدول ${tableName}.`,
            });
        }

        const rows =
          data || [];

        const totalCount =
          Number(
            count || 0
          );

        const nextOffset =
          offset +
            rows.length <
          totalCount
            ? offset +
              rows.length
            : null;

        return response
          .status(200)
          .json({
            tableName,
            offset,
            limit,
            totalCount,
            returnedCount:
              rows.length,
            nextOffset,
            rows,
          });
      }

      if (
        action === "auth-users"
      ) {
        const page =
          normalizeInteger(
            requestBody.page,
            1,
            1,
            1000000
          );

        const perPage =
          normalizeInteger(
            requestBody.perPage,
            100,
            1,
            1000
          );

        const {
          data,
          error,
        } =
          await adminSupabase
            .auth.admin
            .listUsers({
              page,
              perPage,
            });

        if (error) {
          console.error(
            "Backup auth users read error:",
            error
          );

          return response
            .status(500)
            .json({
              error:
                "تعذر قراءة قائمة مستخدمي تسجيل الدخول.",
            });
        }

        const users =
          (
            data?.users || []
          ).map(
            sanitizeAuthUser
          );

        return response
          .status(200)
          .json({
            page,
            perPage,
            total:
              Number(
                data?.total ||
                  users.length
              ),

            nextPage:
              data?.nextPage ||
              (
                users.length ===
                perPage
                  ? page + 1
                  : null
              ),

            users,
          });
      }

      if (
        action ===
        "storage-buckets"
      ) {
        const {
          data,
          error,
        } =
          await adminSupabase
            .storage
            .listBuckets();

        if (error) {
          console.error(
            "Backup storage buckets read error:",
            error
          );

          return response
            .status(500)
            .json({
              error:
                "تعذر فحص ملفات Storage.",
            });
        }

        const buckets =
          data || [];

        return response
          .status(200)
          .json({
            bucketCount:
              buckets.length,

            buckets:
              buckets.map(
                (bucket) => ({
                  id:
                    bucket.id || "",

                  name:
                    bucket.name || "",

                  public:
                    Boolean(
                      bucket.public
                    ),

                  file_size_limit:
                    bucket.file_size_limit ??
                    null,

                  allowed_mime_types:
                    bucket.allowed_mime_types ??
                    null,

                  created_at:
                    bucket.created_at || "",

                  updated_at:
                    bucket.updated_at || "",
                })
              ),
          });
      }

      return response
        .status(400)
        .json({
          error:
            "نوع عملية النسخ الاحتياطي غير معروف.",
        });
    } catch (error) {
      console.error(
        "Secure backup API error:",
        error
      );

      return response
        .status(500)
        .json({
          error:
            "حدث خطأ داخلي أثناء تجهيز النسخة الاحتياطية.",
        });
    }
  };