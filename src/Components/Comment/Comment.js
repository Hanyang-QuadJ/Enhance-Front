// This Component is Skeleton of React Structure for Web Development
// If you want to make other Component, Copy and Refactor this Component.

import React, { Component } from "react";
import { Thumb } from "../";
import moment from "moment";
import Linkify from "react-linkify";
import cx from "classnames";

const defaultProps = {};
const propTypes = {};

class Comment extends Component {
  constructor(props) {
    super(props);
    moment.locale("ko");
  }

  render() {
    const {
      username,
      userPoint,
      content,
      createdAt,
      profileImg,
      onClick,
      checkName,
      onDelete,
      flag
    } = this.props;
    return (
      <div className="comment">
        <div
          className={cx("comment__content", {
            "comment__content-mine": username === checkName && checkName
          })}
        >
          <div className="comment__content__userArea">
            <Thumb
              src={profileImg}
              size={35}
              fontSize={25}
              onClick={onClick}
              point={userPoint}
            />
            <div className="comment__content__userArea__userInfo">
              <div className="comment__content__userArea__userInfo__name">
                {username}
              </div>
            </div>
          </div>
          <div className="comment__content__content">
            <Linkify
              properties={{
                target: "_blank",
                style: { color: "#56b1bf", fontWeight: "400" }
              }}
            >
              {content}
            </Linkify>
          </div>
          <div className="comment__content__date">
            {moment(createdAt).fromNow()}
            {username === checkName || flag === 1 ? (
              <span className="comment__content__delete" onClick={onDelete}>
                <i className="xi-close" />
              </span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

Comment.defaultProps = defaultProps;
Comment.propTypes = propTypes;

export default Comment;
