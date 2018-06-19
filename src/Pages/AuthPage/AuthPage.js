// This Page is Skeleton of React Structure for Web Development
// If you want to make other page, Copy and Refactor this page.

import React, { Component } from "react";
import { connect } from "react-redux";
import {
  NavBar,
  List,
  SideBar,
  RoundInput,
  Button,
  Footer
} from "../../Components";
import { Dots } from "react-activity";
import * as NewsAction from "../../ActionCreators/NewsAction";
import * as PriceAction from "../../ActionCreators/PriceAction";
import * as AuthAction from "../../ActionCreators/AuthAction";
import coinJson from "../../Json/coin";
import "react-activity/dist/react-activity.css";
import Logo from "../../Assests/Imgs/enhance_logo.png";
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
    coinId: state.reducer.coinId,
    isLogin: state.reducer.isLogin
  };
};

class AuthPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      coins: [],
      favorite: [],
      coinType: "BTC",
      email: "",
      password: "",
      isLoginValid: true,
      isLoggedIn: false
    };
    this.toggle = this.toggle.bind(this);
  }

  componentWillMount() {
    const { token, newsCount, coinId, sourceId } = this.props;
    const newsParams = {
      newsCount,
      coinId,
      sourceId
    };
    this.props.dispatch(NewsAction.getNews(newsParams));
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  handleFavorite = async(index, data) => {
    const coin = this.state.favorite.slice();
    coin[index].clicked = true;
    coin[index].loading = true;
    this.setState({ favorite: coin });

    //즐겨찾기 한 코인들에게, 가격, 증감표시 key 추가
    let result = coin.map(function(el) {
      let o = Object.assign({}, el);
      o.price = 0;
      o.percent = "";
      return o;
    });

    //즐겨찾기한 코인, 이름만 모으기
    let abbrArray = [];
    for (let i = 0; i < result.length; i++) {
      abbrArray[i] = result[i].abbr;
    }
    this.props.dispatch(PriceAction.getPrice(abbrArray)).then(value => {
      for (let i = 0; i < abbrArray.length; i++) {
        result[i].price = value[abbrArray[i]].KRW.PRICE;
        result[i].percent = value[abbrArray[i]].KRW.CHANGEPCT24HOUR;
      }
      result[index].loading = false;
      this.setState(state => ({ favorite: result }));
    });
  };

  handleEmail = e => {
    this.setState({ email: e.target.value });
  };

  handlePassword = e => {
    this.setState({ password: e.target.value });
  };

  handleFindPassword = () => {
    this.props.history.push({ pathname: "/auth/verify" });
  };

  handleSignUp = () => {
    this.props.history.push({
      pathname: "/auth/signup"
    });
  };

  handleSignIn = () => {
    const { email, password } = this.state;
    const params = {
      email,
      password
    };
    this.setState({ isLoggedIn: true });
    this.props.dispatch(AuthAction.postSignIn(params)).then(value => {
      if (value === "failed") {
        this.setState({ isLoginValid: false, isLoggedIn: false });
      } else {
        this.setState({ isLoggedIn: false });

        this.props.dispatch(AuthAction.getMe(value)).then(value2 => {
          this.props.history.replace({
            pathname: "/"
          });
        });
      }
    });
  };

  handleKeySignIn = event => {
    if (event.key === "Enter") {
      const { email, password } = this.state;
      const params = {
        email,
        password
      };
      this.setState({ isLoggedIn: true });
      this.props.dispatch(AuthAction.postSignIn(params)).then(value => {
        if (value === "failed") {
          this.setState({ isLoginValid: false, isLoggedIn: false });
        } else {
          this.setState({ isLoggedIn: false });

          this.props.dispatch(AuthAction.getMe(value)).then(value2 => {
            this.props.history.replace({
              pathname: "/"
            });
          });
        }
      });
    }
  };

  render() {
    const { coinType, coins, favorite, isLoginValid, isLoggedIn } = this.state;
    const { news, isLogin } = this.props;
    const state = this.props.location.state;
    return (
      <div className="authPage">
        <NavBar type="auth" />
        <SideBar
          isLogin={isLogin}
          type={coinType}
          coins={coins}
          favorite={favorite}
          handleFavorite={this.handleFavorite}
        />
        <div className="authPage__content">
          <div className="authPage__content__news">
            <div
              ref={this.paneDidMount}
              className="authPage__content__news__lists"
            >
              {news &&
                news.map((data, index) => {
                  return (
                    <List
                      isNews
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
          <div className="authPage__content__chart">
            <div className="authPage__content__chart__intro">
              <div className="authPage__content__chart__intro__logo">
                <img width={45} height={45} src={Logo} />
                <p className="authPage__content__chart__intro__logo__text">
                  CoinHub
                </p>
              </div>
              <div className="authPage__content__chart__intro__welcome">
                <strong>환영합니다.</strong>
                <p>
                  코인허브는 가상화폐와 블록체인 기술에 대한 정보를 실시간으로
                  모아서 한눈에 보기 쉽게 제공해 드리고 있습니다. 코인허브와
                  함께 가상화폐의 역사를 함께 하세요.
                </p>
              </div>
              <div className="authPage__content__chart__intro__login">
                <RoundInput
                  onChange={this.handleEmail}
                  placeholder="이메일"
                  type="email"
                  errorText={
                    isLoginValid ? null : "입력하신 정보를 다시 확인하세요"
                  }
                />
                <br />
                <RoundInput
                  onChange={this.handlePassword}
                  placeholder="비밀번호"
                  type="password"
                  onKeyPress={this.handleKeySignIn}
                  errorText={
                    isLoginValid ? null : "입력하신 정보를 다시 확인하세요"
                  }
                />
                <br />
                {state === "temp" ? (
                  <div style={{ textAlign: "center", color: "#f26968" }}>
                    이메일로 임시 비밀번호가 전송되었습니다 확인 후
                    임시비밀번호로 로그인 해주세요
                  </div>
                ) : null}
                <br />
                <Button
                  text="로그인"
                  width={290}
                  height={50}
                  isLoading={isLoggedIn}
                  onClick={this.handleSignIn}
                />
              </div>
              <div className="authPage__content__chart__intro__signUp">
                <p>아직 코인허브의 회원이 아니신가요?</p>
                <p>
                  <strong
                    className="authPage__content__chart__intro__signUp__link"
                    onClick={this.handleSignUp}
                  >
                    회원가입
                  </strong>
                  하시고 맞춤 정보를 받아가세요!
                </p>
              </div>
              <div
                onClick={this.handleFindPassword}
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
              >
                비밀번호를 잊으셨나요?
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

AuthPage.defaultProps = defaultProps;
AuthPage.propTypes = propTypes;

export default connect(mapStateToProps)(AuthPage);
