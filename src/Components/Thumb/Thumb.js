// This Component is Skeleton of React Structure for Web Development
// If you want to make other Component, Copy and Refactor this Component.

import React, { Component } from "react";
import Gold from "../../Assests/Imgs/gold.png";

const defaultProps = {
  goldImage: Gold
};
const propTypes = {};

class Thumb extends Component {
  constructor(props) {
    super(props);
  }
  handleClass = () => {
    const { point } = this.props;
  };

  render() {
    const {
      size,
      src,
      fontSize,
      cursor,
      onClick,
      goldImage,
      point
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
            cursor: cursor && cursor
          }}
        >
          <i className="xi-user-o" />
        </span>
      );
    } else {
      return (
        <span
          onClick={onClick}
          className="thumb"
          style={{ width: size, height: size, cursor: cursor && cursor }}
        >
          <img className="thumb__image" width={size} height={size} src={src} />
          <img
            className="thumb__classImage"
            src={goldImage}
            width={size / 1.5}
            height={size / 1.5}
            style={{
              bottom: "-8px",
              right: "-5px"
            }}
          />
        </span>
      );
    }
  }
}

Thumb.defaultProps = defaultProps;
Thumb.propTypes = propTypes;

export default Thumb;
