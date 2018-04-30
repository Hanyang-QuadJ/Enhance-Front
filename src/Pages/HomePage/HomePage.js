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
    news: state.reducer.news,
    me: state.reducer.me,
    token: state.reducer.token
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

    this.props.dispatch(PriceAction.getCoins()).then(coins => {
      this.props.dispatch(PriceAction.getFavs(this.props.token)).then(favs => {
        //즐겨찾기 없을 경우
        if (
          favs.length === 0 ||
          favs === [] ||
          favs === null ||
          favs === undefined
        ) {
          let result = coins.map(function(el) {
            let o = Object.assign({}, el);
            o.clicked = false;
            o.loading = false;
            return o;
          });
          this.setState({ favorite: result, loadGraph: true });
          this.props.dispatch(NewsAction.getNews()).then(news => {
            this.setState({ loadGraph: false, isFavEmpty: true });
          });
        } else {
          //즐겨찾기 있을 경우
          let result = coins.map(function(el) {
            let o = Object.assign({}, el);
            o.clicked = false;
            o.loading = false;
            return o;
          });
          for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < favs.length; j++) {
              if (result[i].abbr === favs[j].abbr) {
                result[i].clicked = true;
              }
            }
          }
          this.setState({
            favorite: result,
            loadGraph: true,
            isFavEmpty: false
          });
          const abbrArray = [];
          for (let i = 0; i < result.length; i++) {
            if (result[i].clicked === true) {
              abbrArray.push(result[i].abbr);
            }
          }
          console.log(abbrArray);

          let final = result.map(function(el) {
            let o = Object.assign({}, el);
            o.price = 0;
            o.percent = "";
            return o;
          });

          this.props.dispatch(PriceAction.getPrice(abbrArray)).then(value => {
            for (let i = 0; i < final.length; i++) {
              for (let j = 0; j < abbrArray.length; j++) {
                if (final[i].abbr === abbrArray[j]) {
                  final[i].price = value[abbrArray[j]].KRW.PRICE;
                  final[i].percent = value[abbrArray[j]].KRW.CHANGEPCT24HOUR;
                }
              }
            }
            this.setState({ favorite: final, coinType: abbrArray[0] });
            this.renderChart(abbrArray[0]);
            this.props.dispatch(NewsAction.getNews());
          });
        }
      });
    });
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
    const { me, token } = this.props;
    const params = {
      token: token,
      user_id: me[0].id,
      coin_id: coin[index].id
    };
    if (coin[index].clicked === true) {
      coin[index].clicked = false;
      let leftOver = [];
      for (let i = 0; i < coin.length; i++) {
        if (coin[i].clicked === true) {
          leftOver.push(coin[i].abbr);
        }
      }
      if (leftOver.length === 0) {
        this.setState({ favorite: coin, isFavEmpty: true });
        while (this.instance.firstChild) {
          this.instance.removeChild(this.instance.firstChild);
        }
      } else {
        this.setState({ favorite: coin, coinType: leftOver[0] });
        this.handleChart(leftOver[0]);
      }
    } else {
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
      this.props.dispatch(PriceAction.addFav(params)).then(value => {
        this.props.dispatch(PriceAction.getPrice(abbrArray)).then(value => {
          for (let i = 0; i < abbrArray.length; i++) {
            result[i].price = value[abbrArray[i]].KRW.PRICE;
            result[i].percent = value[abbrArray[i]].KRW.CHANGEPCT24HOUR;
          }
          result[index].loading = false;
          this.setState(state => ({ favorite: result }));
        });
      });
    }
  };

  render() {
    const { loadGraph, coinType, coins, favorite, isFavEmpty } = this.state;
    const { news, me } = this.props;
    return (
      <div className="homePage">
        <NavBar type="news" />
        <SideBar
          onClick={this.handleChart}
          type={coinType}
          coins={coins}
          favorite={favorite}
          handleFavorite={this.handleFavorite}
          loadGraph={loadGraph}
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
                  <p>
                    <strong>환영합니다. </strong>
                    {me && me[0].username + " 님"}
                  </p>
                  <p>
                    인핸스는 가상화폐와 블록체인 기술에 대한 정보를 실시간으로
                    모아서 한눈에 보기 쉽게 제공해 드리고 있습니다. 인핸스와
                    함께 가상화폐의 역사를 함께 하세요.
                  </p>
                </div>
                <div className="homePage__content__chart__intro__desc">
                  <strong>인핸스 뉴스</strong>
                  <p>
                    로그인 후 + 버튼을 누르거나 좌측 상단 돋보기 아이콘을 눌러
                    원하는 가상화폐 종목을 검색하실 수 있습니다.
                  </p>
                  <br />
                  <p>
                    해당 가상화폐 정보 창이 현재 페이지에 노출되고 별모양
                    아이콘을 눌러 팔로우를 하시면 우측 즐겨찾기 목록에
                    저장됩니다. ​
                  </p>
                  <br />
                  <p>
                    우측 즐겨찾기 목록에 위치한 가상화폐 종목 박스를 클리하면
                    좌측 파티션에 해당 가상화폐에 관련된 기사와 정보들이
                    실시간으로 노출됩니다.
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
