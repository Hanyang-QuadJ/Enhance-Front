// This Page is Skeleton of React Structure for Web Development
// If you want to make other page, Copy and Refactor this page.

import React, { Component } from "react";
import { connect } from "react-redux";
import { NavBar, Footer, SideBar } from "../../Components";
import { withRouter } from "react-router-dom";

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

class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="aboutPage">
        <NavBar />
        <SideBar isEmpty />
        <div className="aboutPage__content">
          <h5>새로운 시스템을 바라보는 다양한 시선: 그 모두를 위한 정보.</h5>
          <p>New system, different approaches: and the information for all.</p>
          <br />
          <p>
            신뢰가 필요 없고 경계가 없는 탈중앙화를(Decentralized) 명분으로
            세상에 암호화폐가 존재 해 온지 이미 수년이 지났습니다. 세상은 이런
            가치 있는 시스템을 각기 다른 시선으로 바라보고 있습니다. 충분한
            미래가치를 기대하여 투자를 하는 시선들, 가격이 오르고 수익을 낼 수
            있다는 이유로 발을 들인 "투기"가치로 보는 시선들, 그리고 가상화폐는
            진정 화폐의 가치가 없다고 생각하여 “폰지사기”와 연관 짓는 시선들. 그
            누구 하나 옳고 틀린 것이 아닌, 새로운 개념과 기술에 모두가 충분히
            취할 수 있는 시선들 입니다. 어떠한 시선으로 가상화폐 시대를
            받아들일지는 코인허브의 정보를 통하여 결정하십시오.
          </p>
          <br />
          <p>
            코인허브의 최고 수준의 정보로 당신의 투자에 대한 믿음을 높이십시오.
          </p>
          <p>
            Enhance your belief in your investment with our top-notch
            information.
          </p>
          <br />
          <p>
            코인허브의 정보는 편파되어 있지 않습니다. 그리고 앞으로도 계속,
            다양한 시선의 독자들을 위하여 최대한 객관적인 정보매체로 남기 위해
            노력할 것 입니다. 코인허브는 독자에게 빠르고 정확한 정보를 전달하는
            것이 목표입니다. 최고 수준의 정보로 가상화폐를 바라보는 개개인의
            시선에 대하여 신뢰를 쌓아가도록 도움을 드리겠습니다.
          </p>
          <br />
          <h5>Contact</h5>
          <p>문의 메일 : coinhub@email.com</p>
          <p>광고 문의 : coinhubads@email.com</p>
        </div>
        <Footer type="about" />
      </div>
    );
  }
}

AboutPage.defaultProps = defaultProps;
AboutPage.propTypes = propTypes;

export default withRouter(connect(mapStateToProps)(AboutPage));
