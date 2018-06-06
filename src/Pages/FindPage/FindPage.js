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

class FindPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      coins: [],
      favorite: [],
      coinType: "BTC",
      email: "",
      isLoginValid: true,
      isLoggedIn: false
    };
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

  handleEmail = e => {
    this.setState({ email: e.target.value });
  };

  handleSignIn = () => {
    this.props.history.replace({
      pathname: "/auth"
    });
  };

  handleFind = () => {
    const { email } = this.state;
    const params = {
      email
    };
    this.setState({ isLoggedIn: true });
    this.props.dispatch(AuthAction.findPassword(params)).then(value => {
      this.setState({ isLoggedIn: false });
      this.props.history.push({ pathname: "/auth", state: "temp" });
    });
  };

  handleKeySignIn = event => {
    if (event.key === "Enter") {
      const { email } = this.state;
      const params = {
        email
      };
      this.setState({ isLoggedIn: true });
      this.props.dispatch(AuthAction.findPassword(params)).then(value => {
        this.setState({ isLoggedIn: false });
        console.log(value);
      });
    }
  };

  render() {
    const { coinType, coins, favorite, isLoginValid, isLoggedIn } = this.state;
    const { news } = this.props;
    return (
      <div className="authPage">
        <NavBar type="auth" />
        <SideBar
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
                <img
                  width={45}
                  height={45}
                  src="https://github.com/Hanyang-QuadJ/enhance/blob/master/public/icons/enhance_logo.png?raw=true"
                />
                <p className="authPage__content__chart__intro__logo__text">
                  ENHANCE
                </p>
              </div>
              <div className="authPage__content__chart__intro__welcome">
                <strong>환영합니다.</strong>
                <p>가입하실 때의 이메일을 입력해주세요.</p>
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
                <br />
                <br />
                <Button
                  text="임시 비밀번호 받기"
                  width={290}
                  height={50}
                  isLoading={isLoggedIn}
                  onClick={this.handleFind}
                />
              </div>
              <div className="authPage__content__chart__intro__signUp">
                <p>
                  <strong
                    className="authPage__content__chart__intro__signUp__link"
                    onClick={this.handleSignIn}
                  >
                    로그인 창으로
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FindPage.defaultProps = defaultProps;
FindPage.propTypes = propTypes;

export default connect(mapStateToProps)(FindPage);
