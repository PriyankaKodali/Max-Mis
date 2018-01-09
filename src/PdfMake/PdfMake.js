
// import React, { Component } from 'react';
// import { ApiUrl } from '.././Config';
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// import $ from 'jquery';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
// var moment = require('moment');


// class PdfMake extends Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             fromDate: '06-01-2017',
//             toDate: '06-30-2017',
//             temparr: '',
//             ClientInvoice: '',
//             ClientDue: ''
//         }

//     }

//     _exportPdfTable = () => {

//         var temparr = [];
//         var ClientInvoice = [];

//         var url = ApiUrl + "/api/Invoices/GetInvoiceDetails?ClientId=" + 17 +
//             "&fromdate=" + '06-06-2017' +
//             "&todate=" + '06-30-2017' +
//             "&invoiceId=" + 'MAX-270617_1';
//         $.ajax({
//             url,
//             type: "GET",
//             success: function (data) {
//                 ClientInvoice: data["invoices"]
//                 ClientDue: data["clientDueAmount"]

//                 for (var i = 0; i < data["invoices"].length; i++) {
//                     temparr.push({
//                         SNO: data["invoices"][i].RowNum,
//                         serviceType: data["invoices"][i].ServiceType,
//                         unitPrice: data["invoices"][i].UnitPriceforDisplay,
//                         LineCount: data["invoices"][i].LineCount
//                     })
//                 }

//                 var docDefinition = {
//                     content: [
//                         {
//                             table: {
//                                 headerRows: 1,
//                                 widths: ['*', 'auto', 100, '*'],
//                                 body: temparr
//                             }
//                         }]
//                 };
//                 pdfMake.createPdf(docDefinition).download();
//             }
//         });



//         // var dd = {
//         //         content: [
//         //             { text: 'Dynamic parts', style: 'header' },
//         //             this.table(temparr, ['S.No', 'Service Type', 'Unit Price', 'LineCount'])
//         //         ]
//         //     };

//         //     var dd = {
//         // 	content: [
//         // 		{text: 'Defining column widths', style: 'subheader'},
//         // 		'Tables support the same width definitions as standard columns:',
//         // 		{
//         // 			bold: true,
//         // 			ul: [
//         // 				'auto',
//         // 				'star',
//         // 				'fixed value'
//         // 			]
//         // 		},
//         // 		{
//         // 			style: 'tableExample',
//         // 			table: {
//         // 				widths: [100, '*', 200, '*'],
//         // 				body: [
//         // 					['width=100', 'star-sized', 'width=200', 'star-sized'],
//         // 					['fixed-width cells have exactly the specified width', {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}]
//         // 				]
//         // 			}
//         // 		},
//         // 		{
//         // 			style: 'tableExample',
//         // 			table: {
//         // 				widths: ['*', 'auto'],
//         // 				body: [
//         // 					['This is a star-sized column. The next column over, an auto-sized column, will wrap to accomodate all the text in this cell.', 'I am auto sized.'],
//         // 				]
//         // 			}
//         // 		},
//         // 		{
//         // 			style: 'tableExample',
//         // 			table: {
//         // 				widths: ['*', 'auto'],
//         // 				body: [
//         // 					['This is a star-sized column. The next column over, an auto-sized column, will not wrap to accomodate all the text in this cell, because it has been given the noWrap style.', {text: 'I am auto sized.', noWrap: true}],
//         // 				]
//         // 			}
//         // 		},
//         // 		{text: 'Defining row heights', style: 'subheader'},
//         // 		{
//         // 			style: 'tableExample',
//         // 			table: {
//         // 				heights: [20, 50, 70],
//         // 				body: [
//         // 					['row 1 with height 20', 'column B'],
//         // 					['row 2 with height 50', 'column B'],
//         // 					['row 3 with height 70', 'column B']
//         // 				]
//         // 			}
//         // 		},
//         // 		'With same height:',
//         // 		{
//         // 			style: 'tableExample',
//         // 			table: {
//         // 				heights: 40,
//         // 				body: [
//         // 					['row 1', 'column B'],
//         // 					['row 2', 'column B'],
//         // 					['row 3', 'column B']
//         // 				]
//         // 			}
//         // 		}
//         // 	],
//         // 	styles: {
//         // 		header: {
//         // 			fontSize: 18,
//         // 			bold: true,
//         // 			margin: [0, 0, 0, 10]
//         // 		},
//         // 		subheader: {
//         // 			fontSize: 16,
//         // 			bold: true,
//         // 			margin: [0, 10, 0, 5]
//         // 		},
//         // 		tableExample: {
//         // 			margin: [0, 5, 0, 15]
//         // 		},
//         // 		tableHeader: {
//         // 			bold: true,
//         // 			fontSize: 13,
//         // 			color: 'black'
//         // 		}
//         // 	},
//         // 	defaultStyle: {
//         // 		// alignment: 'justify'
//         // 	}

//         // }
//         // pdfMake.createPdf(dd).download();
//         //     }

//     }


//     render() {
//         return (
//             <div style={{ marginTop: '10%' }}>
//                 <header >
//                     {/* <img src={logo} className="App-logo" alt="logo" /> */}
//                     <h1>React + pdfmake</h1>
//                 </header>
//                 <p >
//                     Sample PDF report generator using React and pdfmake.
//         </p>
//                 <p>
//                     <button onClick={this._exportPdfTable}>
//                         Export PDF
//           </button>
//                 </p>
//             </div>
//         );
//     }
// }

// export default PdfMake;