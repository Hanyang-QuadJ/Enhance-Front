// This Component is Skeleton of React Structure for Web Development
// If you want to make other Component, Copy and Refactor this Component.

import React, { Component } from "react";
import { Thumb } from "../";
import moment from "moment";
import Linkify from "react-linkify";

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
      onClick
    } = this.props;
    return (
      <div className="comment">
        <div className="comment__content">
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
              {/* <div className="comment__content__userArea__userInfo__point">
                {`${userPoint} 포인트`}
              </div> */}
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
          </div>
        </div>
      </div>
    );
  }
}

Comment.defaultProps = defaultProps;
Comment.propTypes = propTypes;

export default Comment;
