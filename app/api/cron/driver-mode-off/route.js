import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    // Verify the request has the correct authorization
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || token !== cronSecret) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Get all active drivers
    const { data: activeDrivers, error: fetchError } = await supabase
      .from("users")
      .select("id, auth_id")
      .eq("is_active", true);

    if (fetchError) {
      console.error("Error fetching active drivers:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch active drivers" },
        { status: 500 }
      );
    }

    if (!activeDrivers || activeDrivers.length === 0) {
      return NextResponse.json(
        { message: "No active drivers found to turn off" },
        { status: 200 }
      );
    }

    // Process each active driver
    const results = [];
    for (const driver of activeDrivers) {
      try {
        // 1. Update user's is_active status to false
        const { error: updateError } = await supabase
          .from("users")
          .update({ is_active: false })
          .eq("id", driver.id);

        if (updateError) throw updateError;

        // 2. End any active driver sessions
        const { data: activeSessions, error: sessionFetchError } = await supabase
          .from("driver_sessions")
          .select("id")
          .eq("user_id", driver.id)
          .is("end_time", null);

        if (sessionFetchError) throw sessionFetchError;

        if (activeSessions && activeSessions.length > 0) {
          for (const session of activeSessions) {
            const { error: sessionUpdateError } = await supabase
              .from("driver_sessions")
              .update({ end_time: new Date().toISOString() })
              .eq("id", session.id);

            if (sessionUpdateError) throw sessionUpdateError;
          }
        }

        results.push({
          driver_id: driver.id,
          status: "success",
          message: "Driver mode turned off successfully",
        });
      } catch (error) {
        console.error(`Error processing driver ${driver.id}:`, error);
        results.push({
          driver_id: driver.id,
          status: "error",
          message: error.message,
        });
      }
    }

    // Return the results
    return NextResponse.json({
      message: `Processed ${activeDrivers.length} active drivers`,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error) {
    console.error("Error in driver-mode-off cron job:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
} 