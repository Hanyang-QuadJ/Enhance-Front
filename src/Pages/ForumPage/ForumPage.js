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
import Textarea from "react-textarea-autosize";
import { Dots } from "react-activity";
import * as NewsAction from "../../ActionCreators/NewsAction";
import * as PriceAction from "../../ActionCreators/PriceAction";
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
    me: state.reducer.me,
    isLogin: state.reducer.isLogin
  };
};

class ForumPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      posts: [],
      postLoading: false,
      favorite: [],
      isFocus: false,
      title: "",
      main: ""
    };
    this.toggle = this.toggle.bind(this);
  }

  paneDidMount = node => {
    if (node) {
      node.addEventListener("scroll", this.handleScroll.bind(this));
    }
  };

  componentDidMount() {
    this.props.dispatch(NewsAction.getNews());
  }

  handleScroll = event => {
    var node = event.target;
    const bottom = node.scrollHeight - node.scrollTop === node.clientHeight;
    if (bottom) {
      console.log("BOTTOM REACHED:", bottom);
    }
  };

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
      this.setState({
        showModal: !this.state.showModal
      });
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

  handlePost = async() => {
    const { main, title } = this.state;
    let date = new Date();
    let post = {
      desc: main,
      title,
      createdAt: date,
      type: "BTC"
    };
    const posts = this.state.posts.slice();
    posts.push(post);
    await this.setState({ posts: posts });
    await this.toggleModal();
  };

  render() {
    const { coinType, posts, favorite, postLoading, isFocus } = this.state;
    const { news, me, isLogin } = this.props;
    return (
      <div className="forumPage">
        <NavBar type="forum" />
        <SideBar
          type={coinType}
          favorite={favorite}
          handleFavorite={this.handleFavorite}
        />
        <Modal
          isOpen={this.state.showModal}
          toggle={this.toggleModal}
          size="lg"
          modalTransition={{ timeout: 20 }}
          backdropTransition={{ timeout: 10 }}
          centered={true}
          // backdrop={false}
        >
          <Loadable active={postLoading} spinner text="포스팅 중입니다">
            <ModalBody>
              <div className="forumPage__modal">
                <SocialInput
                  user={me}
                  showCamera
                  showType
                  isLogin={isLogin}
                  onChange={this.handleMain}
                  onChangeTitle={this.handleTitle}
                  placeholder="본문을 입력하세요"
                  onClick={this.handlePost}
                  postText="등록"
                  onFocus={this.onFocus}
                  isFocus={isFocus}
                />
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
            <div
              ref={this.paneDidMount}
              className="forumPage__content__news__lists"
            >
              {posts.map((data, index) => {
                return (
                  <List
                    social
                    key={index}
                    title={data.title}
                    createdAt={data.pubDate}
                    type={data.type}
                  />
                );
              })}
            </div>
          </div>
          <div className="forumPage__content__chart">
            <div className="forumPage__content__chart__intro">
              <div className="forumPage__content__chart__intro__logo">
                <img
                  width={45}
                  height={45}
                  src={require("../../Assests/Imgs/enhance_logo.png")}
                />
                <p className="forumPage__content__chart__intro__logo__text">
                  ENHANCE
                </p>
              </div>
              <div className="forumPage__content__chart__intro__welcome">
                <h4>Forum</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ForumPage.defaultProps = defaultProps;
ForumPage.propTypes = propTypes;

export default connect(mapStateToProps)(ForumPage);
