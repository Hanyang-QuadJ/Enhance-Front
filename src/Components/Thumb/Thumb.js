// This Component is Skeleton of React Structure for Web Development
// If you want to make other Component, Copy and Refactor this Component.

import React, { Component } from "react";
import Vip from "../../Assests/Imgs/vip.png";
import Gold from "../../Assests/Imgs/gold.png";
import Bronze from "../../Assests/Imgs/bronze.png";
import Silver from "../../Assests/Imgs/silver.png";
import { Sentry } from "react-activity";

const defaultProps = {};
const propTypes = {};

class Thumb extends Component {
  constructor(props) {
    super(props);
  }

  handleClass = point => {
    const { size } = this.props;
    if (point < 50) {
      return null;
    } else if (point >= 50 && point < 120) {
      return (
        <img
          className="thumb__classImage"
          src={Bronze}
          width={size > 50 ? size / 2.5 : size / 2}
          height={size > 50 ? size / 2.5 : size / 2}
          style={{
            bottom: "-8px",
            right: "-5px"
          }}
        />
      );
    } else if (point >= 120 && point < 200) {
      return (
        <img
          className="thumb__classImage"
          src={Silver}
          width={size > 50 ? size / 2.5 : size / 2}
          height={size > 50 ? size / 2.5 : size / 2}
          style={{
            bottom: "-8px",
            right: "-5px"
          }}
        />
      );
    } else if (point >= 200 && point < 400) {
      return (
        <img
          className="thumb__classImage"
          src={Gold}
          width={size > 50 ? size / 2.5 : size / 2}
          height={size > 50 ? size / 2.5 : size / 2}
          style={{
            bottom: "-8px",
            right: "-5px"
          }}
        />
      );
    } else if (point >= 400) {
      return (
        <img
          className="thumb__classImage"
          src={Vip}
          width={size > 50 ? size / 2.5 : size / 2}
          height={size > 50 ? size / 2.5 : size / 2}
          style={{
            bottom: "-8px",
            right: "-5px"
          }}
        />
      );
    } else {
      return (
        <img
          className="thumb__classImage"
          src={Vip}
          width={size > 50 ? size / 2.5 : size / 2}
          height={size > 50 ? size / 2.5 : size / 2}
          style={{
            bottom: "-8px",
            right: "-5px"
          }}
        />
      );
    }
  };

  handleDefaultClass = point => {
    const { size } = this.props;
    if (point < 50) {
      return null;
    } else if (point >= 50 && point < 120) {
      return (
        <img
          className="thumb__defaultImage"
          src={Bronze}
          width={size > 50 ? size / 2.5 : size / 2}
          height={size > 50 ? size / 2.5 : size / 2}
          style={{
            bottom: "-8px",
            right: "-5px"
          }}
        />
      );
    } else if (point >= 120 && point < 200) {
      return (
        <img
          className="thumb__defaultImage"
          src={Silver}
          width={size > 50 ? size / 2.5 : size / 2}
          height={size > 50 ? size / 2.5 : size / 2}
          style={{
            bottom: "-8px",
            right: "-5px"
          }}
        />
      );
    } else if (point >= 200 && point < 400) {
      return (
        <img
          className="thumb__defaultImage"
          src={Gold}
          width={size > 50 ? size / 2.5 : size / 2}
          height={size > 50 ? size / 2.5 : size / 2}
          style={{}}
        />
      );
    } else if (point >= 400) {
      return (
        <img
          className="thumb__defaultImage"
          src={Vip}
          width={size > 50 ? size / 2.5 : size / 2}
          height={size > 50 ? size / 2.5 : size / 2}
          style={{
            bottom: "-8px",
            right: "-5px"
          }}
        />
      );
    }
  };

  render() {
    const {
      size,
      src,
      fontSize,
      cursor,
      onClick,
      point,
      isLoading,
      border
    } = this.props;
    if (src === null || src === undefined || src === null) {
      return (
        <span
          className="thumb__default"
          onClick={onClick}
          style={{
            width: size,
            height: size,
            fontSize: fontSize && fontSize,
            cursor: cursor && cursor,
            border: border
          }}
        >
          <i className="xi-user-o" />
          {this.handleDefaultClass(point)}
        </span>
      );
    } else {
      return (
        <span
          onClick={onClick}
          className="thumb"
          style={{ width: size, height: size, cursor: cursor && cursor }}
        >
          {isLoading ? (
            <Sentry size={15} color="#ffffff" />
          ) : (
            <div>
              <img
                className="thumb__image"
                width={size}
                height={size}
                src={src}
                style={{ border: border }}
              />
              {point !== null || point !== undefined
                ? this.handleClass(point)
                : null}
            </div>
          )}
        </span>
      );
    }
  }
}

Thumb.defaultProps = defaultProps;
Thumb.propTypes = propTypes;

export default Thumb;
