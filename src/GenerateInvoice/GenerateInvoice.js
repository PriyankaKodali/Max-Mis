import React, { Component } from 'react';
import $ from 'jquery';
// import { Link } from 'react-router-link';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import { MyAjax, MyAjaxForAttachments } from '.././MyAjax';
import { ApiUrl } from '.././Config';
import './GenerateInvoice.css';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import rasterizehtml from 'rasterizehtml';


var moment = require('moment');
window.rasterizehtml = rasterizehtml;


class GenerateInvoice extends Component {

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
            InvoiceTime: moment().format("hh:mm:ss"),
            ClientAddress: "",
            ClientDue: {}
        }
    }

    componentWillMount() {
        this.setState({ Client_Id: this.props.match.params["ClientId"], invoiceId: this.props.match.params["invoiceId"] }, () => {
            if (this.props.location.state) {
                this.setState
                    ({
                        Client: { value: this.props.location.state["ClientId"] },
                        fromDate: moment(this.props.location.state["fromDate"]),
                        toDate: moment(this.props.location.state["toDate"]),
                        invoiceId: this.props.location.state["invoiceId"]
                    }, () => {
                        var url = ApiUrl + "/api/Invoices/GetInvoiceDetails?ClientId=" + this.state.Client.value +
                            "&fromdate=" + moment(this.state.fromDate).format("MM-DD-YYYY") +
                            "&todate=" + moment(this.state.fromDate).endOf('month').format("MM-DD-YYYY")+
                            "&invoiceId="+this.state.invoiceId;
                        $.ajax({
                            url,
                            type: "GET",
                            success: (data) => this.setState({ ClientInvoice: data["invoices"], ClientAddress: data["invoices"]["Address"], ClientDue: data["clientDueAmount"] })
                        });

                        var url1 = ApiUrl + "/api/Clients/GetClientInvoiceCount?InvoiceId=" + this.state.invoiceId;
                        $.ajax({
                            url: url1,
                            type: "GET",
                            success: (data) => this.setState({ InvoiceIds: data["InvoiceCount"] })
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

                                {this.state.ClientDue == null || this.state.ClientDue["DueAmount"] == 0 ? <span /> :
                                    <tr>
                                        <td colSpan="3"></td>
                                        <td className="text-right" colSpan="2"><b>Unpaid Balances</b></td>
                                        <td className="text-right">
                                            {this.state.ClientDue === null ? 0 : Math.round(this.state.ClientDue["DueAmount"])}
                                        </td>
                                    </tr>

                                }

                                <tr>
                                    <td colSpan="3"></td>
                                    <td colSpan="2" className="text-right"><b>Account Balance as of {this.state.invoiceDate}</b></td>
                                    {
                                        this.state.ClientInvoice.map((ele, i) => {
                                            if (this.state.ClientDue === null) {
                                                return (
                                                    <td className="text-right">
                                                        {Math.round(ele["Amount"])}
                                                    </td>
                                                )
                                            }
                                            else {
                                                return (
                                                   // < td className="text-right">{Math.round(ele["Amount"])}  </td>
                                                   <td className="text-right"> {Math.round(this.state.ClientDue["DueAmount"])}</td>
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

                <div className="col-md-12" style={{ textAlign: "center", paddingTop: "15px", marginBottom: "30px" }}>
                    {/* <button className="btn btn-success" onClick={this.handleSubmit.bind(this)}> Save </button> <span />
                    <button className="btn btn-success " onClick={this.pdfToHTML.bind(this)}> Generate Pdf</button> */}
                    <button className="btn btn-success" onClick={this.handleSubmit.bind(this)}> Save </button>
                      <button className="mleft10 btn btn-primary" onClick={this.backClick.bind(this)}> Back </button>
                 </div>

            </div>
        )
    }

    backClick(e)
    {
          this.props.history.push({
            state: {
                fromDate: this.state.fromDate,
                toDate: this.state.toDate
            },
            pathname: "/Client"
        })
    }


    pdfToHTML() {

        // var url = ApiUrl + "/Home/GetInvoiceDetails?ClientId=" + this.state.Client.value +
        //     "&fromdate=" + moment(this.state.fromDate).format("MM-DD-YYYY") +
        //     "&todate=" + moment(this.state.fromDate).endOf('month').format("MM-DD-YYYY");
        // window.open(url);

        this.props.history.push({
            state: {
                // ClientId: this.state.Client.value,
                fromDate: this.state.fromDate,
                toDate: this.state.toDate
            },
            pathname: "/Client"
        })
    }

    handleSubmit() {

        //    e.preventDefault();
        var amount = 0;
        var unitPrice = 0;
        var totalcharges = 0;

        {
            this.state.ClientInvoice.map((ele, i) => {
                amount += ele["Amount"]
                unitPrice = ele["UnitPrice"]
                totalcharges += ele["Amount"]
            })
        }

        var services = this.state.ClientInvoice

        var data = new FormData();

        // data.append("Invoices", JSON.stringify(this.state.ClientInvoice.ServiceId));

        data.append("Client_Id", this.props.location.state["ClientId"]);
        data.append("CompanyAddress", this.state.companyAddress);
        data.append("ClientAddress", this.state.ClientInvoice[0]["Address"]);
        data.append("InvoiceDate", moment(this.state.fromDate).format("MM/DD/YYYY"));
        data.append("InvoiceId", this.state.invoiceId);
        data.append("TotalLines", this.state.ClientInvoice[0]["LineCount"]);
        data.append("CreatedBy", sessionStorage.getItem("userName"));

        if (this.state.ClientDue == null) {
            data.append("UnpaidBalance", this.state.ClientDue);
        }
        else {
            data.append("UnpaidBalance", this.state.ClientDue["DueAmount"]);
        }
        data.append("ClientService", this.state.ClientInvoice[0]["ServiceId"]);
        data.append("UnitPrice", this.state.ClientInvoice[0]["UnitPrice"]);
        data.append("CurrentAmount", this.state.ClientInvoice[0]["Amount"]);
        var serviceIds = [];
        for (var i = 0; i < this.state.ClientInvoice.length; i++) {
            serviceIds.push(this.state.ClientInvoice[i].ServiceId);
        }
        data.append("InvoiceServices", JSON.stringify(serviceIds));

        let url = ApiUrl + "/api/AddData/AddInvoice";
        try {
            MyAjaxForAttachments(
                url,
                (data) => {
                    toast("client invoice saved successfully!", {
                        type: toast.TYPE.SUCCESS
                    });
                    $("button[name='submit']").show();
                    this.pdfToHTML();
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
}
export default GenerateInvoice;