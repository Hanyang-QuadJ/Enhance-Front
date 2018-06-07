// This Page is Skeleton of React Structure for Web Development
// If you want to make other page, Copy and Refactor this page.

import React, { Component } from "react";
import { connect } from "react-redux";
import { NavBar, List, Thumb, Button } from "../../Components";
import { PostPage } from "../";
import { Route, Switch, withRouter } from "react-router-dom";
import { Dots } from "react-activity";
import * as PriceAction from "../../ActionCreators/PriceAction";
import * as SocialAction from "../../ActionCreators/SocialAction";
import "react-activity/dist/react-activity.css";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

const defaultProps = {};
const propTypes = {};

const mapStateToProps = state => {
  return {
    news: state.reducer.news,
    token: state.reducer.token,
    me: state.reducer.me,
    isLogin: state.reducer.isLogin,
    favorite: state.reducer.favorite
  };
};
const sourceFilter = [{ id: 0, name: "게시글" }, { id: 1, name: "댓글" }];

function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      user: [],
      posts: [],
      comments: [],
      favorite: [],
      showModal: false,
      sideFavorite: [],
      isFocus: false,
      isFocusComment: false,
      isPostsLoading: false,
      postLoading: false,
      forumLoading: false,
      selectedType: "게시글",
      selectedPostType2: "",
      selectedCoinType: [],
      selectedAbbr: [],
      selectedIndex: null,
      selectedCommentIndex: null,
      forum: [],
      forumIndex: 0,
      editIndex: 0,
      editId: 0
    };
    this.toggle = this.toggle.bind(this);
  }

  componentWillMount() {
    const { token } = this.props;
    const user_id = this.props.match.params.user_id;
    console.log(user_id);
    const type = this.props.match.params.type;
    const params = { user_id: user_id, token };
    this.setState({ isPostsLoading: true });
    this.props.dispatch(SocialAction.getUserById(params)).then(user => {
      this.props.dispatch(SocialAction.getForumByUser(params)).then(forums => {
        this.props.dispatch(SocialAction.getFavByUser(params)).then(favs => {
          this.props
            .dispatch(SocialAction.getCommentsByUser(params))
            .then(comments => {
              let result = forums.reverse().map(function(el) {
                let o = Object.assign({}, el);
                o.loading = false;
                return o;
              });
              let commentResult = comments.reverse().map(function(el) {
                let o = Object.assign({}, el);
                o.loading = false;
                return o;
              });
              this.setState({
                user,
                posts: result,
                comments: commentResult,
                isPostsLoading: false,
                favorite: favs,
                selectedType: type === "post" ? "게시글" : "댓글"
              });
            });
        });
      });
    });
  }

  componentDidUpdate(previousProps, previousState) {
    if (
      previousProps.match.params.user_id !== this.props.match.params.user_id
    ) {
      const { token } = this.props;
      const user_id = this.props.match.params.user_id;
      const type = this.props.match.params.type;
      const params = { user_id: user_id, token };
      this.setState({ isPostsLoading: true });
      this.props.dispatch(SocialAction.getUserById(params)).then(user => {
        this.props
          .dispatch(SocialAction.getForumByUser(params))
          .then(forums => {
            this.props
              .dispatch(SocialAction.getFavByUser(params))
              .then(favs => {
                this.props
                  .dispatch(SocialAction.getCommentsByUser(params))
                  .then(comments => {
                    let result = forums.reverse().map(function(el) {
                      let o = Object.assign({}, el);
                      o.loading = false;
                      return o;
                    });
                    let commentResult = comments.reverse().map(function(el) {
                      let o = Object.assign({}, el);
                      o.loading = false;
                      return o;
                    });
                    this.setState({
                      user,
                      posts: result,
                      comments: commentResult,
                      isPostsLoading: false,
                      favorite: favs,
                      selectedType: type === "post" ? "게시글" : "댓글"
                    });
                  });
              });
          });
      });
    }
  }

  onFocus = () => {
    this.setState(prevState => ({
      isFocus: !prevState.isFocus
    }));
  };

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  };

  handleTitle = e => {
    this.setState({ title: e.target.value });
  };

  handleMain = e => {
    this.setState({ main: e.target.value });
  };

  handleType = data => {
    this.setState({ selectedType: data });
  };

  handleType2 = (index, data) => {
    this.setState({ selectedPostType2: data });
  };

  handleFilter = (index, id, coin) => {
    const newCoin = this.state.sideFavorite.slice();
    let result = newCoin.filter(a => {
      return a.clicked === true;
    });
    if (result[index].selected) {
      result[index].selected = false;
      this.setState({ sideFavorite: newCoin });
    } else {
      result[index].selected = true;
      this.setState({ sideFavorite: newCoin });
    }
  };

  handleDetail = (index, id, name) => {
    const params = {
      token: this.props.token,
      forum_id: id
    };
    const newPosts = this.state.posts.slice();
    newPosts[index].loading = true;
    this.setState({ posts: newPosts, selectedIndex: index });
    this.props.dispatch(SocialAction.getOneForum(params)).then(forum => {
      const newForum = Object.assign({}, forum);

      const images = forum.image.map((data, index) => {
        return { original: data.img_url };
      });
      this.props.dispatch(SocialAction.getOneForumCoins(params)).then(coins => {
        this.props
          .dispatch(SocialAction.getOneForumComment(params))
          .then(comment => {
            const newPosts = this.state.posts.slice();
            newPosts[index].loading = false;
            this.props
              .dispatch(SocialAction.getLikeCheck(params))
              .then(result => {
                let isLiked;
                if (result.message === "You already liked this forum") {
                  isLiked = true;
                } else {
                  isLiked = false;
                }

                this.props
                  .dispatch(SocialAction.postForumView(params))
                  .then(view => {
                    if (view.message === "already View") {
                      null;
                    } else {
                      newPosts[index].view_cnt += 1;
                      newForum.view_cnt = newForum.view_cnt + 1;
                    }

                    this.props
                      .dispatch(SocialAction.getHateCheck(params))
                      .then(result => {
                        let isHate;
                        if (
                          result.message === "it's okay to dislike this forum"
                        ) {
                          isHate = false;
                        } else {
                          isHate = true;
                        }
                        this.setState({ posts: newPosts });
                        this.props.history.push({
                          pathname: `/@${this.props.match.params.user_id}/${
                            this.props.match.params.type
                          }/${id}`,
                          state: {
                            name,
                            forum,
                            comment: comment.reverse(),
                            coins,
                            images,
                            liked: isLiked,
                            disliked: isHate
                          }
                        });
                      });
                  });
              });
          });
      });
    });
  };

  handleCommentDetail = (index, id, name) => {
    const params = {
      token: this.props.token,
      forum_id: id
    };
    const newPosts = this.state.comments.slice();
    newPosts[index].loading = true;
    this.setState({ comments: newPosts });
    this.props.dispatch(SocialAction.getOneForum(params)).then(forum => {
      const images = forum.image.map((data, index) => {
        return { original: data.img_url };
      });
      this.setState({ selectedCommentIndex: index });
      this.props.dispatch(SocialAction.getOneForumCoins(params)).then(coins => {
        this.props
          .dispatch(SocialAction.getOneForumComment(params))
          .then(comment => {
            const newPosts = this.state.comments.slice();
            newPosts[index].loading = false;
            this.setState({ comments: newPosts });
            this.props.history.push({
              pathname: `/@${this.props.match.params.user_id}/${
                this.props.match.params.type
              }/${id}`,
              state: {
                name,
                forum,
                comment: comment.reverse(),
                coins,
                images
              }
            });
          });
      });
    });
  };

  handleBack = () => {
    this.props.history.goBack();
  };

  handleScroll = e => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    const { forumIndex } = this.state;
    const params = {
      forumIndex
    };
    if (bottom) {
      if (this.state.endScroll === false) {
        this.setState({ footerLoading: true });
        this.props.dispatch(SocialAction.getAllForums(params)).then(forums => {
          if (forums.forums.length < 30) {
            this.setState({ endScroll: true, footerLoading: false });
          } else {
            this.setState(prevState => ({
              posts: [...prevState.posts, ...forums.forums],
              forumIndex: forums.nextIndex,
              footerLoading: false
            }));
          }
        });
      } else {
        return null;
      }
    }
  };

  render() {
    const {
      posts,
      main,
      title,
      comments,
      isPostsLoading,
      selectedIndex,
      selectedCommentIndex,
      favorite,
      footerLoading,
      selectedType,
      user
    } = this.state;
    const { me } = this.props;

    return (
      <div className="userPage">
        <NavBar type="forum" />
        <div className="userPage__content">
          <div className="userPage__content__news">
            <div className="userPage__content__news__search">
              <div className="userPage__content__news__search__second">
                <div className="userPage__content__news__search__second__content">
                  <ButtonDropdown
                    isOpen={this.state.dropdownOpen}
                    style={{ marginRight: 10, backgroundColor: "transparent" }}
                    toggle={this.toggle}
                    size="sm"
                    direction="down"
                  >
                    <DropdownToggle caret>
                      {this.state.selectedType}
                    </DropdownToggle>
                    <DropdownMenu>
                      {sourceFilter
                        .filter(a => {
                          return a.name !== this.state.selectedType;
                        })
                        .map((data, index) => {
                          return (
                            <DropdownItem
                              key={index}
                              onClick={() => this.handleType(data.name)}
                            >
                              {data.name}
                            </DropdownItem>
                          );
                        })}
                    </DropdownMenu>
                  </ButtonDropdown>
                </div>
              </div>
            </div>
            {isPostsLoading ? (
              <div className="userPage__content__news__lists-loading">
                <Dots color="#ffffff" size={30} />
              </div>
            ) : (
              <div
                ref={el => {
                  this.lists = el;
                }}
                onScroll={this.handleScroll}
                className="userPage__content__news__lists"
              >
                {posts.length === 0 && selectedType === "게시글" ? (
                  <div className="userPage__content__news__lists-none">
                    아직 등록된 포스트가 없습니다
                  </div>
                ) : null}
                {selectedType === "게시글" ? (
                  posts &&
                  posts.map((data, index) => {
                    return (
                      <List
                        social
                        index={index}
                        me={me[0]}
                        isLoading={data.loading}
                        selectedIndex={selectedIndex}
                        key={index}
                        value={main}
                        titleValue={title}
                        username={data.username}
                        title={data.title}
                        point={data.point}
                        isNews={false}
                        createdAt={data.created_at}
                        updatedAt={null}
                        likeCount={data.like_cnt}
                        disLikeCount={data.dislike_cnt}
                        type={data.coins}
                        view={data.view_cnt}
                        onClick={() =>
                          this.handleDetail(index, data.id, data.username)
                        }
                        onEditClick={() =>
                          this.handleEdit(
                            data.title,
                            data.content,
                            data.coins,
                            data.category,
                            index,
                            data.id
                          )
                        }
                      />
                    );
                  })
                ) : comments.length === 0 ? (
                  <div className="userPage__content__news__lists-none">
                    아직 등록된 댓글이 없습니다
                  </div>
                ) : (
                  removeDuplicates(comments, "forum_id").map((data, index) => {
                    return (
                      <List
                        index={index}
                        isLoading={data.loading}
                        selectedIndex={selectedCommentIndex}
                        key={index}
                        isNews={false}
                        title={data.content}
                        createdAt={data.created_at}
                        updatedAt={null}
                        type="댓글"
                        onClick={() =>
                          this.handleCommentDetail(
                            index,
                            data.forum_id,
                            data.username
                          )
                        }
                      />
                    );
                  })
                )}
                {footerLoading === true ? (
                  <div className="userPage__content__news__lists__footer">
                    <Dots color="#ffffff" size={20} />
                  </div>
                ) : null}
              </div>
            )}
          </div>
          <Switch>
            <Route
              path={`/@${this.props.match.params.user_id}/${
                this.props.match.params.type
              }/:forum_id`}
              component={PostPage}
            />
            <Route
              exact
              path={`${this.props.match.url}`}
              render={() => {
                return (
                  <div className="userPage__content__chart">
                    <div className="userPage__content__chart__intro">
                      <div className="userPage__content__chart__intro">
                        <div className="userPage__content__chart__intro__content">
                          <Thumb
                            src={user && user.profile_img}
                            fontSize={75}
                            size={90}
                            point={user && user.point}
                          />
                          <p className="userPage__content__chart__intro__content__username">
                            {user && user.username}
                          </p>
                          <div className="userPage__content__chart__intro__content__area">
                            <p className="userPage__content__chart__intro__content__area__number-border">
                              {user && user.point}
                              <span className="userPage__content__chart__intro__content__area__text">
                                포인트
                              </span>
                            </p>
                            <p className="userPage__content__chart__intro__content__area__number-border">
                              {posts.length}
                              <span className="userPage__content__chart__intro__content__area__text">
                                게시물
                              </span>
                            </p>
                            <p className="userPage__content__chart__intro__content__area__number">
                              {comments.length}
                              <span className="userPage__content__chart__intro__content__area__text">
                                댓글
                              </span>
                            </p>
                          </div>

                          <div className="userPage__content__chart__intro__content__coins">
                            {favorite.map((data, index) => {
                              return (
                                <div
                                  key={index}
                                  className="userPage__content__chart__intro__content__coins__coin"
                                >
                                  {data.abbr}
                                </div>
                              );
                            })}
                          </div>
                          <Button
                            text="이전으로"
                            marginTop={20}
                            width={100}
                            height={40}
                            onClick={this.handleBack}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

UserPage.defaultProps = defaultProps;
UserPage.propTypes = propTypes;

export default withRouter(connect(mapStateToProps)(UserPage));
