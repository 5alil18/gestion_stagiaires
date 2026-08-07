import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  InputAdornment,
  IconButton,
  Fade,
  Dialog,
  DialogContent,
  DialogActions,
  CircularProgress
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HomeIcon from "@mui/icons-material/Home";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import useMediaQuery from "@mui/material/useMediaQuery";


const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

export default function Auth({handleVirification}) {
  const navigate = useNavigate()
  const [tab, setTab] = useState(0); // 0 = Sign In, 1 = Sign Up
  const [form, setForm] = useState({
    nom: "",
    adresse: "",
    email: "",
    password: ""
  });
  const [signin, setSignin]= useState({
    email:'',
    password:''
  })
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [loading, setLoading] = useState(false)


  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isMobile = useMediaQuery("(max-width:900px)");
  

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  ///////////////////////forgot password

  const handleForgotSubmit =async (e) => {
   try{ 
    setLoading(true)
    e.preventDefault();
    if (!forgotEmail) {
      setForgotError("Veuillez saisir votre adresse email");
      return;
    }
    const response = await axios.post('http://localhost:3000/api/company/forgotPassword',{
      email:forgotEmail
    })
    console.log(response)
    setLoading(false)
    setForgotError("");
    setForgotSuccess("Un lien de réinitialisation a été envoyé à votre adresse email");
    setTimeout(() => {
      setLoading(false)
      setForgotOpen(false);
      setForgotSuccess("");
      setForgotEmail("");

      navigate('/waiting') 
    }, 2000)
  }
    catch(e){
      setForgotError(e.response?.data)

      setTimeout(() => {
         setForgotOpen(false)
         navigate('/auth')
         setLoading(false)
      },2000);
     
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSign = (e)=>{
    setSignin({...signin, [e.target.name]:e.target.value})
  }

  ////////////////////////////sign in

  const handleSignIn =async(e) => {
    e.preventDefault();
    setLoading(true)
   try{
     if (!signin.email || !signin.password) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    const response = await axios.post("http://localhost:3000/api/company/login",{
      email: signin.email,
      password: signin.password
    })
    setSuccess("Connexion réussie ! Redirection...");
    localStorage.setItem('token', response.data.data.token)
    setSuccess(response.data.data.msg)
    nav(response.data.data.token, 'signin')
    setLoading(false)
    afterSubmit('success' , 'signIn')
  }catch(e){
   setError(e.response?.data?.message || e.response?.data || "server error") 
   afterSubmit('error' , 'signIn')
   setLoading(false)
  }
  }


  //////////////////////sign up
const handleSignUp = async (e) => {
  e.preventDefault();
  if (!form.nom || !form.adresse || !form.email || !form.password) {
    setError("Veuillez remplir tous les champs obligatoires.");
    return;
  }
  if (form.password.length < 6) {
    setError("Le mot de passe doit contenir au moins 6 caractères.");
    return;
  }
  setLoading(true)
  try {
    const response = await axios.post(
      "http://localhost:3000/api/company/register",
      {
        name: form.nom,
        address: form.adresse,
        email: form.email,
        password: form.password,
      }
    );
    
    setSuccess(response.data.msg);
    setLoading(false)
    setTimeout(() => {
      afterSubmit('success' , "signUp")
    }, 1000);
    setTimeout(() => {
      nav("signup")
    }, 2000);
  } catch (e) {
    setError(
      e.response?.data ||
      "Une erreur est survenue."
    );
    setLoading(false)
   setTimeout(() => {
    afterSubmit('error' , "signUp")
   }, 1000);
  }
};


  const handleGoogleSignIn = () => {
    setSuccess("Redirection...");
    navigate('/waiting')
  };


  ////////////////////after submit

  const afterSubmit= (type , s)=>{
    if(type ==='success' && s ==='signUp'){
        setForm({
      nom: "",
      adresse: "",
      email: "",
      password: "",
    });
    setTimeout(() => {
      setSuccess('')
    }, 1000);
    }
    if (type === "error" && s ==='signUp') {
       setForm({
      nom: "",
      adresse: "",
      email: "",
      password: "",
    });
    setTimeout(() => setError(""), 2000);
  }
    if(type ==='success' && s ==='signIn'){
      setSignin({
      email: "",
      password: "",
    });
    setTimeout(() => {
      setSuccess('')
    }, 1000);
    }
    if (type === "error" && s ==='signIn') {
       setSignin({
      email: "",
      password: "",
    });
    setTimeout(() => setError(""), 2000);
  }
  }


  ///////////////////fonction de naviagation aprés le signup et in

 const nav = (token, type)=>{
  if(type === 'signup'){
    navigate('/waiting')
  }
   if(type === 'signin' && token){
   navigate('/')
  }
 }
  

 

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 0,
        bgcolor: "white",
        border: "1px solid #cbd5e1",
        boxShadow: "0 25px 50px -12px rgba(15,23,42,0.12)",
        overflow: "hidden",
        maxWidth: 920,
        mx: "auto",
        my: { xs: 2, sm: 4 }
      }}
    >
      <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", minHeight: 520 }}>
        {/* Left Dark Side Panel */}
        <Box
          sx={{
            width: isMobile ? "100%" : "40%",
            bgcolor: "#0f172a",
            color: "white",
            p: { xs: 4, sm: 5 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRight: isMobile ? "none" : "1px solid #1e293b",
            borderBottom: isMobile ? "1px solid #1e293b" : "none"
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                fontFamily: "monospace",
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                fontWeight: 700,
                display: "block",
                mb: 2
              }}
            >
              ACCÈS SÉCURISÉ v2.4
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontFamily: "inherit",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                color: "white",
                lineHeight: 1.1,
                mb: 2.5
              }}
            >
              Portail<br />
              <Box component="span" sx={{ fontWeight: 200, color: "#2563eb" }}>
                Authentification
              </Box>
            </Typography>

            <Box sx={{ width: 40, height: 4, bgcolor: "#2563eb", mb: 3 }} />

            <Typography variant="body2" sx={{ color: "#94a3b8", lineHeight:!isMobile? 1.7:1.5, fontSize: !isMobile? "0.85rem":"0.5rem" }}>
              Connectez-vous ou créez un compte pour accéder au formulaire d'enregistrement des stagiaires et à la gestion de la base de données.
            </Typography>
          </Box>

          <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid #1e293b" }}>
            <Typography variant="caption" sx={{ fontFamily: "monospace", color: "#64748b", textTransform: "uppercase", display: "block" }}>
              STATUT DE CONNEXION: NON AUTHENTIFIÉ
            </Typography>
          </Box>
        </Box>

        {/* Right Auth Form Section */}
        <Box sx={{ flex: 1, p: { xs: 3, sm: 5 }, display: "flex", flexDirection: "column" }}>
          {/* Navigation Tabs */}
          <Box sx={{ borderBottom: "1px solid #e2e8f0", mb: 3 }}>
            <Tabs
              value={tab}
              onChange={(_, newValue) => {
                setTab(newValue);
                setError("");
                setSuccess("");
              }}
              sx={{
                "& .MuiTabs-indicator": {
                  height: "3px",
                  bgcolor: "#2563eb"
                },
                "& .MuiTab-root": {
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  fontFamily: "monospace",
                  letterSpacing: "0.08em",
                  color: "#64748b",
                  py: 1.5,
                  px: 2,
                  borderRadius: 0,
                  "&.Mui-selected": {
                    color: "#0f172a"
                  }
                }
              }}
            >
              <Tab icon={<LoginIcon fontSize="small" />} iconPosition="start" label="SE CONNECTER" />
              <Tab icon={<PersonAddIcon fontSize="small" />} iconPosition="start" label="S'INSCRIRE" />
            </Tabs>
          </Box>

          {/* Feedback Messages */}
          {error && (
            <Fade in={Boolean(error)}>
              <Alert severity="error" sx={{ borderRadius: 0, mb: 2, fontFamily: "monospace", fontSize: "0.8rem" }}>
                {error}
              </Alert>
            </Fade>
          )}
          {success && (
            <Fade in={Boolean(success)}>
              <Alert severity="success" sx={{ borderRadius: 0, mb: 2, fontFamily: "monospace", fontSize: "0.8rem", bgcolor: "#0f172a", color: "white", "& .MuiAlert-icon": { color: "#10b981" } }}>
                {success}
              </Alert>
            </Fade>
          )}

          {/* Tab 0: Sign In Form */}
          {tab === 0 && (
            <Box component="form" onSubmit={handleSignIn} sx={{ display: "flex", flexDirection: "column", gap: 2.5, flex: 1, justifyContent: "center" }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 800, color: "#94a3b8", letterSpacing: "0.08em", fontSize: "0.65rem", fontFamily: "monospace" }}>
                  Adresse Email
                </Typography>
                <TextField
                  name="email"
                  type="email"
                  value={signin.email}
                  onChange={handleSign}
                  placeholder="nom@exemple.com"
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 0 } }}
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 800, color: "#94a3b8", letterSpacing: "0.08em", fontSize: "0.65rem", fontFamily: "monospace" }}>
                  Mot de passe
                </Typography>
                <TextField
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={signin.password}
                  onChange={handleSign}
                  placeholder="••••••••"
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end" size="small">
                          {showPassword ? <VisibilityOff fontSize="small" sx={{ color: "#94a3b8" }} /> : <Visibility fontSize="small" sx={{ color: "#94a3b8" }} />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 0 } }}
                />

                
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.25 }}>
                  <Button
                    variant="text"
                    onClick={() => {
                      setForgotOpen(true);
                      setForgotError("");
                      setForgotSuccess("");
                    }}
                    sx={{
                      p: 0,
                      minWidth: "auto",
                      fontSize: "0.7rem",
                      fontFamily: "monospace",
                      color: "#2563eb",
                      textTransform: "none",
                      fontWeight: 700,
                      "&:hover": { bgcolor: "transparent", textDecoration: "underline" }
                    }}
                  >
                    Mot de passe oublié ?
                  </Button>
        
                </Box>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading === true || !signin.email || !signin.password  }
                sx={{
                  mt: 1,
                  bgcolor: "#2563eb",
                  color: "white",
                  py: 1.5,
                  borderRadius: 0,
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontFamily: "monospace",
                  "&:hover": {
                    bgcolor: "#1d4ed8"
                  }
                }}
              >
                {loading ===false ? "Se connecter" : "connection ..."}
              </Button>
              <Button
                    variant="text"
                    onClick={() => {
                     setTab(1)
                    }}
                    sx={{
                      p: 0,
                      minWidth: "auto",
                      fontSize: "0.7rem",
                      fontFamily: "monospace",
                      color: "#2563eb",
                      textTransform: "none",
                      fontWeight: 700,
                      "&:hover": { bgcolor: "transparent", textDecoration: "underline" }
                    }}
                  >
                    vous n'avez pas un compte ?
                  </Button>
            </Box>
          )}

          {/* Tab 1: Sign Up Form */}
          {tab === 1 && (
            <Box component="form" onSubmit={handleSignUp} sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, justifyContent: "center" }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 800, color: "#94a3b8", letterSpacing: "0.08em", fontSize: "0.65rem", fontFamily: "monospace" }}>
                  Nom Complet
                </Typography>
                <TextField
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  placeholder="Jean Dupont"
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 0 } }}
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 800, color: "#94a3b8", letterSpacing: "0.08em", fontSize: "0.65rem", fontFamily: "monospace" }}>
                  Adresse
                </Typography>
                <TextField
                  name="adresse"
                  value={form.adresse}
                  onChange={handleChange}
                  placeholder="Jijel, Algérie"
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 0 } }}
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 800, color: "#94a3b8", letterSpacing: "0.08em", fontSize: "0.65rem", fontFamily: "monospace" }}>
                  Adresse Email
                </Typography>
                <TextField
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="nom@gmail.com"
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 0 } }}
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 800, color: "#94a3b8", letterSpacing: "0.08em", fontSize: "0.65rem", fontFamily: "monospace" }}>
                  Mot de passe
                </Typography>
                <TextField
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end" size="small">
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 0 } }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={loading === true || Object.values(form).some((e)=> e ==='')}
                fullWidth
                sx={{
                  mt: 1.5,
                  bgcolor: "#2563eb",
                  color: "white",
                  py: 1.5,
                  borderRadius: 0,
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontFamily: "monospace",
                  "&:hover": {
                    bgcolor: "#1d4ed8"
                  }
                }}
              >
                {loading ===false?'Créer un compte':<CircularProgress size={20} color="inherit"></CircularProgress>}
              </Button>
               <Button
                    variant="text"
                    onClick={() => {
                      setTab(0)
                    }}
                    sx={{
                      p: 0,
                      minWidth: "auto",
                      fontSize: "0.7rem",
                      fontFamily: "monospace",
                      color: "#2563eb",
                      textTransform: "none",
                      fontWeight: 700,
                      "&:hover": { bgcolor: "transparent", textDecoration: "underline" }
                    }}
                  >
                    vous avez deja un compte ?
                  </Button>
            </Box>
          )}

          {/* Google Authentication Option */}
          <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #e2e8f0" }}>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                textAlign: "center",
                color: "#94a3b8",
                fontFamily: "monospace",
                fontSize: "0.65rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                mb: 1.5
              }}
            >
             
              OU
            </Typography>
            <Button
              variant="outlined"
              onClick={handleGoogleSignIn}
              fullWidth
              startIcon={<GoogleIcon />}
              sx={{
                borderColor: "#cbd5e1",
                color: "#0f172a",
                bgcolor: "white",
                py: 1.25,
                borderRadius: 0,
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                fontFamily: "monospace",
                "&:hover": {
                  borderColor: "#0f172a",
                  bgcolor: "#f8fafc"
                }
              }}
            >
              Continuer avec Google
            </Button>
          </Box>
        </Box>
      </Box>




      {/* Forgot Password Dialog */}
      <Dialog
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 0,
            border: "1px solid #cbd5e1",
            boxShadow: "0 25px 50px -12px rgba(15,23,42,0.25)"
          }
        }}
      >
        <Box sx={{ bgcolor: "#0f172a", color: "white", px: 3, py: 2 }}>
          <Typography variant="subtitle2" fontWeight="800" sx={{ fontFamily: "monospace", textTransform: "uppercase" }}>
            Réinitialisation du mot de passe
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleForgotSubmit}>
          <DialogContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="body2" sx={{ color: "#475569", fontSize: "0.85rem" }}>
              Saisissez votre adresse email pour recevoir un lien de réinitialisation.
            </Typography>
            {forgotError && (
              <Alert severity="error" sx={{ borderRadius: 0, fontFamily: "monospace", fontSize: "0.75rem" }}>
                {forgotError}
              </Alert>
            )}
            {forgotSuccess && (
              <Alert severity="success" sx={{ borderRadius: 0, fontFamily: "monospace", fontSize: "0.75rem", bgcolor: "#0f172a", color: "white" }}>
                {forgotSuccess}
              </Alert>
            )}
            <TextField
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="nom@exemple.com"
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                  </InputAdornment>
                )
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 0 } }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, px: 3, bgcolor: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
            <Button
              onClick={() => setForgotOpen(false)}
              sx={{ borderRadius: 0, color: "#64748b", fontWeight: 700, fontFamily: "monospace", fontSize: "0.75rem" }}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading === true || !forgotEmail}
              sx={{
                borderRadius: 0,
                bgcolor: "#2563eb",
                color: "white",
                fontWeight: 800,
                fontFamily: "monospace",
                fontSize: "0.75rem",
                "&:hover": { bgcolor: "#1d4ed8" }
              }}
            >
              {loading === false ?"Envoyer" : <CircularProgress size={20} color="inherit"></CircularProgress>}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Paper>
  );
}
