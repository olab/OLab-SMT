import * as React from "react";
import {
  Alert,
  Button,
  TextField,
  Box,
  Typography,
  Container,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import OLabLogoIcon from "../shared/olab4_logo.svg";
import styled from "styled-components";
import { useState } from "react";

import OLabAlert from "@/components/OLabAlert";

export const Logo = styled.div`
  text-decoration: none;
  display: flex;
  align-items: center;

  h1 {
    margin: 0;
    margin-left: 0px;
  }

  span {
    color: #24446a;
  }
`;

export default function LoginPage() {
  const { login, user } = useAuth();

  // Search input value state
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      let loginResult = await login({
        email: data.get("email"),
        password: data.get("password"),
      });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Logo>
          <img src={OLabLogoIcon} />
        </Logo>
        <Typography
          component="h1"
          variant="h5"
          color="rgb(0, 137, 236)"
          fontWeight="bolder"
          fontSize="18pt"
        >
          OLab4
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="User Name"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>

        {error != null && (
          <OLabAlert
            severity="error"
            onClose={() => {
              setError(null);
            }}
          >
            {error}
          </OLabAlert>
        )}
      </Box>
    </Container>
  );
}
