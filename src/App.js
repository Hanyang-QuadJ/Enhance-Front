// React Common Modules
import React, { Component } from "react";
// React Router
import { BrowserRouter as Router, Route, Link } from "react-router-dom"; // Material UI Provider for React
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { green500 } from "material-ui/styles/colors";

// Own Modules
import { DefaultPage, DefaultReduxPage, HomePage, AuthPage } from "./Pages/";

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: green500
  }
});

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Router>
          <div>
            <Route exact path="/" component={HomePage} />
            <Route path="/auth" component={AuthPage} />
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
