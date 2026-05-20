import type { Metadata } from "next";

import { DashboardView } from "./dashboard-view";

export const metadata: Metadata = {
  title: "My dashboard",
};

export default function DashboardPage() {
  return <DashboardView />;
}
