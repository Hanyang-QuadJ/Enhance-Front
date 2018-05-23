// This Component is Skeleton of React Structure for Web Development
// If you want to make other Component, Copy and Refactor this Component.

import React, { Component } from "react";
import { Dots } from "react-activity";

const defaultProps = {};
const propTypes = {};

class Button extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      text,
      onClick,
      width,
      height,
      isLoading,
      marginBottom
    } = this.props;
    return (
      <div
        className="button"
        style={{ width: width, height: height, marginBottom: marginBottom }}
      >
        <div className="button__content" onClick={onClick}>
          {isLoading ? (
            <Dots color="#ffffff" size={20} />
          ) : (
            <div className="button__content__text">{text}</div>
          )}
        </div>
      </div>
    );
  }
}

Button.defaultProps = defaultProps;
Button.propTypes = propTypes;

export default Button;
