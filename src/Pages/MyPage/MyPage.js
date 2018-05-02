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
  Thumb
} from "../../Components";
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
    me: state.reducer.me
  };
};

class MyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coins: [],
      favorite: []
    };
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

  render() {
    const { news, me } = this.props;
    return (
      <div className="myPage">
        <div className="myPage__content">
          <div className="myPage__content__chart">
            <div className="myPage__content__chart__intro">
              <div className="myPage__content__chart__intro__logo">
                <img
                  width={45}
                  height={45}
                  src={require("../../Assests/Imgs/enhance_logo.png")}
                />
                <p className="myPage__content__chart__intro__logo__text">
                  ENHANCE
                </p>
              </div>
              <div className="myPage__content__chart__intro__welcome">
                <Thumb size={60} fontSize={40} />
                <strong className="myPage__content__chart__intro__welcome__text">
                  {me && me[0].username}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MyPage.defaultProps = defaultProps;
MyPage.propTypes = propTypes;

export default connect(mapStateToProps)(MyPage);
