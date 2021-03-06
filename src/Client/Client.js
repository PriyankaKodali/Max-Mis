import React, { Component } from 'react';
import $ from 'jquery';
import './Client.css';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import { MyAjax, MyAjaxForAttachments } from '.././MyAjax';
import { ApiUrl } from '.././Config';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;
var moment = require('moment');

const selectRowProp = {
    clickToSelect: true
};


class Client extends Component {

    constructor(props) {
        super(props);
        var isLoggedIn = sessionStorage.getItem("access_token") != null;
        window.isLoggedIn = isLoggedIn;

        this.state = {
            currentPage: 1, sizePerPage: 25, dataTotalSize: 0,
            Client_Id: {},
            Client: {},
            Clients: [],
           fromDate: moment().startOf('month'),
            toDate: moment().startOf('month').subtract(1, "days"),
            IsDataAvailable: false,
            searchClick: false,
            ClientReport: [],
            TotalDiv55: 0,
            TotalDiv60: 0,
            TotalDiv65: 0,
            sortName: 'ShortName',
            sortOrder: 'asc',
            invoiceId: {},
            Invoices: [],
            count: {}
        }
    }

    componentWillMount() {

        $.ajax({
            url: ApiUrl + "/api/Clients/GetAllClients",
            type: "get",
            success: (data) => { this.setState({ Clients: data["ClientNames"] }) }
        });

        this.setState({ fromDate: moment(this.props.match.params["fromDate"]), toDate: moment(this.props.match.params["toDate"]) }, () => {
            if (this.props.location.state) {
                this.setState
                    ({
                        fromDate: moment(this.props.location.state["fromDate"]),
                        toDate: moment(this.props.location.state["toDate"]),
                    }, () => { this.getClientReport(this.state.currentPage, this.state.sizePerPage) }
                    )
            }
            else {
                this.getClientReport(this.state.currentPage, this.state.sizePerPage)
            }
        })
    }

    getClientReport(page, count) {
        this.setState({ IsDataAvailable: false })
        var url = ApiUrl + "/api/Clients/GetClientReport?clientId=" + this.state.Client.value +
            "&fromdate=" + moment(this.state.fromDate).startOf('month').format("MM-DD-YYYY") +
            "&todate=" + moment(this.state.fromDate).endOf('month').format("MM-DD-YYYY") +
            "&page=" + page +
            "&count=" + count +
            "&SortCol=" + this.state.sortName +
            "&SortDir=" + this.state.sortOrder;
        $.ajax({
                url,
                type: "get",
                success: (data) => this.setState({
                    ClientReport: data["clients"], dataTotalSize: data["totalCount"], currentPage: page,
                    sizePerPage: count, IsDataAvailable: true,
                    TotalDiv55: data["TotalCharCount_55"],
                    TotalDiv60: data["TotalCharCount_60"],
                    TotalDiv65: data["TotalCharCount_65"],
                    TotalMinutes: data["TotalMinutes"]
                })
            })
    }

    dataFormatter60(cell, row) {
        return row.NumberOfCharactersPerLine === 60 ? <b>{row["LineCount_60"]} </b> : <p>{row["LineCount_60"]}</p>
    }

    dataFormatter55(cell, row) {
        return row.NumberOfCharactersPerLine === 55 ? <b>{row["LineCount_55"]} </b> : <p>{row["LineCount_55"]}</p>
    }

    dataFormatter(cell, row) {
        return row.NumberOfCharactersPerLine === 65 ? <b>{row["LineCount_65"]} </b> : <p>{row["LineCount_65"]}</p>
    }

    dataFormatterJobs(cell, row) {
        return row["EmptyJobs"] > 0 ? <p style={{ color: "red" }}> {row["EmptyJobs"]} </p> : <p style={{ color: "green" }}> {row["EmptyJobs"]} </p>
    }

