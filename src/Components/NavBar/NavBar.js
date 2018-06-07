// This Page is Skeleton of React Structure for Web Development
// If you want to make other page, Copy and Refactor this page.

import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { Button, Thumb } from "../";

import cx from "classnames";

import * as DefaultActionCreator from "../../ActionCreators/_DefaultActionCreator";
import * as AuthAction from "../../ActionCreators/AuthAction";

const defaultProps = {};
const propTypes = {};

const mapStateToProps = state => {
  return {
    isLogin: state.reducer.isLogin,
    me: state.reducer.me
  };
};

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  handleAuth = () => {
    const { isLogin } = this.props;
    if (isLogin === true) {
      this.props.history.push({
        pathname: "/profile"
      });
    } else {
      this.props.history.push({
        pathname: "/auth"
      });
    }
  };

  handleAdmin = () => {
    this.props.history.push({
      pathname: "/auth/admin"
    });
  };

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  };

  handleNews = () => {
    this.props.history.push({
      pathname: "/"
    });
  };

  handleForum = () => {
    this.props.history.push({
      pathname: "/forum"
    });
  };

  render() {
    const { navStatus } = this.state;
    const { type, isLogin, me, onClickMe } = this.props;
    return (
      <div className="navBar">
        <Modal
          isOpen={this.state.showModal}
          toggle={this.toggleModal}
          modalTransition={{ timeout: 20 }}
          backdropTransition={{ timeout: 10 }}
          centered={true}
        >
          <ModalBody>
            <div className="navBar__signOut">
              <div className="navBar__signOut__text">
                <h4>로그아웃 하시겠습니까?</h4>
              </div>
              <div className="navBar__signOut__button">
                <Button
                  text="확인"
                  width={100}
                  height={50}
                  onClick={this.handleSignOut}
                />
              </div>
            </div>
          </ModalBody>
        </Modal>
        <div className="navBar__content">
          <div className="navBar__content__brand" onClick={this.handleNews}>
            <img
              className="navBar__content__brand__logo"
              src="https://github.com/Hanyang-QuadJ/enhance/blob/master/public/icons/enhance_logo.png?raw=true"
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
            <div
              className={cx("navBar__content__items__item", {
                "navBar__content__items__item-active": type === "forum"
              })}
              onClick={this.handleForum}
            >
              <span className="navBar__content__items__item-icon">
                <i className="xi-users-o" />
              </span>
              <p>포럼</p>
            </div>
            {isLogin ? (
              <div
                className={cx("navBar__content__items__item", {
                  "navBar__content__items__item-active": type === "auth"
                })}
                onClick={this.handleAuth}
              >
                <Thumb
                  fontSize={30}
                  size={40}
                  border={type === "auth" ? "2px rgb(92, 184, 92) solid" : null}
                  src={me && me.profile_img}
                  point={me && me.point}
                />
              </div>
            ) : (
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
            )}
            {me && me.flag === 1 ? (
              <div
                className={cx("navBar__content__items__item", {
                  "navBar__content__items__item-active": type === "admin"
                })}
                onClick={this.handleAdmin}
              >
                <span className="navBar__content__items__item-icon">
                  <i className="xi-wrench" />
                </span>
                <p>관리자</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

NavBar.defaultProps = defaultProps;
NavBar.propTypes = propTypes;

export default withRouter(connect(mapStateToProps)(NavBar));
