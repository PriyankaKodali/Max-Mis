import React, { Component } from 'react';
import $ from 'jquery';
import { Link } from 'react-router-link';
import { showErrorsForInput, setUnTouched, ValidateForm } from '.././Validation';
import { MyAjax, MyAjaxForAttachments } from '.././MyAjax';
import { ApiUrl } from '.././Config';
import { toast } from 'react-toastify';
import rasterizehtml from 'rasterizehtml';
import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

var moment = require('moment');
window.rasterizehtml = rasterizehtml;


//  function Submit()
//     {
//      confirmAlert({
//       title: 'Confirm to Cancel',                        // Title dialog
//       message: 'Are you sure to delete this Invoice',               // Message dialog
//       childrenElement: () => <div>Custom UI</div>,       // Custom UI or Component
//       confirmLabel: 'Confirm',                           // Text button confirm
//      cancelLabel: 'Cancel',                             // Text button cancel
//       onConfirm: ()=>{ confirmed()}    // Action after Confirm
//    //  onCancel: () => {this.cancel()},         // Action after Cancel
//     })
//     };
//     function  confirmed()
//     {  
//       alert("Conform Clicked");
//     }

class ViewOrCancelInvoice extends Component {

    constructor(props) {
        super(props);
        var isLoggedIn = sessionStorage.getItem("access_token") != null;
        window.isLoggedIn = isLoggedIn;
        this.state = {
            Client_Id: null,
            ClientAddress: [],
            IsDataAvailable: false,
            ClientInvoice: [],
            Client: {},
            fromDate: '',
            toDate: '',
            invoiceDate: moment().format("MM/DD/YYYY"),
            invoiceDueDate: moment().add(10, "days").format("MM/DD/YYYY"),
            unpaidBal: 0,
            invoiceId: {},
            companyAddress: "MAX TRANS SYSTEMS LLC 1032 EAST WACO  KERMIT, TX 79745",
            // InvoiceTime: moment().format("hh:mm:ss"),
            ClientAddress: "",
            ClientDue: {},
            InvoiceApproved: {},
            showDialog: false
        }
    }

    componentWillMount() {
        this.setState({
            Client_Id: this.props.match.params["ClientId"], invoiceId: this.props.match.params["invoiceId"],
            fromDate: this.props.match.params[" fromDate"], toDate: this.props.match.params["toDate"]
        }, () => {
            if (this.props.location.state) {
                this.setState({
                    Client: { value: this.props.location.state["ClientId"] },
                    fromDate: moment(this.props.location.state["fromDate"]),
                    toDate: moment(this.props.location.state["toDate"]),
                    invoiceId: this.props.location.state["invoiceId"]
                }
                    , () => {
                        var url1 = ApiUrl + "/api/Invoices/GetApprovedInvc?InvoiceId=" + this.state.invoiceId;
                        $.ajax({
                            url: url1,
                            type: "GET",
                            success: (data) => {
                                this.setState({ InvoiceApproved: data["approved"] }, () => {
                                    if (this.state.InvoiceApproved != null) {

                                        var url = ApiUrl + "/api/Clients/GetApprovedInvoice?InvoiceId=" + this.state.invoiceId +
                                            "&ClientId=" + this.state.Client.value +
                                            "&fromdate=" + moment(this.state.fromDate).format("MM-DD-YYYY") +
                                            "&todate=" + moment(this.state.fromDate).endOf('month').format("MM-DD-YYYY")
                                        $.ajax({
                                            url,
                                            type: "GET",
                                            success: (data) => this.setState({ ClientInvoice: data["invoices"], ClientAddress: data["invoices"]["Address"], ClientDue: data["clientDueAmount"] })
                                        });
                                    }
                                    else {
                                        var url = ApiUrl + "/api/Invoices/GetInvoiceDetails?ClientId=" + this.state.Client.value +
                                            "&fromdate=" + moment(this.state.fromDate).format("MM-DD-YYYY") +
                                            "&todate=" + moment(this.state.fromDate).endOf('month').format("MM-DD-YYYY") +
                                            "&invoiceId=" + this.state.invoiceId;
                                        $.ajax({
                                            url,
                                            type: "GET",
                                            success: (data) => this.setState({ ClientInvoice: data["invoices"], ClientAddress: data["invoices"]["Address"], ClientDue: data["clientDueAmount"] })
                                        });
                                    }
                                })
                            }
                        });
                    })
            }
        });
    }

