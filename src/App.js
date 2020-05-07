import React, { Component } from "react";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { blue, indigo } from "@material-ui/core/colors";
import store from "./store/store";
import { Provider } from "react-redux";
import Routes from "./routes";

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: blue[900]
    },
    primary: {
      main: indigo[700]
    }
  }
});

class App extends Component {
  
  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className="main-container">
          <ThemeProvider theme={theme}>
            <Provider store={store}>
              <Routes />
            </Provider>
          </ThemeProvider> 
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
