// React
import React from "react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Transition } from "react-transition-group";
// Material UI
import AppBar from "@mui/material/AppBar";
import ToolBar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
// Custom Components
import useMediaQuery from "../../Custom/Hooks/useMediaQuery";
import Navigation from "../../Custom/Components/Navigation";
import DelayedSignInPopup from "../SignIn/SignIn";
// Assets
import Logo from "/Logo.png";
// Custom styles
import "./Navbar.css";

const Navbar = (loginStatus) => {
  const matches = useMediaQuery("(max-width:992px)");
  loginStatus = false;
  const [noDelay, setNoDelay] = useState(false);
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "#3E6981",
      }}
    >
      <ToolBar
        sx={{
          display: "flex",
          flexDirection: matches ? "column" : "",
          justifyContent: matches ? "space-evenly" : "space-between",
          margin: matches ? "0" : "0 5% 0 5%",
          height: matches ? "125px" : "",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "0",
            justifyContent: matches ? "center" : "",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "black",
              marginTop: "3px",
            }}
          >
            CtrlAltCollege
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            width: matches ? "100%" : "27%",
            justifyContent: matches ? "center" : "",
          }}
        >
          {loginStatus ? (
            <nav>
              <Navigation to="/" label="Home" />
              <Navigation to="/releases" label="Releases" />
              <Navigation to="/myposts" label="My Posts" />
            </nav>
          ) : (
            <>
              <nav>
                <Navigation to="/" label="Home" />
                <Navigation to="/releases" label="Releases" />
                <Navigation to="/subscribe" label="Subscribe" />
                <Link
                  onClick={() => {
                    setNoDelay(true);
                  }}
                >
                  {"Login"}
                </Link>
              </nav>
              {noDelay && <DelayedSignInPopup noDelay={noDelay} />}
            </>
          )}
        </Box>
      </ToolBar>
    </AppBar>
  );
};

export default Navbar;
