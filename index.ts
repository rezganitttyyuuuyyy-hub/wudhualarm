import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function generateVerificationCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const segment1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const segment2 = Array.from({ length: 2 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `WINNER-${segment1}-${segment2}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    // Check if winners already selected for this month
    const { data: existing } = await supabase
      .from("monthly_winners")
      .select("id")
      .eq("year_month", yearMonth);

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({ message: "Winners already selected for this month", yearMonth, count: existing.length }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get all profiles with their monthly_points
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, display_name, monthly_points, streak, is_guest")
      .order("monthly_points", { ascending: false })
      .limit(3);

    if (profileError) throw profileError;

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({ message: "No profiles found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Filter qualified users (at least 10 monthly points to qualify)
    const qualified = profiles.filter((p: { monthly_points: number }) => (p.monthly_points ?? 0) >= 10);

    if (qualified.length === 0) {
      return new Response(
        JSON.stringify({ message: "No qualified users this month (minimum 10 monthly points required)" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Select top 3 (or fewer if less than 3 qualified)
    const topN = qualified.slice(0, 3);
    const prizeAmount = 100;

    const winnerRecords = [];
    for (let i = 0; i < topN.length; i++) {
      const winner = topN[i];
      const rank = i + 1;
      let verificationCode = generateVerificationCode();

      // Ensure unique verification code
      let codeUnique = false;
      while (!codeUnique) {
        const { data: existingCode } = await supabase
          .from("monthly_winners")
          .select("id")
          .eq("verification_code", verificationCode)
          .maybeSingle();
        if (existingCode) {
          verificationCode = generateVerificationCode();
        } else {
          codeUnique = true;
        }
      }

      const { data: winnerRecord, error: insertError } = await supabase
        .from("monthly_winners")
        .insert({
          year_month: yearMonth,
          profile_id: winner.id,
          activity_score: winner.monthly_points ?? 0,
          rank,
          verification_code: verificationCode,
          prize_amount: prizeAmount,
          status: "notified",
        })
        .select()
        .single();

      if (insertError) throw insertError;
      winnerRecords.push(winnerRecord);
    }

    // Reset monthly_points for all users for the new month
    const { error: resetError } = await supabase
      .from("profiles")
      .update({ monthly_points: 0 })
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (resetError) {
      console.warn("Failed to reset monthly_points:", resetError.message);
    }

    return new Response(
      JSON.stringify({
        message: "Monthly winners selected successfully",
        yearMonth,
        winners: winnerRecords,
        count: winnerRecords.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
