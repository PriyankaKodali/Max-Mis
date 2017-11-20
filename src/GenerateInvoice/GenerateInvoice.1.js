import React, { Component } from 'react';
import $ from 'jquery';
import { Link } from 'react-router-link';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import { MyAjax, MyAjaxForAttachments } from '.././MyAjax';
import { ApiUrl } from '.././Config';
import './GenerateInvoice.css';

import jsPDF from 'jspdf';
// import { Document, Page } from 'react-pdf';
import { toast } from 'react-toastify';
// import { Page, Text, View, Document, StyleSheet } from '@react-pdf/core';
// import 'regenerator-runtime/runtime';
// import t from 'flow-runtime';


var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;
var moment = require('moment');


class GenerateInvoice extends Component {

    constructor(props) {
        super(props);
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

            // indianDate: moment().format("DD/MM/YYYY"),
            // invoiceIndianDueDate: moment().add(10, "days").format("DD/MM/YYYY"),

            unpaidBal: 0,
            invoiceId: '',
            companyAddress: "MAX TRANS SYSTEMS LLC 1032 EAST WACO  KERMIT, TX 79745",
            InvoiceTime: moment().format("hh:mm:ss")
        }
    }

    componentWillMount() {
        this.setState({ Client_Id: this.props.match.params["ClientId"] });
        if (this.props.location.state) {
            this.setState
                ({
                    Client: { value: this.props.location.state["ClientId"] },
                    fromDate: moment(this.props.location.state["fromDate"]),
                    toDate: moment(this.props.location.state["toDate"])
                }, () => {
                    var url = ApiUrl + "/api/Invoices/GetInvoiceDetails?ClientId=" + this.state.Client.value +
                        "&fromdate=" + moment(this.state.fromDate).format("MM-DD-YYYY") +
                        "&todate=" + moment(this.state.toDate).format("MM-DD-YYYY")
                    $.ajax({
                        url,
                        type: "GET",
                        success: (data) => this.setState({ ClientInvoice: data["invoice"] })
                    })
                })
        }
    }

    render() {
        return (


            <div>

                {/* <div id="invoice">
                       <p className="myinvoice">
                                     <strong>Invoice Date : {' '}</strong> <span />
                                    {this.state.invoiceDate} <br />
                                <strong >Invoice Due Date <span /><span /> : {' '}</strong>
                                {this.state.invoiceDueDate} <br />
                                <strong >Invoice Number : {' '}<span /> </strong>
                                {this.state.invoiceDueDate}<br />
                                    </p>
                    </div> */}
                <div id="Grid">


                    <div className="myInvoice">

                        <div className="col-xs-12" style={{ width: '890px' }}>
                            <div className="col-xs-3">
                                <img className="myImage" src="Images/logo.png" alt="" />
                            </div>
                            <div className="col-xs-9">

                                <p className="myinvoice">
                                    <strong id="invoiceDate">Invoice Date : {' '}</strong> <span />
                                    {this.state.invoiceDate} <br />
                                    <strong >Invoice Due Date <span /><span /> : {' '}</strong>
                                    {this.state.invoiceDueDate} <br />
                                    <strong >Invoice Number : {' '}<span /> </strong>
                                    {this.state.invoiceDueDate}<br />
                                </p>

                            </div>
                        </div>
                        <div /> <br />

                        <div className="col-xs-12">
                            <p>
                                MAX TRANS SYSTEMS LLC,<br />
                                1032 EAST WACO<br />
                                KERMIT, TX 79745 <br />
                                (432) 614-4500<br />
                                <a>manoj@maxtranssystems.com</a>
                            </p>
                        </div> <br />

                        <div className="col-xs-12">
                            <p><b>Bill To :</b></p>
                            <p>  {this.state.ClientInvoice["Address"]} </p>
                        </div>

                        <div className="col-xs-12">
                            <table id="tbl1" className="mytable" style={{ fontSize: '9px' }}>
                                <thead className="mytable">
                                    <tr>
                                        <th className="thick-line cellAlign"> Sno </th>
                                        <th className="thick-line"> Service Description </th>
                                        <th className="thick-line cellAlign"> Month </th>
                                        <th className="thick-line cellAlign"> Unit Price </th>
                                        <th className="cellAlign tabcolumn"> Total Lines </th>
                                        <th className="thick-line amount"> Amount </th>
                                    </tr>
                                </thead>
                                <tbody className="mytable">
                                    <tr>
                                        <td className="thick-line numalign">{this.state.ClientInvoice["RowNum"]}</td>
                                        <td className="thick-line cellAlign">{this.state.ClientInvoice["ServiceType"]}</td>
                                        <td className="cellAlign">{this.state.ClientInvoice["MonthYear"]}  </td>
                                        <td className="numalign">{this.state.ClientInvoice["UnitPrice"]}</td>
                                        <td className="numalign">{this.state.ClientInvoice["LineCount"]}</td>
                                        <td className="mybal" >{this.state.ClientInvoice["Amount"]}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <table id="tbl2" className="clientsummary" style={{ fontSize: '9.5px', width: '37.5%', float: 'right' }}>
                                <tr >
                                    <td style={{ width: "57%" }}><b className="tabcolumn">Total Charges:</b></td>
                                    <td className="mybal"> {this.state.ClientInvoice["Amount"]} </td>
                                </tr>
                                <tr>
                                    <td><b> Unpaid Balances: </b></td>
                                    <td className="mybal">

                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Account Balance as of {this.state.invoiceDate}</b></td>
                                    <td className="mybal"> {this.state.ClientInvoice["Amount"]}  </td>
                                </tr>
                            </table>
                        </div>

                        <div className="col-xs-12"> <hr /> </div>
                        <div className="col-xs-12">
                            <div className="col-xs-4"> www.maxtranscriptionsystems.com </div>
                            <div className="col-xs-4">  + 432-614-4500</div>
                            <div className="col-xs-4">  MAX TRANS SYSTEMS LLC.</div>
                        </div>


                        <div className="col-md-12" style={{ textAlign: "center", marginBottom: "30px" }}>

                            <button className="btn btn-success" onClick={this.handliSubmit.bind(this)}>Save</button> <span />
                            <button className="btn btn-success" onClick={this.pdfToHTML.bind(this)}>Generate Pdf</button> <span />
                            {/* <button className="btn btn-success" onClick={this.postData.bind(this)} > Generate Pdf </button> */}
                        </div>
                    </div>

                </div>

            </div>
        )
    }

    // postData(e) {
    //     var html = $("#Grid").html();
    //     this.openWindowWithPost(ApiUrl + "/api/Pdf/ExportPdf", {
    //         html: html
    //     });
    //     // $.post(
    //     //     ApiUrl + "/api/Pdf/ExportPdf",
    //     //     { html: html },
    //     //     (data) => { window.open(data, "_blank") }
    //     // )
    // }

    // openWindowWithPost(url, data) {
    //     var form = document.createElement("form");
    //     form.target = "_blank";
    //     form.method = "POST";
    //     form.action = url;
    //     form.style.display = "none";

    //     for (var key in data) {
    //         var input = document.createElement("input");
    //         input.type = "hidden";
    //         input.name = key;
    //         input.value = data[key];
    //         form.appendChild(input);
    //     }

    //     document.body.appendChild(form);
    //     form.submit();
    //     document.body.removeChild(form);

    // }

    handliSubmit(e) {
        e.preventDefault();
        var data = new FormData();
        data.append("Client_Id", this.props.location.state["ClientId"]);
        data.append("CompanyAddress", this.state.companyAddress);
        data.append("ClientAddress", this.state.ClientInvoice["Address"]);
        data.append("InvoiceDate", this.state.invoiceDate);
        data.append("InvoicedId", this.state.invoiceId.value);
        data.append("InvoiceTime", this.state.InvoiceTime);
        data.append("InvoiceAmount", this.state.ClientInvoice["Amount"]);
        data.append("UnpaidBalance", this.state.unpaidBal);
        data.append("ClientService", this.state.ClientInvoice["ServiceId"]);
        data.append("UnitPrice", this.state.ClientInvoice["UnitPrice"]);
        data.append("TotalAmount", this.state.ClientInvoice["Amount"]);
        data.append("Status", "Created");

        // data.append("ApprovedBy",)
        // data.append("ApprovedDate", )   
        // data.append("ApprovedTime", moment().format("hh:mm:ss"));
        // data.append("InvoiceUrl", )

        let url = ApiUrl + "/api/AddData/AddInvoice";
        try {
            MyAjaxForAttachments(
                url,
                (data) => {
                    toast("client invoice saved successfully!", {
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

    pdfToHTML() {
        // alert('PdfPrint');

        // //  var pdf = require('html-pdf');
        // //  var fs = require('fs');
        // //  var html = fs.readFileSync('#PdfPrint', 'utf8');
        // //                var pdf = require('PdfPrint');
        // //  pdf.create(html).toFile('test.pdf',
        // //     function(err, res){
        // //   console.log(res.filename);
        // //   })

        // $('#PdfPrint').jqprint;


        // let url = ApiUrl + "/api/pdf/ExportPdf";
        // $.ajax({
        //     url,
        //     type: "post",
        //     success: function (response) {
        //     }
        // })



        // $(document).ready(function () {

        //          $(".btn").click(function () { 
        //            html2canvas(document.body,{
        //            onrendered:function(canvas){

        //              var doc = new jsPDF("p", "pt", "letter", 'Landscape'),
        //             source = $("#Grid")[0],
        //             border = 10,

        //             margins = {
        //                 top: 40,
        //                 bottom: 60,
        //                 left: 20,
        //                 width: 450
        //             };

        //             doc.addHTML(
        //                 source, // HTML string or DOM elem ref.
        //                 margins.left, // x coord
        //                 margins.top,
        //                 {
        //                     // y coord
        //                     width: margins.width // max width of content on PDF
        //                 },

        //                 function (dispose) {
        //                     // dispose: object with X, Y of the last line add to the PDF
        //                     //          this allow the insertion of new lines after html
        //                     //  doc.setFontSize(12);
        //                     //  doc.text(420 , 50 , 'Invoice Date :');
        //                     //  doc.text(420, 55, 'j');

        //                     doc.save("Test.pdf");
        //                 }, margins
        //             );
        //         }
        //          });
        //          }


        $(".btn").click(function () {

            var doc = new jsPDF("p", "pt", "letter", 'Landscape'),
                source = $("#Grid")[0],
                border = 10,

                margins = {
                    top: 40,
                    bottom: 60,
                    left: 20,
                    width: 450
                };

            doc.addHTML(
                source, // HTML string or DOM elem ref.
                margins.left, // x coord
                margins.top,
                {
                    // y coord
                    width: margins.width // max width of content on PDF
                },

                function (dispose) {
                    // dispose: object with X, Y of the last line add to the PDF
                    //          this allow the insertion of new lines after html
                    //  doc.setFontSize(12);
                    //  doc.text(420 , 50 , 'Invoice Date :');
                    //  doc.text(420, 55, 'j');

                    doc.save("Test.pdf");
                }, margins
            );
        }
        );
        //    });
    }
}


export default GenerateInvoice;







{/*  <table className="headerTable">
                           <tr>
                                 <td style={{ textAlign: "left" }} >
                                  <img className="myImage" src="Images/logo.png" alt="" /> 
                                </td>
                                <td className="headerTable" >
                                    <strong>Invoice Date : {' '}</strong> <span />
                                    {this.state.invoiceDate} <div />
                                    <strong>Invoice Due Date <span /><span /> : {' '}</strong>
                                    {this.state.invoiceDueDate} <div />
                                    <strong>Invoice Number : {' '}<span /> </strong>
                                    {this.state.invoiceDueDate}<div />
                                </td>
                            </tr>

                            <tr >
                                <p>
                                    MAX TRANS SYSTEMS LLC,<div /> <span />
                                    1032 EAST WACO<div />
                                    KERMIT, TX 79745 <div />
                                    (432) 614-4500<div />
                                    <a>manoj@maxtranssystems.com</a>
                                </p>
                                <div />
                            </tr>

                            <tr>
                                <p><b>Bill To :</b></p>
                                <p>  {this.state.ClientInvoice["Address"]} </p>
                            </tr>
                           <table className="clientTable">
                                    <thead>
                                        <tr>
                                            <th className="thick-line cellAlign"> Sno </th>
                                            <th className="thick-line"> Service Description </th>
                                            <th className="thick-line cellAlign"> Month </th>
                                            <th className="thick-line cellAlign"> Unit Price </th>
                                            <th className="cellAlign tabcolumn"> Total Lines </th>
                                            <th className="thick-line amount"> Amount </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="thick-line numalign">{this.state.ClientInvoice["RowNum"]}</td>
                                            <td className="thick-line cellAlign">{this.state.ClientInvoice["ServiceType"]}</td>
                                            <td className="cellAlign">{this.state.ClientInvoice["MonthYear"]}  </td>
                                            <td className="numalign">{this.state.ClientInvoice["UnitPrice"]}</td>
                                            <td className="numalign">{this.state.ClientInvoice["LineCount"]}</td>
                                            <td className="mybal" >{this.state.ClientInvoice["Amount"]}</td>
                                        </tr>
                                    </tbody>
                                </table>

                            <table className="summaryTable">
                                <tr>
                                    <td style={{ width: "57%" }}><b>Total Charges:</b></td>
                                    <td> {this.state.ClientInvoice["Amount"]} </td>
                                </tr>
                                <tr>
                                    <td><b> Unpaid Balances: </b></td>
                                    <td>
                                         </td>
                                </tr>
                                <tr>
                                    <td><b>Account Balance as of {this.state.invoiceDate}</b></td>
                                    <td> {this.state.ClientInvoice["Amount"]}  </td>
                                </tr>
                            </table> 

                             <table className="footerTable">
                                 {/* <tr > <hr style={{width: '265%' }}  > </tr> 
                                <tr>
                                    <td>www.maxtranscriptionsystems.com</td>
                                    <td>+ 432-614-4500</td>
                                    <td>MAX TRANS SYSTEMS LLC.</td>
                                </tr>
                            </table>
                        </table> */}
