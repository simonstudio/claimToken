import './App.css';
import { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import { withTranslation } from 'react-i18next';
import { loadSetting } from './store/Settings';
import { connectWeb3 } from './store/Web3';
import { connect } from 'react-redux';
import { log } from './std';
import { ReduxDispatchRespone } from './store';
import { notification } from 'antd';

type Props = {
  [name: string]: any,
}
type State = {
  [name: string]: any,
}


class App extends Component<Props> {
  state: State = {
    count: 0,
  };
  componentDidMount(): void {
    notification.config({
      placement: 'bottomLeft',
    });

    this.props.loadSetting().then((r: ReduxDispatchRespone) => {
      // log(r.payload)
    });
  }

  render() {
    return (<>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AppLayout />}>
            <Route index path='/' element={<HomePage />} />
            <Route index path='/dashboard' element={<DashboardPage />} />
          </Route>
          <Route
            path="*"
            element={
              <div>
                <h2>404 Page not found</h2>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </>);
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  web3: state.Web3.web3,
  accounts: state.Web3.accounts,
  chainId: state.Web3.chainId,
  chainName: state.Web3.chainName,
  settings: state.Settings,
});

export default connect(mapStateToProps, {
  connectWeb3: connectWeb3,
  loadSetting: loadSetting,
})(withTranslation()(App));

