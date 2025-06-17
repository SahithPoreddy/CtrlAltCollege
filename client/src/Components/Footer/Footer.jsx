// React Components
import React from "react";
// Material UI Components
import { Box, Link, Typography } from "@mui/material";
// Custom Components
import useMediaQuery from "../../Custom/Hooks/useMediaQuery";
// Custom Styles
import "./Footer.css";

const Footer = () => {
  const matches = useMediaQuery("(max-width:992px)");
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        flexDirection: "column",
        height: matches ? "300px" : "125px",
        width: "100%",
        backgroundColor: "#cfd8dc",
      }}
    >
      <Typography
        variant="body1"
        sx={{
          display: "flex",
          flexDirection: matches ? "row" : "column",
          alignItems: "center",
        }}
      >
        Created with Love by{"  "}
        <Link href="https://github.com/sahithporeddy" target="_blank">
          @sahithporeddy
        </Link>
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: matches ? "column" : "",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <Link href="#about" color="inherit" sx={{ textDecoration: "none" }}>
          About
        </Link>
        <Link href="#subscribe" color="inherit" sx={{ textDecoration: "none" }}>
          Subscribe
        </Link>
        <Link
          href="https://github.com/sahithporeddy"
          target="_blank"
          color="inherit"
          sx={{ textDecoration: "none" }}
        >
          GitHub
        </Link>
        <Link
          href="https://linkedin.com/in/sahithporeddy"
          target="_blank"
          color="inherit"
          sx={{ textDecoration: "none" }}
        >
          LinkedIn
        </Link>
        <Link
          href="#send-question"
          color="inherit"
          sx={{ textDecoration: "none" }}
        >
          Send a question
        </Link>
        <Link
          href="https://sahithporeddy.com"
          target="_blank"
          color="inherit"
          sx={{ textDecoration: "none" }}
        >
          My Website
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
