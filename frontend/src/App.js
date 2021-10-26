import React from 'react';
import './App.scss';
import { Header } from './components';
import { Home, Auth } from './pages';
import { Route, Switch, BrowserRouter as Router, Redirect } from 'react-router-dom';

const HeaderComponent = (props) => <Header {...props} />;

const App = () => (
  <div id='app-container' className="app-container" data-testid='app-container'>
    <HeaderComponent />
    <div className='pages-container'>
      <Router basename='/'>
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/auth" component={Auth} />
          <Redirect from="/" to="/home" />
        </Switch>
      </Router>
    </div>
  </div>
);

export default App;
