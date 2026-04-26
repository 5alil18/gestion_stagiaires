import { Box, Card, CardContent, Typography } from "@mui/material";

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
const COLORS = ["#fbc02d", "#0028f2", "#2e7d32", "#8e24aa", "#d32f2f", '#fbcf', '#4ad8ff'];
export default function Dashboard({ stagiaires }) {
  //  total
  const total = stagiaires.length;

  //  domaines
  const domainesCount = stagiaires.reduce((acc, s) => {
    const d = s.anne || "Non défini";
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});

  const anneCount = stagiaires.reduce((acc, s) => {
    const a = s.domaine || "Non défini";
    acc[a] = (acc[a] || 0) + 1;
    return acc;
  }, {});

  //  transform data for charts
  const domaineData = Object.keys(domainesCount).map((d) => ({
    name: d,
    value: domainesCount[d],
  }));

  const anneData = Object.keys(anneCount).map((a) => ({
    name: a,
    value: anneCount[a],
  }));

  

  return (
    <Box sx={{ my: 2 }}>
      {/*  Cards */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        {" "}
        <Card sx={{ width: "15%", mx: "auto", color: "primary.main" }}>
          <CardContent>
            <Typography sx={{ textAlign: "center" }}>
              Total Stagiaires
            </Typography>
            <Typography variant="h4" sx={{ textAlign: "center" }}>
              {total}
            </Typography>
          </CardContent>
        </Card>
        <Box
          sx={{
            width: "60%",
            height: 350,
            my: 5,
            textAlign: "center",
            border: "1px solid black",
          }}
        >
          <Typography variant="h6" style={{ marginLeft: "4PX" }}>
            Domaines
          </Typography>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={anneData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {anneData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* Charts */}

      <Card sx={{ my: 2, border: "1px solid black" }}>
        <CardContent>
          <Typography variant="h6">Niveaux des étudiant</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={domaineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {domaineData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
