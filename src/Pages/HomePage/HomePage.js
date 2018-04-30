// This Page is Skeleton of React Structure for Web Development
// If you want to make other page, Copy and Refactor this page.

import React, { Component } from "react";
import { connect } from "react-redux";
import { NavBar, List, SideBar } from "../../Components";
import { Dots } from "react-activity";
import * as NewsAction from "../../ActionCreators/NewsAction";
import * as PriceAction from "../../ActionCreators/PriceAction";
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
    actionResult: state.reducer.actionResult,
    news: state.reducer.news
  };
};

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadGraph: false,
      dropdownOpen: false,
      coinType: "BTC",
      coins: [],
      favorite: [],
      isFavEmpty: true
    };
    this.toggle = this.toggle.bind(this);
  }

  paneDidMount = node => {
    if (node) {
      node.addEventListener("scroll", this.handleScroll.bind(this));
    }
  };

  renderChart = type => {
    const baseUrl = "https://widgets.cryptocompare.com/";
    let appName = encodeURIComponent(window.location.hostname);
    if (appName == "") {
      appName = "local";
    }
    let s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    let theUrl = baseUrl + `serve/v3/coin/chart?fsym=${type}&tsyms=KRW`;
    s.src = theUrl + (theUrl.indexOf("?") >= 0 ? "&" : "?") + "app=" + appName;
    this.instance.appendChild(s);
    s.onload = () => {
      this.setState({ loadGraph: false });
    };
  };

  componentDidMount() {
    //즐겨찾기 가져올 부분
    const coin = coinJson.coin;
    let result = coin.map(function(el) {
      let o = Object.assign({}, el);
      o.clicked = false;
      o.loading = false;
      return o;
    });
    this.setState({ favorite: result, loadGraph: true });

    //즐겨찾기 있을 경우
    // this.setState({ isFavEmpty: false });
    // const abbrArray = [];
    // for (let i = 0; i < result.length; i++) {
    //   abbrArray[i] = result[i].abbr;
    // }
    // let typeArray = [];
    // for (let i = 0; i < abbrArray.length; i++) {
    //   typeArray.push({ name: abbrArray[i], price: 0, percent: "" });
    // }
    // this.props.dispatch(PriceAction.getPrice(abbrArray)).then(value => {
    //   for (let i = 0; i < abbrArray.length; i++) {
    //     typeArray[i].price = value[abbrArray[i]].KRW.PRICE;
    //     typeArray[i].percent = value[abbrArray[i]].KRW.CHANGEPCT24HOUR;
    //   }
    //   this.setState({ coins: typeArray });
    //   this.renderChart(this.state.coinType);
    //   this.props.dispatch(NewsAction.getNews());
    // });

    //즐겨찾기 없을 경우
    this.props.dispatch(NewsAction.getNews());
    this.setState({ loadGraph: false, isFavEmpty: true });
  }

  handleScroll = event => {
    var node = event.target;
    const bottom = node.scrollHeight - node.scrollTop === node.clientHeight;
    if (bottom) {
      console.log("BOTTOM REACHED:", bottom);
    }
  };

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  handleChart = async coin => {
    this.setState({ loadGraph: true, isFavEmpty: false });
    if (this.instance === undefined) {
      this.renderChart(coin);
      this.setState({ coinType: coin });
    } else {
      while (this.instance.firstChild) {
        this.instance.removeChild(this.instance.firstChild);
      }
      this.renderChart(coin);
      this.setState({ coinType: coin });
    }
  };

  handleFavorite = async(index, data) => {
    const coin = this.state.favorite.slice();
    coin[index].clicked = true;
    coin[index].loading = true;
    this.handleChart(data);
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

  render() {
    const { loadGraph, coinType, coins, favorite, isFavEmpty } = this.state;
    const { news } = this.props;
    return (
      <div className="homePage">
        <NavBar type="news" />
        <SideBar
          onClick={this.handleChart}
          type={coinType}
          coins={coins}
          favorite={favorite}
          handleFavorite={this.handleFavorite}
        />
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
                <hr />
                <div className="homePage__content__news__search__second__content">
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
              className="homePage__content__news__lists"
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
          <div className="homePage__content__chart">
            {isFavEmpty === true ? (
              <div className="homePage__content__chart__intro">
                <div className="homePage__content__chart__intro__logo">
                  <img
                    width={45}
                    height={45}
                    src={require("../../Assests/Imgs/enhance_logo.png")}
                  />
                  <p className="homePage__content__chart__intro__logo__text">
                    ENHANCE
                  </p>
                </div>
                <div className="homePage__content__chart__intro__welcome">
                  <p>환영합니다.</p>
                  <p>
                    인핸스는 가상화폐와 블록체인 기술에 대한 정보를 실시간으로
                    모아서 한눈에 보기 쉽게 제공해 드리고 있습니다. 인핸스와
                    함께 가상화폐의 역사를 함께 하세요.
                  </p>
                </div>
              </div>
            ) : null}
            {loadGraph === true ? (
              <div
                className="homePage__content__chart__loading"
                ref={el => (this.instance = el)}
              >
                <Dots color="#ffffff" size={30} />
              </div>
            ) : (
              <div
                className="homePage__content__chart__wrapper"
                ref={el => (this.instance = el)}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

HomePage.defaultProps = defaultProps;
HomePage.propTypes = propTypes;

export default connect(mapStateToProps)(HomePage);
