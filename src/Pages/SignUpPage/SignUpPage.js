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
    news: state.reducer.news,
    newsCount: state.reducer.newsCount,
    sourceId: state.reducer.sourceId,
    coinId: state.reducer.coinId
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
      confirmPassword: "",
      passwordValid: true,
      passwordSame: true,
      username: "",
      emailExist: false,
      userExist: false,
      isSignedUp: false
    };
    this.toggle = this.toggle.bind(this);
  }

  paneDidMount = node => {
    if (node) {
      node.addEventListener("scroll", this.handleScroll.bind(this));
    }
  };

  componentWillMount() {
    const { token, newsCount, coinId, sourceId } = this.props;
    const newsParams = {
      newsCount,
      coinId,
      sourceId
    };
    this.props.dispatch(NewsAction.getNews(newsParams));
  }

  handleScroll = event => {
    var node = event.target;
    const bottom = node.scrollHeight - node.scrollTop === node.clientHeight;
    if (bottom) {
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

  handleConfirmPassword = e => {
    this.setState({ confirmPassword: e.target.value });
  };

  handleName = e => {
    this.setState({ username: e.target.value });
  };

  handleSignUp = () => {
    const { email, password, username, confirmPassword } = this.state;
    const params = {
      email,
      password,
      username
    };
    this.setState({ isSignedUp: true });
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z!@#$%^&*?~{}`\[\]=\-\/+_\()\\><|,\.$;:'"]{6,}$/;
    if (!passwordRegex.test(password)) {
      this.setState({ passwordValid: false, isSignedUp: false });
    } else if (
      email.length === 0 ||
      username.length === 0 ||
      password.length === 0
    ) {
      alert("이메일과 유저네임을 꼭 입력해주세요");
      this.setState({ isSignedUp: false });
    } else if (password !== confirmPassword) {
      this.setState({ passwordSame: false, isSignedUp: false });
    } else {
      this.props.dispatch(AuthAction.postSignUp(params)).then(value => {
        if (value === "user email exists") {
          this.setState({ emailExist: true, isSignedUp: false });
        } else if (value === "username exists") {
          this.setState({ userExist: true, isSignedUp: false });
        } else {
          this.props.dispatch(AuthAction.getMe(value)).then(value2 => {
            this.setState({ isSignedUp: false });
            this.props.history.replace({
              pathname: "/"
            });
          });
        }
      });
    }
  };

  render() {
    const {
      coinType,
      coins,
      favorite,
      isSignedUp,
      emailExist,
      userExist,
      passwordValid,
      passwordSame,
      password
    } = this.state;
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
                  errorText={emailExist ? "이미 등록된 이메일입니다" : null}
                  type="email"
                />
                <br />
                <RoundInput
                  onChange={this.handleName}
                  errorText={userExist ? "이미 등록된 이름입니다" : null}
                  placeholder="닉네임"
                  type="text"
                />
                <br />
                <RoundInput
                  onChange={this.handlePassword}
                  errorText={
                    password.length < 6 && !passwordValid
                      ? "비밀번호는 숫자 영문 혼합 6글자 이상이어야 합니다"
                      : null
                  }
                  placeholder="비밀번호"
                  type="password"
                />
                <br />
                <RoundInput
                  onChange={this.handleConfirmPassword}
                  errorText={
                    !passwordSame
                      ? "위에 입력하신 비밀번호와 일치하지 않습니다"
                      : null
                  }
                  placeholder="비밀번호 확인"
                  type="password"
                />
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
                  isLoading={isSignedUp}
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
