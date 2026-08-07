import React from "react";
import { Box, Paper, Typography} from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

export default function WaitingVerification() {

  return (
    <Box
      sx={{
        minHeight: "60vh",
        bgcolor: "#f8fafc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 500,
          width: "100%",
          p: 5,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <MarkEmailReadIcon
          sx={{
            fontSize: 80,
            color: "#2563eb",
            mb: 2,
          }}
        />

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Vérifiez votre email
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Un email de vérification a été envoyé à votre adresse email.
          Veuillez ouvrir votre boîte de réception et cliquer sur le lien de
          vérification
        </Typography>
      </Paper>
    </Box>
  );
}