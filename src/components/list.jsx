
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Typography,
  Box,
  Chip,
  TableContainer,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Alert,
  Tooltip,
  Stack,
  TextField,
  InputAdornment

} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkIcon from "@mui/icons-material/Work";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState, useRef, useContext, useEffect } from "react";
import { Context } from "../context/context";
import Deletepopup from "./deletePopup"
import axios from "axios"
import useMediaQuery from "@mui/material/useMediaQuery";

// Helper function to extract ONLY Year, Month, and Day
const formatDate = (dateVal) => {
  if (!dateVal) return "";
  
  // Handles Dayjs / Moment objects
  if (typeof dateVal === "object" && dateVal.$d && typeof dateVal.format === "function") {
    return dateVal.format("DD/MM/YYYY");
  }

  const str = String(dateVal).trim();
  
  // Split ISO dates (e.g., "2025-05-20T14:30:00.000Z" -> "2025-05-20")
  if (str.includes("T")) {
    return str.split("T")[0];
  }
  
  // Split timestamps with space (e.g., "2025-05-20 14:30:00" -> "2025-05-20")
  if (str.includes(" ") && (str.includes("-") || str.includes("/"))) {
    return str.split(" ")[0];
  }

  // Handle standard Date string parsing fallback
  const parsed = new Date(dateVal);
  if (!isNaN(parsed.getTime()) && str.length > 10) {
    const yyyy = parsed.getFullYear();
    const mm = String(parsed.getMonth() + 1).padStart(2, "0");
    const dd = String(parsed.getDate()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy}`;
  }

  return str;
};

export default function StagiaireTable({ addStagiaire }) {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [parsedItems, setParsedItems] = useState([]);
  const [importFileName, setImportFileName] = useState("");
  const [importFileType, setImportFileType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const fileInputRef = useRef(null);
  const isMobile = useMediaQuery("(max-width:768px)");
  const { stagiaires, getStagiares, domaine, setDomaine, handleFilterDomaine , errorDomaine, successDomaine, loadingDomaine} = useContext(Context);
  const [index, setindex] = useState(null);

  useEffect(() => {
    getStagiares();
  },[]);

  ////////////////:popup delete

  const [open, setOpen]= useState(false)

  const  handleClickOpen = ()=>{
    setOpen(true)
  }
  const handleClose = ()=>{
    setOpen(false)
  }
 
  const handleIndex= (index)=>{
    setindex(index)
  }
  const handledlete =async ()=>{
  try{
    const response = await axios.delete(`http://localhost:3000/api/stagiares/delete/${index}`,
      {
        headers:{
        'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    getStagiares()
  }catch(e){
  }finally{
    setOpen(false)
  }
}
  // Handle CSV/PDF/TXT File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImportFileName(file.name);
    const isPdf = file.name.endsWith(".pdf");
    setImportFileType(isPdf ? "PDF" : "CSV");

    const reader = new FileReader();

    if (isPdf) {
      reader.onload = (evt) => {
        const text = evt.target.result;
        parsePdfOrTextContent(text);
      };
      reader.readAsText(file);
    } else {
      reader.onload = (evt) => {
        const text = evt.target.result;
        parseCsvContent(text);
      };
      reader.readAsText(file);
    }

    e.target.value = "";
  };

  // CSV Parsing function
  const parseCsvContent = (content) => {
    if (!content || !content.trim()) {
      setAlertMessage("Le fichier sélectionné est vide.");
      setAlertSeverity("error");
      return;
    }

    const lines = content.split(/\r\n|\n/);
    const results = [];

    const firstLine = lines[0] || "";
    const delimiter = firstLine.includes(";") ? ";" : firstLine.includes("\t") ? "\t" : ",";

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const cols = trimmed.split(delimiter).map((col) => col.replace(/^["']|["']$/g, "").trim());

      if (idx === 0) {
        const lowerFirst = cols[0]?.toLowerCase();
        if (lowerFirst === "nom" || lowerFirst === "name" || lowerFirst === "prenom") {
          return;
        }
      }

      if (cols.length >= 2) {
        results.push({
          id: Date.now() + idx,
          nom: cols[0] || "",
          prenom: cols[1] || "",
          telephone: cols[2] || "",
          domaine: cols[3] || "Informatique",
          niveaux: cols[4] || "L1",
          periode: cols[5] || cols[6] || ""
        });
      }
    });

    if (results.length === 0) {
      setAlertMessage("Aucune donnée valide trouvée dans le fichier CSV.");
      setAlertSeverity("error");
    } else {
      setParsedItems(results);
      setImportDialogOpen(true);
    }
  };

  // PDF or Text Parsing function
  const parsePdfOrTextContent = (rawText) => {
    if (!rawText) {
      setAlertMessage("Impossible de lire le contenu du fichier.");
      setAlertSeverity("error");
      return;
    }

    const cleanedText = rawText.replace(/[^\x20-\x7E\n\ràáâäçèéêëìíîïñòóôöùúûüÀÁÂÄÇÈÉÊËÌÍÎÏÑÒÓÔÖÙÚÛÜ]/g, " ");
    const lines = cleanedText.split(/\r\n|\n/);
    const results = [];

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.length < 5) return;

      const parts = trimmed.split(/,|\s{2,}|;/).map((p) => p.trim()).filter(Boolean);

      if (parts.length >= 2) {
        const lower = parts[0].toLowerCase();
        if (lower.includes("nom") || lower.includes("prenom") || lower.includes("liste")) return;

        results.push({
          id: Date.now() + idx,
          nom: parts[0] || "Importé",
          prenom: parts[1] || "Stagiaire",
          telephone: parts[2] || "",
          domaine: parts[3] || "Général",
          niveaux: parts[4] || "L1",
          periode: parts[5] || ""
        });
      }
    });

    if (results.length === 0) {
      const words = cleanedText.split(/\s+/).filter((w) => w.length > 2);
      if (words.length >= 2) {
        results.push({
          id: Date.now(),
          nom: words[0] || "Stagiaire",
          prenom: words[1] || "Importé",
          telephone: "",
          domaine: "PDF Import",
          niveaux: "L1",
          periode: ""
        });
      }
    }

    if (results.length === 0) {
      setAlertMessage("Aucune donnée valide n'a pu être extraite du fichier PDF.");
      setAlertSeverity("error");
    } else {
      setParsedItems(results);
      setImportDialogOpen(true);
    }
  };

  // Confirm Import
  const handleConfirmImport = () => {
    if (parsedItems.length > 0) {
      parsedItems.forEach((item) => {
        if (addStagiaire) {
          addStagiaire(item);
        }
      });
      setAlertMessage(`${parsedItems.length} stagiaire(s) importé(s) avec succès !`);
      setAlertSeverity("success");
    }
    setImportDialogOpen(false);
    setParsedItems([]);
  };

  // Download CSV sample template or export stagiaires
  const handleDownloadCsv = () => {
    let csvRows = [];
    csvRows.push("nom,prenom,telephone,domaine,niveaux,periode");

    if (stagiaires && stagiaires.length > 0) {
      stagiaires.forEach((s) => {
        const nom = s.nom ? `"${String(s.nom).replace(/"/g, '""')}"` : "";
        const prenom = s.prenom ? `"${String(s.prenom).replace(/"/g, '""')}"` : "";
        const tel = s.telephone ? `"${String(s.telephone).replace(/"/g, '""')}"` : "";
        const domaine = s.domaine ? `"${String(s.domaine).replace(/"/g, '""')}"` : "";
        const niveaux = s.niveaux ? `"${String(s.niveaux).replace(/"/g, '""')}"` : "";
        const periode = s.periode || formatDate(s.dateDebut);
        csvRows.push([nom, prenom, tel, domaine, niveaux, `"${String(periode).replace(/"/g, '""')}"`].join(","));
      });
    } else {
      csvRows.push("Dupont,Jean,0612345678,Informatique,L3,3 mois");
      csvRows.push("Benali,Amina,0789012345,Gestion,M1,6 mois");
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", stagiaires.length > 0 ? "liste_stagiaires.csv" : "modele_stagiaires.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, my: 4 }}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv,.pdf,.txt"
        style={{ display: "none" }}
      />

      {/* Alert Notification */}
      {alertMessage && (
        <Alert
          severity={alertSeverity}
          onClose={() => setAlertMessage("")}
          sx={{ borderRadius: 0, fontFamily: "monospace", fontSize: "0.8rem", bgcolor: "#0f172a", color: "white", "& .MuiAlert-icon": { color: alertSeverity === "success" ? "#10b981" : "#ef4444" } }}
        >
          {alertMessage}
        </Alert>
      )}

      {/* Title Header */}
      <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", gap: 2, mb: 1 }}>
        <Box>
          <Typography
            variant={!isMobile ? "h4" : "h5"}
            fontWeight="800"
            sx={{
              color: "#0f172a",
              letterSpacing: "-0.02em",
              textTransform: "uppercase"
            }}
          >
            Liste des stagiaires
          </Typography>
          <Typography variant="caption" sx={{ fontFamily: "monospace", color: "#64748b", letterSpacing: "0.05em" }}>
            BASE DE DONNÉES EN DIRECT • {stagiaires.length} ENREGISTREMENT{stagiaires.length > 1 ? "S" : ""}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
          <Tooltip title={stagiaires.length > 0 ? "Télécharger la liste au format CSV" : "Télécharger le modèle de fichier CSV"}>
            <Button
              variant="outlined"
              onClick={handleDownloadCsv}
              startIcon={<FileDownloadIcon fontSize="small" />}
              sx={{
                borderColor: "#cbd5e1",
                color: "#334155",
                borderRadius: 0,
                fontWeight: 700,
                fontSize: "0.75rem",
                fontFamily: "monospace",
                textTransform: "uppercase",
                px: 1.5,
                py: 0.8,
                "&:hover": {
                  borderColor: "#0f172a",
                  bgcolor: "#f8fafc"
                }
              }}
            >
              Télécharger CSV
            </Button>
          </Tooltip>

          <Chip
            label={`${stagiaires.length} ENTRÉE${stagiaires.length > 1 ? "S" : ""}`}
            sx={{
              borderRadius: 0,
              fontFamily: "monospace",
              fontWeight: 800,
              bgcolor: "#0f172a",
              color: "white",
              fontSize: "0.75rem",
              height: 36
            }}
          />
        </Stack>
      </Box>
      {/* //////////////////////////////////////////// filter  */}
      <Box> 
        <Box sx={{ display:'flex', flexDirection:'row', my:1}}> 
        <TextField
  label="Filter by Domain"
  
  placeholder="informatique"
  value={domaine}
  onChange={(e) =>{
     setDomaine(e.target.value)
    }}
  variant="outlined"
  size="small"L
  fullWidth
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <WorkIcon sx={{ color: "#64748b" }} />
      </InputAdornment>
    ),
  }}
  sx={{
    maxWidth: 350,
    "& .MuiOutlinedInput-root": {
      borderRadius: 0,
      backgroundColor: "#fff",
      fontFamily: "monospace",
      "& fieldset": {
        borderColor: "#cbd5e1",
      },
      "&:hover fieldset": {
        borderColor: "#0f172a",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#0f172a",
        borderWidth: 2,
      },
    },
    "& .MuiInputLabel-root": {
      fontFamily: "monospace",
    },
  }}
