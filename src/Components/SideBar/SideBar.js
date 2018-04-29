// This Component is Skeleton of React Structure for Web Development
// If you want to make other Component, Copy and Refactor this Component.

import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as PriceAction from "../../ActionCreators/PriceAction";
import cx from "classnames";

const defaultProps = {};
const propTypes = {};

const mapStateToProps = state => {
  return {
    prices: state.reducer.prices
  };
};

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prices: null
    };
  }

  componentDidMount() {}

  render() {
    const { onClick, type, coins } = this.props;
    return (
      <div className="sideBar">
        <div className="sideBar__content">
          <div className="sideBar__content__items">
            {coins &&
              coins.map((data, index) => {
                return (
                  <div
                    className={cx("sideBar__content__items__item", {
                      "sideBar__content__items__item-active": type === data.name
                    })}
                    key={index}
                    onClick={() => onClick(data.name)}
                  >
                    <div className="sideBar__content__items__item__title">
                      {data.name}
                    </div>
                    <div className="sideBar__content__items__item__price">
                      {data.price}
                    </div>
                    {Number(data.percent) >= 0 ? (
                      <div className="sideBar__content__items__item__percent">
                        <span className="sideBar__content__items__item__percent__icon">
                          <i className="xi-arrow-up" />
                        </span>
                        {data.percent}%
                      </div>
                    ) : (
                      <div className="sideBar__content__items__item__percent-down">
                        <span className="sideBar__content__items__item__percent-down__icon">
                          <i className="xi-arrow-down" />
                        </span>
                        {data.percent}%
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}

SideBar.defaultProps = defaultProps;
SideBar.propTypes = propTypes;

export default withRouter(connect(mapStateToProps)(SideBar));
