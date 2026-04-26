import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect } from "react";
export default function Updatepopup({ open, handleClose, update, val, index }) {
  const [input, setinput] = useState("");

  useEffect(() => {
    setinput(val);
  }, [val]);

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>mis à jour</DialogTitle>
        <DialogContent>
          <DialogContentText>
            vous etes sur de modifié la pariode de stage ?
          </DialogContentText>
          <form id="subscription-form">
            <TextField
              autoFocus
              required
              margin="dense"
              fullWidth
              variant="standard"
              value={input}
              onChange={(e) => {
                setinput(e.target.value);
              }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button color="warning" onClick={handleClose}>annulé</Button>
          <Button
            form="subscription-form"
            color="warning"
            onClick={() => {
              update(input);
              handleClose();
            }}
          >
            metre à jour
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
