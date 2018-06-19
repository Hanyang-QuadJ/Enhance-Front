// This Component is Skeleton of React Structure for Web Development
// If you want to make other Component, Copy and Refactor this Component.

import React, { Component } from "react";
import { Link } from "react-router-dom";
import cx from "classnames";

const defaultProps = {};
const propTypes = {};

class Footer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { type } = this.props;
    return (
      <div className="footer">
        <div className="footer__items">
          <div className="footer__items__item">
            <span className="footer__items__item__icon">
              <i className="xi-facebook" />
            </span>
          </div>
          <div className="footer__items__item">
            <span className="footer__items__item__icon">
              <i className="xi-twitter" />
            </span>
          </div>
          <div className="footer__items__item">
            <span className="footer__items__item__icon">
              <i className="xi-kakaotalk" />
            </span>
          </div>
          <Link to="/about">
            <div
              className={cx("footer__items__item", {
                "footer__items__item-active": type === "about"
              })}
            >
              About
            </div>
          </Link>
          <div className="footer__items__item">Terms</div>
          <div className="footer__items__item">2018 © CoinHub</div>
        </div>
      </div>
    );
  }
  s;
}

Footer.defaultProps = defaultProps;
Footer.propTypes = propTypes;

export default Footer;
