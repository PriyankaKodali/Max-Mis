import React, { Component } from 'react';
import $ from 'jquery';
import './Employee.css';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import { MyAjax } from '.././MyAjax';
import { ApiUrl } from '.././Config';
import Select from 'react-select';
import DatePicker from 'react-datepicker/dist/react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;
var moment = require('moment');


class Employee extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1, sizePerPage: 10, dataTotalSize: 0,
            Doctors: [],
            Doctor: {},
            Clients: [],
            Employees: [],
            Employ: {},
            Client: {},
            // fromDate: moment().startOf('month').subtract(40, "days"),
            fromDate: moment().startOf('month').subtract(30, "days"),
            toDate: moment().startOf('month').subtract(1, "days"),
            JobWorkLevel: "",
            IsDataAvailable: false,
            Reports: [],
            CharacterCount: [],
            sortName: 'JobDate',
            sortOrder: 'asc'
        }
    }

    componentWillMount() {

        $.ajax({
            url: ApiUrl + "/api/Employees/GetAllDetails",
            type: "get",
            success: (data) => { this.setState({ Clients: data["ClientNames"], Doctors: data["DoctorNames"], Employees: data["Employees"] }) }
        }),
            this.getReport(this.state.currentPage, this.state.sizePerPage);

    }

    getReport(page, count) {
        this.setState({ IsDataAvailable: false })
        var url = ApiUrl + "/api/Employees/GetAllEmployesReport?EmpId=" + this.state.Employ.value +
            "&ClientId=" + this.state.Client.value +
            "&DoctorId=" + this.state.Doctor.value +
            "&JobWorkLevel=" + this.state.JobWorkLevel +
            "&fromdate=" + moment(this.state.fromDate).format("MM-DD-YYYY") +
            "&todate=" + moment(this.state.toDate).format("MM-DD-YYYY") +
            "&page=" + page +
            "&count=" + count +
            "&sortCol=" + this.state.sortName +
            "&sortDir=" + this.state.sortOrder;
        $.ajax
            ({
                url,
                type: "get",
                success: (data) => this.setState({ Reports: data["empReport"], dataTotalSize: data["totalCount"], currentPage: page, sizePerPage: count, IsDataAvailable: true })
            })
    }

    render() {
        return (
            <div >
                <div className="headercon">
                    <div className="row">
                        <div className="col-md-12 searchDiv">
                            <h3 className="col-md-11 form1">Employee Line Count Report</h3>
                            <div className="col-md-1 mybutton">
                                <button type="button" className="btn btn-default pull-left headerbtn" onClick={() => { this.setState({ searchClick: !this.state.searchClick }) }}>
                                    <span className="glyphicon glyphicon-search"></span>
                                </button></div>
                        </div>
                    </div>
                </div>
{/* 
                {
                    this.state.searchClick ? */}
                        <form className="formSearch1" id="searchform">
                            <div className="col-sm-2 form-group">
                                <label>Employe Name</label>
                                <Select className="form-control" name="empname" ref="empname" placeholder="Select Employ " value={this.state.Employ} options={this.state.Employees} onChange={this.EmployChanged.bind(this)} />
                            </div>

                            <div className="col-sm-2 form-group">
                                <label>Client</label>
                                <Select className="form-control" name="clientname" ref="clientname" placeholder="Select Client" value={this.state.Client} options={this.state.Clients} onChange={this.ClientChanged.bind(this)} />

                            </div>

                            <div className="col-sm-2 form-group" >
                                <label>Doctor</label>
                                <Select className="form-control" name="doctorname" ref="doctorname" placeholder="Select Doctor" value={this.state.Doctor} options={this.state.Doctors} onChange={this.DoctorSelected.bind(this)} />
                            </div>

                            <div className="col-sm-2 form-group">
                                <label>From Date</label>
                                {/* <input className="form-control" type="date" name="fromDate" ref="fromDate" autoComplete="off" />  */}
                                <DatePicker className="form-control" name="fromDate" ref="fromDate" selected={this.state.fromDate} dateFormat="DD-MM-YYYY" onChange={(val) => this.setState({ fromDate: val })} />
                            </div>

                            <div className="col-sm-2 form-group">
                                <label>To Date</label>
                                {/* <input className="form-control" type="date" name="toDate" ref="toDate"  value={this.state.startDate} autoComplete="off" />  */}
                                <DatePicker className="form-control" name="toDate" ref="toDate" selected={this.state.toDate} dateFormat="DD-MM-YYYY" onChange={(val) => this.setState({ toDate: val })} />
                            </div>


                            <div className="col-sm-2 form-group">
                                <label>Level</label>
                                <select className="form-control" name="level" ref="level" autoComplete="off" >
                                    <option value="">All</option>
                                    <option >MT</option>
                                    <option>AQA</option>
                                    <option>QA</option>
                                </select>
                            </div>

                            <div className="col-sm-2 button-block my-button-block text-center">
                                <input type="button" className="btn btn-success" value="Search" onClick={this.search.bind(this)} />
                                <input type="button" className="mleft10 btn btn-default" value="Clear" onClick={this.clear.bind(this)} />
                            </div>

                            {/* <div className="col-sm-6 spanstyle">
                            <span className="badge" width='80'> MT(Direct) :{this.state.CharacterCount["TotalMtDirect"]}
                                <span className="badge" >| MT: {this.state.CharacterCount["TotalMt"]}</span>
                                <span className="badge">| AQA: {this.state.CharacterCount["TotalAQA"]} </span>
                                <span className="badge">| QA: {this.state.CharacterCount["TotalQA"]} </span>
                            </span>
                        </div> */}
                        </form>
                        {/* : <div />
                } */}

                <div className="clearfix"> </div>
                {
                    !this.state.IsDataAvailable ? < div className="loader visible" ></div >
                        :
                        <div className="col-xs-12">
                            <BootstrapTable data={this.state.Reports} striped hover remote={true} pagination={true}
                                fetchInfo={{ dataTotalSize: this.state.dataTotalSize }}
                                options={{
                                    sizePerPage: this.state.sizePerPage,
                                    onPageChange: this.onPageChange.bind(this),
                                    sizePerPageList: [{ text: '10', value: 10 },
                                    { text: '25', value: 25 },
                                    { text: 'ALL', value: this.state.dataTotalSize }],
                                    page: this.state.currentPage,
                                    onSizePerPageList: this.onSizePerPageList.bind(this),
                                    paginationPosition: 'bottom',
                                    onSortChange: this.onSortChange.bind(this)
                                }}
                                exportCSV
                            >
                                {/* <TableHeaderColumn dataField='JobDate' dataSort={true} dataFormat={(val) => moment(val).format("DD-MM-YYYY")} width='50'>Date</TableHeaderColumn> */}
                                <TableHeaderColumn dataField='EmployeeName' dataSort={true} width='120'>Employ Name</TableHeaderColumn>
                                <TableHeaderColumn dataField='ClientName' dataSort={true} width='160'>Client Name</TableHeaderColumn>
                                <TableHeaderColumn dataField='DoctorName' dataSort={true} width='120'>Doctor Name</TableHeaderColumn>
                                <TableHeaderColumn dataField='VoiceGrade' dataSort={true} width='60' dataAlign="center">Voice Grade</TableHeaderColumn>
                                <TableHeaderColumn dataField='JobNumber' isKey={true} dataSort={true} width='100'>Job Number</TableHeaderColumn>
                                <TableHeaderColumn dataField='JobWorkLevel' dataSort={true} width='80'>Job WorkLevel</TableHeaderColumn>
                                <TableHeaderColumn dataField='TotalCharacters' dataSort={true} width='60' dataAlign="right">Line Count</TableHeaderColumn>
                            </BootstrapTable>
                        </div>
                }
            </div>
        );
    }

    onSortChange(sortName, sortOrder) {
        sortOrder = this.state.sortName === sortName && this.state.sortOrder === "asc" ? "desc" : "asc";
        this.setState({
            sortName: sortName,
            sortOrder: sortOrder
        }, () => {
            this.getReport(this.state.currentPage, this.state.sizePerPage)
        });
    }

    EmployChanged(val) {
        this.setState({ Employ: val || '' })
    }

    ClientChanged(val) {
        this.setState({ Client: val || '' })
    }

    DoctorSelected(val) {
        this.setState({ Doctor: val || '' })
    }

    search() {
        // if (this.refs.empname.value === "" && this.refs.clientname.value === "" && this.refs.doctorname.val === ""
        //     && this.refs.fromDate.value === "" && this.refs.toDate === "") {
        //     return;
        // }
        this.setState({
            JobWorkLevel: this.refs.level.value
        });
        this.getReport(this.state.currentPage, this.state.sizePerPage);
    }

    clear() {

        this.state.Employ = "";
        this.state.Client = "";
        this.state.Doctor = "";
        this.state.fromDate = moment().startOf('month');
        this.state.toDate = moment();
        this.getReport(this.state.currentPage, this.state.sizePerPage);
    }

    onPageChange(page, sizePerPage) {
        this.getReport(page, sizePerPage);
    }

    onSizePerPageList(sizePerPage) {
        this.getReport(this.state.currentPage, sizePerPage);
    }
}

export default Employee