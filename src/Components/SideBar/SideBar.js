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

const defaultProps = {};
const propTypes = {};

const mapStateToProps = state => {
  return {
    prices: state.reducer.prices
  };
};

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prices: null,
      showModal: false,
      coins: [],
      selectedCoin: []
    };
  }
  componentWillMount() {
    this.setState({ coins: this.props.coins });
  }

  componentDidMount() {}

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  };

  handleFavorite = () => {
    this.setState({});
  };

  render() {
    const { onClick, type, handleFavorite, coins, favorite } = this.props;
    // const { coins } = this.state;
    return (
      <div className="sideBar">
        <Modal
          isOpen={this.state.showModal}
          toggle={this.toggleModal}
          size="lg"
          modalTransition={{ timeout: 20 }}
          backdropTransition={{ timeout: 10 }}
          centered={true}
        >
          <ModalHeader>
            <div className="sideBar__modal__header">종목을 선택하세요</div>
          </ModalHeader>
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
                          onClick={() => handleFavorite(index, data.abbr)}
                        >
                          <div className="sideBar__modal__content__items_wrapper__item__abbr">
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
          <ModalFooter>등록</ModalFooter>
        </Modal>
        <div className="sideBar__content">
          <div className="sideBar__content__items">
            {favorite &&
              favorite
                .filter(a => {
                  return a.clicked === true;
                })
                .map((data, index) => {
                  if (data.loading === true) {
                    return (
                      <div className="sideBar__content__items__item">
                        <Sentry color="#ffffff" />
                      </div>
                    );
                  } else {
                    return (
                      <div
                        className={cx("sideBar__content__items__item", {
                          "sideBar__content__items__item-active":
                            type === data.abbr
                        })}
                        key={index}
                        onClick={() => onClick(data.abbr)}
                      >
                        <div className="sideBar__content__items__item__title">
                          {data.abbr}
                        </div>
                        <div className="sideBar__content__items__item__price">
                          {data.price}
                        </div>
                        {Number(data.percent) >= 0 ? (
                          <div className="sideBar__content__items__item__percent">
                            <span className="sideBar__content__items__item__percent__icon">
                              <i className="xi-arrow-up" />
                            </span>
                            {data.percent}%
                          </div>
                        ) : (
                          <div className="sideBar__content__items__item__percent-down">
                            <span className="sideBar__content__items__item__percent-down__icon">
                              <i className="xi-arrow-down" />
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
