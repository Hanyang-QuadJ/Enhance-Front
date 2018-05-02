// This Page is Skeleton of React Structure for Web Development
// If you want to make other page, Copy and Refactor this page.

import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Switch, Link } from "react-router-dom";
import { NavBar, List, SideBar, Thumb } from "../../Components";
import { Dots } from "react-activity";
import * as NewsAction from "../../ActionCreators/NewsAction";
import * as PriceAction from "../../ActionCreators/PriceAction";
import coinJson from "../../Json/coin";
import { _DefaultPage, AuthPage, MyPage } from "../";
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
    token: state.reducer.token,
    isLogin: state.reducer.isLogin
  };
};

const sourceFilter = [{ id: 0, name: "네이버" }, { id: 1, name: "다음" }];

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navStatus: "news",
      loadGraph: false,
      dropdownOpen: false,
      coinType: "BTC",
      coinId: 1,
      news: [],
      favorite: [],
      isFavEmpty: true,
      newsCount: 30,
      sourceId: 0,
      sourceName: "네이버",
      footerLoading: false,
      newsLoading: false
    };
    this.toggle = this.toggle.bind(this);
  }

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
    const { newsCount, coinId, sourceId } = this.state;
    const newsParams = {
      coinId,
      sourceId,
      newsCount
    };
    // 뉴스
    this.setState({ newsLoading: true, loadGraph: true });
    this.props.dispatch(NewsAction.getNews(newsParams)).then(news => {
      this.setState({
        newsCount: news.nextIndex,
        news: news.result,
        newsLoading: false
      });
      // 모든 코인
      this.props.dispatch(PriceAction.getCoins()).then(coins => {
        //즐겨찾기
        this.props
          .dispatch(PriceAction.getFavs(this.props.token))
          .then(favs => {
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
              this.setState({
                favorite: result,
                loadGraph: false,
                isFavEmpty: true
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
              let final = result.map(function(el) {
                let o = Object.assign({}, el);
                o.price = 0;
                o.percent = "";
                return o;
              });

              this.props
                .dispatch(PriceAction.getPrice(abbrArray))
                .then(value => {
                  for (let i = 0; i < final.length; i++) {
                    for (let j = 0; j < abbrArray.length; j++) {
                      if (final[i].abbr === abbrArray[j]) {
                        final[i].price = value[abbrArray[j]].KRW.PRICE;
                        final[i].percent =
                          value[abbrArray[j]].KRW.CHANGEPCT24HOUR;
                      }
                    }
                  }
                  this.setState({ favorite: final, coinType: abbrArray[0] });
                  this.renderChart(abbrArray[0]);
                });
            }
          });
      });
    });
  }

  handleScroll = e => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    const { newsCount, coinId, sourceId } = this.state;
    const newsParams = {
      coinId,
      sourceId,
      newsCount
    };
    if (bottom) {
      this.setState({ footerLoading: true });
      this.props.dispatch(NewsAction.getNews(newsParams)).then(news => {
        this.setState(prevState => ({
          news: [...prevState.news, ...news.result],
          newsCount: news.nextIndex,
          footerLoading: false
        }));
      });
    }
  };

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  handleSource = (id, name) => {
    const { sourceId, coinId } = this.state;
    const newsParams = {
      coinId,
      sourceId: id,
      newsCount: 30
    };
    this.setState({ sourceName: name, sourceId: id, newsLoading: true });
    this.props.dispatch(NewsAction.getNews(newsParams)).then(news => {
      this.setState({ news: news.result, newsLoading: false });
    });
  };

  handleChart = async(coin, id) => {
    const { sourceId } = this.state;
    const newsParams = {
      coinId: id,
      sourceId,
      newsCount: 30
    };
    this.setState({
      loadGraph: true,
      isFavEmpty: false,
      newsLoading: true,
      coinType: coin
    });

    if (this.instance === undefined) {
      this.renderChart(coin);
      this.props.dispatch(NewsAction.getNews(newsParams)).then(value => {
        this.setState({ news: value.result, newsLoading: false, coinId: id });
      });
    } else {
      while (this.instance.firstChild) {
        this.instance.removeChild(this.instance.firstChild);
      }
      await this.renderChart(coin);
      this.props.dispatch(NewsAction.getNews(newsParams)).then(value => {
        this.setState({ news: value.result, newsLoading: false, coinId: id });
      });
    }
  };

  handleFavorite = async(index, id, data) => {
    const coin = this.state.favorite.slice();
    const { me, token } = this.props;
    const params = {
      token: token,
      coin_id: coin[index].id
    };
    //삭제
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
        this.props.dispatch(PriceAction.removeFav(params));
      } else {
        this.setState({ favorite: coin, coinType: leftOver[0] });
        this.handleChart(leftOver[0], id);
        this.props.dispatch(PriceAction.removeFav(params));
      }
    }
    //추가
    else {
      coin[index].clicked = true;
      coin[index].loading = true;
      this.handleChart(data, id);
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
      this.props.dispatch(PriceAction.addFav(params)).then(x => {
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
    const {
      loadGraph,
      coinType,
      favorite,
      isFavEmpty,
      news,
      footerLoading,
      newsLoading,
      sourceName,
      navStatus
    } = this.state;
    const { me, isLogin } = this.props;
    return (
      <div className="homePage">
        <NavBar type={navStatus} />
        <SideBar
          onClick={this.handleChart}
          type={coinType}
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
                    <DropdownToggle caret>{sourceName}</DropdownToggle>

                    <DropdownMenu>
                      {sourceFilter
                        .filter(a => {
                          return a.name !== sourceName;
                        })
                        .map((data, index) => {
                          return (
                            <DropdownItem
                              key={index}
                              onClick={() =>
                                this.handleSource(data.id, data.name)
                              }
                            >
                              {data.name}
                            </DropdownItem>
                          );
                        })}
                    </DropdownMenu>
                  </ButtonDropdown>
                  <div className="homePage__content__news__search__second__content__function">
                    <Thumb size={30} fontSize={20} />
                  </div>
                </div>
              </div>
            </div>
            {newsLoading ? (
              <div className="homePage__content__news__lists-loading">
                <Dots color="#ffffff" size={30} />
              </div>
            ) : (
              <div
                onScroll={this.handleScroll}
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
                {footerLoading === true ? (
                  <div className="homePage__content__news__lists__footer">
                    <Dots color="#ffffff" size={20} />
                  </div>
                ) : null}
              </div>
            )}
          </div>
          <Route path="/news/@:user_id" component={MyPage} />
          <Route
            exact
            path="/news"
            children={() => {
              return (
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
                          인핸스는 가상화폐와 블록체인 기술에 대한 정보를
                          실시간으로 모아서 한눈에 보기 쉽게 제공해 드리고
                          있습니다. 인핸스와 함께 가상화폐의 역사를 함께 하세요.
                        </p>
                      </div>
                      <div className="homePage__content__chart__intro__desc">
                        <strong>인핸스 뉴스</strong>
                        <p>
                          로그인 후 + 버튼을 누르거나 좌측 상단 돋보기 아이콘을
                          눌러 원하는 가상화폐 종목을 검색하실 수 있습니다.
                        </p>
                        <br />
                        <p>
                          원하는 가상화폐를 클릭하여 팔로우 하시면 우측 즐겨찾기
                          목록에 저장되어 해당 가상 화폐의 정보를 계속 보실 수
                          있습니다.
                        </p>
                        <br />
                        <p>
                          우측 즐겨찾기 목록에 위치한 가상화폐 종목 박스를
                          클리하면 좌측 파티션에 해당 가상화폐에 관련된 기사와
                          정보들이 실시간으로 노출됩니다.
                        </p>
                      </div>
                    </div>
                  ) : null}
                  {loadGraph === true && isLogin === true ? (
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
              );
            }}
          />
        </div>
      </div>
    );
  }
}

HomePage.defaultProps = defaultProps;
HomePage.propTypes = propTypes;

export default connect(mapStateToProps)(HomePage);
