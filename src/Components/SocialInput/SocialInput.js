// This Component is Skeleton of React Structure for Web Development
// If you want to make other Component, Copy and Refactor this Component.

import React, { Component } from "react";
import Textarea from "react-textarea-autosize";
import Badge from "material-ui/Badge";
import { Thumb, RoundInput } from "../";
import categoryJson from "../../Json/category";
import FileInputComponent from "react-file-input-previews-base64";
import cx from "classnames";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

const defaultProps = {};
const propTypes = {};

class SocialInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagePreview: [],
      dropdownOpen: false,
      dropdownOpen2: false
    };
  }

  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  };

  toggle2 = () => {
    this.setState(prevState => ({
      dropdownOpen2: !prevState.dropdownOpen2
    }));
  };

  handlePostType = type => {
    this.setState({ selectedPostType: type });
  };

  handlePreview = file_arr => {
    let imagePreview = this.state.imagePreview.slice();
    for (let i = 0; i < file_arr.length; i++) {
      imagePreview.push(file_arr[i].base64);
    }
    this.setState({ imagePreview });
  };

  handleBadge = value => {
    let imagePreview = this.state.imagePreview.slice();
    imagePreview.splice(imagePreview.indexOf(value), 1);
    this.setState({ imagePreview });
  };

  render() {
    const category = categoryJson.category;
    const {
      user,
      isLogin,
      showCamera,
      showType,
      onChange,
      placeholder,
      handleBase,
      handleType,
      handleType2,
      selectedPostType,
      imagePreview,
      handleDelete,
      onClick,
      onClickLeft,
      value,
      className,
      postType,
      postText,
      onFocus,
      titleValue,
      isFocus,
      minRows,
      maxRows,
      isTitle,
      onKeyPress,
      onChangeTitle,
      showType2,
      selectedPostType2
    } = this.props;
    return (
      <div className={cx("socialInput", className)}>
        <div className="socialInput__body">
          <div className="socialInput__body__thumbArea">
            <Thumb
              size={50}
              src={user && user.profile_img}
              point={user && user.point}
            />
          </div>
          <div className="socialInput__body__inputArea">
            {isTitle ? (
              <input
                className="socialInput__body__input-title"
                placeholder="제목"
                value={titleValue}
                onChange={onChangeTitle}
              />
            ) : null}
            <Textarea
              minRows={minRows}
              maxRows={maxRows}
              value={value}
              onChange={e => onChange(e)}
              onFocus={onFocus}
              onBlur={onFocus}
              onKeyPress={onKeyPress}
              placeholder={isLogin === true ? placeholder : "가입하세요"}
              className="socialInput__body__input"
            />
          </div>
        </div>
        <hr
          className={cx("socialInput__hr", {
            "socialInput__hr-active": isFocus
          })}
        />
        <div className="socialInput__footer">
          {showCamera === true ? (
            <div className="socialInput__footer__camera">
              <FileInputComponent
                parentStyle={{ margin: 0 }}
                labelStyle={{ display: "none", margin: 0 }}
                imagePreview={false}
                buttonComponent={
                  <span className="socialInput__footer__camera__icon">
                    <i className="xi-camera" />
                  </span>
                }
                multiple={true}
                callbackFunction={handleBase}
                accept="image/*"
              />
            </div>
          ) : null}

          <div className="socialInput__footer__postArea">
            {showType === true ? (
              <ButtonDropdown
                isOpen={this.state.dropdownOpen}
                style={{ marginRight: 10 }}
                toggle={this.toggle}
                size="sm"
                direction="down"
              >
                <DropdownToggle caret>{selectedPostType}</DropdownToggle>
                <DropdownMenu>
                  {postType
                    .filter(a => {
                      return a.abbr !== selectedPostType;
                    })
                    .map((data, index) => {
                      return (
                        <DropdownItem
                          key={index}
                          onClick={() => handleType(index, data.abbr)}
                        >
                          {data.abbr}
                        </DropdownItem>
                      );
                    })}
                </DropdownMenu>
              </ButtonDropdown>
            ) : null}
            {showType2 ? (
              <ButtonDropdown
                isOpen={this.state.dropdownOpen2}
                style={{ marginRight: 10 }}
                toggle={this.toggle2}
                size="sm"
                direction="down"
              >
                <DropdownToggle caret>{selectedPostType2}</DropdownToggle>
                <DropdownMenu>
                  {category
                    .filter(a => {
                      return a !== selectedPostType2;
                    })
                    .map((data, index) => {
                      return (
                        <DropdownItem
                          key={index}
                          onClick={() => handleType2(index, data)}
                        >
                          {data}
                        </DropdownItem>
                      );
                    })}
                </DropdownMenu>
              </ButtonDropdown>
            ) : null}

            {postText === "수정" ? (
              <span
                onClick={onClickLeft}
                className="socialInput__footer__postArea__postButton"
              >
                삭제
              </span>
            ) : null}

            <span
              onClick={onClick}
              className="socialInput__footer__postArea__postButton"
            >
              {postText}
            </span>
          </div>
        </div>
        <div className="socialInput__footer__imagePreview">
          {imagePreview && imagePreview.length === 0
            ? null
            : imagePreview &&
              imagePreview.map((data, index) => {
                return (
                  <Badge
                    key={index}
                    badgeContent={
                      <i className="xi-minus-min" style={{ fontSize: 20 }} />
                    }
                    primary={true}
                    badgeStyle={{ top: 12, right: 12, cursor: "pointer" }}
                    onClick={() => handleDelete(data)}
                  >
                    <img
                      className="socialInput__footer__imagePreview__image"
                      src={data}
                    />
                  </Badge>
                );
              })}
        </div>
      </div>
    );
  }
}

SocialInput.defaultProps = defaultProps;
SocialInput.propTypes = propTypes;

export default SocialInput;
