// React elements
import * as React from "react";
// Material UI components
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { grey } from "@mui/material/colors";
import { Box } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: grey,
  },
});

const LoadMore = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: "50px",
        marginBottom: "50px",
      }}
    >
      <ThemeProvider theme={theme}>
        <Button
          onClick={() => {
            alert("show more button clicked");
          }}
          variant="outlined"
          color="primary"
        >
          Show more
        </Button>
      </ThemeProvider>
    </Box>
  );
};

export default LoadMore;
