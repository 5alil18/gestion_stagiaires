import { useState } from "react";
import { Container, Typography, AppBar, IconButton, Box } from "@mui/material";
import StagiaireForm from "./components/formulaire";
import StagiaireList from "./components/list";
import Dashboard from "./components/dashbord";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import Home from "@mui/icons-material/Home";
import { Routes, Route, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import AlertDialog from "./components/lougoutPopup";
import ProtectedRoute from "./auth/protectedRoutes";
import Auth from "./auth/auth";
import WaitingVerification from "./verification/waitingVerification";
import VerifyEmail from "./verification/chekedEmail";
import ResetPassword from "./resetPassword/resetPassword";
import { Context } from "./context/context";
import axios from "axios";
function App() {
  const [stagiaires, setStagiaires] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [color, setColor] = useState("home");
  const isMobile = useMediaQuery("(max-width:600px)");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [errorDomaine, setErrorDomaine] = useState("");
  const [successDomaine, setSuccessDomaine] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const lougOut = () => {
    setOpen(true);
  };

  const handleToken = () => {
    localStorage.removeItem("token");
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  };

  ///////////////////////////////get les stagaires

  const getStagiares = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/stagiares", {
        headers: {
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
      });
      setStagiaires(response.data.stagiaires);
      console.log("Stagiaires fetched successfully:", response.data.stagiaires);
    } catch (e) {
      setError(e.response?.data);
    }
  };

  //////////////////////////////filter les stagiares
  const [domaine, setDomaine] = useState("");
  const [loadingDomaine, setLoadingDomaine] = useState(false);

  const handleFilterDomaine = async () => {
    try {
      setLoadingDomaine(true);
      setErrorDomaine("");
      setSuccessDomaine("");
      if (domaine === "") {
        return getStagiares();
      }
      const response = await axios.get(
        `http://localhost:3000/api/stagiares/domaine/${domaine}`,
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setStagiaires(response.data.data);
      setLoadingDomaine(false);
      setSuccessDomaine("Stagiaires filtrés avec succès.");
      setTimeout(() => {
        afterFilterDomaine("success");
      },3000);

    } catch (e) {
      setErrorDomaine(e.response?.data);
       setTimeout(() => {
        afterFilterDomaine("error");
      },3000);

    }
  };
  const afterFilterDomaine = (type) => {
    if (type === "success") {
      setSuccessDomaine("");
      setLoadingDomaine(false);
    } else {
      setErrorDomaine("");
      setLoadingDomaine(false);
    }
  }

  return (
    <Context.Provider
      value={{
        stagiaires,
        setStagiaires,
        getStagiares,
        error,
        domaine,
        setDomaine,
        handleFilterDomaine,
        errorDomaine,
        successDomaine,
        loadingDomaine
      }}
    >
      <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", pb: 6 }}>
        <AppBar
          elevation={0}
          sx={{
            height: 80,
            position: "sticky",
            top: 0,
            zIndex: 1100,
            bgcolor: "#0f172a",
            borderBottom: "1px solid #1e293b",
            boxShadow: "0 10px 30px -10px rgba(15,23,42,0.4)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {!isMobile && (
            <Typography
              variant={isMobile ? "body1" : "h4"}
              sx={{
                mt: isMobile ? 1 : 2,
                textAlign: "center",
                fontWeight: 800,
                color: "white",
                letterSpacing: "-0.01em",
                fontFamily: "inherit",
                mr: isMobile ? 4 : 0,
              }}
            >
              Gestion des Stagiaires
            </Typography>
          )}

          {token && (
            <IconButton
              onClick={() => {
                lougOut();
                setColor("lougout");
              }}
              disabled={token ? false : true}
              sx={{
                position: "absolute",
                top: !isMobile ? 14 : 19,
                right: !isMobile ? 20 : 30,
                bgcolor:
                  color === "lougout" ? "#2563eb" : "rgba(255,255,255,0.08)",
                borderRadius: 0,
                border: "1px solid",
                borderColor:
                  color === "lougout" ? "#3b82f6" : "rgba(255,255,255,0.15)",
                p: 1,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor:
                    color === "lougout" ? "#1d4ed8" : "rgba(255,255,255,0.18)",
                },
              }}
            >
              <LogoutIcon
                sx={{
                  height: isMobile ? 20 : 36,
                  width: isMobile ? 20 : 36,
                  color: color === "dash" ? "#38bdf8" : "#94a3b8",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  position: "absolute",
                  top: -37,
                  right: 6,
                  color: "#ef4444",
                  scale: 4,
                }}
              ></Typography>
            </IconButton>
          )}

          {/* /////////////// */}

          <IconButton
            onClick={() => {
              navigate("/dashboard");
              setColor("dash");
            }}
            disabled={token ? false : true}
            sx={{
              position: "absolute",
              top: !isMobile ? 14 : 19,
              right: !isMobile ? 85 : 90,
              bgcolor: color === "dash" ? "#2563eb" : "rgba(255,255,255,0.08)",
              borderRadius: 0,
              border: "1px solid",
              borderColor:
                color === "dash" ? "#3b82f6" : "rgba(255,255,255,0.15)",
              p: 1,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor:
                  color === "dash" ? "#1d4ed8" : "rg²a(255,255,255,0.18)",
              },
            }}
          >
            <LeaderboardIcon
              sx={{
                height: isMobile ? 20 : 36,
                width: isMobile ? 20 : 36,
                color: color === "dash" ? "#38bdf8" : "#94a3b8",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                position: "absolute",
                top: -37,
                right: 6,
                color: "#ef4444",
                scale: 4,
              }}
            >
              {stagiaires.length ? "." : ""}
            </Typography>
          </IconButton>

          {/* :::::::::::::::::: */}

          <IconButton
            onClick={() => {
              navigate("/list");
              setColor("list");
            }}
            disabled={token ? false : true}
            sx={{
              position: "absolute",
              top: !isMobile ? 15 : 19,
              right: !isMobile ? 150 : 150,
              bgcolor: color === "list" ? "#2563eb" : "rgba(255,255,255,0.08)",
              borderRadius: 0,
              border: "1px solid",
              borderColor:
                color === "list" ? "#3b82f6" : "rgba(255,255,255,0.15)",
              p: 1,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor:
                  color === "list" ? "#1d4ed8" : "rgba(255,255,255,0.18)",
              },
            }}
          >
            <PeopleAltIcon
              sx={{
                height: isMobile ? 20 : 36,
                width: isMobile ? 20 : 36,
                color: color === "list" ? "#38bdf8" : "#94a3b8",
              }}
            />
            <Typography
              variant={!isMobile ? "h6" : "body1"}
              sx={{
                position: "absolute",
                top: -10,
                right: 1,
                color: "#ef4444",
                fontFamily: "monospace",
                fontWeight: 800,
              }}
            >
              {stagiaires.length}
            </Typography>
          </IconButton>

          <IconButton
            onClick={() => {
              navigate("/");
              setColor("home");
            }}
            disabled={token ? false : true}
            sx={{
              position: "absolute",
              top: !isMobile ? 17 : 19,
              left: !isMobile ? 80 : 30,
              bgcolor: color === "home" ? "#2563eb" : "rgba(255,255,255,0.08)",
              borderRadius: 0,
              border: "1px solid",
              borderColor:
                color === "home" ? "#3b82f6" : "rgba(255,255,255,0.15)",
              p: 1,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor:
                  color === "home" ? "#1d4ed8" : "rgba(255,255,255,0.18)",
              },
            }}
          >
            <Home
              sx={{
                height: isMobile ? 20 : 36,
                width: isMobile ? 20 : 36,
                color: color === "home" ? "#38bdf8" : "#94a3b8",
              }}
            />
          </IconButton>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          {/* ***********************************************les routes *************************************************/}
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <StagiaireForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/list"
              element={
                <ProtectedRoute>
                  <StagiaireList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  {stagiaires.length ? (
                    <Dashboard stagiaires={stagiaires} />
                  ) : (
                    ""
                  )}
                </ProtectedRoute>
              }
            />
            <Route path="/waiting" element={<WaitingVerification />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
          <AlertDialog
            open={open}
            handleClickOpen={handleClickOpen}
            handleClose={handleClose}
            handleToken={handleToken}
          ></AlertDialog>
        </Container>
      </Box>
    </Context.Provider>
  );
}

export default App;
