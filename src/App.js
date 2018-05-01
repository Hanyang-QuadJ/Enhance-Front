// React Common Modules
import React, { Component } from "react";
// React Router
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter,
  Switch
} from "react-router-dom"; // Material UI Provider for React
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { connect } from "react-redux";
import { green500 } from "material-ui/styles/colors";
import * as AuthAction from "./ActionCreators/AuthAction";
import * as NewsAction from "./ActionCreators/NewsAction";

// Own Modules
import {
  DefaultPage,
  DefaultReduxPage,
  HomePage,
  AuthPage,
  SignUpPage,
  MyPage,
  ForumPage
} from "./Pages/";

import HomePageRoute from "./Pages/HomePage/HomePage";

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: green500
  }
});

const mapStateToProps = state => {
  return {
    isLogin: state.reducer.isLogin,
    token: state.reducer.token,
    me: state.reducer.me,
    newsCount: state.reducer.newsCount,
    coinId: state.reducer.coinId,
    sourceId: state.reducer.sourceId
  };
};

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { token, newsCount, coinId, sourceId } = this.props;
    const newsParams = {
      newsCount,
      coinId,
      sourceId
    };
    this.props.dispatch(NewsAction.getNews(newsParams));
    if (this.props.isLogin === true) {
      this.props.dispatch(AuthAction.getMe(this.props.token));
    }
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Route path="/news" component={HomePage} />
          <Route exact path="/forum" component={ForumPage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/auth/signup" component={SignUpPage} />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(connect(mapStateToProps)(App));
