import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

export default function Deletepopup({
  open,
  handleClickOpen,
  handleClose,
  handledelete,
  
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
          <Button onClick={handleClose} color="error" autoFocus variant='outlined'>
            Disagree
          </Button>
          <Button 
          variant='contained'
          color="error"
            onClick={() => {
              handledelete();
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
