import React from 'react';
import './App.css';
import { Header } from './components';
import { Home } from './pages';
import { Route, Switch, BrowserRouter as Router, Redirect } from 'react-router-dom';

const HeaderComponent = (props) => <Header {...props} />;

const App = () => (
  <div id='app-container' className="app-container" data-testid='app-container'>
    <HeaderComponent />
    <div className='pages-container'>
      <Router basename='/'>
        <Switch>
          <Route path="/home" component={Home} />
          <Redirect from="/" to="/home" />
        </Switch>
      </Router>
    </div>
  </div>
);

export default App;
