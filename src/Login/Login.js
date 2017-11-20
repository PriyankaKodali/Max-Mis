import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { ApiUrl } from '../Config';
import './Login.css';
import { showErrorsForInput, setUnTouched, ValidateForm } from '.././Validation';
import { MyAjaxForAttachments, MyAjax } from './../MyAjax';



class LogIn extends Component {

    constructor(props) {
         super(props);
        this.state = { error: "" };
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("roles");
        window.isLoggedIn = false;
    }


    render() {
        return (
            <div>

                <div id="logingrid">

                    <div className="container">

                        <div className="col-xs-6">
                            <img className="logo" src="Images/logo.png" alt="" />
                        </div>

                        <form onSubmit={this.handleSubmit.bind(this)} onChange={this.validate.bind(this)}>
                            <div className="col-xs-12">
                                <div className="col-xs-4 form-group">
                                    <input className="form-control" type="text" placeholder="UserName" name="username" autoComplete="off" ref="username" />
                                </div>
                            </div><br />
                            <div className="col-xs-12">
                                <div className="col-xs-4 form-group">
                                    <input className="form-control" type="password" placeholder="Password" name="password" autoComplete="off" ref="password" />
                                </div></div>
                            <div className="clearfix"></div>
                            <div className="col-xs-12 form-group submitButton">
                                 <button type="submit" name="submit" className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>Sign In</button>
                                <div className="loader"></div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }


    handleSubmit(e) {
        e.preventDefault();
        toast.dismiss();
        $(".loader").css("display", "inline-block");
        $("button[name='submit']").hide();

        if (!ValidateForm(e)) {
            $(".loader").hide();
            $("button[name='submit']").show();
            return false;
        }

        var data = {
            username: this.refs.username.value,
            password: this.refs.password.value,
            grant_type: "password"
        };

        let url = ApiUrl + "/Token";
        try {
            $.post(url, data).done(
                (data) => {
                     window.isLoggedIn = true;
                    sessionStorage.setItem("access_token", data["access_token"]);
                    sessionStorage.setItem("roles", data["roles"]);
                    sessionStorage.setItem("displayName",   data["displayName"]);
                      sessionStorage.setItem("userName", data["userName"]);
                    this.props.history.push("/DashBoard");
                }
            ).fail(
                (error) => {
                    $(".loader").hide();
                    $("button[name='submit']").show();
                    if (error.responseJSON) {
                        toast(error.responseJSON.error_description, {
                            type: toast.TYPE.ERROR,
                            autoClose: false
                        });
                    }
                    else {
                        toast("An error occoured, please try again", {
                            type: toast.TYPE.ERROR,
                            autoClose: false
                        });
                    }
                    return false;
                }
                )

                console.log(sessionStorage.getItem("roles"));
        }
        catch (e) {
            toast("An error occoured, please try again!", {
                type: toast.TYPE.ERROR,
                autoClose: false
            });
            $(".loader").hide();
            $("button[name='submit']").show();
            return false;
        }
    }

    validate(e) {
        var success = ValidateForm(e);
        return success;
    }

}

export default LogIn;