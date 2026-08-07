import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog({ open ,handleClose, handleToken}) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        role="alertdialog"
      >
        <DialogTitle id="alert-dialog-title">
          {"vous etes sur de quiter l'app"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            vous devrez refaire un connexion (se connecter tab) pour l'accé à l'app
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus variant='outlined' color='error'>
            annuler
          </Button>
          <Button onClick={handleToken} color='error' variant='contained'>oui</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
