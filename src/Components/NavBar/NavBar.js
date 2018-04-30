// This Page is Skeleton of React Structure for Web Development
// If you want to make other page, Copy and Refactor this page.

import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import cx from "classnames";

import * as DefaultActionCreator from "../../ActionCreators/_DefaultActionCreator";

const defaultProps = {};
const propTypes = {};

const mapStateToProps = state => {
  return {};
};

class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  handleAuth = () => {
    this.props.history.push({
      pathname: "/auth"
    });
  };

  handleNews = () => {
    this.props.history.push({
      pathname: "/"
    });
  };

  render() {
    const { type } = this.props;
    return (
      <div className="navBar">
        <div className="navBar__content">
          <div className="navBar__content__brand">
            <img
              className="navBar__content__brand__logo"
              src={require("../../Assests/Imgs/enhance_logo.png")}
            />
            <p className="navBar__content__brand__logo__text">ENHANCE</p>
          </div>
          <div className="navBar__content__items">
            <div
              className={cx("navBar__content__items__item", {
                "navBar__content__items__item-active": type === "news"
              })}
              onClick={this.handleNews}
            >
              <span className="navBar__content__items__item-icon">
                <i className="xi-library-books-o" />
              </span>
              <p>뉴스</p>
            </div>
            <div className="navBar__content__items__item">
              <span className="navBar__content__items__item-icon">
                <i className="xi-users-o" />
              </span>
              <p>포럼</p>
            </div>
            <div
              className={cx("navBar__content__items__item", {
                "navBar__content__items__item-active": type === "auth"
              })}
              onClick={this.handleAuth}
            >
              <span className="navBar__content__items__item-icon">
                <i className="xi-log-in" />
              </span>
              <p>로그인</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NavBar.defaultProps = defaultProps;
NavBar.propTypes = propTypes;

export default withRouter(connect(mapStateToProps)(NavBar));
