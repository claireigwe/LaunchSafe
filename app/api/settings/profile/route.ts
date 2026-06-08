import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Fetch Profile
    const { data: profileData, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // Fetch Notification Prefs
    const { data: prefsData, error: prefsError } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // Default response structure
    return NextResponse.json({
      success: true,
      data: {
        profile: {
          fullName: profileData?.full_name || user.user_metadata?.full_name || "",
          email: user.email || "",
          jobTitle: profileData?.job_title || "",
          createdAt: user.created_at || new Date().toISOString(),
          lastLogin: user.last_sign_in_at || new Date().toISOString(),
        },
        prefs: {
          taskNotifications: prefsData?.task_notifications ?? true,
          deadlineReminders: prefsData?.deadline_reminders ?? true,
          documentNotifications: prefsData?.document_notifications ?? true,
          billingNotifications: prefsData?.billing_notifications ?? true,
          systemAnnouncements: prefsData?.system_announcements ?? true,
        }
      }
    });
  } catch (error: any) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { profile, prefs } = body;

    // Update Profile
    if (profile) {
      const { error: updateProfileError } = await supabase
        .from("user_profiles")
        .update({
          full_name: profile.fullName,
          job_title: profile.jobTitle,
        })
        .eq("user_id", user.id);
        
      if (updateProfileError) {
        console.error("Profile update error:", updateProfileError);
        return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 });
      }
      
      // Also update auth.users metadata as a fallback/sync
      if (profile.fullName) {
        await supabase.auth.updateUser({
          data: { full_name: profile.fullName }
        });
      }
    }

    // Update Notification Prefs
    if (prefs) {
      const { error: updatePrefsError } = await supabase
        .from("notification_preferences")
        .update({
          task_notifications: prefs.taskNotifications,
          deadline_reminders: prefs.deadlineReminders,
          document_notifications: prefs.documentNotifications,
          billing_notifications: prefs.billingNotifications,
          system_announcements: prefs.systemAnnouncements,
        })
        .eq("user_id", user.id);

      if (updatePrefsError) {
        console.error("Prefs update error:", updatePrefsError);
        return NextResponse.json({ success: false, error: "Failed to update preferences" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
