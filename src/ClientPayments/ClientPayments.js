import React, { Component } from 'react';
import $ from 'jquery';
import { Link } from 'react-router-link';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import { ApiUrl } from '.././Config';
import Select from 'react-select';
import './ClientPayments.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { showErrorsForInput, setUnTouched, ValidateForm } from '../Validation';
import { MyAjaxForAttachments, MyAjax } from './../MyAjax';
import { toast } from 'react-toastify';
import validate from 'validate.js';

var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;
var moment = require('moment');

class ClientPayments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Client: {},
            Clients: [],
            Services: [],
            ClientDetail: [],
            ClientPayment: [],
            BalanceAmount: '',
            InvoiceId: {},
            ServiceId: {},
            DueAmount: {},
            paymentamount: 0, Description: null,
            amount: 0,
            ClientDue: [],
            hiddenAmount: {}, errors: {},
            isButtonDisabled: false,
            dueAfterPay: "0"
        }
    }

    selectRowProp = {
        mode: 'checkbox',
        clickToSelect: true,
        onSelect:this.onRowSelect,
        onSelectAll: this.onSelectAll
    };

    onRowSelect(row, isSelected, e) {

        var TotalPaid = document.getElementById("hiddenAmount").value;

        if (isSelected) {

            var DueAmount = row.DueAmount;
            if (TotalPaid > DueAmount) {
                row.Balance = 0;
                TotalPaid -= DueAmount;
                document.getElementById("hiddenAmount").value = TotalPaid;
            }
            else {
                
                row.Balance = (row.DueAmount - TotalPaid).toFixed(3);
                TotalPaid = 0;
                document.getElementById("hiddenAmount").value = TotalPaid;
            }
        }
        else {
            if (row.Balance == 0) {
                row.Balance = row.DueAmount
                document.getElementById("hiddenAmount").value = document.getElementById("hiddenAmount").value + row.DueAmount;
            }

            if (row.DueAmount == row.Balance) {
                row.Balance = row.DueAmount;
                document.getElementById("hiddenAmount").value = document.getElementById("hiddenAmount").value;
            }
            else {
                document.getElementById("hiddenAmount").value = row.DueAmount - row.Balance;
                row.Balance = row.DueAmount
            }
        }

    }

    onSelectAll(isSelected, rows) {
        var PaidAmount = document.getElementById("paymentAmount").value;
        // var dueAfterPay = 0;
        // document.getElementById("dueAfterPay").value=dueAfterPay;

        if (isSelected) {
            for (let i = 0; i < rows.length; i++) {
                if (PaidAmount > rows[i].DueAmount) {
                    rows[i].Balance = 0;
                    PaidAmount -= rows[i].DueAmount;
                    //   dueAfterPay = (parseFloat(dueAfterPay)  + parseFloat(rows[i].Balance));
                    //   document.getElementById("dueAfterPay").value =dueAfterPay;
                }
                else {
                    rows[i].Balance = (rows[i].DueAmount - PaidAmount).toFixed(3);
                    PaidAmount = 0;
                    // dueAfterPay = (parseFloat(dueAfterPay) +  parseFloat((rows[i].Balance)));
                    // document.getElementById("dueAfterPay").value=dueAfterPay;
                }
            }
        }

        else {
             var dueAfterPay = 0;
              document.getElementById("dueAfterPay").value=dueAfterPay;
             for (let i = 0; i < rows.length; i++) {
                rows[i].Balance = rows[i].DueAmount;
             //   dueAfterPay += (parseFloat(rows[i].DueAmount )); 
            }
            //    document.getElementById("dueAfterPay").value=dueAfterPay
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
        var url = ApiUrl + "/api/Payments/GetPaymentDetails?client_id=" + this.state.Client.value;
        $.ajax({
            url,
            type: "get",
            success: (data) => this.setState({ ClientPayment: data["paymentDetails"], ClientDue: data["overallDue"] })
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
                            <input className="form-control" id="paymentAmount" type="text" name="PaymentAmount" ref="paymentamount" onChange={this.handlePaymentAmount.bind(this)} />
                            <input id="hiddenAmount" type="hidden" name="hiddenAmount" ref="hiddenAmount" value={this.state.hiddenAmount} />
                        </div>

                        <div className="col-sm-2 form-group">
                            <label>Payment Date</label>
                            <input className="form-control" type="date" ref="paymentDate" name="PayDate" />
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
                        selectRow={this.selectRowProp} >
                        <TableHeaderColumn dataField="InvoiceId" isKey={true} width="40" > Invoice Number </TableHeaderColumn>
                        <TableHeaderColumn dataField="ServiceName" width="40" > Service</TableHeaderColumn>
                        <TableHeaderColumn dataField="InvoiceMonth" width="40" dataFormat={this.MonthFormatter.bind(this)} > Month </TableHeaderColumn>
                        <TableHeaderColumn dataField="DueAmount" width="40" > Due Amount</TableHeaderColumn>
                        <TableHeaderColumn dataField="Balance" width="40" > Balance </TableHeaderColumn>
                    </BootstrapTable>

                    <div >
                        <div className="col-sm-12" style={{ paddingTop: '10px' }}>
                            {/* <p className="col-xs-2 pull-right overallbal"  > <b>Balance Amount : <span /></b> {this.state.totalDue}  </p> */}

                             <p className="col-xs-2 pull-right overallbal"  > <b>Balance Amount : <span /></b>
                                 {this.state.dueAfterPay}
                                 </p> 
  
                            <p className="col-xs-2 pull-right overallDue" ><b>Total DueAmount : <span /> </b>
                                {this.state.ClientDue} </p>  
                        </div>
                    </div>
                    <div className="col-md-12 button-block paybutton">
                        <button type="submit" name="submit" className="btn btn-primary mybutton" > Submit </button>
                    </div>
                </form>
            </div>
        )
    }


    handlePaymentAmount(val) {
        this.setState({ hiddenAmount: this.refs.paymentamount.value })

        if(this.state.ClientDue>this.refs.paymentamount.value)
            {
                   this.setState({dueAfterPay: Math.round((this.state.ClientDue - this.refs.paymentamount.value) * 100 / 100)})
            }
            else{
             //  this.setState({dueAfterPay: Math.round((this.refs.paymentamount.value - this.state.ClientDue )* 100 / 100)})
              this.setState({dueAfterPay: 0 })
            }
    }

    ClientChanged(val) {
          this.state.dueAfterPay='',
            this.state.ClientDue=''
         this.setState({ Client: val }, () => {

            if (this.state.Client && this.state.Client.value) {
                $.ajax({
                    url: ApiUrl + "/api/Payments/GetClientsCurrency?ClientId=" + this.state.Client.value,
                    success: (data) => { this.setState({ ClientDetail: data["clientCurrency"] }) }
                })
                showErrorsForInput(this.refs.client.wrapper, null);
                this.getClientPayments();
            }
        });
    }

    MonthFormatter(cell, row) {
        return <p > {moment(row["InvoiceMonth"]).format("MMMM") + " " + row["invoiceYear"]} </p>
    }

    handlePay(e) {

        e.preventDefault();

        $(e.currentTarget.getElementsByClassName('form-control')).map((i, ele) => {
            ele.classList.remove("un-touched");
            return null;
        })

        if (!this.validate(e)) {
            //  this.setState({ isButtonDisabled: this.state.isButtonDisabled });
            return;
        }

        // else{
        //       this.setState({ isButtonDisabled: !this.state.isButtonDisabled });
        // }

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

          if (this.refs.table.state.selectedRowKeys.length <= 0) {
                alert("Select service for the payment");
            }
            else{
                
                this.state.totalDue = totalDue;
                this.setState({ ClientPayment: tempClientPayment });

                var data = new FormData();

                data.append("Client_Id", this.state.Client.value);
                data.append("Currency", this.refs.currency.value);
                data.append("paymentAmount", this.refs.paymentamount.value);
                data.append("paymentDate", this.refs.paymentDate.value);
                data.append("Description", this.refs.description.value);
                data.append("PaymentCreatedBy", sessionStorage.getItem("userName"));
                data.append("ClientPayment", JSON.stringify(this.refs.table.state.selectedRowKeys));

                var file = this.refs.chequepdf.files;
                if (file.length == 1) {
                    if ($.inArray(this.refs.chequepdf.value.split('.').pop().toLowerCase(), ["doc", "docx", "pdf", "txt"]) == -1) {
                        return;
                    }

                    data.append("ChequePdf", file[0]);
                }

                let url = ApiUrl + "/api/Payments/PayAmount"

                try {
                    MyAjaxForAttachments(
                        url,
                        (data) => {
                            toast("Client Payment was successfull!", {
                                type: toast.TYPE.SUCCESS
                            });

                            $("button[name='submit']").show();
                            this.Refresh();
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

    Refresh() {
        this.refs.paymentamount.value = '',
            this.refs.description.value = '',
            this.refs.paymentDate.value = '',
            this.state.dueAfterPay='',
            this.state.ClientDue=''

            this.getClientPayments();

    }

    validate(e) {
        let fields = this.state.fields;
        let IsError = false;
        let errors = {};
        var success = ValidateForm(e);

        if (!this.state.Client || !this.state.Client.value) {
            success = false;
            showErrorsForInput(this.refs.client.wrapper, ["Please select a client"]);
        }
        if (!this.refs.paymentDate.value) {
            success = false;
            showErrorsForInput(this.refs.paymentDate, ["Please select payment date"]);
        }

        return success;
    }
}

export default ClientPayments;
