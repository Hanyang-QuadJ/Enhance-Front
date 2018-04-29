// This Page is Skeleton of React Structure for Web Development
// If you want to make other page, Copy and Refactor this page.

import React, { Component } from "react";
import { connect } from "react-redux";
import { NavBar, List, SideBar } from "../../Components";
import { Dots } from "react-activity";
import * as NewsAction from "../../ActionCreators/NewsAction";
import * as PriceAction from "../../ActionCreators/PriceAction";
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
      coins: []
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
      this.setState({ loadGraph: true });
    };
  };

  componentDidMount() {
    const params = { type: ["BTC", "ETH", "EOC", "XRP", "BCH", "ADA"] };
    let typeArray = [];
    for (let i = 0; i < params.type.length; i++) {
      typeArray.push({ name: params.type[i], price: 0, percent: "" });
    }
    this.props.dispatch(PriceAction.getPrice(params)).then(value => {
      for (let i = 0; i < params.type.length; i++) {
        typeArray[i].price = value[params.type[i]].KRW.PRICE;
        typeArray[i].percent = value[params.type[i]].KRW.CHANGEPCT24HOUR;
      }
      this.setState({ coins: typeArray });
      this.renderChart(this.state.coinType);
      this.props.dispatch(NewsAction.getNews());
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

  handleCoin = async coin => {
    while (this.instance.firstChild) {
      this.instance.removeChild(this.instance.firstChild);
    }
    await this.setState({ loadGraph: false });
    await this.renderChart(coin);
    await this.setState({ coinType: coin });
  };

  render() {
    const { loadGraph, coinType, coins } = this.state;
    const { news } = this.props;
    return (
      <div className="homePage">
        <NavBar type="news" />
        <SideBar onClick={this.handleCoin} type={coinType} coins={coins} />
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
            {loadGraph === false ? (
              <div
                className="homePage__content__chart__loading"
                ref={el => (this.instance = el)}
              >
                <Dots color="#ffffff" size={30} />
              </div>
            ) : (
              <div
                id="test"
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
