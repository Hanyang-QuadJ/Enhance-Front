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
            <a
              href="https://www.facebook.com/CoinHub-229985534263086"
              className="footer__items__item__icon"
              target="blank"
            >
              <i className="xi-facebook" />
            </a>
          </div>
          <div className="footer__items__item">
            <a
              href="https://twitter.com/Coinhub_Korea"
              className="footer__items__item__icon-twitter"
              target="blank"
            >
              <i className="xi-twitter" />
            </a>
          </div>
          <div className="footer__items__item">
            <a
              href="https://open.kakao.com/o/gIpdVlP"
              className="footer__items__item__icon-kakao"
              target="blank"
            >
              <i className="xi-kakaotalk" />
            </a>
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
          <Link to="/terms">
            <div
              className={cx("footer__items__item", {
                "footer__items__item-active": type === "terms"
              })}
            >
              Terms
            </div>
          </Link>

          <Link to="/about">
            <div className="footer__items__item">2018 © CoinHub.kr</div>
          </Link>
        </div>
      </div>
    );
  }
  s;
}

Footer.defaultProps = defaultProps;
Footer.propTypes = propTypes;

export default Footer;
