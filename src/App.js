import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Link } from 'react-router-dom';


class App extends Component {

  constructor(props) {
    super(props);
    var isLoggedIn = sessionStorage.getItem("access_token") != null;
    window.isLoggedIn = isLoggedIn;
  }

  logoutClick(e) {
    e.preventDefault();
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("roles");
    window.isLoggedIn = false;
    window.open("/#/login", "_self")
  }

  render() {
        var roles = sessionStorage.getItem("roles");
    return (
     <div className="App">
       {
                  window.isLoggedIn ? 
                   <div className="my-nav-bar">
                    <div className="container-fluid">
                        <div className="navbar-header header headerimage">
                            <img className="headerimage" src="Images/logo.png" alt="" />
                        </div>
                        <div id="navbar2" className="navbar-collapse collapse">
                            <ul className="nav navbar-nav navbar-right">
                                <li className="dropdown">
                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">{"Hi " + sessionStorage.getItem("displayName")}</a>
                                    <ul className="dropdown-menu">
                                        <li><a href="#">Change Password</a></li>
                                        <li><a onClick={this.logoutClick.bind(this)}>Logout</a></li>
                                    </ul>
                                </li>
                            </ul>

                            <ul className="nav navbar-nav navbar-right">
                                <li className="dropdown">
                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Reports</a>
                                    <ul className="dropdown-menu">
                                        <li> <Link to="/Client">Client Report </Link> </li>
                                        <li> <Link to="../Employee">Employee Report </Link> </li>
                                        <li> <Link to="../ClientPayments"> Client Payment </Link> </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                  : 
                    <div className="container">
                    </div>
       }

      {this.props.children}

    </div>
    );
  }
}

export default App;
