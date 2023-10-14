import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';

function AppUI() {



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


function App() {

  return (
    <AppUI />

  );
}

export default App;
