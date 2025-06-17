import * as React from "react";
import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const defaultTheme = createTheme();

export default function DelayedSignInPopup(props) {
  const [open, setOpen] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [hasOpenedVoluntarily, setHasOpenedVoluntarily] = useState(false);

  // Check if user is logged in (replace with your actual auth check)
  const isLoggedIn = () => {
    // Example: Check for an auth token in cookies or localStorage
    // return document.cookie.includes('authToken') || localStorage.getItem('authToken');
    return false; // For demo purposes, always assume not logged in
  };

  useEffect(() => {
    if (isLoggedIn()) return; // Skip if user is logged in

    let timer;
    if (props.noDelay) {
      // Voluntary popup: open immediately and mark as voluntarily opened
      setOpen(true);
      setHasOpenedVoluntarily(true);
    } else if (!hasOpenedVoluntarily) {
      // Involuntary popup: set 5-second delay only if not voluntarily opened
      timer = setTimeout(() => {
        setOpen(true);
      }, 0);
    }

    return () => {
      if (timer) clearTimeout(timer); // Cleanup timer on unmount or change
    };
  }, [props.noDelay, hasOpenedVoluntarily]); // Dependencies to re-evaluate logic

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });

    // Handle login request here (e.g., set auth token, close modal)
    setOpen(false);
    setHasOpenedVoluntarily(true); // Prevent future involuntary popups
  };

  const handleClose = () => {
    setOpen(false);
    setHasOpenedVoluntarily(true); // Prevent involuntary popup after manual close
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      {/* Modal for the sign-in form */}
      {open && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="sign-in-modal"
          aria-describedby="sign-in-form"
        >
          <Container
            component="main"
            maxWidth="xs"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>

              <Typography component="h1" variant="h5">
                Sign {signUp ? "Up" : "In"}
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="user"
                  autoComplete="username"
                  style={{ display: signUp ? "block" : "none" }} // Show only on sign up
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
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign {signUp ? "Up" : "In"}
                </Button>
                <Grid container>
                  <Grid item xs>
                    {!signUp && (
                      <Link href="#" variant="body2">
                        Forgot password?
                      </Link>
                    )}
                  </Grid>
                  <Grid item>
                    {signUp ? (
                      <Link
                        href="#"
                        variant="body2"
                        onClick={() => setSignUp(false)}
                      >
                        {"Already have an account? Sign In"}
                      </Link>
                    ) : (
                      <Link
                        href="#"
                        variant="body2"
                        onClick={() => setSignUp(true)}
                      >
                        {"Don't have an account? Sign Up"}
                      </Link>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </Modal>
      )}
    </ThemeProvider>
  );
}
