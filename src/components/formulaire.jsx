
import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  Snackbar,
  Typography,
  Alert,
  Paper,
  FormControl,
  Grid,
  Fade, 
  CircularProgress
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";

import { useContext} from "react";
import {Context} from "../context/context"

export default function StagiaireForm() {

  const {getStagiares} = useContext(Context)
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    domaine: "",
    anne: "",
    dateDebut: null,
    dateFin: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const [success , setSuccess] = useState('')
  const [error , setError] = useState('')
  const [loading , setLoading]= useState(false)

  const afterSubmit = ()=>{
    setForm({
      nom: "",
      prenom: "",
      telephone: "",
      domaine: "",
      anne: "",
      dateDebut: null,
      dateFin: null,
    })
    setClick(false)
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    try{
       e.preventDefault();   
       setError('')
       setSuccess('')
       setLoading(true)
    // setStagiaires((prev) => [form, ...prev]);
    // localStorage.setItem("stagiaires", JSON.stringify([form, ...stagiaires]));
    const response = await axios.post("http://localhost:3000/api/stagiares/add",{
      nom : form.nom,
      prenom : form.prenom,
      telephone:form.telephone,
      domaine: form.domaine,
      niveaux: form.anne,
      dateDebut: form.dateDebut,
      dateFin: form.dateFin
    },
    { 
      headers : {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  )
    setSuccess(response?.data?.msg)
    getStagiares()
    setClick(true)
      setTimeout(() => {
        afterSubmit()
      }, 2000);
    }catch(e){
      setError(e.response?.data || "server error")
      setClick(true)
       setTimeout(() => {
        afterSubmit()
    }, 2000);
    }
  };
  const [click, setClick] = useState(false);
  function handleClose() {
    setClick(false);
  }
  const isMobile = useMediaQuery('(max-width:900px)');

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 0,
        bgcolor: "white",
        border: "1px solid",
        borderColor: "#cbd5e1",
        boxShadow: "0 20px 40px -15px rgba(15,23,42,0.08)",
        overflow: "hidden",
        maxWidth: 1024,
        mx: "auto",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", minHeight: 540 }}>
        <Box
          sx={{
            width: isMobile ? "100%" : "34%",
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
                mb: 2.5
              }}
            >
              System Management v2.4
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontFamily: "inherit",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                color: "white",
                lineHeight: 1.1,
                mb: 3
              }}
            >
              Nouveau<br />
              <Box component="span" sx={{ fontWeight: 800 }}>
                Stagiaire
              </Box>
            </Typography>

            {/* Accent Line */}
            <Box sx={{ width: 48, height: 4, bgcolor: "#2563eb", mb: 4 }} />

            <Typography variant="body2" sx={{ color: "#94a3b8", lineHeight: 1.7, fontSize: "0.875rem" }}>
              Veuillez remplir avec précision les informations relatives au nouveau stagiaire pour l'intégration dans notre base de données.
            </Typography>
          </Box>

          <Box sx={{ mt: { xs: 4, sm: 6 }, display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#10b981" }} />
              <Typography variant="caption" sx={{ fontFamily: "monospace", color: "#64748b", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.05em" }}>
                SERVEUR ACTIF: L-STG-01
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#334155" }} />
              <Typography variant="caption" sx={{ fontFamily: "monospace", color: "#64748b", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.05em" }}>
                DERNIÈRE MAJ: 24/05/2026
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right Form Body Panel */}
        <Box sx={{ flex: 1, p: { xs: 3, sm: 5 }, bgcolor: "white", display: "flex", flexDirection: "column" }}>
          {/* Form Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Typography variant="h6" fontWeight="700" color="#0f172a" sx={{ letterSpacing: "-0.01em" }}>
              Formulaire d'enregistrement
            </Typography>
            <Box
              sx={{
                bgcolor: "#f1f5f9",
                color: "#64748b",
                px: 1.5,
                py: 0.5,
                border: "1px solid",
                borderColor: "#e2e8f0",
                fontFamily: "monospace",
                fontWeight: 800,
                fontSize: "0.65rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase"
              }}
            >
              Étape 01/01
            </Box>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Grid container spacing={3}>
              {/* Nom */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                  <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 800, color: "#94a3b8", letterSpacing: "0.08em", fontSize: "0.65rem", fontFamily: "monospace" }}>
                    Nom
                  </Typography>
                  <TextField
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    placeholder="bouakrif"
                    size="small"
                  />
                </Box>
              </Grid>

              {/* Prénom */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                  <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 800, color: "#94a3b8", letterSpacing: "0.08em", fontSize: "0.65rem", fontFamily: "monospace" }}>
                    Prénom
                  </Typography>
                  <TextField
                    name="prenom"
                    value={form.prenom}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    placeholder="khalil"
                    size="small"
                  />
                </Box>
              </Grid>

              {/* Téléphone */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                  <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 800, color: "#94a3b8", letterSpacing: "0.08em", fontSize: "0.65rem", fontFamily: "monospace" }}>
                    Téléphone
                  </Typography>
                  <TextField
                    name="telephone"
                    value={form.telephone}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    placeholder="06 12 34 56 78"
                    size="small"
                  />
                </Box>
              </Grid>

              {/* Domaine */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                  <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 800, color: "#94a3b8", letterSpacing: "0.08em", fontSize: "0.65rem", fontFamily: "monospace" }}>
                    Domaine
                  </Typography>
                  <TextField
                    name="domaine"
                    value={form.domaine}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    placeholder="infomatique"
                    size="small"
                  />
                </Box>
              </Grid>

              {/* Niveau d'étude (anne) */}
              <Grid item xs={12}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                  <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 800, color: "#94a3b8", letterSpacing: "0.08em", fontSize: "0.65rem", fontFamily: "monospace" }}>
                    Niveau d'étude (Année)
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      id="demo-select-small"
                      name="anne"
                      value={form.anne}
                      onChange={handleChange}
                      displayEmpty
                      sx={{ borderRadius: 0 }}
                    >
                      <MenuItem value="">
                        <em style={{ fontStyle: "normal", color: "#94a3b8" }}>Sélectionnez un niveau</em>
                      </MenuItem>
                      <MenuItem value={"L1"}>Licence 1 (L1)</MenuItem>
                      <MenuItem value={"L2"}>Licence 2 (L2)</MenuItem>
                      <MenuItem value={"L3"}>Licence 3 (L3)</MenuItem>
                      <MenuItem value={"M1"}>Master 1 (M1)</MenuItem>
                      <MenuItem value={"M2"}>Master 2 (M2)</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              {/* Dates Picker */}
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                        <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 800, color: "#94a3b8", letterSpacing: "0.08em", fontSize: "0.65rem", fontFamily: "monospace" }}>
                          Date de début
                        </Typography>
                        <DatePicker
                          value={form.dateDebut}
                          onChange={(newValue) =>
                            setForm({
                              ...form,
                              dateDebut: newValue,
                            })
                          }
                          slotProps={{
                            textField: {
                              size: "small",
                              fullWidth: true,
                            }
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                        <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 800, color: "#94a3b8", letterSpacing: "0.08em", fontSize: "0.65rem", fontFamily: "monospace" }}>
                          Date de fin
                        </Typography>
                        <DatePicker
                          value={form.dateFin}
                          onChange={(newValue) =>
                            setForm({
                              ...form,
                              dateFin: newValue,
                            })
                          }
                          slotProps={{
                            textField: {
                              size: "small",
                              fullWidth: true,
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </LocalizationProvider>
              </Grid>
            </Grid>

            {/* Bottom Actions and Disclaimer */}
            <Box sx={{ pt: 4, mt: 3, borderTop: "1px solid", borderColor: "#f1f5f9", display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between", gap: 2 }}>
              <Typography variant="caption" sx={{ color: "#94a3b8", maxWidth: 260, fontStyle: "italic", fontSize: "0.7rem", lineHeight: 1.4 }}>
                En cliquant sur ajouter, vous confirmez que les données saisies sont conformes au contrat de stage.
              </Typography>

              <Button
                type="submit"
                variant="contained"
                disabled={Object.values(form).some((e) => e === "" || e === null || e === undefined) || loading}
                endIcon={<SendIcon fontSize="small" />}
                sx={{
                  bgcolor: "#2563eb",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  borderRadius: 0,
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontFamily: "monospace",
                  "&:hover": {
                    bgcolor: "#1d4ed8",
                  }
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Ajouter le stagiaire"}
              </Button>
            </Box>

            {/* Decorative bottom geometric lines */}
            <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
              <Box sx={{ width: 40, height: 3, bgcolor: "#2563eb" }} />
              <Box sx={{ width: 40, height: 3, bgcolor: "#e2e8f0" }} />
              <Box sx={{ width: 40, height: 3, bgcolor: "#e2e8f0" }} />
            </Box>
          </Box>
        </Box>
      </Box>



      { success &&(
        <Snackbar
        open={click}
        // autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Fade}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={handleClose}
          sx={{
            width: "100%",
            borderRadius: 0,
            bgcolor: "#0f172a",
            color: "white",
            borderLeft: "4px solid #10b981",
            fontWeight: 600,
            fontSize: "0.85rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            fontFamily: "monospace",
            "& .MuiAlert-icon": {
              color: "#10b981"
            }
          }}
        >
          {success}
        </Alert>
      </Snackbar>
      )}
      { error &&(
        <Snackbar
        open={click}
        // autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Fade}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={handleClose}
          sx={{
            width: "100%",
            borderRadius: 0,
            bgcolor: "#0f172a",
            color: "white",
            borderLeft: "4px solid #ef4444",
            fontWeight: 600,
            fontSize: "0.85rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            fontFamily: "monospace",
            "& .MuiAlert-icon": {
              color: "#ef4444"
            }
          }}
        >
          {error}
        </Alert>
      </Snackbar>
      )}
    </Paper>
  );
}



