// This Page is Skeleton of React Structure for Web Development
// If you want to make other page, Copy and Refactor this page.

import React, { Component } from "react";
import { connect } from "react-redux";
import { Thumb, SocialInput, Comment } from "../../Components";
import * as SocialAction from "../../ActionCreators/SocialAction";

import moment from "moment";

const defaultProps = {};
const propTypes = {};

const mapStateToProps = state => {
  return {
    news: state.reducer.news,
    me: state.reducer.me,
    isLogin: state.reducer.isLogin,
    token: state.reducer.token
  };
};

class PostPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocusComment: false,
      comment: "",
      newComment: []
    };
    moment.locale("ko");
  }
  componentWillMount() {}

  handleComment = e => {
    this.setState({ comment: e.target.value });
  };

  handlePostComment = e => {
    const { me } = this.props;
    const date = new Date();
    const newComment = this.state.newComment.slice();
    const frontParams = {
      username: me[0].username,
      profile_img: me[0].profile_img,
      point: me[0].point,
      content: this.state.comment,
      date
    };
    const params = {
      token: this.props.token,
      content: this.state.comment,
      forum_id: this.props.match.params.forum_id
    };
    newComment.splice(0, 0, frontParams);
    this.props.dispatch(SocialAction.postForumComment(params)).then(value => {
      this.setState({ newComment, comment: "" });
    });
  };

  onFocusComment = () => {
    this.setState(prevState => ({
      isFocusComment: !prevState.isFocusComment
    }));
  };

  componentDidUpdate(previousProps, previousState) {
    if (
      previousProps.location.state.forum !== this.props.location.state.forum
    ) {
      this.setState({
        newComment: []
      });
    }
  }

  render() {
    const { isFocusComment, newComment } = this.state;
    const { me, isLogin } = this.props;
    const { forum, coins, comment } = this.props.location.state;
    return (
      <div className="forumPage__content__chart">
        <div className="forumPage__content__chart__intro">
          <div className="postPage__content__chart__intro__post">
            <div className="postPage__content__chart__intro__post__header">
              <div className="postPage__content__chart__intro__post__header__userInfo">
                <div className="postPage__content__chart__intro__post__header__userInfo__thumb">
                  <Thumb src={forum.profile_img} fontSize={35} size={50} />
                </div>
                <div className="postPage__content__chart__intro__post__header__userInfo__name">
                  <strong>{forum.username}</strong>
                  <span className="postPage__content__chart__intro__post__header__userInfo__point">
                    {`${forum.point} 포인트`}
                  </span>
                </div>
              </div>
              <div className="postPage__content__chart__intro__post__header__detail">
                <p>{forum.category}</p>
                <span className="postPage__content__chart__intro__post__header__userInfo__date">
                  {moment(forum.created_at).fromNow()}
                </span>
              </div>
            </div>
            <div className="postPage__content__chart__intro__post__title">
              <p>{forum.title}</p>
            </div>
            <div className="postPage__content__chart__intro__post__body">
              <p>{forum.content}</p>
            </div>
            <div className="postPage__content__chart__intro__post__coin">
              {coins.map((data, index) => {
                return (
                  <div
                    key={index}
                    className="postPage__content__chart__intro__post__coin__item"
                  >
                    {data.abbr}
                  </div>
                );
              })}
            </div>
            <div className="postPage__content__chart__intro__post__footer">
              <span className="postPage__content__chart__intro__post__footer__count">
                10
              </span>
              <span className="postPage__content__chart__intro__post__footer__icon">
                <i className="far fa-thumbs-up" />
              </span>
              <span className="postPage__content__chart__intro__post__footer__count">
                {forum.view_cnt}
              </span>
              <span className="postPage__content__chart__intro__post__footer__icon">
                <i className="xi-eye" />
              </span>
            </div>
          </div>
          <SocialInput
            user={me && me[0]}
            isLogin={isLogin}
            value={this.state.comment}
            onChange={this.handleComment}
            placeholder="댓글을 입력하세요"
            onClick={this.handlePostComment}
            postText="등록"
            onFocus={this.onFocusComment}
            isFocus={isFocusComment}
          />
          <div className="postPage__content__chart__intro__comments">
            {newComment.map((data, index) => {
              return (
                <Comment
                  key={index}
                  username={data.username}
                  profileImg={data.profile_img}
                  userPoint={data.point}
                  createdAt={data.created_at}
                  content={data.content}
                />
              );
            })}
            {comment.map((data, index) => {
              return (
                <Comment
                  key={index}
                  username={data.username}
                  profileImg={data.profile_img}
                  userPoint={data.point}
                  createdAt={data.created_at}
                  content={data.content}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

PostPage.defaultProps = defaultProps;
PostPage.propTypes = propTypes;

export default connect(mapStateToProps)(PostPage);