    render() {
        return (
            <div>
                <div className="headercon">
                    <div className="row">
                        <div className="col-md-12 searchDiv">
                            <h3 className="col-md-11 form1">Client Report</h3>
                            <div className="col-md-1 mybutton">
                                <button type="button" className="btn btn-default pull-left headerbtn" >
                                    <span className="glyphicon glyphicon-search"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* {
                    this.state.searchClick ? */}
                <div>
                    <form className="formSearch" id="searchform">
                        <div className="col-md-3 form-group">
                            <label>Client</label>
                            <Select className="form-control" name="clientname" ref="clientname" placeholder="Select Client" value={this.state.Client} options={this.state.Clients} onChange={this.ClientChanged.bind(this)} />
                        </div>

                        <div className="col-md-3 form-group" key={this.state.fromDate}>
                            <label> Month </label>
                            <DatePicker className="form-control" name="fromDate" ref="fromDate"  defaultValue={moment(this.state.fromDate).startOf('month')}  selected={ moment(this.state.fromDate).startOf('month')} dateFormat="MMM-YYYY" onChange={(val) => this.setState({ fromDate: val })} />
                        </div>

                        <div className="col-md-3 button-block myclient-button-block text-center">
                            <input type="button" className="btn btn-success" value="Search" onClick={this.search.bind(this)} />
                            <input type="button" className="mleft10 btn btn-default" value="Clear" onClick={this.clear.bind(this)} />
                        </div>
                    </form>
                </div>
                {/* 
                       : <div />
                }  */}

                <div className="clearfix"> </div>
                {
                    !this.state.IsDataAvailable ? < div className="loader visible" ></div >
                        :
                        <BootstrapTable data={this.state.ClientReport} ref="clienttable" striped hover remote={true} pagination={true}
                            fetchInfo={{ dataTotalSize: this.state.dataTotalSize }}
                            selectRow={selectRowProp}
                            options={{
                                sizePerPage: this.state.sizePerPage,
                                onPageChange: this.onPageChange.bind(this),
                                sizePerPageList: [{ text: '10', value: 10 },
                                { text: '25', value: 25 },
                                { text: 'ALL', value: this.state.dataTotalSize }],
                                page: this.state.currentPage,
                                onSizePerPageList: this.onSizePerPageList.bind(this),
                                paginationPosition: 'bottom',
                                onSortChange: this.onSortChange.bind(this),
                                exportCSVText: 'Export to Excel'
                            }}
                            exportCSV
                        >
                            <TableHeaderColumn dataField="ShortName" isKey={true} dataSort={true} width="40" > Client Name </TableHeaderColumn>
                            <TableHeaderColumn dataField="NumberOfCharactersPerLine" dataAlign="center" dataSort={true} width="23" > Chr/Line </TableHeaderColumn>
                            <TableHeaderColumn dataField="PaymentType" dataSort={true} width="30" > Payment Type </TableHeaderColumn>
                            <TableHeaderColumn dataField="TotalMinutes" dataSort={true} width="30" dataAlign="right"> Total Minutes</TableHeaderColumn>
                            <TableHeaderColumn dataField="LineCount_55" dataSort={true} width="25" dataAlign="right" dataFormat={this.dataFormatter55.bind(this)} > Lines (55) </TableHeaderColumn>
                            <TableHeaderColumn dataField="LineCount_60" dataSort={true} width="25" dataAlign="right" dataFormat={this.dataFormatter60.bind(this)}> Lines (60) </TableHeaderColumn>
                            <TableHeaderColumn dataField="LineCount_65" dataSort={true} width="25" dataAlign="right" dataFormat={this.dataFormatter.bind(this)} > Lines (65) </TableHeaderColumn>
                            <TableHeaderColumn dataField="Currency" dataSort={true} width="25" dataAlign="right"> Currency </TableHeaderColumn>
                            <TableHeaderColumn dataField="AmountPerUnit" dataSort={true} width="25" dataAlign="center"> Unit Price </TableHeaderColumn>
                            <TableHeaderColumn dataField="PaymentAmount" dataSort={true} width="25" dataAlign="right" > Amount </TableHeaderColumn>
                            <TableHeaderColumn dataField="TotalJobs" dataSort={true} width="25" dataAlign="right" > Total Jobs </TableHeaderColumn>
                            <TableHeaderColumn dataField="EmptyJobs" dataSort={true} width="22" dataAlign="center" headerText='Jobs With Zero Count' dataFormat={this.dataFormatterJobs.bind(this)} > Exp Jobs </TableHeaderColumn>
                            <TableHeaderColumn columnClassName="invoice" dataField='Edit' dataFormat={this.invoiceFormatter.bind(this)} width='18'></TableHeaderColumn>
                        </BootstrapTable>
                }
                <div > </div>
                <div className="col-sm-6 spanstyle">
                    <span className="badge" width='280'>
                        <span className="badge" > Line Count Divided by 55 : {this.state.TotalDiv55}</span>
                        <span className="badge">|  Line Count Divded by 60 : {this.state.TotalDiv60} </span>
                        <span className="badge">|  Line Count Divided by 65 : {this.state.TotalDiv65} </span>
                        <span className="badge">|  Total Time : {this.state.TotalMinutes} </span>
                    </span>
                </div>
            </div>
        );
    }

