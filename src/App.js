// React Common Modules
import React, { Component } from "react";
// React Router
import { BrowserRouter as Router, Route, Link } from "react-router-dom"; // Material UI Provider for React
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

// Own Modules
import { DefaultPage, DefaultReduxPage } from "./Pages/";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MuiThemeProvider>
        <Router>
          <div>
            <Route exact path="/" component={DefaultPage} />
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
