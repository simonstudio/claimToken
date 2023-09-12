import React from 'react';
import { withTranslation } from 'react-i18next';
import { ConfigProvider, DatePicker, Layout, Space, theme } from 'antd';
import Header from './com/Header';
import './App.css';
import { Content, Footer } from 'antd/es/layout/layout';
import { connect } from 'react-redux';
import Claim from './com/Claim';

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
    let { t, i18n } = this.props;
    i18n.changeLanguage("vi");
  }

  render() {
    let { t } = this.props

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

});

export default connect(mapStateToProps, {

})(withTranslation()(App));

