// This Page is Skeleton of React Structure for Web Development
// If you want to make other page, Copy and Refactor this page.

import React, { Component } from "react";
import { connect } from "react-redux";
import { Thumb, SocialInput, Comment } from "../../Components";
import * as SocialAction from "../../ActionCreators/SocialAction";
import { withRouter } from "react-router-dom";
import { Modal, ModalBody } from "reactstrap";
import { Dots } from "react-activity";
import NumericLabel from "react-pretty-numbers";
import ImageGallery from "react-image-gallery";
import Linkify from "react-linkify";
import moment from "moment";

const defaultProps = {};
const propTypes = {};
const images = [
  {
    original:
      "https://postfiles.pstatic.net/20120315_193/leonjuhee_13317925245553SFz3_JPEG/%BE%EE%BA%A5%C1%AE%BD%BA.jpg?type=w2",
    thumbnail: "http://lorempixel.com/250/150/nature/1/"
  },
  {
    original:
      "http://kinimage.naver.net/20180303_154/1520003835008lum9g_PNG/%A4%B7%A4%B2%A4%B8%A4%B5.png",
    thumbnail: "http://lorempixel.com/250/150/nature/2/"
  },
  {
    original:
      "http://blogfiles5.naver.net/MjAxODA1MjNfMTIg/MDAxNTI3MDA2ODY4NTg3.QTYqJjYWl1IwDngZZh87x2tOEa5zE1_N_skakE_kqCcg.-aftVtOzj1Wf2EUUu3GVxeNqlaHx_90FLgQbzMJahLMg.JPEG.studio_queenmab/b0d779951bc97bf8b603ef99438ad16b_PqgHoMrpWRl.jpg",
    thumbnail: "http://lorempixel.com/250/150/nature/3/"
  }
];
let option = {
  title: true,
  shortFormat: true,
  shortFormatMinValue: 10000,
  shortFormatPrecision: 1
};

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
      newComment: [],
      user: [],
      showModal: false,
      username: "",
      userPoint: 0,
      userImg: "",
      userLoading: false,
      userCoins: [],
      forumLength: 0,
      commentLength: 0,
      isLiked: false,
      newLike: 0,
      userId: 0
    };
    moment.locale("ko");
  }

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

  handleUser = user_id => {
    this.setState({ userLoading: true });
    const { token } = this.props;
    const params = {
      token,
      user_id
    };
    this.props.dispatch(SocialAction.getUserById(params)).then(user => {
      this.props
        .dispatch(SocialAction.getCommentsByUser(params))
        .then(comments => {
          this.props.dispatch(SocialAction.getFavByUser(params)).then(favs => {
            this.props
              .dispatch(SocialAction.getForumByUser(params))
              .then(async forums => {
                await this.setState({
                  userId: user_id,
                  username: user.username,
                  userImg: user.profile_img,
                  userCoins: favs,
                  userPoint: user.point,
                  forumLength: forums.length,
                  commentLength: comments.length,
                  userLoading: false
                });
                await this.toggleModal();
              });
          });
        });
    });
  };

  handleLike = () => {
    const { forum, liked } = this.props.location.state;
    const params = {
      token: this.props.token,
      forum_id: Number(this.props.match.params.forum_id)
    };
    if (liked) {
      this.props.dispatch(SocialAction.postForumLike(params)).then(value => {
        this.setState(prevState => ({
          isLiked: false,
          newLike: forum.like_cnt
        }));
      });
    } else {
      this.props.dispatch(SocialAction.postForumLike(params)).then(value => {
        this.setState(prevState => ({
          isLiked: true,
          newLike: forum.like_cnt + 1
        }));
      });
    }
  };

  handleDisLike = () => {
    const { forum, liked } = this.props.location.state;
    const params = {
      token: this.props.token,
      forum_id: Number(this.props.match.params.forum_id)
    };
    if (liked) {
      this.props.dispatch(SocialAction.postForumDisLike(params)).then(value => {
        this.setState(prevState => ({
          isLiked: true,
          newLike: forum.like_cnt - 1
        }));
      });
    } else {
      this.props.dispatch(SocialAction.postForumDisLike(params)).then(value => {
        this.setState(prevState => ({
          isLiked: false,
          newLike: forum.like_cnt - 1
        }));
      });
    }
  };

  handleUserDetail = () => {
    const { userId, username, userPoint, userImg, userCoins } = this.state;
    this.props.history.push({
      pathname: "/@" + userId,
      state: { userId, username, userPoint, userImg, userCoins }
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
        newComment: [],
        newLike: 0,
        isLiked: false
      });
    }
  }

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  };

  render() {
    if (this.props.location.state === undefined) {
      window.location.href = "/enhance/forum";
    } else {
      const {
        isLiked,
        newLike,
        isFocusComment,
        newComment,
        username,
        userImg,
        userCoins,
        userPoint,
        forumLength,
        commentLength,
        userLoading
      } = this.state;
      const { me, isLogin, onClick } = this.props;
      const { forum, coins, comment, name, liked } = this.props.location.state;

      return (
        <div className="postPage__content__chart">
          <Modal
            isOpen={this.state.showModal}
            toggle={this.toggleModal}
            size="lg"
            centered
            modalTransition={{ timeout: 20 }}
            backdropTransition={{ timeout: 10 }}
            // backdrop={false}
          >
            <ModalBody>
              <div className="postPage__modal">
                <div className="postPage__modal__content">
                  <Thumb
                    src={userImg}
                    fontSize={75}
                    size={90}
                    point={userPoint}
                    onClick={this.handleUserDetail}
                  />
                  <p className="postPage__modal__content__username">
                    {username}
                  </p>
                  <div className="postPage__modal__content__area">
                    <p className="postPage__modal__content__area__number-border">
                      {userPoint}
                      <span className="postPage__modal__content__area__text">
                        포인트
                      </span>
                    </p>
                    <p className="postPage__modal__content__area__number-border">
                      {forumLength}
                      <span className="postPage__modal__content__area__text">
                        게시물
                      </span>
                    </p>
                    <p className="postPage__modal__content__area__number">
                      {commentLength}
                      <span className="postPage__modal__content__area__text">
                        댓글
                      </span>
                    </p>
                  </div>
                  <div className="postPage__modal__content__coins">
                    {userCoins.map((data, index) => {
                      return (
                        <div
                          key={index}
                          className="postPage__modal__content__coins__coin"
                        >
                          {data.abbr}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </ModalBody>
          </Modal>
          {userLoading ? (
            <div className="postPage__content__chart__intro__loading">
              <Dots size={30} color="#FFFFFF" />
            </div>
          ) : (
            <div className="postPage__content__chart__intro">
              <div className="postPage__content__chart__intro__post">
                <div className="postPage__content__chart__intro__post__header">
                  <div className="postPage__content__chart__intro__post__header__userInfo">
                    <div className="postPage__content__chart__intro__post__header__userInfo__thumb">
                      <Thumb
                        src={forum.profile_img}
                        fontSize={35}
                        size={50}
                        point={forum.point}
                        onClick={() => this.handleUser(forum.user_id)}
                      />
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
                  <div style={{ marginBottom: 10 }}>
                    <ImageGallery
                      items={images}
                      showThumbnails={false}
                      showPlayButton={false}
                      showBullets={true}
                    />
                  </div>
                  <Linkify
                    properties={{
                      target: "_blank",
                      style: { color: "#56b1bf", fontWeight: "400" }
                    }}
                  >
                    {forum.content}
                  </Linkify>
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
                    {!isLiked ? (
                      <NumericLabel params={option}>
                        {forum.like_cnt}
                      </NumericLabel>
                    ) : (
                      <NumericLabel params={option}>{newLike}</NumericLabel>
                    )}
                  </span>

                  {!liked ? (
                    <span
                      className="postPage__content__chart__intro__post__footer__icon"
                      onClick={!isLiked ? this.handleLike : this.handleDisLike}
                    >
                      {!isLiked ? (
                        <i className="xi-heart-o" />
                      ) : (
                        <i className="xi-heart" />
                      )}
                    </span>
                  ) : (
                    <span
                      className="postPage__content__chart__intro__post__footer__icon"
                      onClick={isLiked ? this.handleLike : this.handleDisLike}
                    >
                      {isLiked ? (
                        <i className="xi-heart-o" />
                      ) : (
                        <i className="xi-heart" />
                      )}
                    </span>
                  )}

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
                      onClick={() => this.handleUser(data.user_id)}
                      createdAt={data.created_at}
                      checkName={name}
                      content={data.content}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      );
    }
  }
}

PostPage.defaultProps = defaultProps;
PostPage.propTypes = propTypes;

export default withRouter(connect(mapStateToProps)(PostPage));
