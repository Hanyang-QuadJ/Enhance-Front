// This Page is Skeleton of React Structure for Web Development
// If you want to make other page, Copy and Refactor this page.

import React, { Component } from "react";
import { connect } from "react-redux";
import { NavBar, List, SideBar, SocialInput } from "../../Components";
import { PostPage } from "../";
import { Route, Switch, withRouter } from "react-router-dom";
import { Dots } from "react-activity";
import * as NewsAction from "../../ActionCreators/NewsAction";
import * as PriceAction from "../../ActionCreators/PriceAction";
import * as SocialAction from "../../ActionCreators/SocialAction";
import * as AuthAction from "../../ActionCreators/AuthAction";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import Loadable from "react-loading-overlay";
import "react-activity/dist/react-activity.css";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button
} from "reactstrap";
import cx from "classnames";

const defaultProps = {};
const propTypes = {};

const styles = {
  styleAdd: {
    position: "absolute",
    left: "45vw",
    bottom: 30
  }
};

const mapStateToProps = state => {
  return {
    news: state.reducer.news,
    token: state.reducer.token,
    me: state.reducer.me,
    isLogin: state.reducer.isLogin,
    favorite: state.reducer.favorite
  };
};

class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      posts: [],
      favorite: [],
      sideFavorite: [],
      isFocus: false,
      isFocusComment: false,
      postLoading: false,
      isPostsLoading: false,
      forumLoading: false,
      footerLoading: false,
      title: "",
      main: "",
      endScroll: false,
      showModal: false,
      selectedCoinType: [],
      selectedAbbr: [],
      selectedPostType2: "자유",
      selectedIndex: null,
      forum: [],
      forumIndex: 0
    };
    this.toggle = this.toggle.bind(this);
  }

  componentWillMount() {
    const { isLogin } = this.props;
    const { forumIndex } = this.state;
    const params = { forumIndex };
    this.setState({ isPostsLoading: true });
    this.props.dispatch(SocialAction.getAllForums(params)).then(forums => {
      if (forums.forums.length < 30) {
        this.setState({ endScroll: true });
      }
      let result = forums.forums.reverse().map(function(el) {
        let o = Object.assign({}, el);
        o.loading = false;
        return o;
      });
      this.setState({
        posts: result,
        forumIndex: forums.nextIndex,
        isPostsLoading: false
      });
      this.props.dispatch(PriceAction.getCoins()).then(coins => {
        if (isLogin) {
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
        } else {
          null;
        }
      });
    });
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  toggleModal = () => {
    if (this.props.isLogin === false) {
      this.props.history.push({
        pathname: "/auth"
      });
    } else {
      if (this.state.favorite.length === 0) {
        alert("글을 작성하려면 우측에서 종목을 추가하세요");
      } else {
        this.setState({
          showModal: !this.state.showModal
        });
      }
    }
  };

  onFocus = () => {
    this.setState(prevState => ({
      isFocus: !prevState.isFocus
    }));
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

  handleTitle = e => {
    this.setState({ title: e.target.value });
  };

  handleMain = e => {
    this.setState({ main: e.target.value });
  };

  handleDetail = (index, id) => {
    const { isLogin } = this.props;
    if (isLogin) {
      const params = {
        token: this.props.token,
        forum_id: id
      };
      const newPosts = this.state.posts.slice();
      newPosts[index].loading = true;
      this.setState({ posts: newPosts });
      this.props.dispatch(SocialAction.getOneForum(params)).then(forum => {
        const newForum = Object.assign({}, forum);
        newForum.view_cnt = newForum.view_cnt + 1;
        this.setState({ selectedIndex: index });
        this.props.dispatch(SocialAction.postForumView(params)).then(view => {
          this.props
            .dispatch(SocialAction.getOneForumCoins(params))
            .then(coins => {
              this.props
                .dispatch(SocialAction.getOneForumComment(params))
                .then(comment => {
                  const newPosts = this.state.posts.slice();
                  newPosts[index].loading = false;
                  newPosts[index].view_cnt = newPosts[index].view_cnt + 1;
                  this.setState({ posts: newPosts });
                  this.props.history.push({
                    pathname: "/forum/" + id,
                    state: {
                      forum: newForum,
                      comment: comment.reverse(),
                      coins
                    }
                  });
                });
            });
        });
      });
    } else {
      this.props.history.replace({
        pathname: "/auth"
      });
    }
  };

  handlePost = async() => {
    const {
      main,
      title,
      selectedCoinType,
      selectedAbbr,
      selectedPostType2
    } = this.state;
    if (selectedCoinType.length === 0) {
      alert("해당하는 종목을 1개 이상 선택해주세요!");
    } else {
      let date = new Date();
      const coinArray = [];
      for (let i = 0; i < selectedAbbr.length; i++) {
        coinArray.push({ abbr: selectedAbbr[i] });
      }
      const params = {
        title,
        content: main,
        category: selectedPostType2,
        coins: selectedCoinType,
        created_at: date,
        token: this.props.token
      };

      this.setState({ postLoading: true });
      this.props.dispatch(SocialAction.postForum(params)).then(id => {
        const params = {
          token: this.props.token,
          forum_id: id
        };
        const frontParams = {
          title,
          id,
          content: main,
          category: selectedPostType2,
          coins: coinArray,
          created_at: date,
          view_cnt: 0
        };
        this.props.dispatch(SocialAction.getOneForum(params)).then(forum => {
          this.props
            .dispatch(SocialAction.getOneForumCoins(params))
            .then(async coins => {
              const newPosts = this.state.posts.slice();
              newPosts.splice(0, 0, frontParams);
              await this.props.history.push({
                pathname: "/forum/" + id,
                state: { forum, coins, comment: [] }
              });
              await this.setState({
                posts: newPosts,
                postLoading: false,
                selectedIndex: 0
              });
              await this.toggleModal();
            });
        });
      });
    }
  };

  handleType2 = (index, data) => {
    this.setState({ selectedPostType2: data });
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
      postLoading,
      isPostsLoading,
      isFocus,
      selectedPostType2,
      selectedIndex,
      favorite,
      forumLoading,
      footerLoading,
      sideFavorite
    } = this.state;
    const { news, me, isLogin } = this.props;
    return (
      <div className="forumPage">
        <NavBar type="forum" />
        {isLogin ? (
          <SideBar
            multiple
            favorite={sideFavorite && sideFavorite}
            onClick={this.handleFilter}
            handleFavorite={this.handleFavorite}
          />
        ) : null}

        <Modal
          isOpen={this.state.showModal}
          toggle={this.toggleModal}
          size="lg"
          modalTransition={{ timeout: 20 }}
          backdropTransition={{ timeout: 10 }}
          // backdrop={false}
        >
          <Loadable active={postLoading} spinner text="포스팅 중입니다">
            <ModalBody>
              <div className="forumPage__modal">
                <SocialInput
                  user={me && me[0]}
                  isTitle={true}
                  minRows={4}
                  maxRows={6}
                  showCamera
                  showType2
                  isLogin={isLogin}
                  onChange={this.handleMain}
                  onChangeTitle={this.handleTitle}
                  placeholder="본문을 입력하세요"
                  onClick={this.handlePost}
                  postText="등록"
                  handleType={this.handleType}
                  handleType2={this.handleType2}
                  postType={favorite}
                  selectedPostType2={selectedPostType2}
                  onFocus={this.onFocus}
                  isFocus={isFocus}
                />
                <p className="forumPage__modal__favorite__text">
                  <span className="forumPage__modal__favorite__icon">
                    <i className="xi-caret-down-min" />
                  </span>관련된 종목을 선택하세요
                </p>

                <div className="forumPage__modal__favorite">
                  {favorite &&
                    favorite
                      .sort((a, b) => {
                        if (a.abbr < b.abbr) return -1;
                        if (a.abbr > b.abbr) return 1;
                        return 0;
                      })
                      .map((data, index) => {
                        return (
                          <div
                            key={index}
                            className={cx("forumPage__modal__favorite__item", {
                              "forumPage__modal__favorite__item-active":
                                data.clicked
                            })}
                            onClick={() =>
                              this.handleCoinTag(index, data.coin_id, data.abbr)
                            }
                          >
                            {data.abbr}
                          </div>
                        );
                      })}
                </div>
              </div>
            </ModalBody>
          </Loadable>
        </Modal>
        <div className="forumPage__content">
          <div className="forumPage__content__news">
            <div className="forumPage__content__news__search">
              <div className="forumPage__content__news__search__first">
                <div className="forumPage__content__news__search__first__iconArea">
                  <span className="forumPage__content__news__search__first__iconArea__icon">
                    <i className="xi-search" />
                  </span>
                </div>
                <div className="forumPage__content__news__search__first__inputArea">
                  <input
                    className="forumPage__content__news__search__first__inputArea__input"
                    placeholder="무엇을 찾고싶으신가요?"
                  />
                </div>
              </div>
              <div className="forumPage__content__news__search__second">
                <div className="forumPage__content__news__search__second__content">
                  <ButtonDropdown
                    isOpen={this.state.dropdownOpen}
                    style={{ marginRight: 10, backgroundColor: "transparent" }}
                    toggle={this.toggle}
                    size="sm"
                    direction="down"
                  >
                    <DropdownToggle caret>최신 순</DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem>인기 순</DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
                  <Button onClick={this.toggleModal} size="sm">
                    새 글 작성
                  </Button>
                </div>
              </div>
            </div>
            {isPostsLoading ? (
              <div className="forumPage__content__news__lists-loading">
                <Dots color="#ffffff" size={30} />
              </div>
            ) : (
              <div
                ref={el => {
                  this.lists = el;
                }}
                onScroll={this.handleScroll}
                className="forumPage__content__news__lists"
              >
                {posts.map((data, index) => {
                  return (
                    <List
                      social
                      index={index}
                      isLoading={data.loading}
                      selectedIndex={selectedIndex}
                      key={index}
                      username={data.username}
                      title={data.title}
                      point={data.point}
                      createdAt={data.created_at}
                      type={data.coins}
                      view={data.view_cnt}
                      onClick={() => this.handleDetail(index, data.id)}
                    />
                  );
                })}
                {footerLoading === true ? (
                  <div className="forumPage__content__news__lists__footer">
                    <Dots color="#ffffff" size={20} />
                  </div>
                ) : null}
              </div>
            )}
          </div>
          <Switch>
            <Route
              path={`${this.props.match.url}/:forum_id`}
              component={PostPage}
            />
            <Route
              exact
              path={`${this.props.match.url}`}
              render={() => {
                return (
                  <div className="forumPage__content__chart">
                    <div className="forumPage__content__chart__intro">
                      <div className="forumPage__content__chart__intro__logo">
                        <img
                          width={45}
                          height={45}
                          src="https://github.com/Hanyang-QuadJ/enhance/blob/master/public/icons/enhance_logo.png?raw=true"
                        />
                        <p className="forumPage__content__chart__intro__logo__text">
                          ENHANCE
                        </p>
                      </div>
                      <div className="forumPage__content__chart__intro__welcome">
                        <p>
                          <strong>환영합니다. </strong>
                          {me && me[0].username + " 님"}
                        </p>
                        <p>
                          인핸스는 가상화폐와 블록체인 기술에 대한 정보를
                          실시간으로 모아서 한눈에 보기 쉽게 제공해 드리고
                          있습니다. 인핸스와 함께 가상화폐의 역사를 함께 하세요.
                        </p>
                      </div>
                      <div className="forumPage__content__chart__intro__desc">
                        <strong>인핸스 포럼</strong>
                        <p>
                          로그인 후 + 버튼을 누르거나 좌측 상단 돋보기 아이콘을
                          눌러 원하는 가상화폐 종목을 검색하실 수 있습니다.
                        </p>
                        <br />
                        <p>
                          원하는 가상화폐를 클릭하여 팔로우 하시면 우측 즐겨찾기
                          목록에 저장되어 해당 가상 화폐의 정보를 계속 보실 수
                          있습니다.
                        </p>
                        <br />
                        <p>각 가상화폐의 종목의 커뮤니티에 참여하세요.</p>
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
