import React, { Component } from 'react';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { showErrorsForInput, setUnTouched, ValidateForm } from '.././Validation';
import { MyAjax, MyAjaxForAttachments } from '.././MyAjax';
import { ApiUrl } from '.././Config';
import { toast } from 'react-toastify';
import rasterizehtml from 'rasterizehtml';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


class DashBoard extends Component{

    constructor(props) {
        super(props);
        var isLoggedIn = sessionStorage.getItem("access_token") != null;
        var Role= sessionStorage.getItem("roles");
         window.isLoggedIn = isLoggedIn;
    }
    render(){

        return(
           <div>
               <p style={{ fontSize:18, color:"green", paddingTop:50}}>
                 {/* { sessionStorage.getItem("roles") }  */}
                 { "Hi "+  sessionStorage.getItem("userName") } 
               </p>

           </div>
        )
    }

}

export default DashBoard;