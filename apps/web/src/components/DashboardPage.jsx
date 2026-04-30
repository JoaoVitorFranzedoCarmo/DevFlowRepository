// src/components/DashboardPage.jsx
import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import SprintHeader from "./dashboard/SprintHeader";
import SummaryCards from "./dashboard/SummaryCards";
import TasksChart from "./dashboard/TasksChart";
import BurndownChart from "./dashboard/BurndownChart";
import TaskDistributionChart from "./dashboard/TaskDistributionChart";
import TopComponents from "./dashboard/TopComponents";
import CostBreakdown from "./dashboard/CostBreakdown";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [cost, setCost] = useState(null);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const [s, c, comp] = await Promise.all([
        api.get("/tasks/dashboard/stats").catch(() => ({ data: null })),
        api.get("/tasks/dashboard/cost").catch(() => ({ data: null })),
        api.get("/components").catch(() => ({ data: [] })),
      ]);
      setStats(s.data);
      setCost(c.data);
      setComponents(Array.isArray(comp.data) ? comp.data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <>
      <SprintHeader stats={stats} />
      <SummaryCards stats={stats} cost={cost} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <TasksChart stats={stats} />
        <BurndownChart stats={stats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4 mb-4">
        <TaskDistributionChart stats={stats} />
        <TopComponents components={components} />
      </div>

      <CostBreakdown cost={cost} />
    </>
  );
}
