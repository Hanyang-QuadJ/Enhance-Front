// This Component is Skeleton of React Structure for Web Development
// If you want to make other Component, Copy and Refactor this Component.

import React, { Component } from "react";
import moment from "moment";
import cx from "classnames";
import { Dots } from "react-activity";
import { Medal } from "../";
import NumericLabel from "react-pretty-numbers";

let option = {
  title: true,
  shortFormat: true,
  shortFormatMinValue: 10000,
  shortFormatPrecision: 1
};

const defaultProps = {};
const propTypes = {};

class List extends Component {
  constructor(props) {
    super(props);
    moment.locale("ko");
  }

  render() {
    const {
      me,
      title,
      username,
      createdAt,
      type,
      link,
      social,
      onClick,
      onEditClick,
      active,
      index,
      isLoading,
      point,
      selectedIndex,
      likeCount,
      view
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
              {isLoading ? (
                <Dots color="#ffffff" size={15} />
              ) : (
                <div>
                  <p>{moment(createdAt).fromNow()}</p>
                </div>
              )}
            </div>
            <div className="list__content__textArea">
              <div className="list__content__textArea__content">
                <div
                  className="list__content__textArea__text"
                  dangerouslySetInnerHTML={{ __html: title }}
                />
                <Medal point={point} size={30} />
                <span className="list__content__textArea__username">
                  {username}
                </span>
                {me && me.username === username ? (
                  <span>
                    <span
                      className="list__content__textArea__edit"
                      onClick={onEditClick}
                    >
                      <i className="xi-pen-o" />
                    </span>
                    <span
                      className="list__content__textArea__edit"
                      onClick={onEditClick}
                    >
                      <i className="xi-trash-o" />
                    </span>
                  </span>
                ) : null}
              </div>

              {social ? (
                <div className="list__content__textArea__social">
                  <div className="list__content__textArea__social__items">
                    <div className="list__content__textArea__social__item">
                      <span className="list__content__textArea__social__item__count">
                        <NumericLabel params={option}>
                          {likeCount && likeCount}
                        </NumericLabel>
                      </span>
                      <span className="list__content__textArea__social__item__icon">
                        <i className="far fa-thumbs-up" />
                      </span>
                    </div>
                    <div className="list__content__textArea__social__item">
                      <span className="list__content__textArea__social__item__count">
                        {view}
                      </span>
                      <span className="list__content__textArea__social__item__icon">
                        <i className="xi-eye" />
                      </span>
                    </div>
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
                {type.length > 3
                  ? type.slice(0, 3).map((data, index) => {
                    if (index !== 2) {
                      return (
                        <div
                          key={index}
                          className="list__content__type-array__item"
                        >
                          {data.abbr}
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={index}
                          className="list__content__type-array__item"
                        >
                          {data.abbr} ...
                        </div>
                      );
                    }
                  })
                  : type.map((data, index) => {
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
