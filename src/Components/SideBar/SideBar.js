// This Component is Skeleton of React Structure for Web Development
// If you want to make other Component, Copy and Refactor this Component.

import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as PriceAction from "../../ActionCreators/PriceAction";
import cx from "classnames";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { Sentry } from "react-activity";
import "react-activity/dist/react-activity.css";
import Loadable from "react-loading-overlay";

const defaultProps = {};
const propTypes = {};

const mapStateToProps = state => {
  return {
    prices: state.reducer.prices,
    isLogin: state.reducer.isLogin
  };
};

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prices: null,
      showModal: false,
      selectedCoin: []
    };
  }

  componentDidMount() {}

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

  handleFavorite = () => {
    this.setState({});
  };

  render() {
    const {
      onClick,
      type,
      handleFavorite,
      favorite,
      loadGraph,
      multiple
    } = this.props;
    return (
      <div className="sideBar">
        <Modal
          isOpen={this.state.showModal}
          toggle={this.toggleModal}
          size="lg"
          modalTransition={{ timeout: 20 }}
          backdropTransition={{ timeout: 10 }}
          centered={true}
          // backdrop={false}
        >
          <ModalHeader>
            <div className="sideBar__modal__header">종목을 선택하세요</div>
          </ModalHeader>
          <Loadable active={loadGraph} spinner text="데이터 생성중 입니다">
            <ModalBody>
              <div className="sideBar__modal">
                <div className="sideBar__modal__content">
                  <div className="sideBar__modal__content__items">
                    {favorite.map((data, index) => {
                      return (
                        <div
                          key={index}
                          className="sideBar__modal__content__items__wrapper"
                        >
                          <div
                            className={cx(
                              "sideBar__modal__content__items__wrapper__item",
                              {
                                "sideBar__modal__content__items__wrapper__item-active":
                                  data.clicked === true
                              }
                            )}
                            onClick={() =>
                              handleFavorite(index, data.id, data.abbr)
                            }
                          >
                            <div className="sideBar__modal__content__items__wrapper__item__abbr">
                              {data.abbr}
                            </div>
                            <div className="sideBar__modal__content__items__wrapper__item__full">
                              {data.full}
                            </div>
                            <div className="sideBar__modal__content__items__wrapper__item__kor">
                              <p>{data.kor}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </ModalBody>
          </Loadable>

          <ModalFooter>
            <span className="sideBar__modal__close" onClick={this.toggleModal}>
              닫기
            </span>
          </ModalFooter>
        </Modal>
        <div className="sideBar__content">
          <div className="sideBar__content__items">
            {favorite &&
              favorite
                .sort((a, b) => {
                  if (a.abbr < b.abbr) return -1;
                  if (a.abbr > b.abbr) return 1;
                  return 0;
                })
                .filter(a => {
                  return a.clicked === true;
                })
                .map((data, index) => {
                  if (data.loading === true) {
                    return (
                      <div
                        key={index}
                        className="sideBar__content__items__item"
                      >
                        <div style={{ marginTop: 10, marginBottom: 10 }}>
                          <Sentry color="#ffffff" />
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        className={
                          multiple
                            ? cx(
                              "sideBar__content__items__item",
                              {
                                "sideBar__content__items__item-active":
                                    data.selected === true
                              },
                              {
                                "sideBar__content__items__item-disable":
                                    loadGraph === true
                              }
                            )
                            : cx(
                              "sideBar__content__items__item",
                              {
                                "sideBar__content__items__item-active":
                                    type === data.abbr
                              },
                              {
                                "sideBar__content__items__item-disable":
                                    loadGraph === true
                              }
                            )
                        }
                        key={index}
                        onClick={() => onClick(index, data.id, data.abbr)}
                      >
                        <div className="sideBar__content__items__item__title">
                          {data.abbr}
                        </div>
                        <div className="sideBar__content__items__item__price">
                          {data.price}
                        </div>
                        {Number(data.percent) < 0 ? (
                          <div className="sideBar__content__items__item__percent-down">
                            <span className="sideBar__content__items__item__percent-down__icon">
                              <i className="xi-arrow-down" />
                            </span>
                            {data.percent}%
                          </div>
                        ) : (
                          <div className="sideBar__content__items__item__percent">
                            <span className="sideBar__content__items__item__percent__icon">
                              <i className="xi-arrow-up" />
                            </span>
                            {data.percent}%
                          </div>
                        )}
                      </div>
                    );
                  }
                })}
            <div
              className="sideBar__content__items__item"
              onClick={this.toggleModal}
            >
              <span className="sideBar__content__items__item-plus">
                <i className="xi-plus" />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SideBar.defaultProps = defaultProps;
SideBar.propTypes = propTypes;

export default withRouter(connect(mapStateToProps)(SideBar));
