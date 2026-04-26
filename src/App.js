import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  AppBar,
  IconButton,
} from "@mui/material";
import StagiaireForm from "./components/formulaire";
import StagiaireList from "./components/list";
import Dashboard from "./components/dashbord";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import Home from "@mui/icons-material/Home";
import { Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from "./supabase/supabaseClient";
import useMediaQuery from "@mui/material/useMediaQuery";
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
  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <>
      <AppBar
        sx={{ height: 80, position: "sticky", bgcolor: "secondary.main" }}
      >
        {" "}
        <Typography
          variant={isMobile ? "body1" : "h4"}
          sx={{ mt: 3, textAlign: "center" }}
        >
          Gestion des Stagiaires
        </Typography>
        <IconButton
          onClick={() => {
            navigate("/dashboard");
            setColor("dash");
          }}
          sx={{
            position: "absolute",
            top:!isMobile?14:19,
            right:!isMobile?20:10,
            bgcolor: "rgba(255,255,255,0.2)",
            borderRadius: "50%",
            p: 1,
          }}
        >
          <LeaderboardIcon
            sx={{ height: isMobile ? 20 : 40, width: isMobile ? 20 : 40 }}
            color={color === "dash" ? "error" : "primary"}
          />
          <Typography
            variant="h6"
            sx={{
              position: "absolute",
              top:-37,
              right: 6,
              color: "red",
              scale: 4,
            }}
          >
            {stagiaires.length ? "." : ""}
          </Typography>
        </IconButton>
        <IconButton
          onClick={() => {
            navigate("/list");
            setColor("list");
          }}
          sx={{
            position: "absolute",
            top:!isMobile?15:19,
            right: !isMobile?90:50,
            bgcolor: "rgba(255,255,255,0.2)",
            borderRadius: "50%",
            p: 1,
          }}
        >
          <PeopleAltIcon
            sx={{ height: isMobile ? 20 : 40, width: isMobile ? 20 : 40 }}
            color={color === "list" ? "error" : "primary"}
          />
          <Typography
            variant= {!isMobile?"h6":'body1'}
            sx={{ position: "absolute", top: -10, right: 1, color: "red" }}
          >
            {stagiaires.length}
          </Typography>
        </IconButton>
        <IconButton
          onClick={() => {
            navigate("/");
            setColor("home");
          }}
          sx={{
            position: "absolute",
            top:!isMobile? 17:19,
            left: !isMobile?80:30,
            bgcolor: "rgba(255,255,255,0.2)",
            borderRadius: "50%",
            p: 1,
          }}
        >
          <Home
            sx={{ height: isMobile ? 20 : 40, width: isMobile ? 20 : 40 }}
            color={color === "home" ? "error" : "primary"}
          />
        </IconButton>
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
