// ConfirmDialog.jsx
// material ui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import MDButton from "@/components/MDButton";
import Close from "@mui/icons-material/Close";
import { useState } from "react";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import theme from "@/assets/theme";

const ConfirmDialog = (props) => {
  const [isOpen, setIsOpen] = useState(true);

  const onCancelClicked = (e) => {
    setIsOpen(false);
    if (props.handleCancel) {
      props.handleCancel();
    }
  };

  const onConfirmClicked = (e) => {
    setIsOpen(false);
    if (props.handleOk) {
      props.handleOk();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={isOpen} maxWidth="sm" fullWidth>
        <DialogTitle>{props.title}</DialogTitle>
        <Box position="absolute" top={0} right={0}>
          <IconButton onClick={onCancelClicked}>
            <Close />
          </IconButton>
        </Box>
        <DialogContent>
          <Typography>{props.message}</Typography>
        </DialogContent>
        <DialogActions>
          <MDButton
            onClick={onCancelClicked}
          >
            Cancel
          </MDButton>
          <MDButton
            onClick={onConfirmClicked}
            color="primary"
          >
            Confirm
          </MDButton>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ConfirmDialog;
