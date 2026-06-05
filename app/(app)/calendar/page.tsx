import type { Metadata } from "next";
import { CalendarPage } from "@/features/compliance/components/calendar/calendar-page";

export const metadata: Metadata = {
  title: "Calendar | LaunchSafe",
};

export default function CalendarRoute() {
  return <CalendarPage />;
}
