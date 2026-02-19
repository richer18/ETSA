import { ThemeProvider, createTheme } from "@mui/material/styles";
import Routers from "./Router/Router";

// Create custom theme
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },

    // Custom gradient palette
    gradients: {
      primary: {
        main: "#1976d2",
        state: "#0d47a1",
      },
      dark: {
        main: "#000",
        state: "#333",
      },
    },
  },

  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },

  // Custom functions allowed (MUI supports theme augmentation)
  functions: {
    linearGradient: (color1, color2) =>
      `linear-gradient(to bottom, ${color1}, ${color2})`,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routers />
    </ThemeProvider>
  );
}

export default App;
