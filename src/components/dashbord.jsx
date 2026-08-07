
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useContext } from "react";
import { Context } from "../context/context";

// Professional modern color palette
const COLORS = [
  "#6366F1", 
  "#10B981", 
  "#F59E0B", 
  "#EC4899", 
  "#8B5CF6", 
  "#06B6D4", 
  "#EF4444", 
];

export default function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const {stagiaires} = useContext(Context)
  const total = stagiaires.length;

  const domainesCount = stagiaires.reduce((acc, s) => {
    const d = s.niveaux || "Non défini";
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});

  const niveauxCount = stagiaires.reduce((acc, s) => {
    const a = s.domaine || "Non défini";
    acc[a] = (acc[a] || 0) + 1;
    return acc;
  }, {});

  const domaineData = Object.keys(domainesCount).map((d) => ({
    name: d,
    value: domainesCount[d],
  }));

  const niveauxData = Object.keys(niveauxCount).map((a) => ({
    name: a,
    value: niveauxCount[a],
  }));
  // -------------------------------------

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Top Section: KPI Card & Pie Chart */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isTablet ? "column" : "row",
          gap: 3,
          alignItems: "stretch",
        }}
      >
        {/* Total Stagiaires KPI Card */}
        <Card
          elevation={0}
          sx={{
            width: isTablet ? "100%" : "280px",
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.2)",
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Typography
              variant="subtitle2"
              sx={{
                textTransform: "uppercase",
                letterSpacing: 1,
                opacity: 0.85,
                fontWeight: 600,
                mb: 1,
              }}
            >
              Total Stagiaires
            </Typography>
            <Typography
              variant="h2"
              component="div"
              sx={{ fontWeight: 700, lineHeight: 1 }}
            >
              {total}
            </Typography>
          </CardContent>
        </Card>

        {/* Domaines Pie Chart */}
        <Card
          elevation={0}
          sx={{
            flex: 1,
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "text.primary", mb: 2 }}
            >
              Domaines
            </Typography>
            <Box sx={{ width: "100%", height: isMobile ? 260 : 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={niveauxData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 45 : 65}
                    outerRadius={isMobile ? 75 : 100}
                    paddingAngle={4}
                    label
                  >
                    {niveauxData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Bottom Section: Bar Chart */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "text.primary", mb: 3 }}
          >
            Niveaux des étudiants
          </Typography>
          <Box sx={{ width: "100%", height: isMobile ? 250 : 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={domaineData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {domaineData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
