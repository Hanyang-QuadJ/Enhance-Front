// This Component is Skeleton of React Structure for Web Development
// If you want to make other Component, Copy and Refactor this Component.

import React, { Component } from "react";
import moment from "moment";
import cx from "classnames";
import { Dots } from "react-activity";
import { Medal } from "../";
import NumericLabel from "react-pretty-numbers";
import * as base64 from "../../Assests/Icons/base64";

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
      updatedAt,
      type,
      link,
      social,
      onClick,
      onEditClick,
      onDeleteClick,
      active,
      index,
      isLoading,
      point,
      isNews,
      selectedIndex,
      likeCount,
      disLikeCount,
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
                  <p>
                    {updatedAt !== null && !isNews
                      ? moment(updatedAt).fromNow()
                      : moment(createdAt).fromNow()}
                  </p>
                  <p>{updatedAt !== null && !isNews ? "수정됨" : null}</p>
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
                {(me && me.username === username) || (me && me.flag === 1) ? (
                  <span>
                    <span
                      className="list__content__textArea__edit"
                      onClick={onEditClick}
                    >
                      <i className="xi-pen-o" />
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
                        <img width={9} height={9} src={base64.arrowUpWhite} />
                      </span>
                    </div>
                    <div className="list__content__textArea__social__item">
                      <span className="list__content__textArea__social__item__count">
                        <NumericLabel params={option}>
                          {disLikeCount && disLikeCount}
                        </NumericLabel>
                      </span>
                      <span className="list__content__textArea__social__item__icon">
                        <img width={9} height={9} src={base64.arrowDownWhite} />
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
                {type && type.length > 3
                  ? type.slice(0, 3).map((data, index) => {
                    if (index !== 2 && type) {
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
