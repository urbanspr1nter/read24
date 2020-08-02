import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Home from './pages/Home';
import AddBook from './pages/AddBook';
import Navigation from './components/Navigation';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <div className="container">
        <div className="row">
          <div className="col col-12">
            <Navigation />
          </div>
        </div>
        <div className="row">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/book/add">
              <AddBook />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
