// This Component is Skeleton of React Structure for Web Development
// If you want to make other Component, Copy and Refactor this Component.

import React, { Component } from "react";

const defaultProps = {};
const propTypes = {};

class Thumb extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { size, src, fontSize, cursor, onClick } = this.props;
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
        </span>
      );
    }
  }
}

Thumb.defaultProps = defaultProps;
Thumb.propTypes = propTypes;

export default Thumb;
