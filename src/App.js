import React from 'react';
import { withTranslation } from 'react-i18next';
import { ConfigProvider, Layout, Space, notification, theme } from 'antd';
import { Content, } from 'antd/es/layout/layout';
import { connect } from 'react-redux';
import Claim from './com/Claim';
import { SettingsEvent, loadSetting } from './store/Settings';


import './App.css';
import { connectWeb3 } from './store/Web3';

const contentStyle = {
  color: "#fff",
  backgroundColor: "#18141a",

};

const footerStyle = {
};

class App extends React.Component {
  state = {
  }

  componentDidMount() {
    let { t, i18n, settings, loadSetting } = this.props;
    // i18n.changeLanguage("en");
    i18n.changeLanguage(settings.language)

    SettingsEvent.on("changed", settings => {
      i18n.changeLanguage(settings.language)
    })

    loadSetting().then(r => {
      if (r.error) {
        console.error(r.error)
        // notification.error({ message: t(r.error.message) })
      } else {  }
    })
  }



  render() {
    let { t, settings } = this.props

    return (<ConfigProvider theme={{ algorithm: theme.darkAlgorithm, }} >

      <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
        <Layout>
          {/* <Header /> */}
          <Content style={contentStyle}>
            <Claim />
          </Content>

          {/* <Footer style={footerStyle}>Footer</Footer> */}

        </Layout>

      </Space>

    </ConfigProvider>)
  }
}


const mapStateToProps = (state, ownProps) => ({
  web3: state.Web3.web3,
  accounts: state.Web3.accounts,
  chainId: state.Web3.chainId,
  chainName: state.Web3.chainName,
  settings: state.Settings.settings,
});

export default connect(mapStateToProps, {
  connectWeb3: connectWeb3,
  loadSetting: loadSetting,
})(withTranslation()(App));

