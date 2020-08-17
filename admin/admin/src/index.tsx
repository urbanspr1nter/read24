import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Home from './pages/Home/Home';
import AddBook from './pages/AddBook/AddBook';
import Navigation from './components/Navigation';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import ListBooks from './pages/ListBooks/ListBooks';
import EditBook from './pages/EditBook/EditBook';
import AddClassroom from './pages/AddClassroom/AddClassroom';
import ListClassrooms from './pages/ListClassrooms/ListClassrooms';
import EditClassroom from './pages/EditClassroom/EditClassroom';
import AddUser from './pages/AddUser/AddUser';
import AddTeacher from './pages/AddTeacher/AddTeacher';
import ListTeachers from './pages/ListTeachers/ListTeachers';
import EditTeacher from './pages/EditTeacher/EditTeacher';

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
            <Route path="/book/list">
              <ListBooks />
            </Route>
            <Route path="/book/edit/:id" component={EditBook} />
            <Route path="/classroom/add">
              <AddClassroom />
            </Route>
            <Route path="/classroom/list">
              <ListClassrooms />
            </Route>
            <Route path="/classroom/edit/:id" component={EditClassroom} />
            <Route path="/user/add">
              <AddUser />
            </Route>
            <Route path="/teacher/add">
              <AddTeacher />
            </Route>
            <Route path="/teacher/list">
              <ListTeachers />
            </Route>
            <Route path="/teacher/edit/:id" component={EditTeacher} />
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
