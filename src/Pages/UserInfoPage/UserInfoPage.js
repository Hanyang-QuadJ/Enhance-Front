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

const defaultProps = {};
const propTypes = {};

const mapStateToProps = state => {
  return {
    me: state.reducer.me
  };
};

class UserInfoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coins: [],
      favorite: []
    };
  }

  render() {
    const { news, me } = this.props;
    return (
      <div className="userInfoPage__content__chart">
        <div className="userInfoPage__content__chart__intro">
          <div className="userInfoPage__content__chart__intro__logo">
            <img
              width={45}
              height={45}
              src="https://github.com/Hanyang-QuadJ/enhance/blob/master/public/icons/enhance_logo.png?raw=true"
            />
            <p className="userInfoPage__content__chart__intro__logo__text">
              ENHANCE
            </p>
          </div>
          <div className="userInfoPage__content__chart__intro__welcome">
            <Thumb size={60} fontSize={40} />
            <strong className="userInfoPage__content__chart__intro__welcome__text">
              {me && me[0].username}
            </strong>
          </div>
        </div>
      </div>
    );
  }
}

UserInfoPage.defaultProps = defaultProps;
UserInfoPage.propTypes = propTypes;

export default connect(mapStateToProps)(UserInfoPage);
