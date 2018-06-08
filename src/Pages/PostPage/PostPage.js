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
import * as base64 from "../../Assests/Icons/base64";
import Notifications, { notify } from "react-notify-toast";

const defaultProps = {};
const propTypes = {};
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
      r_forum: {},
      r_images: [],
      r_coins: [],
      forumLength: 0,
      commentLength: 0,
      isLiked: false,
      isHated: false,
      isRefreshed: false,
      newLike: 0,
      newHate: 0,
      userId: 0
    };
    moment.locale("ko");
  }

  componentWillMount() {
    const { isLogin } = this.props;
    if (isLogin) {
      const { forum_id } = this.props.match.params;
      const params = { token: this.props.token, forum_id };
      this.props.dispatch(SocialAction.getLikeCheck(params)).then(value => {
        this.props.dispatch(SocialAction.getHateCheck(params)).then(hate => {
          this.props.dispatch(SocialAction.getOneForum(params)).then(result => {
            this.props
              .dispatch(SocialAction.getOneForumCoins(params))
              .then(coins => {
                this.props
                  .dispatch(SocialAction.getOneForumComment(params))
                  .then(comments => {
                    if (value.message === "You already liked this forum") {
                      this.setState({
                        isLiked: true,
                        newLike: result.like_cnt
                      });
                    } else {
                      this.setState({ newLike: result.like_cnt });
                    }
                    if (hate.message !== "it's okay to dislike this forum") {
                      this.setState({
                        isHated: true,
                        newHate: result.dislike_cnt
                      });
                    } else {
                      this.setState({ newHate: result.dislike_cnt });
                    }
                    const images = result.image.map((data, index) => {
                      return { original: data.img_url };
                    });
                    this.setState({
                      r_forum: result,
                      r_coins: coins,
                      r_images: images,
                      isRefreshed: true,
                      newComment: comments.reverse()
                    });
                  });
              });
          });
        });
      });
    } else {
      this.props.history.replace({ pathname: "/auth" });
    }
  }

  handleComment = e => {
    this.setState({ comment: e.target.value });
  };

  handlePostComment = e => {
    const { me } = this.props;
    const date = new Date();
    const newComment = this.state.newComment.slice();
    const params = {
      token: this.props.token,
      content: this.state.comment,
      forum_id: this.props.match.params.forum_id
    };
    if (this.state.comment.length === 0) {
      alert("댓글을 먼저 입력하세요!");
    } else {
      this.props.dispatch(SocialAction.postForumComment(params)).then(value => {
        const frontParams = {
          username: me.username,
          profile_img: me.profile_img,
          point: me.point,
          content: this.state.comment,
          date,
          id: value
        };
        newComment.splice(0, 0, frontParams);
        this.setState({ newComment, comment: "" });
      });
    }
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
    if (this.props.location.state === undefined) {
      const { r_forum } = this.state;
      const params = {
        token: this.props.token,
        forum_id: Number(this.props.match.params.forum_id)
      };
      this.setState({ isLiked: true, newLike: r_forum.like_cnt + 1 });
      this.props.dispatch(SocialAction.postForumLike(params)).then(value => {
        let myColor = { background: "#5cb85c", text: "#ffffff" };
        notify.show("상승 예측!", "custom", 3000, myColor);
      });
    } else {
      const { forum, liked } = this.props.location.state;
      const params = {
        token: this.props.token,
        forum_id: Number(this.props.match.params.forum_id)
      };
      if (liked) {
        this.setState({ isLiked: false, newLike: forum.like_cnt });
        this.props.dispatch(SocialAction.postForumLike(params)).then(value => {
          let myColor = { background: "#5cb85c", text: "#ffffff" };
          notify.show("상승 예측!", "custom", 3000, myColor);
        });
      } else {
        this.setState(prevState => ({
          isLiked: true,
          newLike: forum.like_cnt + 1
        }));
        this.props.dispatch(SocialAction.postForumLike(params)).then(value => {
          let myColor = { background: "#5cb85c", text: "#ffffff" };
          notify.show("상승 예측!", "custom", 3000, myColor);
        });
      }
    }
  };

  handleHate = () => {
    if (this.props.location.state === undefined) {
      const { r_forum } = this.state;
      const params = {
        token: this.props.token,
        forum_id: Number(this.props.match.params.forum_id)
      };
      this.setState({ isHated: true, newHate: r_forum.dislike_cnt + 1 });
      this.props.dispatch(SocialAction.postHate(params)).then(value => {
        let myColor = { background: "#f26968", text: "#ffffff" };
        notify.show("하락 예측!", "custom", 3000, myColor);
      });
    } else {
      const { forum, hated } = this.props.location.state;
      const params = {
        token: this.props.token,
        forum_id: Number(this.props.match.params.forum_id)
      };
      if (hated) {
        this.setState(prevState => ({
          isHated: false,
          newHate: forum.dislike_cnt
        }));
        this.props.dispatch(SocialAction.postHate(params)).then(value => {
          let myColor = { background: "#f26968", text: "#ffffff" };
          notify.show("하락 예측!", "custom", 3000, myColor);
        });
      } else {
        this.setState(prevState => ({
          isHated: true,
          newHate: forum.dislike_cnt + 1
        }));
        this.props.dispatch(SocialAction.postHate(params)).then(value => {
          let myColor = { background: "#f26968", text: "#ffffff" };
          notify.show("하락 예측!", "custom", 3000, myColor);
        });
      }
    }
  };

  handleDisLike = () => {
    if (this.props.location.state === undefined) {
      const { r_forum } = this.state;
      const params = {
        token: this.props.token,
        forum_id: Number(this.props.match.params.forum_id)
      };
      this.setState({ isLiked: false, newLike: r_forum.like_cnt - 1 });
      this.props
        .dispatch(SocialAction.postForumDisLike(params))
        .then(value => {});
    } else {
      const { forum, liked } = this.props.location.state;
      const params = {
        token: this.props.token,
        forum_id: Number(this.props.match.params.forum_id)
      };
      if (liked) {
        this.setState(prevState => ({
          isLiked: true,
          newLike: forum.like_cnt - 1
        }));
        this.props
          .dispatch(SocialAction.postForumDisLike(params))
          .then(value => {});
      } else {
        this.setState(prevState => ({
          isLiked: false,
          newLike: forum.like_cnt - 1
        }));
        this.props
          .dispatch(SocialAction.postForumDisLike(params))
          .then(value => {});
      }
    }
  };

  handleUnHate = () => {
    if (this.props.location.state === undefined) {
      const { r_forum } = this.state;
      const params = {
        token: this.props.token,
        forum_id: Number(this.props.match.params.forum_id)
      };
      this.setState({ isHated: false, newHate: r_forum.dislike_cnt - 1 });
      this.props.dispatch(SocialAction.postUnHate(params)).then(value => {});
    } else {
      const { forum, hated } = this.props.location.state;
      const params = {
        token: this.props.token,
        forum_id: Number(this.props.match.params.forum_id)
      };
      if (hated) {
        this.setState(prevState => ({
          isHated: true,
          newHate: forum.dislike_cnt - 1
        }));
        this.props.dispatch(SocialAction.postUnHate(params)).then(value => {});
      } else {
        this.setState(prevState => ({
          isHated: false,
          newHate: forum.dislike_cnt - 1
        }));
        this.props.dispatch(SocialAction.postUnHate(params)).then(value => {});
      }
    }
  };

  handleUserDetail = type => {
    const { userId, username, userPoint, userImg, userCoins } = this.state;
    this.props.history.push({
      pathname: `/@${userId}/${type}`,
      state: { userId, username, userPoint, userImg, userCoins }
    });
  };

  handleDelete = id => {
    const { me } = this.props;
    if (this.props.location.state === undefined) {
      const deletedComment = this.state.newComment.slice();
      let result = deletedComment.filter(a => {
        return a.id !== id;
      });
      this.setState({ newComment: result });
      const params = {
        comment_id: id,
        token: this.props.token,
        flag: me && me.flag
      };
      this.props.dispatch(SocialAction.deleteComment(params)).then(value => {});
    } else {
      const deletedComment = this.state.newComment.slice();
      const params = {
        comment_id: id,
        token: this.props.token,
        flag: me && me.flag
      };
      this.setState({ isRefreshed: true });
      if (deletedComment.length !== 0) {
        let result = deletedComment.filter(a => {
          return a.id !== id;
        });
        this.setState({ newComment: result });
        this.props
          .dispatch(SocialAction.deleteComment(params))
          .then(value => {});
      } else {
        this.props.dispatch(SocialAction.deleteComment(params)).then(value => {
          const { forum_id } = this.props.match.params;
          const params = {
            token: this.props.token,
            forum_id,
            flag: me && me.flag
          };
          this.props
            .dispatch(SocialAction.getOneForumComment(params))
            .then(comments => {
              this.setState({ newComment: comments });
            });
        });
      }
    }
  };

  onFocusComment = () => {
    this.setState(prevState => ({
      isFocusComment: !prevState.isFocusComment
    }));
  };

  componentDidUpdate(previousProps, previousState) {
    if (previousProps.location.state !== this.props.location.state) {
      this.setState({
        newComment: [],
        newLike: 0,
        newHate: 0,
        isLiked: false,
        isHated: false,
        isRefreshed: false
      });
    }
  }

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  };

  render() {
    const {
      isLiked,
      isHated,
      newLike,
      newHate,
      isFocusComment,
      newComment,
      username,
      userImg,
      userCoins,
      userPoint,
      forumLength,
      commentLength,
      userLoading,
      r_forum,
      r_images,
      r_coins
    } = this.state;
    const { me, isLogin } = this.props;
    if (this.props.location.state === undefined) {
      return (
        <div className="postPage__content__chart">
          <Notifications />
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
                    onClick={() => this.handleUserDetail("post")}
                  />
                  <p className="postPage__modal__content__username">
                    {username}
                  </p>
                  <div className="postPage__modal__content__area">
                    <p className="postPage__modal__content__area__number-border-none">
                      {userPoint}
                      <span className="postPage__modal__content__area__text">
                        포인트
                      </span>
                    </p>
                    <p
                      className="postPage__modal__content__area__number-border"
                      onClick={() => this.handleUserDetail("post")}
                    >
                      {forumLength}
                      <span className="postPage__modal__content__area__text">
                        게시물
                      </span>
                    </p>
                    <p
                      className="postPage__modal__content__area__number"
                      onClick={() => this.handleUserDetail("comment")}
                    >
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
                        src={r_forum.profile_img}
                        fontSize={35}
                        size={50}
                        point={r_forum.point}
                        onClick={() => this.handleUser(r_forum.user_id)}
                      />
                    </div>
                    <div className="postPage__content__chart__intro__post__header__userInfo__name">
                      <strong>{r_forum.username}</strong>
                      <span className="postPage__content__chart__intro__post__header__userInfo__point">
                        {`${r_forum.point} 포인트`}
                      </span>
                    </div>
                  </div>
                  <div className="postPage__content__chart__intro__post__header__detail">
                    <p>{r_forum.category}</p>
                    <span className="postPage__content__chart__intro__post__header__userInfo__date">
                      {r_forum.updated_at !== null
                        ? moment(r_forum.updated_at).fromNow() + " 수정됨"
                        : moment(r_forum.created_at).fromNow()}
                    </span>
                  </div>
                </div>
                <div className="postPage__content__chart__intro__post__title">
                  <p>{r_forum.title}</p>
                </div>
                <div className="postPage__content__chart__intro__post__body">
                  <div style={{ marginBottom: 10 }}>
                    {r_images.length === 0 ? null : (
                      <ImageGallery
                        items={r_images}
                        size={50}
                        showThumbnails={false}
                        showPlayButton={false}
                        showBullets={true}
                      />
                    )}
                  </div>
                  <Linkify
                    properties={{
                      target: "_blank",
                      style: { color: "#56b1bf", fontWeight: "400" }
                    }}
                  >
                    {r_forum.content}
                  </Linkify>
                </div>
                <div className="postPage__content__chart__intro__post__coin">
                  {r_coins.map((data, index) => {
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
                      <NumericLabel params={option}>{newLike}</NumericLabel>
                    ) : (
                      <span className="postPage__content__chart__intro__post__footer__count-liked">
                        <NumericLabel params={option}>{newLike}</NumericLabel>
                      </span>
                    )}
                  </span>
                  <span
                    className="postPage__content__chart__intro__post__footer__icon"
                    onClick={!isLiked ? this.handleLike : this.handleDisLike}
                  >
                    {!isLiked ? (
                      <img
                        src={base64.arrowUpWhite}
                        style={{ width: 18, height: 18 }}
                      />
                    ) : (
                      <img
                        src={base64.arrowUpGreen}
                        style={{ width: 18, height: 18 }}
                      />
                    )}
                  </span>
                  <span className="postPage__content__chart__intro__post__footer__count">
                    {!isHated ? (
                      <NumericLabel params={option}>{newHate}</NumericLabel>
                    ) : (
                      <span className="postPage__content__chart__intro__post__footer__count-hated">
                        <NumericLabel params={option}>{newHate}</NumericLabel>
                      </span>
                    )}
                  </span>
                  <span
                    className="postPage__content__chart__intro__post__footer__icon"
                    onClick={!isHated ? this.handleHate : this.handleUnHate}
                  >
                    {!isHated ? (
                      <img
                        src={base64.arrowDownWhite}
                        style={{ width: 18, height: 18 }}
                      />
                    ) : (
                      <img
                        src={base64.arrowDownRed}
                        style={{ width: 18, height: 18 }}
                      />
                    )}
                  </span>
                  <span className="postPage__content__chart__intro__post__footer__count">
                    {r_forum.view_cnt}
                  </span>
                  <span className="postPage__content__chart__intro__post__footer__view">
                    <i className="xi-eye" />
                  </span>
                </div>
              </div>
              <SocialInput
                user={me && me}
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
                      onClick={() => this.handleUser(data.user_id)}
                      onDelete={() => this.handleDelete(data.id)}
                      checkName={me.username}
                      content={data.content}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      );
    } else {
      const {
        isLiked,
        isHated,
        newLike,
        newHate,
        isFocusComment,
        newComment,
        username,
        userImg,
        userCoins,
        userPoint,
        forumLength,
        commentLength,
        userLoading,
        isRefreshed
      } = this.state;
      const { me, isLogin } = this.props;
      const {
        forum,
        coins,
        comment,
        name,
        liked,
        hated,
        images
      } = this.props.location.state;
      return (
        <div className="postPage__content__chart">
          <Notifications />
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
                    onClick={() => this.handleUserDetail("post")}
                  />
                  <p className="postPage__modal__content__username">
                    {username}
                  </p>
                  <div className="postPage__modal__content__area">
                    <p className="postPage__modal__content__area__number-border-none">
                      {userPoint}
                      <span className="postPage__modal__content__area__text">
                        포인트
                      </span>
                    </p>
                    <p
                      className="postPage__modal__content__area__number-border"
                      onClick={() => this.handleUserDetail("post")}
                    >
                      {forumLength}
                      <span className="postPage__modal__content__area__text">
                        게시물
                      </span>
                    </p>
                    <p
                      className="postPage__modal__content__area__number"
                      onClick={() => this.handleUserDetail("comment")}
                    >
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
                      {forum.updated_at !== null
                        ? moment(forum.updated_at).fromNow() + " 수정됨"
                        : moment(forum.created_at).fromNow()}
                    </span>
                  </div>
                </div>
                <div className="postPage__content__chart__intro__post__title">
                  <p>{forum.title}</p>
                </div>
                <div className="postPage__content__chart__intro__post__body">
                  <div style={{ marginBottom: 10 }}>
                    {images.length === 0 ? null : (
                      <ImageGallery
                        items={images}
                        size={50}
                        showThumbnails={false}
                        showPlayButton={false}
                        showBullets={true}
                      />
                    )}
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
                      liked ? (
                        <span className="postPage__content__chart__intro__post__footer__count-liked">
                          <NumericLabel params={option}>
                            {forum.like_cnt}
                          </NumericLabel>
                        </span>
                      ) : (
                        <NumericLabel params={option}>
                          {forum.like_cnt}
                        </NumericLabel>
                      )
                    ) : liked ? (
                      <NumericLabel params={option}>{newLike}</NumericLabel>
                    ) : (
                      <span className="postPage__content__chart__intro__post__footer__count-liked">
                        <NumericLabel params={option}>{newLike}</NumericLabel>
                      </span>
                    )}
                  </span>

                  {!liked ? (
                    <span
                      className="postPage__content__chart__intro__post__footer__icon"
                      onClick={!isLiked ? this.handleLike : this.handleDisLike}
                    >
                      {!isLiked ? (
                        <img
                          src={base64.arrowUpWhite}
                          style={{ width: 18, height: 18 }}
                        />
                      ) : (
                        <img
                          src={base64.arrowUpGreen}
                          style={{ width: 18, height: 18 }}
                        />
                      )}
                    </span>
                  ) : (
                    <span
                      className="postPage__content__chart__intro__post__footer__icon"
                      onClick={isLiked ? this.handleLike : this.handleDisLike}
                    >
                      {isLiked ? (
                        <img
                          src={base64.arrowUpWhite}
                          style={{ width: 18, height: 18 }}
                        />
                      ) : (
                        <img
                          src={base64.arrowUpGreen}
                          style={{ width: 18, height: 18 }}
                        />
                      )}
                    </span>
                  )}

                  <span className="postPage__content__chart__intro__post__footer__count">
                    {!isHated ? (
                      hated ? (
                        <span className="postPage__content__chart__intro__post__footer__count-hated">
                          <NumericLabel params={option}>
                            {forum.dislike_cnt}
                          </NumericLabel>
                        </span>
                      ) : (
                        <NumericLabel params={option}>
                          {forum.dislike_cnt}
                        </NumericLabel>
                      )
                    ) : hated ? (
                      <NumericLabel params={option}>{newHate}</NumericLabel>
                    ) : (
                      <span className="postPage__content__chart__intro__post__footer__count-hated">
                        <NumericLabel params={option}>{newHate}</NumericLabel>
                      </span>
                    )}
                  </span>

                  {!hated ? (
                    <span
                      className="postPage__content__chart__intro__post__footer__icon"
                      onClick={!isHated ? this.handleHate : this.handleUnHate}
                    >
                      {!isHated ? (
                        <img
                          src={base64.arrowDownWhite}
                          style={{ width: 18, height: 18 }}
                        />
                      ) : (
                        <img
                          src={base64.arrowDownRed}
                          style={{ width: 18, height: 18 }}
                        />
                      )}
                    </span>
                  ) : (
                    <span
                      className="postPage__content__chart__intro__post__footer__icon"
                      onClick={isHated ? this.handleHate : this.handleUnHate}
                    >
                      {isHated ? (
                        <img
                          src={base64.arrowDownWhite}
                          style={{ width: 18, height: 18 }}
                        />
                      ) : (
                        <img
                          src={base64.arrowDownRed}
                          style={{ width: 18, height: 18 }}
                        />
                      )}
                    </span>
                  )}

                  <span className="postPage__content__chart__intro__post__footer__count">
                    {forum.view_cnt}
                  </span>
                  <span className="postPage__content__chart__intro__post__footer__view">
                    <i className="xi-eye" />
                  </span>
                </div>
              </div>
              <SocialInput
                user={me && me}
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
                      onClick={() => this.handleUser(data.user_id)}
                      checkName={me && me.username}
                      flag={me && me.flag}
                      onDelete={() => this.handleDelete(data.id)}
                      content={data.content}
                    />
                  );
                })}
                {!isRefreshed &&
                  comment.map((data, index) => {
                    return (
                      <Comment
                        key={index}
                        username={data.username}
                        profileImg={data.profile_img}
                        userPoint={data.point}
                        onClick={() => this.handleUser(data.user_id)}
                        onDelete={() => this.handleDelete(data.id)}
                        createdAt={data.created_at}
                        checkName={me && me.username}
                        flag={me && me.flag}
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
