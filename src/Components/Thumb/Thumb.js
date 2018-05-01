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
    const { size, src, fontSize } = this.props;
    if (src === null || src === undefined || src === null) {
      return (
        <span
          className="thumb__default"
          style={{ width: size, height: size, fontSize: fontSize && fontSize }}
        >
          <i className="xi-user-o" />
        </span>
      );
    } else {
      return (
        <span className="thumb" style={{ width: size, height: size }}>
          <img className="thumb__image" width={size} height={size} src={src} />
        </span>
      );
    }
  }
}

Thumb.defaultProps = defaultProps;
Thumb.propTypes = propTypes;

export default Thumb;
