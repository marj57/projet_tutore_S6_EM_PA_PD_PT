import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import Home from './Pages/Home';
import AddForm from './Pages/Add';
import Recette  from './Pages/Recette';

class Layout extends Component {
  render() {
    return (
        <Router>
            <div>  
                <div className="row header justify-content-center">
                    <Link to="/"><img className="logo-title" src="./img/Logo.png" alt="Logo du Site"/></Link>
                </div>
                <div className="row">
                    <div className="col-1">
                        <nav className="nav flex-column navbar">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link to="/add"><i className="fas fa-plus fa-3x"></i></Link>
                            </li>
                        </ul>
                        </nav>
                    </div>
                </div>
                <div className="container content">
                    <Route exact path="/" component={Home}/>
                    <Route path="/add" component={AddForm}/>
                    <Route path="/edit/:id" component={AddForm}/>
                    <Route path="/recette/:id" component={Recette}/>
                </div>
            </div>
        </Router>
    );
  }
}

export default Layout;
