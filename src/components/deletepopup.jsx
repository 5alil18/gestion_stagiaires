import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

export default function Deletepopup({
  open,
  handleClickOpen,
  handleClose,
  handledlete,
  index,
}) {
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        role="alertdialog"
      >
        <DialogTitle id="alert-dialog-title">
          {"vous etes sur pour suuprimer ce etudiant"}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleClose} color="error" autoFocus>
            Disagree
          </Button>
          <Button
          color="error"
            onClick={() => {
              handledlete(index);
              handleClose()
            }}
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
