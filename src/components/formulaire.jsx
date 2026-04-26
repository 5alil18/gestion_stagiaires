import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  Snackbar,
  Typography,
  Alert
} from "@mui/material";

export default function StagiaireForm({ addStagiaire }) {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    domaine: "",
    anne: "",
    periode: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addStagiaire(form);
    setForm({
      nom: "",
      prenom: "",
      telephone: "",
      domaine: "",
      anne: "",
      periode: "",
    });
  };
  const [click, setClick] = useState(false);
  function handleClose() {
    setClick(false);
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        mt: 5,
        gap: 5,
      }}
    >
      <Typography variant="h2" sx={{ mx: "auto" }} color="primary">
        Fomulaire
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Nom"
          name="nom"
          value={form.nom}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Prénom"
          name="prenom"
          value={form.prenom}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="telephone"
          name="telephone"
          value={form.telephone}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Domaine"
          name="domaine"
          value={form.domaine}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Select
            label="anne"
            name="anne"
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={form.anne}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"L1"}>L1</MenuItem>
            <MenuItem value={"L2"}>L2</MenuItem>
            <MenuItem value={"L3"}>L3</MenuItem>
            <MenuItem value={"M1"}>M1</MenuItem>
            <MenuItem value={"M2"}>M2</MenuItem>
          </Select>

          <TextField
            label="periode"
            name="periode"
            value={form.periode}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            color="success"
            type="submit"
            variant="contained"
            disabled={Object.values(form).some((e) => e === "")}
            onClick={() => {
              setClick(true);
              setTimeout(() => {
                setClick(false);
              }, 1500);
            }}
          >
            Ajouter
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={click}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert  severity="success" variant="filled">
          un nouveaux stagiare est ajouté
        </Alert>
      </Snackbar>
    </Box>
  );
}
