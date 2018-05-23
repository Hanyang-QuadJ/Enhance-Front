// This Page is Skeleton of React Structure for Web Development
// If you want to make other page, Copy and Refactor this page.

import React, { Component } from "react";
import { connect } from "react-redux";
import {
  NavBar,
  List,
  SideBar,
  Thumb,
  Button,
  SocialInput
} from "../../Components";
import { ProfilePost } from "../";
import { Route, Switch, withRouter } from "react-router-dom";
import { Dots } from "react-activity";
import * as PriceAction from "../../ActionCreators/PriceAction";
import * as SocialAction from "../../ActionCreators/SocialAction";
import * as AuthAction from "../../ActionCreators/AuthAction";
import "react-activity/dist/react-activity.css";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalBody
} from "reactstrap";
import cx from "classnames";
import Loadable from "react-loading-overlay";

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
      main: "",
      title: "",
      editIndex: 0,
      editId: 0
    };
    this.toggle = this.toggle.bind(this);
  }

  componentWillMount() {
    const { token } = this.props;
    const user_id = this.props.match.params.user_id;
    const params = { user_id: user_id, token };
    this.setState({ isPostsLoading: true });
    this.props.dispatch(SocialAction.getForumByUser(params)).then(forums => {
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
            posts: result,
            comments: commentResult,
            isPostsLoading: false
          });
          this.props.dispatch(PriceAction.getCoins()).then(coins => {
            this.props
              .dispatch(PriceAction.getFavs(this.props.token))
              .then(favs => {
                if (favs.length === 0) {
                  let result = coins.map(function(el) {
                    let o = Object.assign({}, el);
                    o.clicked = false;
                    o.loading = false;
                    return o;
                  });
                  this.setState({
                    sideFavorite: result
                  });
                } else {
                  //글 작성 코인 타입
                  let result = favs.map(function(el) {
                    let o = Object.assign({}, el);
                    o.clicked = false;
                    return o;
                  });

                  //사이드 바 즐겨찾기
                  let resultSide = coins.map(function(el) {
                    let o = Object.assign({}, el);
                    o.clicked = false;
                    o.selected = false;
                    o.loading = true;
                    return o;
                  });
                  for (let i = 0; i < resultSide.length; i++) {
                    for (let j = 0; j < favs.length; j++) {
                      if (resultSide[i].abbr === favs[j].abbr) {
                        resultSide[i].clicked = true;
                      }
                    }
                  }
                  this.setState({ favorite: result, sideFavorite: resultSide });

                  //Crypto Compare API
                  const abbrArray = [];
                  for (let i = 0; i < resultSide.length; i++) {
                    if (resultSide[i].clicked === true) {
                      abbrArray.push({
                        id: resultSide[i].id,
                        abbr: resultSide[i].abbr
                      });
                    }
                  }
                  let final = resultSide.map(function(el) {
                    let o = Object.assign({}, el);
                    o.price = 0;
                    o.percent = "";
                    return o;
                  });
                  this.props
                    .dispatch(
                      PriceAction.getPrice(
                        abbrArray.map((a, index) => {
                          return a.abbr;
                        })
                      )
                    )
                    .then(value => {
                      for (let i = 0; i < final.length; i++) {
                        for (let j = 0; j < abbrArray.length; j++) {
                          if (final[i].abbr === abbrArray[j].abbr) {
                            final[i].loading = false;
                            final[i].price = value[abbrArray[j].abbr].KRW.PRICE;
                            final[i].percent =
                              value[abbrArray[j].abbr].KRW.CHANGEPCT24HOUR;
                          }
                        }
                      }
                      this.setState({ sideFavorite: final });
                    });
                }
              });
          });
        });
    });
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

  handleFavorite = async(index, id, data) => {
    const coin = this.state.sideFavorite.slice();
    const favorite = this.state.favorite.slice();
    const { token } = this.props;
    const params = {
      token: token,
      coin_id: coin[index].id
    };
    //삭제
    if (coin[index].clicked === true) {
      coin[index].clicked = false;

      for (let i = 0; i < favorite.length; i++) {
        if (favorite[i].abbr === data) {
          favorite.splice(i, 1);
        }
      }

      let leftOver = [];
      for (let i = 0; i < coin.length; i++) {
        if (coin[i].clicked === true) {
          leftOver.push(coin[i].abbr);
        }
      }
      //한개 남았을 때
      if (leftOver.length === 0) {
        this.setState({ sideFavorite: coin, favorite });
        this.props.dispatch(PriceAction.removeFav(params));
      } else {
        this.setState({ sideFavorite: coin, favorite });
        this.props.dispatch(PriceAction.removeFav(params));
      }
    }
    //추가
    else {
      coin[index].clicked = true;
      coin[index].loading = true;
      favorite.push({ coin_id: id, clicked: false, abbr: data });

      this.setState({ sideFavorite: coin, favorite });

      //즐겨찾기 한 코인들에게, 가격, 증감표시 key 추가
      let result = coin.map(function(el) {
        let o = Object.assign({}, el);
        o.price = 0;
        o.percent = "";
        return o;
      });

      //즐겨찾기한 코인, 이름만 모으기
      let abbrArray = [];
      for (let i = 0; i < result.length; i++) {
        abbrArray[i] = result[i].abbr;
      }
      this.props.dispatch(PriceAction.addFav(params)).then(x => {
        this.props.dispatch(PriceAction.getPrice(abbrArray)).then(value => {
          for (let i = 0; i < abbrArray.length; i++) {
            result[i].price = value[abbrArray[i]].KRW.PRICE;
            result[i].percent = value[abbrArray[i]].KRW.CHANGEPCT24HOUR;
          }
          result[index].loading = false;
          this.setState(state => ({ sideFavorite: result }));
        });
      });
    }
  };

  handleDetail = (index, id, name) => {
    const params = {
      token: this.props.token,
      forum_id: id
    };
    const newPosts = this.state.posts.slice();
    newPosts[index].loading = true;
    this.setState({ posts: newPosts });
    this.props.dispatch(SocialAction.getOneForum(params)).then(forum => {
      this.setState({ selectedIndex: index });
      this.props.dispatch(SocialAction.getOneForumCoins(params)).then(coins => {
        this.props
          .dispatch(SocialAction.getOneForumComment(params))
          .then(comment => {
            const newPosts = this.state.posts.slice();
            newPosts[index].loading = false;
            this.setState({ posts: newPosts });
            this.props
              .dispatch(SocialAction.getLikeCheck(params))
              .then(result => {
                let isLiked;
                if (result.message === "You already liked this forum") {
                  isLiked = true;
                } else {
                  isLiked = false;
                }
                this.props.history.push({
                  pathname: `/@${this.props.match.params.user_id}/${id}`,
                  state: {
                    name,
                    forum,
                    comment: comment.reverse(),
                    coins,
                    liked: isLiked
                  }
                });
              });
          });
      });
    });
  };

  handleCoinTag = (index, id, data) => {
    let newFav = this.state.favorite.slice();
    let coinType = this.state.selectedCoinType.slice();
    let abbrType = this.state.selectedAbbr.slice();

    if (!newFav[index].clicked) {
      newFav[index].clicked = true;
      coinType.push(id);
      abbrType.push(data);
      this.setState({
        favorite: newFav,
        selectedCoinType: coinType,
        selectedAbbr: abbrType
      });
    } else {
      newFav[index].clicked = false;
      let coinIndex = coinType.indexOf(id);
      let abbrIndex = abbrType.indexOf(data);
      coinType.splice(coinIndex, 1);
      abbrType.splice(abbrIndex, 1);
      this.setState({
        favorite: newFav,
        selectedCoinType: coinType,
        selectedAbbr: abbrType
      });
    }
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
      this.setState({ selectedCommentIndex: index });
      this.props.dispatch(SocialAction.getOneForumCoins(params)).then(coins => {
        this.props
          .dispatch(SocialAction.getOneForumComment(params))
          .then(comment => {
            const newPosts = this.state.comments.slice();
            newPosts[index].loading = false;
            this.setState({ comments: newPosts });
            this.props.history.push({
              pathname: `/@${this.props.match.params.user_id}/${id}`,
              state: {
                name,
                forum,
                comment: comment.reverse(),
                coins
              }
            });
          });
      });
    });
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

  handleSignOut = () => {
    this.props.dispatch(AuthAction.signOut()).then(value => {
      this.props.history.replace({
        pathname: "/auth"
      });
    });
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
      isFocus,
      footerLoading,
      sideFavorite,
      postLoading,
      selectedType,
      selectedPostType2,
      selectedCoinType,
      selectedAbbr
    } = this.state;
    const {
      userId,
      userImg,
      userPoint,
      userCoins,
      username
    } = this.props.location.state;
    const { me } = this.props;

    return (
      <div className="userPage">
        <NavBar type="forum" />
        <SideBar
          multiple
          favorite={sideFavorite && sideFavorite}
          onClick={this.handleFilter}
          handleFavorite={this.handleFavorite}
        />
        <div className="userPage__content">
          <div className="userPage__content__news">
            <div className="userPage__content__news__search">
              <div className="userPage__content__news__search__first">
                <div className="userPage__content__news__search__first__iconArea">
                  <span className="userPage__content__news__search__first__iconArea__icon">
                    <i className="xi-search" />
                  </span>
                </div>
                <div className="userPage__content__news__search__first__inputArea">
                  <input
                    className="userPage__content__news__search__first__inputArea__input"
                    placeholder="무엇을 찾고싶으신가요?"
                  />
                </div>
              </div>
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
                {selectedType === "게시글"
                  ? posts &&
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
                          createdAt={data.created_at}
                          likeCount={data.like_cnt}
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
                  : removeDuplicates(comments, "forum_id").map(
                    (data, index) => {
                      return (
                        <List
                          index={index}
                          isLoading={data.loading}
                          selectedIndex={selectedCommentIndex}
                          key={index}
                          title={data.content}
                          createdAt={data.created_at}
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
                    }
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
              path={`/@${this.props.match.params.user_id}/:forum_id`}
              component={ProfilePost}
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
                            src={userImg}
                            fontSize={75}
                            size={90}
                            point={userPoint}
                          />
                          <p className="userPage__content__chart__intro__content__username">
                            {username}
                          </p>
                          <div className="userPage__content__chart__intro__content__area">
                            <p className="userPage__content__chart__intro__content__area__number-border">
                              {userPoint}
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
