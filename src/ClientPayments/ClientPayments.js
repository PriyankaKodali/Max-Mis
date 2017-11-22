import React, { Component } from 'react';
import $ from 'jquery';
import { Link } from 'react-router-link';
// import 'bootstrap/dist/css/bootstrap-theme.css';
// import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import { ApiUrl } from '.././Config';
import Select from 'react-select';
import './ClientPayments.css'
import DatePicker from 'react-datepicker/dist/react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { showErrorsForInput, setUnTouched, ValidateForm } from '.././Validation';
import { MyAjaxForAttachments, MyAjax } from './../MyAjax';
import { toast } from 'react-toastify';

var validate = require('validate.js');
var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;
var moment = require('moment');


const selectRowProp = {
    mode: 'checkbox',
    clickToSelect: true,
    onSelect: onRowSelect.bind(this),
};

function onRowSelect(row, isSelected, e) {


}

class ClientPayments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Client: {},
            Clients: [],
            Services: [],
            paymentDate: '',
            paymentamount: {},
            ClientDetail: [],
            ClientPayment: [],
            BalanceAmount: '',
            InvoiceId: {},
            ServiceId: {},
            DueAmount: {},
            paymentAmount: null, Description: null,
            amount: 0
        }
    }

    componentWillMount() {
        $.ajax({
            url: ApiUrl + "/api/Clients/GetAllClients",
            type: "get",
            success: (data) => { this.setState({ Clients: data["ClientNames"] }) }
        });
    }

    componentDidMount() {
        setUnTouched(document);
        $('[data-toggle="popover"]').popover();
    }

    componentDidUpdate() {
        $('[data-toggle="popover"]').popover();
    }

    getClientPayments() {
        var url = ApiUrl + "/api/Payment/GetPaymentDetails?client_id=" + this.state.Client.value;
        $.ajax({
            url,
            type: "get",
            success: (data) => this.setState({ ClientPayment: data["paymentDetails"] })
        })
    }

    render() {

        return (
            <div>

                <div className="headercon">
                    <div className="row">
                        <div className="col-md-12 searchDiv">
                            <h3 className="col-md-12 form1">Client Payment</h3>
                        </div>
                    </div>
                </div>

                <form className="payform" onSubmit={this.handlePay.bind(this)} onChange={this.validate.bind(this)}  >
                    <div className="col-sm-12">

                        <div className="col-sm-3 form-group">
                            <label>Client</label>
                            <Select className="form-control" name="clientname" ref="client" placeholder="Select Client" value={this.state.Client} options={this.state.Clients} onChange={this.ClientChanged.bind(this)} />
                        </div>

                        <div className="col-sm-1 form-group" key={this.state.ClientDetail}>
                            <label> Currency </label>
                            <input className="form-control" disabled type="text" name="Currency" ref="currency" defaultValue={this.state.ClientDetail["Currency"]} />
                        </div>

                        <div className="col-sm-3 form-group">
                            <label>Payment Amount</label>
                            <input className="form-control" type="text" name="paymentAmount" ref="paymentamount" />
                        </div>

                        <div className="col-sm-2 form-group">
                            <label> Payment Date</label>
                            <input className="form-control" type="date" ref="paymentDate" name="paymentDate" />
                            {/* <label> Payment Date </label>
                            <input className="form-control" type="date" ref="paymentDate" name="paymentDate" /> */}
                        </div>

                        <div className="col-sm-3">
                            <label> Cheque copy</label>
                            <div className="form-group">
                                <input className="form-control" type="file" name="chequepdf" ref="chequepdf" />
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-12 form-group">
                        <label> Description </label>
                        <textarea className="form-control mytext" type="text" ref="description" name="Description" />
                    </div>

                    <div className="clearfix"> </div>

                    <BootstrapTable className="clienttable" data={this.state.ClientPayment} ref="table" striped hover remote={true}
                        selectRow={selectRowProp}
                    >
                        <TableHeaderColumn dataField="InvoiceId" isKey={true} width="40" > Invoice Number </TableHeaderColumn>
                        <TableHeaderColumn dataField="ServiceName" width="40" > Service</TableHeaderColumn>
                        <TableHeaderColumn dataField="InvoiceCreatedDate" width="40" dataFormat={this.MonthFormatter.bind(this)} > Month </TableHeaderColumn>
                        <TableHeaderColumn dataField="DueAmount" width="40" > Due Amount</TableHeaderColumn>
                        <TableHeaderColumn dataField="Balance" width="40" > Balance </TableHeaderColumn>
                    </BootstrapTable>


                    <div className="col-xs-12">

                        {/* <div className="col-xs-6 form-group text-right">
                                <label><b>Total Due Amount</b></label>
                            </div>
                            
                            <div>
                                <p>{this.state.overallDueAmount}</p>
                            </div> */}

                        <div className="col-xs-10 form-group text-right">
                            <label><b>Balance Amount</b></label>
                        </div>

                        <div className="col-xs-2 form-group" >
                            <p>{this.state.totalDue}</p>
                        </div>

                    </div>
                    <div className="col-md-12 button-block paybutton">
                        <button type="submit" name="submit" className="btn btn-primary mybutton">Submit</button>
                    </div>

                </form>

            </div>
        )
    }

    ClientChanged(val) {
        this.setState({ Client: val }, () => {
            if (this.state.Client && this.state.Client.value) {
                $.ajax({
                    url: ApiUrl + "/api/Payment/GetClientsCurrency?ClientId=" + this.state.Client.value,
                    success: (data) => { this.setState({ ClientDetail: data["client"] }) }
                });
                this.getClientPayments();
            }
        });

    }

    MonthFormatter(cell, row) {
        return <p > {moment(row["InvoiceCreatedDate"]).format("MMMM YYYY")} </p>
    }

    handlePay(e) {
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

        var TotalAmount = this.refs.paymentamount.value;
        var tempClientPayment = this.state.ClientPayment;
        var totalDue = 0;
        var balanceAmount = 0;
        var actualDueamount = 0;
        var overallDueAmount = 0
        this.state.ClientPayment.map((item, i) => {
            overallDueAmount += item["DueAmount"]
            console.log(overallDueAmount);
        })

        this.state.ClientPayment.map((item, i) => {

            if (this.refs.table.state.selectedRowKeys.length > 0) {

                if (this.refs.table.state.selectedRowKeys.indexOf(item["InvoiceId"]) != -1) {
                    var bal = 0;
                    if (TotalAmount > 0) {
                        if (item["DueAmount"] > TotalAmount) {
                            bal = Math.round((item["DueAmount"] - TotalAmount) * 1000) / 1000;
                            TotalAmount = bal;
                        }
                        else {
                            TotalAmount -= Math.round((TotalAmount - item["DueAmount"]) * 1000 / 1000);
                        }
                        tempClientPayment[i]["Balance"] = bal;
                        TotalAmount -= item["DueAmount"];
                        totalDue += tempClientPayment[i]["Balance"];
                    }

                    else {
                        tempClientPayment[i]["Balance"] = item["DueAmount"];
                        totalDue += tempClientPayment[i]["Balance"];
                    }

                    actualDueamount += item["DueAmount"];
                }

                console.log(actualDueamount);

                this.state.totalDue = totalDue;
                this.setState({ ClientPayment: tempClientPayment });

                var data = new FormData();

                //console.log(JSON.stringify(this.refs.table.state.selectedRowKeys));

                data.append("Client_Id", this.state.Client.value);
                data.append("Currency", this.refs.currency.value);
                data.append("paymentAmount", this.refs.paymentamount.value);
                data.append("paymentDate", this.refs.paymentDate.value);
                data.append("Description", this.refs.description.value);
                data.append("ClientPayment", JSON.stringify(this.refs.table.state.selectedRowKeys));

                var file = this.refs.chequepdf.files;
                if (file.length == 1) {
                    if ($.inArray(this.refs.chequepdf.value.split('.').pop().toLowerCase(), ["doc", "docx", "pdf", "txt"]) == -1) {
                        return;
                    }

                    data.append("ChequePdf", file[0]);
                }

                let url = ApiUrl + "/api/AddPayment/PayAmount"

                try {

                    MyAjaxForAttachments(
                        url,
                        (data) => {
                            toast("Client Payment was successfull!", {
                                type: toast.TYPE.SUCCESS
                            });

                            $("button[name='submit']").show();
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

            else {
                alert("Select service for the payment");
            }
        });

    }

    validate(e) {

        var success = ValidateForm(e);

        if (!this.state.Client || !this.state.Client.value) {
            success = false;
            showErrorsForInput(this.refs.client.wrapper, ["Please select a client"]);
        }

        return success;
    }
}

export default ClientPayments;

