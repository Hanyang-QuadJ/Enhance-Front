// This Page is Skeleton of React Structure for Web Development
// If you want to make other page, Copy and Refactor this page.

import React, { Component } from "react";
import { connect } from "react-redux";
import { NavBar, List, SideBar, RoundInput, Button } from "../../Components";
import { Dots } from "react-activity";
import * as NewsAction from "../../ActionCreators/NewsAction";
import * as PriceAction from "../../ActionCreators/PriceAction";
import * as AuthAction from "../../ActionCreators/AuthAction";
import coinJson from "../../Json/coin";
import "react-activity/dist/react-activity.css";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

const defaultProps = {};
const propTypes = {};

const mapStateToProps = state => {
  return {
    news: state.reducer.news
  };
};

class SignUpPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      coins: [],
      favorite: [],
      coinType: "BTC",
      email: "",
      password: "",
      username: ""
    };
    this.toggle = this.toggle.bind(this);
  }

  paneDidMount = node => {
    if (node) {
      node.addEventListener("scroll", this.handleScroll.bind(this));
    }
  };

  componentDidMount() {
    this.props.dispatch(NewsAction.getNews());
  }

  handleScroll = event => {
    var node = event.target;
    const bottom = node.scrollHeight - node.scrollTop === node.clientHeight;
    if (bottom) {
      console.log("BOTTOM REACHED:", bottom);
    }
  };

  handleBack = () => {
    this.props.history.push({
      pathname: "/auth"
    });
  };

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  handleEmail = e => {
    this.setState({ email: e.target.value });
  };

  handlePassword = e => {
    this.setState({ password: e.target.value });
  };

  handleName = e => {
    this.setState({ username: e.target.value });
  };

  handleSignUp = () => {
    const { email, password, username } = this.state;
    const params = {
      email,
      password,
      username
    };
    this.props.dispatch(AuthAction.postSignUp(params)).then(value => {
      this.props.dispatch(AuthAction.getMe(value.token)).then(value2 => {
        this.props.history.replace({
          pathname: "/"
        });
      });
    });
  };

  render() {
    const { coinType, coins, favorite } = this.state;
    const { news } = this.props;
    return (
      <div className="signUpPage">
        <NavBar type="auth" />
        <SideBar
          type={coinType}
          coins={coins}
          favorite={favorite}
          handleFavorite={this.handleFavorite}
        />
        <div className="signUpPage__content">
          <div className="signUpPage__content__news">
            <div className="signUpPage__content__news__search">
              <div className="signUpPage__content__news__search__first">
                <div className="signUpPage__content__news__search__first__iconArea">
                  <span className="signUpPage__content__news__search__first__iconArea__icon">
                    <i className="xi-search" />
                  </span>
                </div>
                <div className="signUpPage__content__news__search__first__inputArea">
                  <input
                    className="signUpPage__content__news__search__first__inputArea__input"
                    placeholder="무엇을 찾고싶으신가요?"
                  />
                </div>
              </div>
              <div className="signUpPage__content__news__search__second">
                <hr />
                <div className="signUpPage__content__news__search__second__content">
                  <ButtonDropdown
                    isOpen={this.state.dropdownOpen}
                    style={{ marginRight: 10, backgroundColor: "transparent" }}
                    toggle={this.toggle}
                    size="sm"
                    direction="down"
                  >
                    <DropdownToggle caret>최신 순</DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem>인기 순</DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
                </div>
              </div>
            </div>
            <div
              ref={this.paneDidMount}
              className="signUpPage__content__news__lists"
            >
              {news &&
                news.map((data, index) => {
                  return (
                    <List
                      key={index}
                      title={data.title}
                      createdAt={data.pubDate}
                      type={coinType}
                      link={data.link}
                    />
                  );
                })}
            </div>
          </div>
          <div className="signUpPage__content__chart">
            <div className="signUpPage__content__chart__intro">
              <div className="signUpPage__content__chart__intro__logo">
                <img
                  width={45}
                  height={45}
                  src={require("../../Assests/Imgs/enhance_logo.png")}
                />
                <p className="signUpPage__content__chart__intro__logo__text">
                  ENHANCE
                </p>
              </div>
              <div className="signUpPage__content__chart__intro__login">
                <RoundInput
                  onChange={this.handleEmail}
                  placeholder="이메일"
                  type="email"
                />
                <br />
                <RoundInput
                  onChange={this.handleName}
                  placeholder="닉네임"
                  type="text"
                />
                <br />
                <RoundInput
                  onChange={this.handlePassword}
                  placeholder="비밀번호"
                  type="password"
                />
                <br />
                <RoundInput placeholder="비밀번호 확인" type="password" />
                <br />
                <br />
                <Button
                  width={290}
                  height={50}
                  text="이전으로"
                  onClick={this.handleBack}
                />
                <br />
                <Button
                  width={290}
                  height={50}
                  text="회원가입"
                  onClick={this.handleSignUp}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SignUpPage.defaultProps = defaultProps;
SignUpPage.propTypes = propTypes;

export default connect(mapStateToProps)(SignUpPage);
