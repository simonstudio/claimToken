import './App.css';
import { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import { withTranslation } from 'react-i18next';
import { loadSetting } from './store/Settings';
import { Web3Event, connectWeb3, getSigner } from './store/Web3';
import { connect } from 'react-redux';
import { log } from './std';
import { ReduxDispatchRespone } from './store';
import { notification } from 'antd';
import { TokenEvent, addContract, balanceOf, getInfo } from './store/Tokens';
import { setInfo } from './store/Infos';
import { Contract } from 'ethers';


const { error } = console;



declare global {
  interface Window {
    ethereum: any
    [name: string]: any
  }
}

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

    const { t, settings, getSigner, } = this.props;
    Web3Event.on("changed", async web3 => {
      await getSigner()
      this.initContracts()
    })

    TokenEvent.on("addContractSuccess", async (instance: Contract) => {
      const { t, settings, web3, accounts, setInfo } = this.props;
      let address = instance.target
      window.instance = instance

      if (address == settings.Token.address) {
        let token = {
          symbol: "Token",
          decimals: 1e18,
          name: "Token",
          totalSupply: 0,
        }
        token = {
          ...token,
          ...await getInfo(instance)
        }
        try {
          let balances = { ... await balanceOf([web3, instance], accounts[0].address), }
          setInfo({ balances })
        } catch (err) {
          error(err)
        }

        setInfo({ token })
      }
    })

    this.props.loadSetting()
  }

  initContracts(): void {
    let { t, web3, settings, } = this.props

    let { Token, Stake } = settings

    if (!web3)
      notification.error({ message: "", description: t("Web3 is not connected") })

    else if (Token && Stake) {
      let { addContract } = this.props;

      addContract(Token).then(async (r: ReduxDispatchRespone) => {
        if (r.error) {
          error(Token, r.error.message)
          return notification.error({ message: "", description: r.error.message });
        }
        let token = r.payload;
        this.setState({ token })
      })

      addContract(Stake).then(async (r: ReduxDispatchRespone) => {
        if (r.error) {
          error(Token, r.error.message)
          return notification.error({ message: "", description: r.error.message });
        }
        let stake = r.payload;
        this.setState({ stake })

      })

    } else {
      notification.error({ message: "", description: t("Settings was not loaded") })
    }
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
  getSigner: getSigner,
  loadSetting: loadSetting,
  setInfo: setInfo,
  addContract: addContract,
})(withTranslation()(App));

