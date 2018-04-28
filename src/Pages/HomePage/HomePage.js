// This Page is Skeleton of React Structure for Web Development
// If you want to make other page, Copy and Refactor this page.

import React, { Component } from "react";
import { connect } from "react-redux";
import { NavBar } from "../../Components";
import Script from "react-load-script";

const defaultProps = {};
const propTypes = {};

const mapStateToProps = state => {
  return {
    actionResult: state.reducer.actionResult
  };
};

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: ""
    };
  }

  componentDidMount() {
    const baseUrl = "https://widgets.cryptocompare.com/";
    var appName = encodeURIComponent(window.location.hostname);
    let cccTheme = {
      General: { background: "red" },
      Tabs: { activeBorderColor: "#037367" }
    };
    if (appName == "") {
      appName = "local";
    }
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    var theUrl = baseUrl + "serve/v3/coin/chart?fsym=BTC&tsyms=USD,EUR,CNY,GBP";
    s.src =
      theUrl +
      (theUrl.indexOf("?") >= 0 ? "&" : "?") +
      "app=" +
      appName +
      "cccTheme=" +
      cccTheme;
    console.log(s);
    this.setState({ url: s.src });
    this.instance.appendChild(s);
  }

  render() {
    return (
      <div className="homePage">
        <NavBar type="news" />
        <div className="homePage__content">
          <div className="homePage__content__news">
            <div className="homePage__content__news__search">
              <div className="homePage__content__news__search__first">
                <div className="homePage__content__news__search__first__iconArea">
                  <span className="homePage__content__news__search__first__iconArea__icon">
                    <i className="xi-search" />
                  </span>
                </div>
                <div className="homePage__content__news__search__first__inputArea">
                  <input
                    className="homePage__content__news__search__first__inputArea__input"
                    placeholder="무엇을 찾고싶으신가요?"
                  />
                </div>
              </div>
              <div className="homePage__content__news__search__second">
                <div className="homePage__content__news__search__second__content">
                  <p>필터</p>
                </div>
              </div>
            </div>
          </div>
          <div className="homePage__content__chart">
            <div
              id="test"
              className="homePage__content__chart__wrapper"
              ref={el => (this.instance = el)}
            />
          </div>
        </div>
      </div>
    );
  }
}

HomePage.defaultProps = defaultProps;
HomePage.propTypes = propTypes;

export default connect(mapStateToProps)(HomePage);