    invoiceFormatter(cell, row) {

        if (row["Status"] === "Approved") {
            return (
                <a data-toggle="tooltip" className="tooltipLink" title="View Invoice" data-original-title="View Invoive">
                    <i className='glyphicon glyphicon-list-alt table-row-selected' headerText='View Invoice' style={{ cursor: 'pointer', fontSize: '17px', color: 'green' }} onClick={() => this.gotoClientInvoice(row["ClientId"], "", "", row["EmptyJobs"], row["Status"], row["AmountPerUnit"])} ></i>
                </a>
            )
        }

        else if (row["Status"] === "Generated") {
            return (
                <a data-toggle="tooltip" className="tooltipLink" title="Approve Invoice" data-original-title="Approve Invoice">
                    <i className='glyphicon glyphicon-list-alt table-row-selected' headerText='Approve Invoice' style={{ cursor: 'pointer', fontSize: '17px', color: 'orange' }} onClick={() => this.gotoClientInvoice(row["ClientId"], "", "", row["EmptyJobs"], row["Status"], row["AmountPerUnit"])} ></i>
                </a>
            )
        }

        else {
            return (
                <a data-toggle="tooltip" className="tooltipLink" title="Generate Invoice" data-original-title="Generate Invoive">
                    <i className='glyphicon glyphicon-list-alt table-row-selected' style={{ cursor: 'pointer', fontSize: '17px' }} onClick={() => this.gotoClientInvoice(row["ClientId"], "", "", row["EmptyJobs"], row["Status"], row["AmountPerUnit"])} ></i>
                </a>
            )
        }
    }


    onSortChange(sortName, sortOrder) {
        sortOrder = this.state.sortName === sortName && this.state.sortOrder === "asc" ? "desc" : "asc";
        this.setState({
            sortName: sortName,
            sortOrder: sortOrder
        }, () => {
            this.getClientReport(this.state.currentPage, this.state.sizePerPage)
        });
    }

    gotoClientInvoice(ClientId, fromDate, toDate, EmptyJobs, Status, AmountPerUnit) {

        var fromDate = this.state.fromDate.format("MM-DD-YYYY");
        var toDate = this.state.toDate.format("MM-DD-YYYY");

        if (EmptyJobs > 0) {

            alert("Could not generate invoice as pendings jobs are present");
        }

        else {
            if (AmountPerUnit == 0) {
                alert("Counldn't generate invoice as there is no unit price for this client!");
            }

            else {
                if (Status == null) {
                    var url = ApiUrl + "/api/Clients/GetClientInvoiceCount?ClientId=" + ClientId +
                        "&fromDate=" + this.state.fromDate.format("MM-DD-YYYY");

                    $.ajax({
                        url,
                        type: "get",
                        success: (data) => {
                            this.setState({ InvoiceCount: data["InvoiceCount"] })
                            var invoiceId = "MAX-" + ClientId + moment(fromDate).format("MM") + moment(fromDate).format("YY") + "_" + (this.state.InvoiceCount + 1)

                            this.props.history.push({
                                state: {
                                    ClientId: ClientId,
                                    fromDate: fromDate,
                                    toDate: toDate,
                                    invoiceId: invoiceId
                                },
                                pathname: "/GenerateInvoice"
                            })
                        }
                    });
                }
                else {
                    if (Status == "Generated") {
                        var url = ApiUrl + "/api/Clients/GetClientInvoice?ClientId=" + ClientId +
                            "&fromDate=" + this.state.fromDate.format("MM-DD-YYYY");

                        $.ajax({
                            url,
                            type: "get",
                            success: (data) => {
                                this.setState({ InvoiceCount: data["InvoiceCount"] })
                                var invoiceId = "MAX-" + ClientId + moment(fromDate).format("MM") + moment(fromDate).format("YY") + "_" + (this.state.InvoiceCount + 1)
                                this.props.history.push({
                                    state: {
                                        ClientId: ClientId,
                                        fromDate: fromDate,
                                        toDate: toDate,
                                        invoiceId: invoiceId
                                    },
                                    pathname: "/ViewOrCancelInvoice"
                                })
                            }
                        })
                    }
                    else {
                        if (Status = "Approved") {
                            var url = ApiUrl + "/api/Clients/GetClientInvoice?ClientId=" + ClientId +
                                "&fromDate=" + this.state.fromDate.format("MM-DD-YYYY");

                            $.ajax({
                                url,
                                type: "get",
                                success: (data) => {
                                    this.setState({ InvoiceCount: data["InvoiceCount"] })
                                    var invoiceId = "MAX-" + ClientId + moment(fromDate).format("MM") + moment(fromDate).format("YY") + "_" + (this.state.InvoiceCount)
                                    this.props.history.push({
                                        state: {
                                            ClientId: ClientId,
                                            fromDate: fromDate,
                                            toDate: toDate,
                                            invoiceId: invoiceId
                                        },
                                        pathname: "/ViewOrCancelInvoice"
                                    })
                                }
                            })
                        }
                    }
                }
            }
        }

    }

    ClientChanged(val) {
        this.setState({ Client: val || '' })
    }

    search() {
        this.getClientReport(this.state.currentPage, this.state.sizePerPage);
    }

    clear() {

        this.state.Client = "";
        this.state.fromDate = moment().startOf('month');
        this.state.toDate = moment();
        this.getClientReport(this.state.currentPage, this.state.sizePerPage);
    }

    onPageChange(page, sizePerPage) {
        this.getClientReport(page, sizePerPage);
    }

    onSizePerPageList(sizePerPage) {
        this.getClientReport(this.state.currentPage, sizePerPage);
    }
}

export default Client;