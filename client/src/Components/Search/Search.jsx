// React
import * as React from "react";
import { useState } from "react";
// Material UI Components
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
// Custom Components
import useMediaQuery from "../../Custom/Hooks/useMediaQuery";
// Custom Styles
import "./Search.css";

export default function Search() {
  // Custom media query handler
  const matches = useMediaQuery("(max-width:992px)");
  // States
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  // Handle functions
  const handleSearch = (value) => {
    setSearchValue(value);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: "50px",
      }}
    >
      <Autocomplete
        id="free-solo-demo"
        freeSolo
        disablePortal
        options={[...searchResult]}
        size="small"
        sx={{
          width: matches ? 300 : 400,
          backgroundColor: "#eee",
        }}
        onClick={(e) => {
          console.log(e.target.value);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search..."
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
          />
        )}
      />
    </Box>
  );
}
