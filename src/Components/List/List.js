// This Component is Skeleton of React Structure for Web Development
// If you want to make other Component, Copy and Refactor this Component.

import React, { Component } from "react";
import moment from "moment";
import cx from "classnames";

const defaultProps = {};
const propTypes = {};

class List extends Component {
  constructor(props) {
    super(props);
    moment.locale("ko");
  }

  render() {
    const {
      title,
      createdAt,
      type,
      link,
      social,
      onClick,
      active,
      index,
      selectedIndex
    } = this.props;
    return (
      <a href={link && link} target="_blank">
        <div
          className={
            onClick === undefined
              ? "list"
              : cx("list", { "list-active ": index === selectedIndex })
          }
          onClick={onClick}
        >
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
                <div className="list__content__textArea__social">
                  <div className="list__content__textArea__social__item">
                    <span className="list__content__textArea__social__item__count">
                      10
                    </span>
                    <span className="list__content__textArea__social__item__icon">
                      <i className="far fa-thumbs-up" />
                    </span>
                  </div>
                  <div className="list__content__textArea__social__item">
                    <span className="list__content__textArea__social__item__count">
                      10
                    </span>
                    <span className="list__content__textArea__social__item__icon">
                      <i className="xi-eye" />
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
            {typeof type === "string" ? (
              <div className="list__content__type">
                <p>{type}</p>
              </div>
            ) : (
              <div className="list__content__type-array">
                {type.map((data, index) => {
                  return (
                    <div
                      key={index}
                      className="list__content__type-array__item"
                    >
                      {data.abbr}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </a>
    );
  }
}

List.defaultProps = defaultProps;
List.propTypes = propTypes;

export default List;