/>
<Button  onClick={handleFilterDomaine} variant="contained" sx={{bgcolor:'#0f172a', ml:1}} disabled={loadingDomaine=== true}>{loadingDomaine===false ?'filtrer': "filtrer ..." }</Button>
{domaine && (
  <Button variant="contained" color="warning" sx={{ml:1}} onClick={()=>{
    setDomaine("")
    return getStagiares()
  }}>annuler le filter</Button>
)}
</Box>
     {successDomaine && (
  <Alert severity="success" sx={{ mb: 2 }}>
    {successDomaine}
  </Alert>
)}

{errorDomaine && (
  <Alert severity="error" sx={{ mb: 2 }}>
    {errorDomaine}
  </Alert>
)}</Box>
     

      {/* Table Section */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0,
          border: "1px solid #cbd5e1",
          boxShadow: "0 20px 40px -15px rgba(15,23,42,0.08)",
          overflow: "hidden"
        }}
      >
        {stagiaires.length === 0 ? (
          <Box sx={{ p: 6, textAlign: "center", bgcolor: "#f8fafc" }}>
            <PersonIcon sx={{ fontSize: 44, color: "#cbd5e1", mb: 1 }} />
            <Typography variant="subtitle2" fontWeight="800" color="#64748b" sx={{ fontFamily: "monospace" }}>
              AUCUN STAGIAIRE TROUVÉ DANS LA BASE
            </Typography>
            <Typography variant="caption" color="#94a3b8" sx={{ mt: 0.5, display: "block" }}>
              Utilisez le formulaire d'enregistrement pour ajouter des stagiaires.
            </Typography>
          </Box>
        ) : isMobile ? (
          /* Mobile Card View */
          <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            {stagiaires.map((s, i) => (
              <Card key={s._id} variant="outlined" sx={{ borderRadius: 0, border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="800" color="#0f172a">
                        {s.prenom} {s.nom}
                      </Typography>
                      <Typography variant="caption" color="#64748b" sx={{ display: "flex", alignItems: "center", gap: 0.5, fontFamily: "monospace", mt: 0.5 }}>
                        <WorkIcon fontSize="inherit" /> {s.domaine || "Général"}
                      </Typography>
                    </Box>
                    {s.niveaux && (
                      <Chip
                        label={s.niveaux}
                        size="small"
                        sx={{ borderRadius: 0, fontWeight: 800, fontFamily: "monospace", bgcolor: "#0f172a", color: "white" }}
                      />
                    )}
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, fontSize: "0.8rem", fontFamily: "monospace", color: "#64748b", my: 1.5, py: 1, borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PhoneIcon fontSize="small" sx={{ fontSize: "0.9rem" }} /> {s.telephone || "-"}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarMonthIcon fontSize="small" sx={{ fontSize: "0.9rem" }} />
                      Période: {s.periode || s.dateDebut ? `${s.periode || formatDate(s.dateDebut)} ${s.dateFin ? '→ ' + formatDate(s.dateFin) : ''}` : '-'}
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        handleIndex(s._id)
                        handleClickOpen()
                      }}
                      sx={{
                        color: "#ef4444",
                        borderRadius: 0,
                        border: "1px solid #fca5a5",
                        p: 0.8,
                        "&:hover": { bgcolor: "#fef2f2" }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          /* Desktop Table View */
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "#0f172a" }}>
                <TableRow>
                
                  <TableCell sx={{ color: "white", fontWeight: 800, fontFamily: "monospace", fontSize: "0.75rem", textTransform: "uppercase" }}>Nom</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 800, fontFamily: "monospace", fontSize: "0.75rem", textTransform: "uppercase" }}>Prénom</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 800, fontFamily: "monospace", fontSize: "0.75rem", textTransform: "uppercase" }}>Téléphone</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 800, fontFamily: "monospace", fontSize: "0.75rem", textTransform: "uppercase" }}>Domaine</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 800, fontFamily: "monospace", fontSize: "0.75rem", textTransform: "uppercase" }}>Année</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 800, fontFamily: "monospace", fontSize: "0.75rem", textTransform: "uppercase" }}>Période / Date début</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 800, fontFamily: "monospace", fontSize: "0.75rem", textTransform: "uppercase" }}>Date fin</TableCell>
                  <TableCell align="center" sx={{ color: "white", fontWeight: 800, fontFamily: "monospace", fontSize: "0.75rem", textTransform: "uppercase" }}>Effacer</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {stagiaires.map((s, i) => (
                  <TableRow key={s._id} hover sx={{ "&:hover": { bgcolor: "#f8fafc" }, "&:last-child td": { borderBottom: 0 } }}>
                    <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>{s.nom}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#334155" }}>{s.prenom}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace", color: "#64748b", fontSize: "0.85rem" }}>{s.telephone || "-"}</TableCell>
                    <TableCell>
                      <Chip
                        label={s.domaine || "Général"}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 0, fontWeight: 600, fontSize: "0.75rem", borderColor: "#cbd5e1" }}
                      />
                    </TableCell>
                    <TableCell>
                      {s.niveaux ? (
                        <Chip
                          label={s.niveaux}
                          size="small"
                          sx={{ borderRadius: 0, fontWeight: 800, fontFamily: "monospace", bgcolor: "#f1f5f9", color: "#0f172a", border: "1px solid #cbd5e1" }}
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "monospace", color: "#64748b", fontSize: "0.85rem" }}>
                      {s.periode || formatDate(s.dateDebut) || "-"}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "monospace", color: "#64748b", fontSize: "0.85rem" }}>
                      {formatDate(s.dateFin) || "-"}
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => {
                          handleIndex(s._id)
                          handleClickOpen()
                        }}
                        sx={{
                          color: "#ef4444",
                          borderRadius: 0,
                          "&:hover": { bgcolor: "#fef2f2" }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Import Preview Dialog */}
      <Dialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 0,
            border: "1px solid #cbd5e1",
            boxShadow: "0 25px 50px -12px rgba(15,23,42,0.25)"
          }
        }}
      >
        <Box sx={{ bgcolor: "#0f172a", color: "white", px: 3, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {importFileType === "PDF" ? <PictureAsPdfIcon sx={{ color: "#ef4444" }} /> : <FileUploadIcon sx={{ color: "#38bdf8" }} />}
            <Typography variant="subtitle1" fontWeight="800" sx={{ fontFamily: "monospace", textTransform: "uppercase" }}>
              APERÇU DE L'IMPORTATION ({parsedItems.length} ÉLÉMENTS)
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ fontFamily: "monospace", color: "#94a3b8" }}>
            FICHIER: {importFileName}
          </Typography>
        </Box>

        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ color: "#334155", mb: 2, fontSize: "0.85rem" }}>
            Voici les stagiaires détectés dans votre fichier. Cliquez sur "Confirmer l'importation" pour les ajouter à la liste.
          </Typography>

          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 0, maxHeight: 300 }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, fontFamily: "monospace", fontSize: "0.7rem" }}>Nom</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontFamily: "monospace", fontSize: "0.7rem" }}>Prénom</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontFamily: "monospace", fontSize: "0.7rem" }}>Téléphone</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontFamily: "monospace", fontSize: "0.7rem" }}>Domaine</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontFamily: "monospace", fontSize: "0.7rem" }}>Année</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontFamily: "monospace", fontSize: "0.7rem" }}>Période</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parsedItems.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ fontWeight: 700 }}>{item.nom}</TableCell>
                    <TableCell>{item.prenom}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{item.telephone || "-"}</TableCell>
                    <TableCell>{item.domaine}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace" }}>{item.niveaux}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace" }}>{item.periode || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>

        <DialogActions sx={{ p: 2, px: 3, bgcolor: "#f8fafc", borderTop: "1px solid #e2e8f0", gap: 1 }}>
          <Button
            onClick={() => setImportDialogOpen(false)}
            sx={{
              borderRadius: 0,
              color: "#64748b",
              fontWeight: 700,
              fontFamily: "monospace",
              fontSize: "0.75rem",
              textTransform: "uppercase"
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirmImport}
            startIcon={<CheckCircleIcon fontSize="small" />}
            sx={{
              borderRadius: 0,
              bgcolor: "#2563eb",
              color: "white",
              fontWeight: 800,
              fontFamily: "monospace",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              px: 2.5,
              "&:hover": {
                bgcolor: "#1d4ed8"
              }
            }}
          >
            Confirmer l'importation ({parsedItems.length})
          </Button>
        </DialogActions>
      </Dialog>
      <Deletepopup open={open} handleClickOpen={handleClickOpen} handleClose={handleClose} handledelete={handledlete}></Deletepopup>
      
    </Box>
  );
}