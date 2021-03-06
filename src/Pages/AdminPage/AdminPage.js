// This Page is Skeleton of React Structure for Web Development
// If you want to make other page, Copy and Refactor this page.

import React, { Component } from "react";
import { connect } from "react-redux";
import { NavBar, SideBar, Thumb, Button, RoundInput } from "../../Components";
import { withRouter } from "react-router-dom";
import * as PriceAction from "../../ActionCreators/PriceAction";
import * as SocialAction from "../../ActionCreators/SocialAction";
import * as AuthAction from "../../ActionCreators/AuthAction";
import "react-activity/dist/react-activity.css";
import { Modal, ModalBody } from "reactstrap";
import cx from "classnames";
import Loadable from "react-loading-overlay";
import { confirmAlert } from "react-confirm-alert";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import FileInputComponent from "react-file-input-previews-base64";
import Notifications, { notify } from "react-notify-toast";

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

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postLoading: false,
      forumLoading: false,
      showModal: false,
      sideFavorite: [],
      posts: [],
      crop: { aspect: 16 / 9 },
      isUploading: false,
      comments: [],
      favorite: [],
      showCrop: false,
      username: "",
      keyword: "",
      kor: "",
      full: "",
      coin: "",
      abbr: "",
      croppedImg: "",
      targetImg: "",
      targetImgFile: null,
      emailValid: true,
      usernameValid: true
    };
  }

  componentWillMount() {
    const { me, token, isLogin } = this.props;
    if (isLogin) {
      if (me.flag !== 1) {
        this.props.history.replace({ pathname: "/" });
      } else {
        this.setState({ email: me.email, username: me.username });
        const params = { user_id: me.id, token };
        this.props
          .dispatch(SocialAction.getForumByUser(params))
          .then(forums => {
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
                  comments: commentResult
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
                        this.setState({
                          favorite: result,
                          sideFavorite: resultSide
                        });

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
                                  final[i].price =
                                    value[abbrArray[j].abbr].KRW.PRICE;
                                  final[i].percent =
                                    value[
                                      abbrArray[j].abbr
                                    ].KRW.CHANGEPCT24HOUR;
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
    } else {
      this.props.history.replace({ pathname: "/auth" });
    }
  }

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  };

  handleCoin = e => {
    this.setState({ coin: e.target.value });
  };

  handleKor = e => {
    this.setState({ kor: e.target.value });
  };

  handleFull = e => {
    this.setState({ full: e.target.value });
  };

  handleAbbr = e => {
    this.setState({ abbr: e.target.value });
  };

  handleKeyword = e => {
    this.setState({ keyword: e.target.value });
  };

  handleUsername = e => {
    this.setState({ username: e.target.value });
  };

  handleCurrentPassword = e => {
    this.setState({ c_password: e.target.value });
  };

  handleDeleteUser = () => {
    const { token } = this.props;
    const { username } = this.state;
    const params = { token, username };
    this.props.dispatch(AuthAction.deleteUser(params)).then(value => {
      notify.show("유저가 삭제되었습니다");
    });
  };

  handlePostCoin = () => {
    const { token } = this.props;
    const { kor, abbr, full, keyword } = this.state;
    const params = { kor, full, abbr, keyword, token };
    this.props.dispatch(AuthAction.postCoin(params)).then(value => {
      notify.show("코인이 등록되었습니다");
    });
  };

  _crop = () => {
    this.setState({
      croppedImg: this.refs.cropper.getCroppedCanvas().toDataURL()
    });
  };

  handleFile = e => {
    this.setState({ targetImg: e[0].base64, showCrop: true });
  };

  handleDeleteCoin = () => {
    const { token } = this.props;
    const { coin } = this.state;
    const params = { token, abbr: coin };
    this.props.dispatch(AuthAction.deleteCoin(params)).then(result => {
      notify.show("코인이 삭제되었습니다");
    });
  };

  handleEditImage = () => {
    const { token } = this.props;
    const { croppedImg } = this.state;
    const params = { token, base64: croppedImg };
    this.setState({ isUploading: true });
    this.props.dispatch(AuthAction.updateProfile(params)).then(result => {
      this.setState({ isUploading: false });
      this.toggleModal();
    });
  };

  handleSignOut = () => {
    confirmAlert({
      title: "로그아웃 확인",
      message: "정말 로그아웃 하시겠습니까?",
      buttons: [
        {
          label: "확인",
          onClick: () => {
            this.props.dispatch(AuthAction.signOut()).then(value => {
              this.props.history.replace({
                pathname: "/auth"
              });
            });
          }
        },
        {
          label: "취소",
          onClick: () => null
        }
      ]
    });
  };

  render() {
    const {
      posts,
      comments,
      favorite,
      sideFavorite,
      postLoading,
      isUploading,
      showCrop,
      usernameValid,
      emailValid
    } = this.state;
    const { me } = this.props;

    return (
      <div className="settingsPage">
        <NavBar type="admin" />
        <Notifications />
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
              <div className="settingsPage__modal">
                <div className="settingsPage__modal__left">
                  <FileInputComponent
                    parentStyle={{ margin: 0, textAlign: "center" }}
                    labelText="Select file"
                    labelStyle={{ fontSize: 14 }}
                    labelStyle={{ display: "none", margin: 0 }}
                    multiple={true}
                    callbackFunction={this.handleFile}
                    imagePreview={false}
                    buttonComponent={
                      showCrop ? (
                        <span className="socialInput__footer__camera__icon">
                          <i className="xi-camera" />
                        </span>
                      ) : (
                        <Thumb
                          src={me && me.profile_img}
                          fontSize={80}
                          size={100}
                        />
                      )
                    }
                    accept="image/*"
                  />
                  {showCrop ? (
                    <Cropper
                      ref="cropper"
                      src={this.state.targetImg}
                      style={{ height: 200, width: "50%" }}
                      // Cropper.js options
                      aspectRatio={1}
                      guides={false}
                      crop={this._crop}
                    />
                  ) : null}
                </div>
                <div className="settingsPage__modal__right">
                  <br />
                  <img
                    src={this.state.croppedImg}
                    width={200}
                    height={200}
                    className="settingsPage__modal__cropImage"
                    style={showCrop ? null : { display: "none" }}
                  />
                  {showCrop ? (
                    <Button
                      text="수정하기"
                      width={90}
                      isLoading={isUploading}
                      height={30}
                      marginTop={10}
                      onClick={this.handleEditImage}
                    />
                  ) : (
                    "프로필을 클릭해 이미지를 수정하세요"
                  )}
                </div>
              </div>
            </ModalBody>
          </Loadable>
        </Modal>
        <div className="settingsPage__content">
          <div className="settingsPage__content__news">
            <div className="settingsPage__content__news__search">
              <div className="settingsPage__content__news__search__first">
                <div className="settingsPage__content__news__search__first__iconArea">
                  <span className="settingsPage__content__news__search__first__iconArea__icon">
                    <i className="xi-cog" />
                  </span>
                </div>
                <div className="settingsPage__content__news__search__first__inputArea">
                  관리자 페이지
                </div>
              </div>
            </div>
            <div className="settingsPage__content__news__lists">
              <div className="settingsPage__content__news__lists__content">
                <br />
                <RoundInput
                  placeholder="삭제하고자하는 유저 네임을 입력하세요"
                  onChange={this.handleUsername}
                />
                <Button
                  text="삭제하기"
                  width={90}
                  height={30}
                  marginTop={10}
                  onClick={this.handleDeleteUser}
                />
              </div>
              <div className="settingsPage__content__news__lists__content">
                <br />
                <RoundInput
                  placeholder="삭제하고자하는 코인 약자를 입력하세요"
                  onChange={this.handleCoin}
                />
                <Button
                  text="삭제하기"
                  width={90}
                  height={30}
                  marginTop={10}
                  onClick={this.handleDeleteCoin}
                />
              </div>
              <br />
              <br />
              <div className="settingsPage__content__news__lists__content">
                <RoundInput
                  placeholder="한글 이름을 입력하세요 ex)비트코인"
                  onChange={this.handleKor}
                />
                <br />
                <RoundInput
                  placeholder="영어 풀네임을 입력하세요 ex)BitCoin"
                  onChange={this.handleFull}
                />
                <br />
                <RoundInput
                  placeholder="약자를 입력하세요 ex)BTC"
                  onChange={this.handleAbbr}
                />
                <br />
                <RoundInput
                  placeholder="검색어 키워드를 입력하세요 ex)비트코인"
                  onChange={this.handleKeyword}
                />
                <br />
                <Button
                  text="등록하기"
                  width={90}
                  height={30}
                  marginTop={10}
                  onClick={this.handlePostCoin}
                />
              </div>
            </div>
          </div>
          <div className="settingsPage__content__chart">
            <div className="settingsPage__content__chart__intro">
              <div className="settingsPage__content__chart__intro">
                <div className="settingsPage__content__chart__intro__content">
                  <Thumb
                    src={me && me.profile_img}
                    fontSize={75}
                    size={90}
                    point={me && me.point}
                  />
                  <p className="settingsPage__content__chart__intro__content__username">
                    {me && me.username}
                  </p>
                  <div className="settingsPage__content__chart__intro__content__area">
                    <p className="settingsPage__content__chart__intro__content__area__number-border">
                      {me && me.point}
                      <span className="settingsPage__content__chart__intro__content__area__text">
                        포인트
                      </span>
                    </p>
                    <p className="settingsPage__content__chart__intro__content__area__number-border">
                      {posts.length}
                      <span className="settingsPage__content__chart__intro__content__area__text">
                        게시물
                      </span>
                    </p>
                    <p className="settingsPage__content__chart__intro__content__area__number">
                      {comments.length}
                      <span className="settingsPage__content__chart__intro__content__area__text">
                        댓글
                      </span>
                    </p>
                  </div>

                  <div className="settingsPage__content__chart__intro__content__coins">
                    {favorite.map((data, index) => {
                      return (
                        <div
                          key={index}
                          className="settingsPage__content__chart__intro__content__coins__coin"
                        >
                          {data.abbr}
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    text="사진 수정"
                    width={100}
                    height={40}
                    marginBottom={10}
                    onClick={this.toggleModal}
                  />
                  <Button
                    text="로그아웃"
                    width={100}
                    height={40}
                    marginBottom={10}
                    onClick={this.handleSignOut}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AdminPage.defaultProps = defaultProps;
AdminPage.propTypes = propTypes;

export default withRouter(connect(mapStateToProps)(AdminPage));
