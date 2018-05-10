// This Component is Skeleton of React Structure for Web Development
// If you want to make other Component, Copy and Refactor this Component.

import React, { Component } from "react";
import Vip from "../../Assests/Imgs/vip.png";
import Gold from "../../Assests/Imgs/gold.png";
import Bronze from "../../Assests/Imgs/bronze.png";
import Silver from "../../Assests/Imgs/silver.png";

const defaultProps = {};
const propTypes = {};

class Medal extends Component {
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
          className="medal__classImage"
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
          className="medal__classImage"
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
          className="medal__classImage"
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
          className="medal__classImage"
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
    const { point, size } = this.props;
    return <span>{this.handleClass(point)}</span>;
  }
}

Medal.defaultProps = defaultProps;
Medal.propTypes = propTypes;

export default Medal;
