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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import Updatepopup from "./updatepopup";
import { useState } from "react";
import Deletepopup from "./deletepopup";

export default function StagiaireTable({
  stagiaires,
  deleteStagiaire,
  updateStagiare,
}) {
  const [open, setOpen] = useState(false);
  function handleclose() {
    setOpen(false);
  }
  const [deleteopen, setdelete] = useState(false);
  function handleclosedelete() {
    setdelete(false);
  }
  const [selected, setselcted] = useState("");
  const [index, setindex] = useState(null);
  function update(e) {
    updateStagiare(index, e);
  }
  function handleseconddelete(id){
    deleteStagiaire(id);
  }

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 8, my: 2 }}
    >
      <Typography variant="h2" color="primary" sx={{ textAlign: "center" }}>
        list des stagiaires
      </Typography>
      <Paper sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "secondary.main" }}>Nom</TableCell>
              <TableCell sx={{ color: "secondary.main" }}>prenom</TableCell>
              <TableCell sx={{ color: "secondary.main" }}>telephone</TableCell>
              <TableCell sx={{ color: "secondary.main" }}>domaine</TableCell>
              <TableCell sx={{ color: "secondary.main" }}>anné</TableCell>
              <TableCell sx={{ color: "secondary.main" }}>periode</TableCell>
              <TableCell sx={{ color: "secondary.main" }}>update</TableCell>
              <TableCell sx={{ color: "secondary.main" }}>effacer</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {stagiaires.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.nom}</TableCell>
                <TableCell>{s.prenom}</TableCell>
                <TableCell>{s.telephone}</TableCell>
                <TableCell>{s.domaine}</TableCell>
                <TableCell>{s.anne}</TableCell>
                <TableCell>{s.periode}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setOpen(true);
                      setselcted(s.periode);
                      setindex(s.id);
                    }}
                  >
                    <CreateOutlinedIcon color="success" />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setindex(s.id)
                      setdelete(true);
                    }}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Updatepopup
        open={open}
        val={selected}
        handleClose={handleclose}
        update={update}
      ></Updatepopup>
      <Deletepopup
        open={deleteopen}
        handleClose={handleclosedelete}
        handledlete={handleseconddelete}
        index={index}
      ></Deletepopup>
    </Box>
  );
}
