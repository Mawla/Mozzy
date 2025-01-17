import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";

  if (!token_hash || !type) {
    logger.error(
      "Auth confirm: Missing required parameters",
      new Error("Missing token_hash or type"),
      { token_hash: !!token_hash, type: !!type }
    );
    redirect("/auth/auth-code-error");
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      logger.error("Auth confirm: Failed to verify OTP", error);
      redirect("/auth/auth-code-error");
    }

    logger.info("Auth confirm: Successfully verified OTP", { type });
    redirect(next);
  } catch (err) {
    logger.error("Auth confirm: Unexpected error", err as Error);
    redirect("/auth/auth-code-error");
  }
}
