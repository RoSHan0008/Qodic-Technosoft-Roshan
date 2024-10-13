import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";

const Login = ({ SetcurrentPage, googleLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("User logged in Successfully");
      SetcurrentPage("page");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className="dark-theme">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            InputLabelProps={{ className: "input-label" }}
            InputProps={{ className: "input-field" }}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            InputLabelProps={{ className: "input-label" }}
            InputProps={{ className: "input-field" }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ marginTop: 2 }}
            onClick={() => SetcurrentPage("signup")}
            disabled={loading}
          >
            Don't have an account? Sign Up
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            fullWidth
            sx={{
              marginTop: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textTransform: "none",
            }}
            onClick={googleLogin}
            disabled={loading}
          >
            <img
              src="google.png"
              alt="Google logo"
              style={{ width: "20px", marginRight: "8px" }}
            />
            Sign in with Google
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