    render() {
        return (
            <div>
                <div id="grid">
                    <div className="col-xs-12" id="invoice">
                        <table className="col-xs-12">
                            <tr>
                                <td><img className="myImage" src="Images/logo.png" alt="" /></td>
                                <td rowSpan="2">
                                    <p className="pull-right" style={{ marginTop: '5px' }}>
                                        <strong id="invoiceDate">Invoice Date : {' '}</strong> <span />
                                        {moment(this.state.fromDate).format("MM/DD/YYYY")} <br />
                                        <strong >Invoice Due Date <span /><span /> : {' '}</strong>
                                        {moment(this.state.fromDate).add(10, "days").format("MM/DD/YYYY")} <br />
                                        <strong >Invoice Number : {' '}<span /> </strong>
                                        {this.state.invoiceId}<br />
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>
                                        MAX TRANS SYSTEMS LLC,<br />
                                        1032 EAST WACO<br />
                                        KERMIT, TX 79745 <br />
                                        <br />
                                        (432) 614-4500<br />
                                        <a>manoj@maxtranssystems.com</a>
                                    </p>
                                </td>
                            </tr>
                        </table>
                        <div className="col-xs-12"><hr /></div>
                        <table>
                            <tr>
                                <td>
                                    <p>
                                        <b>Bill To :</b><br />

                                        {this.state.ClientInvoice.map((item, i) => {
                                            return (<p key={0}> {(item.Address).split(",").map((item) => {
                                                return (
                                                    <span> {item}, <br /></span>
                                                )
                                            })} </p>
                                            )
                                        })
                                        }
                                    </p>

                                </td>
                            </tr>
                        </table>

                        <br />
                        <table id="tbl1" className="mytable" style={{ fontSize: '9px' }}>
                            <thead className="mytable">
                                <tr>
                                    <th className="text-center"> S.No. </th>
                                    <th className="text-center"> Service Description </th>
                                    <th className="text-center"> Month </th>
                                    <th className="text-center"> Unit Price </th>
                                    <th className="text-center"> Total Lines </th>
                                    <th className="text-center"> Amount </th>
                                </tr>
                            </thead>
                            <tbody className="mytable" >
                                {
                                    this.state.ClientInvoice.map((item, i) => {
                                        return (
                                            <tr key={i}>
                                                <td className="text-center">   {item.RowNum} </td>
                                                <td className="text-center" key={item.ServiceId} > {item.ServiceType}
                                                </td>
                                                <td className="text-center"> {item.MonthYear}
                                                </td>
                                                <td className="text-center"> {item.UnitPriceforDisplay}
                                                </td>
                                                <td className="text-right"> {item.LineCount}
                                                </td>
                                                <td className="text-right" >  {Math.round(item.Amount)}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr>
                                    <td colSpan="3"></td>
                                    <td colSpan="2" className="text-right"><b>Total Charges</b></td>
                                    {
                                        this.state.ClientInvoice.map((ele, i) => {
                                            var amount = 0;
                                            return (
                                                < td className="text-right">  {amount += Math.round(ele["Amount"])} </td>
                                            )
                                        })
                                    }
                                </tr>

                                {
                                    this.state.ClientDue == null || this.state.ClientDue["TotalDueAmount"] == 0 ? <span /> :
                                        <tr>
                                            <td colSpan="3"></td>
                                            <td className="text-right" colSpan="2"><b>Unpaid Balances</b></td>
                                            <td className="text-right">
                                                {this.state.ClientDue === null ? 0 : Math.round(this.state.ClientDue["TotalDueAmount"])}
                                            </td>
                                        </tr>

                                }

                                <tr>
                                    <td colSpan="3"></td>


                                    <td colSpan="2" className="text-right"><b>Account Balance as of ( {this.state.invoiceDate} ) </b></td>
                                    {
                                        this.state.ClientInvoice.map((ele, i) => {
                                            {/* return (
                                                < td className="text-right">{Math.round(this.state.ClientDue["DueAmount"] + ele["Amount"])}  </td>
                                            ) */}
                                            if (this.state.ClientDue === null) {
                                                return (
                                                    <td className="text-right">
                                                        {Math.round(ele["Amount"])}
                                                    </td>
                                                )
                                            }
                                            else {
                                                return (
                                                    <td className="text-right"> {Math.round(this.state.ClientDue["TotalDueAmount"]) + Math.round(ele["Amount"])}</td>
                                                )
                                            }
                                        })
                                    }
                                </tr>

                            </tbody>
                        </table>
                        <hr />

                        <footer>
                            <div className="col-xs-12 footer">
                                <div className="col-xs-4 text-left"> www.maxtranscriptionsystems.com </div>
                                <div className="col-xs-4 text-center">  + 432-614-4500</div>
                                <div className="col-xs-4 text-right">  MAX TRANS SYSTEMS LLC.</div>
                            </div>
                        </footer>
                    </div>

                    <div className="clearfix"></div>
                </div>

                <div>
                    <div className="col-md-12  button-block myclient-button-block text-center">
                        <p>
                            {
                                sessionStorage.getItem("roles").indexOf("Coordinator") != -1 ?
                                    <p>

                                        {this.state.InvoiceApproved == null ?

                                            <p>
                                                <button className="btn btn-success" onClick={this.approveClick.bind(this)}> <span /> Approve</button>
                                                <button className="mleft10 btn btn-danger" onClick={() => { this.setState({ cancelClick: !this.state.cancelClick }) }} > <span /> Cancel Invoice</button>
                                                <button className="mleft10 btn btn-primary" onClick={this.backClick.bind(this)}> Back </button>
                                            </p>
                                            :
                                            <p>

                                                <button className="btn btn-success" onClick={this.pdfToHTML.bind(this)} >Download Pdf</button>
                                                <button className="mleft10 btn btn-danger" onClick={() => { this.setState({ cancelClick: !this.state.cancelClick }) }} > <span /> Cancel Invoice</button>
                                                <button className="mleft10 btn btn-primary" onClick={this.backClick.bind(this)}>Back </button>

                                            </p>
                                        }
                                    </p>
                                    :
                                    <p>
                                        {this.state.InvoiceApproved == null ?

                                            <p>
                                                <button className="mleft10 btn btn-danger" onClick={() => { this.setState({ cancelClick: !this.state.cancelClick }) }} > <span /> Cancel Invoice</button>
                                                <button className="mleft10 btn btn-primary" onClick={this.backClick.bind(this)}> Back </button>
                                            </p>
                                            :
                                            <p>
                                                <button className="mleft10 btn btn-success" onClick={this.pdfToHTML.bind(this)} >Download Pdf</button>
                                                <button className="mleft10 btn btn-danger" onClick={() => { this.setState({ cancelClick: !this.state.cancelClick }) }} > <span /> Cancel Invoice</button>
                                                <button className="mleft10 btn btn-primary" onClick={this.backClick.bind(this)}> Back </button>
                                            </p>
                                        }
                                    </p>
                            }
                        </p>
                    </div>
                </div>
                {
                    this.state.cancelClick ?
                        <form onChange={this.validate.bind(this)} onSubmit={this.delete.bind(this)}>
                            <div className="col-xs-12">
                                <div className="col-sm-12 form-group">
                                    <label> Description </label>
                                    <textarea className="form-control mytext" type="text" ref="description" name="Description" autoFocus />
                                </div>
                                <div className="col-md-12 button-block text-center">
                                    {/* <button className="btn btn-danger" onClick={() => { this.setState({ showDialog: !this.state.showDialog }) }} >Click here to cancel invoice</button>  */}
                                    <button className="btn btn-danger" onClick={this.delete.bind(this)} >Click here to cancel invoice</button>
                                </div>
                            </div>
                        </form>
                        : <div />
                }
                {/* {
                     {/* <form onChange={this.validate.bind(this)} >  
                    this.state.showDialog ?
                        <ReactConfirmAlert
                            title="Confirm to submit"
                            message="Are you sure to do this."
                            confirmLabel="Confirm"
                            cancelLabel="Cancel"
                            onConfirm={() => this.delete()}
                            onCancel={() => this.backClick()}
                        />
                     : <div />
                } */}
            </div>
        );
    }

    approveClick() {
        var data = new FormData();
        data.append("InvoiceId", this.state.invoiceId);
        data.append("ApprovedBy", sessionStorage.getItem("userName"));
        data.append("approvedDate", moment(this.state.fromDate).format("MM-DD-YYYY"));
        data.append("ClientId", this.props.location.state["ClientId"]);


        var url = ApiUrl + "api/AddData/updateInvoice?InvoiceId=" + this.state.invoiceId

        try {
            MyAjaxForAttachments(
                url,
                (data) => {
                    toast("Invoice Approved successfull!", {
                        type: toast.TYPE.SUCCESS
                    });

                    $("button[name='submit']").show();
                    this.backClick();
                    return true;
                },
                (error) => {
                    toast("An error occoured, please try again!", {
                        type: toast.TYPE.ERROR,
                        autoClose: false
                    });
                    $(".loader").hide();
                    $("button[name='submit']").show();
                    return false;
                },
                "POST",
                data
            );

        }
        catch (e) {
            toast("An error occoured, please try again!", {
                type: toast.TYPE.ERROR
            });
            $(".loader").hide();
            $("button[name='submit']").show();
            return false;
        }
    }

    backClick() {
        this.props.history.push({
            state: {
                fromDate: this.state.fromDate,
                toDate: this.state.toDate
            },
            pathname: "/Client"
        })
    }

    pdfToHTML() {
        var url = ApiUrl + "/Home/GetInvoiceDetails?ClientId=" + this.state.Client.value +
            "&fromdate=" + moment(this.state.fromDate).format("MM-DD-YYYY") +
            "&todate=" + moment(this.state.fromDate).endOf('month').format("MM-DD-YYYY");
        window.open(url);
        this.props.history.push({
            state: {
                fromDate: this.state.fromDate,
                toDate: this.state.toDate
            },
            pathname: "/Client"
        })
    }

    delete(e) {
        e.preventDefault();

        $(e.currentTarget.getElementsByClassName('form-control')).map((i, ele) => {
            ele.classList.remove("un-touched");
            return null;
        })

        if (!this.validate(e)) {
            return;
        }

        var inputs = $(e.currentTarget.getElementsByClassName('form-control')).map((i, el) => {
            if (el.closest(".form-group").classList.contains("hidden")) {
                return null;
            }
            else {
                return el;
            }
        });

        var data = new FormData();
        data.append("Description", this.refs.description.value);
        data.append("InvoiceId", this.state.invoiceId);

        var url = ApiUrl + "/api/DeleteInvoice/DeleteInvoice?InvoiceId=" + this.state.invoiceId

        try {
            MyAjaxForAttachments(
                url,
                (data) => {
                    toast("Invoice Cancellation was successfull!", {
                        type: toast.TYPE.SUCCESS
                    });
                    $("button[name='submit']").show();
                    this.backClick();
                    return true;
                },
                (error) => {
                    toast("Cancellation cannot be done!", {
                        type: toast.TYPE.ERROR,
                        autoClose: false
                    });
                    $(".loader").hide();
                    $("button[name='submit']").show();
                    this.backClick();
                    return false;
                },
                "POST",
                data
            );
        }
        catch (e) {
            toast("An error occoured, please try again!", {
                type: toast.TYPE.ERROR
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

export default ViewOrCancelInvoice;