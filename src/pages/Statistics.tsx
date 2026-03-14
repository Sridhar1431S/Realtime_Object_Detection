import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getHistory } from "@/lib/detectionStore";
import { TrendingUp, Eye, Award } from "lucide-react";

const COLORS = [
  "hsl(185, 100%, 50%)",
  "hsl(200, 100%, 60%)",
  "hsl(220, 80%, 60%)",
  "hsl(260, 70%, 60%)",
  "hsl(320, 70%, 55%)",
  "hsl(40, 90%, 55%)",
  "hsl(150, 70%, 45%)",
  "hsl(10, 80%, 55%)",
  "hsl(280, 60%, 55%)",
];

export default function StatisticsPage() {
  const history = useMemo(() => getHistory(), []);

  const totalDetections = history.length;

  const freqMap = useMemo(() => {
    const map: Record<string, number> = {};
    history.forEach((h) => (map[h.objectName] = (map[h.objectName] || 0) + 1));
    return map;
  }, [history]);

  const barData = useMemo(
    () => Object.entries(freqMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    [freqMap]
  );

  const pieData = barData;

  const mostDetected = barData[0]?.name || "N/A";

  const timelineData = useMemo(() => {
    const dayMap: Record<string, number> = {};
    history.forEach((h) => {
      const day = new Date(h.timestamp).toLocaleDateString();
      dayMap[day] = (dayMap[day] || 0) + 1;
    });
    return Object.entries(dayMap)
      .map(([date, count]) => ({ date, count }))
      .slice(-14);
  }, [history]);

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            Detection <span className="text-primary">Statistics</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">Analytics overview of all detection activity.</p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {[
            { icon: Eye, label: "Total Detections", value: totalDetections },
            { icon: Award, label: "Most Detected", value: mostDetected },
            { icon: TrendingUp, label: "Object Types", value: barData.length },
          ].map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hover-card rounded-xl p-5 sm:p-6"
            >
              <s.icon className="w-6 h-6 text-primary mb-3" />
              <p className="text-2xl font-bold font-mono text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {totalDetections === 0 ? (
          <div className="hover-card rounded-xl p-8 sm:p-12 text-center text-muted-foreground">
            No detection data yet. Use the detection page to start collecting data.
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Bar Chart */}
            <div className="hover-card rounded-xl p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Object Frequency</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {barData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="hover-card rounded-xl p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Object Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart */}
            <div className="hover-card rounded-xl p-4 sm:p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Detection Timeline</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                  />
                  <Line type="monotone" dataKey="count" stroke="hsl(185, 100%, 50%)" strokeWidth={2} dot={{ fill: "hsl(185, 100%, 50%)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
