// This Component is Skeleton of React Structure for Web Development
// If you want to make other Component, Copy and Refactor this Component.

import React, { Component } from "react";
import moment from "moment";

const defaultProps = {};
const propTypes = {};

class List extends Component {
  constructor(props) {
    super(props);
    moment.locale("ko");
  }

  render() {
    const { title, createdAt, type, link, social, onClick } = this.props;
    return (
      <a href={link && link} target="_blank">
        <div className="list" onClick={onClick}>
          <div className="list__content">
            <div className="list__content__date">
              <p>{moment(createdAt).fromNow()}</p>
            </div>
            <div className="list__content__textArea">
              <div
                className="list__content__textArea__text"
                dangerouslySetInnerHTML={{ __html: title }}
              />
              {social ? (
                <div className="list__content__textArea__text">
                  <i className="xi-thumbs-up" />
                </div>
              ) : null}
            </div>
            <div className="list__content__type">
              <p>{type}</p>
            </div>
          </div>
        </div>
      </a>
    );
  }
}

List.defaultProps = defaultProps;
List.propTypes = propTypes;

export default List;
