import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (q: string) => void;
}

const Modal: React.FC<ModalProps> = ({ onClose, open, onSubmit }) => {
  const [isError, setIsError] = React.useState(false);

  const handleAutoHideAlert = () => {
    setTimeout(() => {
      setIsError(false);
    }, 3000);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const types = formJson.types;
          if (!types || types.length === 0) {
            setIsError(true);
            handleAutoHideAlert();
            return;
          }
          onClose();
          onSubmit(types);
        },
      }}
    >
      <DialogTitle> Filter by pokemon types</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter pokemon type to filter the list of pokemons by types
        </DialogContentText>
        <TextField
          autoFocus
          required
          name="types"
          margin="dense"
          label="Enter types"
          fullWidth
          variant="standard"
          helperText="Enter multiple types separated by comma"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Search</Button>
      </DialogActions>
      {isError && (
        <Alert severity="error">
          Enter multiple types separated by comma to filter the list of pokemons
        </Alert>
      )}
    </Dialog>
  );
};

export default Modal;
