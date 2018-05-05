// This Page is Skeleton of React Structure for Web Development
// If you want to make other page, Copy and Refactor this page.

import React, { Component } from "react";
import { connect } from "react-redux";
import {
  NavBar,
  List,
  SideBar,
  RoundInput,
  Thumb,
  SocialInput
} from "../../Components";
import { PostPage, MyPage } from "../";
import { Route } from "react-router-dom";
import Textarea from "react-textarea-autosize";
import { Dots } from "react-activity";
import * as NewsAction from "../../ActionCreators/NewsAction";
import * as PriceAction from "../../ActionCreators/PriceAction";
import * as SocialAction from "../../ActionCreators/SocialAction";
import * as AuthAction from "../../ActionCreators/AuthAction";
import coinJson from "../../Json/coin";
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

class ForumPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      posts: [],
      favorite: [],
      postLoading: false,
      myFavorite: [],
      isFocus: false,
      title: "",
      main: "",
      comment: "",
      selectedCoinType: [],
      selectedPostType2: "자유"
    };
    this.toggle = this.toggle.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(SocialAction.getAllForums()).then(forums => {
      this.setState({ posts: forums });
      this.props.dispatch(PriceAction.getFavs(this.props.token)).then(favs => {
        if (favs.length === 0) {
          return null;
        } else {
          let result = favs.map(function(el) {
            let o = Object.assign({}, el);
            o.clicked = false;
            return o;
          });
          this.setState({ favorite: result });
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

  handleFavorite = async(index, data) => {
    const coin = this.state.favorite.slice();
    coin[index].clicked = true;
    coin[index].loading = true;
    this.setState({ favorite: coin });

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
    this.props.dispatch(PriceAction.getPrice(abbrArray)).then(value => {
      for (let i = 0; i < abbrArray.length; i++) {
        result[i].price = value[abbrArray[i]].KRW.PRICE;
        result[i].percent = value[abbrArray[i]].KRW.CHANGEPCT24HOUR;
      }
      result[index].loading = false;
      this.setState(state => ({ favorite: result }));
    });
  };

  handleTitle = e => {
    this.setState({ title: e.target.value });
  };

  handleMain = e => {
    this.setState({ main: e.target.value });
  };

  handleDetail = () => {
    this.props.history.push({
      pathname: "/forum/1"
    });
  };

  handlePost = async() => {
    const { main, title, selectedCoinType, selectedPostType2 } = this.state;
    let date = new Date();
    const params = {
      title,
      content: main,
      category: selectedPostType2,
      coin_id: selectedCoinType[0]
    };
    const newPosts = this.state.posts.slice();
    newPosts.push(params);
    await this.setState({ posts: newPosts });
    await this.toggleModal();
  };

  handleType2 = (index, data) => {
    this.setState({ selectedPostType2: data });
  };

  handleCoinTag = (index, id, data) => {
    let newFav = this.state.favorite.slice();
    let coinType = this.state.selectedCoinType.slice();
    if (!newFav[index].clicked) {
      newFav[index].clicked = true;
      coinType.push(id);
      this.setState({ favorite: newFav, selectedCoinType: coinType });
    } else {
      newFav[index].clicked = false;
      let coinIndex = coinType.indexOf(id);
      coinType.splice(coinIndex, 1);
      this.setState({ favorite: newFav, selectedCoinType: coinType });
    }
  };

  render() {
    const {
      posts,
      postLoading,
      isFocus,
      selectedCoinType,
      selectedPostType2,
      favorite
    } = this.state;
    const { news, me, isLogin } = this.props;
    console.log(selectedCoinType);
    return (
      <div className="forumPage">
        <NavBar type="forum" />
        {/* <SideBar
          favorite={favorite && favorite}
          handleFavorite={this.handleFavorite}
        /> */}
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
                <hr />
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
            <div className="forumPage__content__news__lists">
              {posts.map((data, index) => {
                return (
                  <List
                    social
                    key={index}
                    title={data.title}
                    createdAt={data.pubDate}
                    type={data.type}
                    onClick={this.handleDetail}
                  />
                );
              })}
            </div>
          </div>

          <div className="forumPage__content__chart">
            <Route path="/forum/@:user_id" component={MyPage} />
            <Route path="/forum/:post_id" component={PostPage} />
            <Route
              exact
              path="/forum"
              render={() => {
                return (
                  <div className="homePage__content__chart__intro">
                    <div className="homePage__content__chart__intro__logo">
                      <img
                        width={45}
                        height={45}
                        src="https://github.com/Hanyang-QuadJ/enhance/blob/master/public/icons/enhance_logo.png?raw=true"
                      />
                      <p className="homePage__content__chart__intro__logo__text">
                        ENHANCE
                      </p>
                    </div>
                    <div className="homePage__content__chart__intro__welcome">
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
                    <div className="homePage__content__chart__intro__desc">
                      <strong>인핸스 뉴스</strong>
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
                      <p>
                        우측 즐겨찾기 목록에 위치한 가상화폐 종목 박스를
                        클리하면 좌측 파티션에 해당 가상화폐에 관련된 기사와
                        정보들이 실시간으로 노출됩니다.
                      </p>
                    </div>
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

ForumPage.defaultProps = defaultProps;
ForumPage.propTypes = propTypes;

export default connect(mapStateToProps)(ForumPage);
