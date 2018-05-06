// This Page is Skeleton of React Structure for Web Development
// If you want to make other page, Copy and Refactor this page.

import React, { Component } from "react";
import { connect } from "react-redux";
import { Thumb, SocialInput } from "../../Components";

import moment from "moment";

const defaultProps = {};
const propTypes = {};

const mapStateToProps = state => {
  return {
    news: state.reducer.news,
    me: state.reducer.me,
    isLogin: state.reducer.isLogin
  };
};

class PostPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocusComment: false,
      comment: "",
      forum: []
    };
    moment.locale("ko");
  }
  componentWillMount() {}

  render() {
    const { isFocusComment, forum } = this.state;
    const {
      me,
      isLogin,
      userName,
      userPoint,
      category,
      createdAt,
      title,
      content
    } = this.props;
    return (
      <div className="postPage__content__chart__intro__post">
        <div className="postPage__content__chart__intro__post__header">
          <div className="postPage__content__chart__intro__post__header__userInfo">
            <div className="postPage__content__chart__intro__post__header__userInfo__thumb">
              <Thumb fontSize={35} size={50} />
            </div>
            <div className="postPage__content__chart__intro__post__header__userInfo__name">
              <strong>{userName}</strong>
              <span className="postPage__content__chart__intro__post__header__userInfo__point">
                {userPoint}포인트
              </span>
            </div>
          </div>
          <div className="postPage__content__chart__intro__post__header__detail">
            <p>{category}</p>
            <span className="postPage__content__chart__intro__post__header__userInfo__date">
              {moment(createdAt).fromNow()}
            </span>
          </div>
        </div>
        <div className="postPage__content__chart__intro__post__title">
          <p>{title}</p>
        </div>
        <div className="postPage__content__chart__intro__post__body">
          <p>{content}</p>
        </div>
        <div className="postPage__content__chart__intro__post__footer">
          <span className="postPage__content__chart__intro__post__footer__icon">
            <i className="far fa-thumbs-up" />
          </span>
          <span className="postPage__content__chart__intro__post__footer__icon">
            <i className="xi-eye" />
          </span>
        </div>
      </div>
    );
  }
}

PostPage.defaultProps = defaultProps;
PostPage.propTypes = propTypes;

export default connect(mapStateToProps)(PostPage);
