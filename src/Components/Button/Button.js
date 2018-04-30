// This Component is Skeleton of React Structure for Web Development
// If you want to make other Component, Copy and Refactor this Component.

import React, { Component } from "react";

const defaultProps = {};
const propTypes = {};

class DefaultComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { text, onClick } = this.props;
    return (
      <div className="button">
        <div className="button__content" onClick={onClick}>
          <div className="button__content__text">{text}</div>
        </div>
      </div>
    );
  }
}

DefaultComponent.defaultProps = defaultProps;
DefaultComponent.propTypes = propTypes;

export default DefaultComponent;
