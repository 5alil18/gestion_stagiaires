import { useState, useEffect } from "react";
import { Container, Typography, Button, AppBar } from "@mui/material";
import StagiaireForm from "./components/formulaire";
import StagiaireList from "./components/list";
import Dashboard from "./components/dashbord";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import Home from "@mui/icons-material/Home";
import { Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from "./supabase/supabaseClient";
function App() {
  const [stagiaires, setStagiaires] = useState([]);

  useEffect(() => {
    getStagiaires();
  }, []);

  async function getStagiaires() {
    const { data, error } = await supabase.from("stagiare").select("*");
    console.log(data);
    if (!error) {
      setStagiaires(data);
    }
  }

  // ➕ ajouter

  // const addStagiaire = (stagiaire) => {
  //   setStagiaires([...stagiaires, { ...stagiaire, id: Date.now() }]);
  // };
  const addStagiaire = async (stagiaire) => {
    const { error } = await supabase.from("stagiare").insert([stagiaire]);

    if (!error) {
      getStagiaires(); // refresh UI
    }
  };

  // supprimer

  // const deleteStagiaire = (id) => {
  //   setStagiaires(stagiaires.filter((s) => s.id !== id));
  // };
  const deleteStagiaire = async (id) => {
    const { error } = await supabase.from("stagiare").delete().eq("id", id);

    if (!error) {
      getStagiaires();
    }
  };
  //////////update

  // function updateStagiare(index, el) {
  //   setStagiaires((prev) =>
  //     prev.map((stagiaire) =>
  //       stagiaire.id === index ? { ...stagiaire, periode: el } : stagiaire,
  //     ),
  //   );
  // }
    const updateStagiare = async (id, value) => {
    const { error } = await supabase
      .from("stagiare")
      .update({ periode: value })
      .eq("id", id);

    if (!error) {
      getStagiaires();
    }
  };

  const navigate = useNavigate();
  const [color, setColor] = useState("home");

  return (
    <>
      <AppBar
        sx={{ height: 80, position: "sticky", bgcolor: "secondary.main" }}
      >
        {" "}
        <Typography variant="h4" sx={{ mt: 3, textAlign: "center" }}>
          Gestion des Stagiaires
        </Typography>
        <Button
          onClick={() => {
            navigate("/dashboard");
            setColor("dash");
          }}
          sx={{
            position: "absolute",
            top: 14,
            right: 20,
            bgcolor: "rgba(255,255,255,0.5)",
            borderRadius: "50%",
            p: 1,
          }}
        >
          <LeaderboardIcon
            sx={{ height: 40, width: 40 }}
            color={color === "dash" ? "error" : "primary"}
          />
          <Typography
            variant="h6"
            sx={{
              position: "absolute",
              top: -34,
              right: 6,
              color: "red",
              scale: 4,
            }}
          >
            {stagiaires.length ? "." : ""}
          </Typography>
        </Button>
        <Button
          onClick={() => {
            navigate("/list");
            setColor("list");
          }}
          sx={{
            position: "absolute",
            top: 15,
            right: 90,
            bgcolor: "rgba(255,255,255,0.5)",
            borderRadius: "50%",
            p: 1,
          }}
        >
          <PeopleAltIcon
            sx={{ height: 40, width: 40 }}
            color={color === "list" ? "error" : "primary"}
          />
          <Typography
            variant="h6"
            sx={{ position: "absolute", top: -10, right: 4, color: "red" }}
          >
            {stagiaires.length}
          </Typography>
        </Button>
        <Button
          onClick={() => {
            navigate("/");
            setColor("home");
          }}
          sx={{
            position: "absolute",
            top: 17,
            left: 80,
            bgcolor: "rgba(255,255,255,0.5)",
            borderRadius: "50%",
            p: 1,
          }}
        >
          <Home
            sx={{ height: 40, width: 40 }}
            color={color === "home" ? "error" : "primary"}
          />
        </Button>
      </AppBar>{" "}
      <Container>
        <Routes>
          <Route
            path="/"
            element={<StagiaireForm addStagiaire={addStagiaire} />}
          ></Route>
          <Route
            path="/list"
            element={
              <StagiaireList
                stagiaires={stagiaires}
                deleteStagiaire={deleteStagiaire}
                updateStagiare={updateStagiare}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              stagiaires.length ? <Dashboard stagiaires={stagiaires} /> : ""
            }
          />
        </Routes>
      </Container>
    </>
  );
}

export default App;
