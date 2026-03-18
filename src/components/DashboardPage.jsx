// src/components/DashboardPage.jsx

import SprintHeader from "./dashboard/SprintHeader";
import SummaryCards from "./dashboard/SummaryCards";
import TasksChart from "./dashboard/TasksChart";
import BurndownChart from "./dashboard/BurndownChart";
import TaskDistributionChart from "./dashboard/TaskDistributionChart";
import TopComponents from "./dashboard/TopComponents";

export default function DashboardPage() {
  return (
    <>
      {/* Sprint header */}
      <SprintHeader />

      {/* Summary cards row */}
      <SummaryCards />

      {/* Charts row 1: Tasks bar + Burndown */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <TasksChart />
        <BurndownChart />
      </div>

      {/* Charts row 2: Pie + Top Components */}
      <div className="grid grid-cols-[1fr_2fr] gap-4">
        <TaskDistributionChart />
        <TopComponents />
      </div>
    </>
  );
}
