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

class SettingsPage extends Component {
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
      email: "",
      username: "",
      c_password: "",
      password: "",
      confirmPassword: "",
      croppedImg: "",
      targetImg: "",
      targetImgFile: null
    };
  }

  componentWillMount() {
    const { me, token } = this.props;
    this.setState({ email: me.email, username: me.username });
    const params = { user_id: me.id, token };
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

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  };

  handleEmail = e => {
    this.setState({ email: e.target.value });
  };

  handlePassword = e => {
    this.setState({ password: e.target.value });
  };

  handleConfirmPassword = e => {
    this.setState({ confirmPassword: e.target.value });
  };

  handleUsername = e => {
    this.setState({ username: e.target.value });
  };

  handleCurrentPassword = e => {
    this.setState({ c_password: e.target.value });
  };

  handleEditPassword = () => {
    const { token } = this.props;
    const { password, confirmPassword, c_password } = this.state;
    const params = { old_password: c_password, new_password: password, token };
    this.props.dispatch(AuthAction.updatePassword(params));
  };

  handleEditUsername = () => {
    const { token } = this.props;
    const { username, email } = this.state;
    const params = { token, username, email };
    console.log(params);
    this.props.dispatch(AuthAction.updateUsername(params)).then(result => {});
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

  _crop = () => {
    this.setState({
      croppedImg: this.refs.cropper.getCroppedCanvas().toDataURL()
    });
  };

  handleFile = e => {
    this.setState({ targetImg: e[0].base64, showCrop: true });
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
      showCrop
    } = this.state;
    const { me } = this.props;

    return (
      <div className="settingsPage">
        <NavBar type="auth" />
        <SideBar
          favorite={sideFavorite && sideFavorite}
          handleFavorite={this.handleFavorite}
        />
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
                  회원정보 수정
                </div>
              </div>
            </div>
            <div className="settingsPage__content__news__lists">
              <div className="settingsPage__content__news__lists__content">
                <RoundInput
                  value={me && me.email}
                  onChange={this.handleEmail}
                />
              </div>
              <br />
              <div className="settingsPage__content__news__lists__content">
                <RoundInput
                  value={me && me.username}
                  onChange={this.handleUsername}
                />
                <Button
                  text="수정하기"
                  width={90}
                  height={30}
                  marginTop={10}
                  onClick={this.handleEditUsername}
                />
              </div>
              <br />
              <br />
              <div className="settingsPage__content__news__lists__content">
                <RoundInput
                  placeholder="현재 비밀번호를 입력하세요"
                  type="password"
                  onChange={this.handleCurrentPassword}
                />
                <br />
                <RoundInput
                  placeholder="새로운 비밀번호를 입력하세요"
                  type="password"
                  onChange={this.handlePassword}
                />
                <br />
                <RoundInput
                  placeholder="비밀번호 확인"
                  type="password"
                  onChange={this.handleConfirmPassword}
                />
                <Button
                  text="수정하기"
                  width={90}
                  height={30}
                  marginTop={10}
                  onClick={this.handleEditPassword}
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

SettingsPage.defaultProps = defaultProps;
SettingsPage.propTypes = propTypes;

export default withRouter(connect(mapStateToProps)(SettingsPage));
