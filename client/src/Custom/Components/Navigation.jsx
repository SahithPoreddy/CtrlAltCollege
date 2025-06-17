import React from "react";
import { NavLink } from "react-router-dom";
import { styled } from "@mui/system";

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: "none",
  color: "black",
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    width: "0%",
    height: "2px",
    bottom: "-2px",
    left: "0",
    backgroundColor: "black",
    transition: "width .5s ease-in-out",
  },
  "&.active:after": {
    width: "100%",
  },
}));

const Navigation = ({ to, label }) => {
  return (
    <StyledNavLink to={to} activeclassname="active">
      {label}
    </StyledNavLink>
  );
};

export default Navigation;
