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

class PostPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      posts: [],
      postLoading: false,
      favorite: [],
      isFocus: false,
      isFocusComment: false,
      title: "",
      main: "",
      comment: ""
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {}

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

  onFocusComment = () => {
    this.setState(prevState => ({
      isFocusComment: !prevState.isFocusComment
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

  handleComment = e => {
    this.setState({ comment: e.target.value });
  };

  handlePostComment = e => {
    this.setState({ comment: e.target.value });
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
    const {
      coinType,
      posts,
      favorite,
      postLoading,
      isFocus,
      isFocusComment
    } = this.state;
    const { news, me, isLogin } = this.props;
    return (
      <div className="postPage__content__chart__intro">
        <div className="postPage__content__chart__intro__post">
          <div className="postPage__content__chart__intro__post__header">
            <div className="postPage__content__chart__intro__post__header__userInfo">
              <div className="postPage__content__chart__intro__post__header__userInfo__thumb">
                <Thumb fontSize={35} size={50} />
              </div>
              <div className="postPage__content__chart__intro__post__header__userInfo__name">
                <strong>신현종</strong>
                <span className="postPage__content__chart__intro__post__header__userInfo__point">
                  27포인트
                </span>
              </div>
            </div>
            <div className="postPage__content__chart__intro__post__header__detail">
              <p>질문과답변</p>
              <span className="postPage__content__chart__intro__post__header__userInfo__point">
                123445
              </span>
            </div>
          </div>
          <div className="postPage__content__chart__intro__post__title">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
              eleifend maximus enim sit amet elementum. Curabitur accumsan porta
              metus non condimentum. Vestibulum egestas nibh quis tellus auctor,
              ac luctus tortor feugiat.
            </p>
          </div>
          <div className="postPage__content__chart__intro__post__body">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
              eleifend maximus enim sit amet elementum. Curabitur accumsan porta
              metus non condimentum. Vestibulum egestas nibh quis tellus auctor,
              ac luctus tortor feugiat.
            </p>
          </div>
          <div className="postPage__content__chart__intro__post__footer">
            <span className="postPage__content__chart__intro__post__footer__icon">
              <i className="far fa-thumbs-up" />
            </span>
            <span className="postPage__content__chart__intro__post__footer__icon">
              <i className="xi-eye" />
            </span>
          </div>
          <SocialInput
            user={me && me[0]}
            isLogin={isLogin}
            onChange={this.handleComment}
            placeholder="댓글을 입력하세요"
            onClick={this.handlePostComment}
            postText="등록"
            onFocus={this.onFocusComment}
            isFocus={isFocusComment}
          />
          <div className="postPage__content__chart__intro__comments" />
        </div>
      </div>
    );
  }
}

PostPage.defaultProps = defaultProps;
PostPage.propTypes = propTypes;

export default connect(mapStateToProps)(PostPage);
