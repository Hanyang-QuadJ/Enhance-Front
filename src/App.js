// React Common Modules
import React, { Component } from "react";
// React Router
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter,
  Switch,
  Redirect
} from "react-router-dom"; // Material UI Provider for React
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { connect } from "react-redux";
import { green500 } from "material-ui/styles/colors";
import * as AuthAction from "./ActionCreators/AuthAction";
import * as NewsAction from "./ActionCreators/NewsAction";
import * as PriceAction from "./ActionCreators/PriceAction";

// Own Modules
import {
  DefaultPage,
  DefaultReduxPage,
  HomePage,
  AuthPage,
  SignUpPage,
  MyPage,
  UserPage,
  ForumPage
} from "./Pages/";

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
    this.state = {
      isReady: false
    };
  }

  componentWillMount() {
    const { token, newsCount, coinId, sourceId } = this.props;
    const newsParams = {
      newsCount,
      coinId,
      sourceId
    };
    this.props.dispatch(NewsAction.getNews(newsParams)).then(value => {
      if (this.props.isLogin === true) {
        this.props.dispatch(AuthAction.getMe(this.props.token)).then(value2 => {
          this.setState({ isReady: true });
        });
      } else {
        this.setState({ isReady: true });
      }
    });
  }

  render() {
    const { isReady } = this.state;
    if (isReady) {
      return (
        <MuiThemeProvider muiTheme={muiTheme}>
          <div>
            <Route exact path="/" component={HomePage} />
            <Route path="/forum" component={ForumPage} />
            <Route path="/profile" component={MyPage} />
            <Route path="/@:user_id" component={UserPage} />
            <Route exact path="/auth" component={AuthPage} />
            <Route path="/auth/signup" component={SignUpPage} />
          </div>
        </MuiThemeProvider>
      );
    } else {
      return <div className="app">로딩중</div>;
    }
  }
}

export default withRouter(connect(mapStateToProps)(App));
