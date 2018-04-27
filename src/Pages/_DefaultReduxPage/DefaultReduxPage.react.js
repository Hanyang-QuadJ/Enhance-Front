// This Page is Skeleton of React Structure for Web Development
// If you want to make other page, Copy and Refactor this page.

import React, { Component } from "react";
import { connect } from "react-redux";

import * as DefaultActionCreator from "../../ActionCreators/_DefaultActionCreator";

const defaultProps = {};
const propTypes = {};

const mapStateToProps = state => {
  return {
    actionResult: state.reducer.actionResult
  };
};

class DefaultPage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(DefaultActionCreator.action());
  }

  render() {
    return <div>This is Default Redux Page</div>;
  }
}

DefaultPage.defaultProps = defaultProps;
DefaultPage.propTypes = propTypes;

export default connect(mapStateToProps)(DefaultPage);
