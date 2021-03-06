// This Page is Skeleton of React Structure for Web Development
// If you want to make other page, Copy and Refactor this page.

import React, { Component } from "react";
import { connect } from "react-redux";
import { NavBar, List, SideBar, SocialInput, Footer } from "../../Components";
import { PostPage } from "../";
import { Route, Switch, withRouter } from "react-router-dom";
import { Dots } from "react-activity";
import * as PriceAction from "../../ActionCreators/PriceAction";
import * as SocialAction from "../../ActionCreators/SocialAction";
import { Modal, ModalBody } from "reactstrap";
import Loadable from "react-loading-overlay";
import categoryJson from "../../Json/category";
import { confirmAlert } from "react-confirm-alert";
import "react-activity/dist/react-activity.css";
import Logo from "../../Assests/Imgs/enhance_logo.png";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button
} from "reactstrap";
import cx from "classnames";
import { getBase64Image } from "../../Assests/Functions/function";

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

const sortFilter = [{ id: 1, name: "최신순" }, { id: 0, name: "인기순" }];

class ForumPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      typeDropDown: false,
      posts: [],
      favorite: [],
      sideFavorite: [],
      isFocus: false,
      isFocusComment: false,
      postLoading: false,
      isPostsLoading: false,
      forumLoading: false,
      filterCoins: [],
      footerLoading: true,
      title: "",
      main: "",
      endScroll: false,
      sort: 1,
      sortName: "최신순",
      showModal: false,
      selectedCoinType: [],
      selectedAbbr: [],
      selectedPostType: "전체",
      selectedPostType2: "자유",
      selectedIndex: null,
      forum: [],
      forumIndex: 0,
      postButton: "등록",
      editIndex: 0,
      editId: 0,
      imagePreview: [],
      search: "",
      loadGraph: false
    };
    this.toggle = this.toggle.bind(this);
  }

  componentWillMount() {
    const { isLogin } = this.props;
    const {
      forumIndex,
      selectedPostType,
      sort,
      filterCoins,
      search
    } = this.state;
    const params = {
      index: forumIndex,
      coins: filterCoins,
      order: sort,
      keyword: search,
      category: selectedPostType
    };
    this.setState({ isPostsLoading: true });
    this.props.dispatch(SocialAction.filterForums(params)).then(forums => {
      if (forums.result.length < 30) {
        this.setState({ endScroll: true });
      }
      let result = forums.result.map(function(el) {
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

  componentDidMount() {
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  toggleType = () => {
    this.setState(prevState => ({
      typeDropDown: !prevState.typeDropDown
    }));
  };

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
    const { selectedPostType, sort, search, filterCoins } = this.state;
    const requestCoins = this.state.filterCoins.slice();
    const newCoin = this.state.sideFavorite.slice();
    let result = newCoin.filter(a => {
      return a.clicked === true;
    });
    this.setState({ isPostsLoading: true, loadGraph : true });
    if (result[index].selected) {
      result[index].selected = false;
      result[index].loading = true;
      requestCoins.splice(requestCoins.indexOf(id), 1);
      this.setState({ sideFavorite: result });
      if (requestCoins.length === 0) {
        const params = {
          index: 0,
          coins: [],
          order: sort,
          keyword: search,
          category: selectedPostType
        };
        this.props.dispatch(SocialAction.filterForums(params)).then(forums => {
          result[index].loading = false;
          if (forums.result.length < 30) {
            this.setState({ endScroll: true });
          }
          let newForum = forums.result.map(function(el) {
            let o = Object.assign({}, el);
            o.loading = false;
            return o;
          });
          this.setState({
            posts: newForum,
            forumIndex: forums.nextIndex,
            sideFavorite: newCoin,
            filterCoins: requestCoins,
            isPostsLoading: false,
            loadGraph : false
          });
        });
      } else {
        const params = {
          index: 0,
          token: this.props.token,
          coins: requestCoins,
          category: selectedPostType,
          order: sort,
          keyword: this.state.search
        };
        this.props.dispatch(SocialAction.filterForums(params)).then(forums => {
          result[index].loading = false;
          this.setState({
            forumIndex: forums.nextIndex,
            posts: forums.result,
            sideFavorite: newCoin,
            filterCoins: requestCoins,
            isPostsLoading: false,
            loadGraph : false
          });
        });
      }
    } else {
      const params = {
        index: 0,
        token: this.props.token,
        coins: requestCoins,
        category: selectedPostType,
        order: sort,
        keyword: this.state.search
      };
      result[index].selected = true;
      result[index].loading = true;
      requestCoins.push(id);
      this.setState({ sideFavorite: result });
      this.props.dispatch(SocialAction.filterForums(params)).then(forums => {
        result[index].loading = false;
        this.setState({
          forumIndex: forums.nextIndex,
          posts: forums.result,
          sideFavorite: newCoin,
          filterCoins: requestCoins,
          isPostsLoading: false,
          loadGraph : false
        });
      });
    }
  };

  handleCategory = data => {
    const { filterCoins } = this.state;
    const params = {
      index: 0,
      category: data,
      token: this.props.token,
      order: this.state.sort,
      coins: filterCoins,
      keyword: this.state.search
    };
    this.setState({ isPostsLoading: true, selectedPostType: data });
    this.props.dispatch(SocialAction.filterForums(params)).then(forums => {
      this.setState({
        isPostsLoading: false,
        forumIndex: forums.nextIndex,
        posts: forums.result
      });
    });
  };

  handleSort = (id, data) => {
    const { filterCoins } = this.state;
    const params = {
      index: 0,
      category: this.state.selectedPostType,
      token: this.props.token,
      order: id,
      coins: filterCoins,
      keyword: this.state.search
    };
    this.setState({ isPostsLoading: true, sort: id, sortName: data });
    this.props.dispatch(SocialAction.filterForums(params)).then(forums => {
      this.setState({
        isPostsLoading: false,
        forumIndex: forums.nextIndex,
        posts: forums.result
      });
    });
  };

  handlePreview = file_arr => {
    const { token } = this.props;
    const { editId } = this.state;
    const params = { token, base64: file_arr[0].base64, forum_id: editId };
    this.setState({ postLoading : true });
    this.props.dispatch(SocialAction.uploadImage(params)).then(result => {
      let imagePreview = this.state.imagePreview.slice();
      for (let i = 0; i < file_arr.length; i++) {
        imagePreview.push(file_arr[i].base64);
      }
      this.setState({ imagePreview, postLoading: false });
    });
  };

  handleBadge = value => {
    const { token } = this.props;
    let result = value.split("/");
    const params = { token, key: result[4] };
    this.setState({ postLoading : true });
    this.props.dispatch(SocialAction.deleteImage(params)).then(result => {
      let imagePreview = this.state.imagePreview.slice();
      imagePreview.splice(imagePreview.indexOf(value), 1);
      this.setState({ imagePreview, postLoading: false });
    });
  };

  handleFavorite = (index, id, data) => {
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
      this.setState({ sideFavorite: coin, favorite, loadGraph: true });

      //즐겨찾기한 코인, 이름만 모으기
      let abbrArray = [];
      for (let i = 0; i < coin.length; i++) {
        if (coin[i].clicked === true) {
          abbrArray.push({ id: coin[i].id, abbr: coin[i].abbr });
        }
      }

      this.props.dispatch(PriceAction.addFav(params)).then(x => {
        this.props
          .dispatch(
            PriceAction.getPrice(
              abbrArray.map((a, index) => {
                return a.abbr;
              })
            )
          )
          .then(value => {
            for (let i = 0; i < coin.length; i++) {
              for (let j = 0; j < abbrArray.length; j++) {
                if (coin[i].abbr === abbrArray[j].abbr) {
                  coin[i].price = value[abbrArray[j].abbr].KRW.PRICE;
                  coin[i].percent =
                    value[abbrArray[j].abbr].KRW.CHANGEPCT24HOUR;
                }
              }
            }
            coin[index].loading = false;
            this.setState(state => ({ sideFavorite: coin, loadGraph: false }));
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
      this.setState({ posts: newPosts, selectedIndex: index });
      this.props.dispatch(SocialAction.getOneForum(params)).then(forum => {
        const images = forum.image.map((data, index) => {
          return { original: data.img_url };
        });
        this.props.dispatch(SocialAction.postForumView(params)).then(view => {
          const newPosts = this.state.posts.slice();
          const newForum = Object.assign({}, forum);
          if (view.message === "already View") {
            null;
          } else {
            newForum.view_cnt = newForum.view_cnt + 1;
            newPosts[index].view_cnt = newPosts[index].view_cnt + 1;
          }
          this.props
            .dispatch(SocialAction.getHateCheck(params))
            .then(result => {
              let isHate;
              if (result.message === "it's okay to dislike this forum") {
                isHate = false;
              } else {
                isHate = true;
              }

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
                    .dispatch(SocialAction.getOneForumCoins(params))
                    .then(coins => {
                      this.props
                        .dispatch(SocialAction.getOneForumComment(params))
                        .then(comment => {
                          newPosts[index].loading = false;
                          this.setState({ posts: newPosts });
                          this.props.history.push({
                            pathname: "/forum/" + id,
                            state: {
                              name: this.props.me.username,
                              forum: newForum,
                              comment: comment.reverse(),
                              images,
                              coins,
                              liked: isLiked,
                              hated: isHate
                            }
                          });
                        });
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
      selectedPostType2,
      imagePreview
    } = this.state;
    if (selectedCoinType.length === 0) {
      alert("해당하는 종목을 1개 이상 선택해주세요!");
    }
    else if (title === "" || main === "") {
      alert("제목 또는 본문을 입력하세요!");
    } else {
      let date = new Date();
      const coinArray = [];
      for (let i = 0; i < selectedAbbr.length; i++) {
        coinArray.push({ id: selectedCoinType[i], abbr: selectedAbbr[i] });
      }
      const params = {
        title,
        content: main,
        category: selectedPostType2,
        coins: selectedCoinType,
        created_at: date,
        token: this.props.token,
        base64: imagePreview
      };

      this.setState({ postLoading: true });
      this.props.dispatch(SocialAction.postForum(params)).then(id => {
        const params = {
          token: this.props.token,
          forum_id: id
        };

        let frontImages = imagePreview.map((data, index) => {
          return { img_url: data };
        });
        const frontParams = {
          title,
          id,
          content: main,
          category: selectedPostType2,
          coins: coinArray,
          created_at: date,
          updated_at: null,
          view_cnt: 0,
          like_cnt: 0,
          dislike_cnt: 0,
          username: this.props.me.username,
          me: this.props.me,
          images: frontImages
        };

        let images = imagePreview.map((data, index) => {
          return { original: data };
        });

        this.props.dispatch(SocialAction.getOneForum(params)).then(forum => {
          this.props
            .dispatch(SocialAction.getOneForumCoins(params))
            .then(async coins => {
              const newPosts = this.state.posts.slice();
              newPosts.splice(0, 0, frontParams);
              await this.props.history.push({
                pathname: "/forum/" + id,
                state: { forum, coins, comment: [], images }
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

  handleEditPost = () => {
    const {
      main,
      title,
      selectedCoinType,
      selectedAbbr,
      selectedPostType2,
      posts,
      editIndex,
      editId,
      imagePreview
    } = this.state;
    if (selectedCoinType.length === 0) {
      alert("해당하는 종목을 1개 이상 선택해주세요!");
    } else {
      let date = new Date();
      const coinArray = [];
      for (let i = 0; i < selectedAbbr.length; i++) {
        coinArray.push({ abbr: selectedAbbr[i], id: selectedCoinType[i] });
      }
      const params = {
        id: editId,
        title,
        content: main,
        category: selectedPostType2,
        coins: selectedCoinType,
        pic_list: imagePreview,
        created_at: date,
        token: this.props.token
      };
      this.setState({ postLoading: true });
      this.props.dispatch(SocialAction.editForum(params)).then(value => {
        const params = {
          token: this.props.token,
          forum_id: editId
        };
        //프론트 수정
        let newImages = imagePreview.map((data, index) => {
          return { original: data };
        });

        let frontImages = imagePreview.map((data, index) => {
          return { img_url: data };
        });

        const newPosts = posts.slice();
        const i = editIndex;
        newPosts[i].title = title;
        newPosts[i].main = main;
        newPosts[i].coins = coinArray;
        newPosts[i].category = selectedPostType2;
        newPosts[i].images = frontImages;
        newPosts[i].updated_at = date;

        this.props.dispatch(SocialAction.getOneForum(params)).then(forum => {
          this.props
            .dispatch(SocialAction.getOneForumCoins(params))
            .then(async coins => {
              await this.setState({
                title,
                main,
                posts: newPosts,
                postLoading: false,
                selectedIndex: editIndex
              });
              await this.toggleModal();
              await this.props.history.push({
                pathname: "/forum/" + editId,
                state: { forum, coins, comment: [], images: newImages }
              });
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
    let scrollTop = e.target.scrollTop;
    let docHeight = e.target.offsetHeight;
    let winHeight = e.target.scrollHeight;

    const {
      filterCoins,
      selectedPostType,
      search,
      sort,
      forumIndex
    } = this.state;

    const params = {
      index: forumIndex,
      category: selectedPostType,
      token: this.props.token,
      order: sort,
      coins: filterCoins,
      keyword: search
    };

    if (docHeight + scrollTop >= winHeight) {
      if (this.state.endScroll === false) {
        this.setState({ footerLoading: true });
        this.props.dispatch(SocialAction.filterForums(params)).then(forums => {
          if (forums.result.length < 30) {
            this.setState(prevState => ({
              endScroll: true,
              posts: [...prevState.posts, ...forums.result],
              footerLoading: false
            }));
          } else {
            this.setState(prevState => ({
              posts: [...prevState.posts, ...forums.result],
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

  handleEdit = async(title, main, coins, category, index, id, image) => {
    const { favorite } = this.state;

    let newFav = favorite.slice();
    newFav.map((data, index) => {
      data.clicked = false;
    });
    let type = [];
    let abbr = [];

    let preview = image.map((data, index) => {
      return data.img_url;
    });

    let resultImgArray = [];

    for (let i = 0; i < preview.length; i++) {
      resultImgArray.push(getBase64Image(preview[i]));
    }

    for (let i = 0; i < coins.length; i++) {
      for (let j = 0; j < newFav.length; j++) {
        if (coins[i].abbr === newFav[j].abbr) {
          newFav[j].clicked = true;
        }
      }
    }

    for (let i = 0; i < coins.length; i++) {
      abbr.push(coins[i].abbr);
      type.push(coins[i].id);
    }
    await this.setState({
      title,
      main,
      postButton: "수정",
      editIndex: index,
      editId: id,
      favorite: newFav,
      selectedAbbr: abbr,
      selectedCoinType: type,
      selectedPostType2: category,
      imagePreview: preview
    });
    await this.toggleModal();
  };

  handleDelete = async() => {
    await this.toggleModal();
    await confirmAlert({
      title: "포럼 삭제 확인",
      message: "정말 삭제 하시겠습니까?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            const { editId } = this.state;
            const { me } = this.props;

            const params = {
              token: this.props.token,
              forum_id: editId,
              flag: me && me.flag
            };

            const newPosts = this.state.posts.slice();

            let forumIndex;
            for (let i = 0; i < newPosts.length; i++) {
              if (newPosts[i].id === editId) {
                forumIndex = i;
              }
            }
            this.setState({ postLoading: true });
            this.props
              .dispatch(SocialAction.deleteForum(params))
              .then(result => {
                newPosts.splice(forumIndex, 1);
                this.setState({ posts: newPosts, postLoading: false });
                this.props.history.replace({
                  pathname: "/forum"
                });
              });
          }
        },
        {
          label: "No",
          onClick: () => null
        }
      ]
    });
  };

  handleOpenPost = async() => {
    const { favorite } = this.state;
    const newFav = favorite.slice();
    newFav.map((data, index) => {
      data.clicked = false;
    });

    await this.setState({
      title: "",
      main: "",
      postButton: "등록",
      selectedCoinType: [],
      selectedAbbr: [],
      selectedPostType2: "자유",
      imagePreview: [],
      favorite: newFav
    });
    await this.toggleModal();
  };

  handleSearchPost = () => {
    const params = {
      index: 0,
      category: this.state.selectedPostType,
      order: this.state.sort,
      coins: this.state.filterCoins,
      keyword: this.state.search
    };
    this.setState({ isPostsLoading: true });
    this.props.dispatch(SocialAction.filterForums(params)).then(news => {
      this.setState({
        forumIndex: news.nextIndex,
        posts: news.result,
        isPostsLoading: false
      });
    });
  };

  handleKeySearchPost = event => {
    if (event.key === "Enter") {
      const params = {
        index: 0,
        category: this.state.selectedPostType,
        order: this.state.sort,
        coins: this.state.filterCoins,
        keyword: this.state.search
      };
      this.setState({ isPostsLoading: true });
      this.props.dispatch(SocialAction.filterForums(params)).then(news => {
        this.setState({
          forumIndex: news.nextIndex,
          posts: news.result,
          isPostsLoading: false
        });
      });
    }
  };

  handleSearchBar = e => {
    this.setState({ search: e.target.value });
  };

  render() {
    const {
      posts,
      postLoading,
      isPostsLoading,
      isFocus,
      imagePreview,
      sort,
      sortName,
      selectedPostType,
      selectedPostType2,
      selectedIndex,
      favorite,
      footerLoading,
      sideFavorite,
      postButton,
      main,
      title,
      typeDropDown,
      loadGraph
    } = this.state;

    const { me, isLogin } = this.props;
    const categoryType = categoryJson.all;
    return (
      <div className="forumPage">
        <NavBar type="forum" />
        <SideBar
          isLogin={isLogin}
          multiple
          favorite={sideFavorite}
          onClick={this.handleFilter}
          handleFavorite={this.handleFavorite}
          loadGraph={loadGraph}
        />


        <Modal
          isOpen={this.state.showModal}
          toggle={this.toggleModal}
          size="lg"
          modalTransition={{ timeout: 20 }}
          backdropTransition={{ timeout: 10 }}
          // backdrop={false}
        >
          <Loadable active={postLoading} spinner text="처리중 입니다">
            <ModalBody>
              <div className="forumPage__modal">
                <SocialInput
                  user={me && me}
                  isTitle={true}
                  minRows={4}
                  maxRows={6}
                  showCamera
                  showType2
                  isLogin={isLogin}
                  onChange={this.handleMain}
                  onChangeTitle={this.handleTitle}
                  imagePreview={imagePreview}
                  placeholder="본문을 입력하세요"
                  onClick={
                    postButton === "수정"
                      ? this.handleEditPost
                      : this.handlePost
                  }
                  onClickLeft={this.handleDelete}
                  postText={postButton}
                  handleDelete={this.handleBadge}
                  handleBase={this.handlePreview}
                  handleType={this.handleType}
                  handleType2={this.handleType2}
                  postType={favorite}
                  selectedPostType2={selectedPostType2}
                  onFocus={this.onFocus}
                  isFocus={isFocus}
                  value={main}
                  titleValue={title}
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
                {imagePreview.map((data, index) => {
                  return (
                    <img ref={"base"} style={{ display: "none" }} src={data} />
                  );
                })}
              </div>
            </ModalBody>
          </Loadable>
        </Modal>
        <div className="forumPage__content">
          <div className="forumPage__content__news">
            <div className="forumPage__content__news__search">
              <div className="forumPage__content__news__search__first">
                <div className="forumPage__content__news__search__first__container">
                  <div className="forumPage__content__news__search__first__iconArea">
                    <span className="forumPage__content__news__search__first__iconArea__icon">
                      <i className="xi-search" />
                    </span>
                  </div>
                  <div className="forumPage__content__news__search__first__inputArea">
                    <input
                      className="forumPage__content__news__search__first__inputArea__input"
                      placeholder="무엇을 찾고싶으신가요?"
                      onChange={this.handleSearchBar}
                      onKeyPress={this.handleKeySearchPost}
                    />
                  </div>
                </div>
                <Button onClick={this.handleSearchPost} size="sm">
                  검색
                </Button>
              </div>
              <div className="forumPage__content__news__search__second">
                <div className="forumPage__content__news__search__second__content">
                  <div>
                    <ButtonDropdown
                      isOpen={this.state.dropdownOpen}
                      style={{
                        marginRight: 10,
                        backgroundColor: "transparent"
                      }}
                      toggle={this.toggle}
                      size="sm"
                      direction="down"
                    >
                      <DropdownToggle caret>{sortName}</DropdownToggle>
                      <DropdownMenu>
                        {sortFilter
                          .filter(a => {
                            return a.id !== sort;
                          })
                          .map((data, index) => {
                            return (
                              <DropdownItem
                                key={index}
                                onClick={() =>
                                  this.handleSort(data.id, data.name)
                                }
                              >
                                {data.name}
                              </DropdownItem>
                            );
                          })}
                      </DropdownMenu>
                    </ButtonDropdown>
                    <ButtonDropdown
                      isOpen={typeDropDown}
                      style={{
                        marginRight: 10,
                        backgroundColor: "transparent"
                      }}
                      toggle={this.toggleType}
                      size="sm"
                      direction="down"
                    >
                      <DropdownToggle caret>{selectedPostType}</DropdownToggle>
                      <DropdownMenu>
                        {categoryType
                          .filter(a => {
                            return a !== selectedPostType;
                          })
                          .map((data, index) => {
                            return (
                              <DropdownItem
                                key={index}
                                onClick={() => this.handleCategory(data)}
                              >
                                {data}
                              </DropdownItem>
                            );
                          })}
                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>

                  <Button onClick={this.handleOpenPost} size="sm">
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
                {posts.length === 0 ? (
                  <div className="forumPage__content__news__lists-nothing">
                    해당 하는 항목에 대한 글이 없습니다
                  </div>
                ) : null}
                {posts.map((data, index) => {
                  return (
                    <List
                      social
                      me={me && me}
                      index={index}
                      isLoading={data.loading}
                      selectedIndex={selectedIndex}
                      key={index}
                      isNews={false}
                      username={data.username}
                      title={data.title}
                      point={data.point}
                      likeCount={data.like_cnt}
                      disLikeCount={data.dislike_cnt}
                      createdAt={data.created_at}
                      updatedAt={data.updated_at}
                      type={data.coins}
                      view={data.view_cnt}
                      onClick={() => this.handleDetail(index, data.id)}
                      onEditClick={() =>
                        this.handleEdit(
                          data.title,
                          data.content,
                          data.coins,
                          data.category,
                          index,
                          data.id,
                          data.images
                        )
                      }
                      onDeleteClick={() => this.handleDelete(index, data.id)}
                    />
                  );
                })}
                {footerLoading && posts.length >= 30 ? (
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
                        <img width={45} height={45} src={Logo} />
                        <p className="forumPage__content__chart__intro__logo__text">
                          CoinHub
                        </p>
                      </div>
                      <div className="forumPage__content__chart__intro__welcome">
                        <p>
                          <strong>환영합니다. </strong>
                          {me && me.username + " 님"}
                        </p>
                        <p>
                          코인허브는 가상화폐와 블록체인 기술에 대한 정보를
                          실시간으로 모아서 한눈에 보기 쉽게 제공해 드리고
                          있습니다. 코인허브와 함께 가상화폐의 역사를 함께 하세요.
                        </p>
                      </div>
                      <div className="forumPage__content__chart__intro__desc">
                        <strong>코인허브 포럼</strong>
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
        <Footer/>
      </div>
    );
  }
}

ForumPage.defaultProps = defaultProps;
ForumPage.propTypes = propTypes;

export default withRouter(connect(mapStateToProps)(ForumPage));
