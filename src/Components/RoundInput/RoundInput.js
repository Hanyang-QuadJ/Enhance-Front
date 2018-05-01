// This Component is Skeleton of React Structure for Web Development
// If you want to make other Component, Copy and Refactor this Component.

import React, { Component } from "react";
import TextField from "material-ui/TextField";

const defaultProps = {};
const propTypes = {};

const styles = {
  input: {
    width: 290
  },
  inputText: {
    fontSize: 18,
    color: "white",
    paddingBottom: 20,
    paddingLeft: 10
  },
  hint: {
    marginBottom: 10,
    marginLeft: 10,
    color: "white"
  }
};

class RoundInput extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { type, onChange, placeholder, isMulti, rows, rowsMax } = this.props;
    return (
      <div className="roundInput">
        <TextField
          hintText={placeholder}
          onChange={onChange}
          type={type}
          style={styles.input}
          inputStyle={styles.inputText}
          hintStyle={styles.hint}
          underlineStyle={styles.underline}
          multiLine={isMulti}
          rows={rows}
          rowsMax={rowsMax}
        />
      </div>
    );
  }
}

RoundInput.defaultProps = defaultProps;
RoundInput.propTypes = propTypes;

export default RoundInput;
