import React, { useEffect, useState} from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, CircularProgress, Button } from "@mui/material";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/company/verifyEmail/${token}`
        );

        
        setMessage(response.data.data);
        setSuccess(true);
      } catch (e) {
        setSuccess(false);
        setMessage(
          e.response?.data 
        );
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f8fafc",
      }}
    >
      <Paper sx={{ p: 5, width: 450, textAlign: "center" }}>
        {loading ? (
          <>
            <CircularProgress />
            <Typography mt={2}>
              Vérification de votre email...
            </Typography>
          </>
        ) : (
          <>
            <Typography
              variant="h4"
              color={success ? "green" : "red"}
            >
              {success===true ? "✅ Email vérifié" : "❌ Erreur"}
            </Typography>

            <Typography mt={2}>
              {message}
            </Typography>

            <Button
              variant="contained"
              sx={{ mt: 4 }}
              onClick={() => navigate("/auth")}
            >
              Aller à la connexion (se connecter)
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}