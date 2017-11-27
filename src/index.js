import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/css/bootstrap.css';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Client from './Client/Client';
import './Client/Client.css';
// import Doctor from './Doctor/Doctor';
// import './Doctor/Doctor.css';
import Employee from './Employee/Employee';
import './Employee/Employee.css';
import GenerateInvoice from './GenerateInvoice/GenerateInvoice';
import './GenerateInvoice/GenerateInvoice.css';
import ClientPayments from './ClientPayments/ClientPayments';
import ViewOrCancelInvoice from './ViewOrCancelInvoice/ViewOrCancelInvoice';
import DashBoard from './DashBoard/DashBoard';

import LogIn from './Login/Login';

import { Router, Route, IndexRoute } from 'react-router'
import { HashRouter } from 'react-router-dom'


window.jQuery = window.$ = require("jquery");
var bootstrap = require("bootstrap");
window.isLoggedIn = sessionStorage.getItem("access_token") !== null;



ReactDOM.render((
    <HashRouter>
        <div>
            
            <ToastContainer autoClose={3000} position="top-center" />

            <App>
                <Route exact path='/' component={LogIn} />
                <Route exact path='/DashBoard/:id?' render={(nextState) => requireAuth(nextState, <DashBoard location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path='/Client/:id?' render={(nextState) => requireAuth(nextState, <Client location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path='/GenerateInvoice/:id?' render={(nextState) => requireAuth(nextState, <GenerateInvoice location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path='/Employee' component={Employee} />
                <Route exact path='/ClientPayments/:id?' render={(nextState) => requireAuth(nextState, <ClientPayments location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path='/ViewOrCancelInvoice/:id?' render={(nextState) => requireAuth(nextState, <ViewOrCancelInvoice location={nextState.location} history={nextState.history} match={nextState.match} />)} />
                <Route exact path='/LogIn' component={LogIn} />
            </App>
            
        </div>
    </HashRouter>
),
    document.getElementById('root')
);

function requireAuth(nextState, component) {
    var isLoggedIn = sessionStorage.getItem("access_token") != null;
    if (!isLoggedIn) {
        nextState.history.push("/LogIn");
        return null;
    }
    else {
        return component;
    }
}
