import React, { useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import html2pdf from "html2pdf.js";
import { Col, Container, Row, Table } from "react-bootstrap";

const text10 = { fontSize: "10px" };
const text9 = { fontSize: "9px" };
const text8 = { fontSize: "8px" };

function RcdPrintTable({ payload, onClose }) {
  const printRef = useRef(null);
  if (!payload) return null;

  const header = payload.header || {};
  const formattedDate = payload.formattedDate || "";
  const shortDate = payload.shortDate || "";
  const collections = payload.collections || [];
  const totalCollections = Number(payload.totalCollections || 0);
  const autoAccountability = payload.autoAccountability || [];

  const handleLocalPrint = () => {
    const printContents = printRef.current?.querySelector("#printableArea")?.outerHTML;
    if (!printContents) return;

    const printWindow = window.open("", "", "width=800,height=600");
    if (!printWindow) return;

    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((node) => node.outerHTML)
      .join("\n");

    printWindow.document.write(`
      <html>
        <head>
          <title>RCD_Report_${formattedDate || "Print"}</title>
          ${styles}
          <style>
            @page { size: auto; margin: 10mm; }
            html, body { width: 100%; margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; font-size: 11px; background: #fff; }
            #printableArea {
              width: 100% !important;
              max-width: none !important;
              margin: 0 auto !important;
            }
            #printableArea #rcd-print-preview-root {
              width: 100% !important;
              max-width: none !important;
              margin: 0 !important;
              padding: 8mm !important;
              box-shadow: none !important;
            }
            table { border-collapse: collapse; width: 100%; font-size: 10px; }
            th, td { border: 1px solid black; padding: 6px; text-align: center; }
            thead { display: table-header-group; }
            tfoot { display: table-footer-group; }
            tr { page-break-inside: auto; }
            @media print {
              html, body { width: 100%; }
              body {
                margin: 0;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              #printableArea {
                width: 100% !important;
                max-width: none !important;
              }
              #printableArea #rcd-print-preview-root {
                width: 100% !important;
                max-width: none !important;
                margin: 0 !important;
                padding: 8mm !important;
              }
              .footer {
                position: fixed;
                bottom: 0;
                width: 100%;
                text-align: center;
                font-size: 10px;
                color: gray;
              }
            }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 200);
  };

  const handleLocalSavePdf = async () => {
    const previewElement = printRef.current?.querySelector("#rcd-print-preview-root");
    if (!previewElement) return;

    const collector = payload?.header?.officer || "collector";
    const datePart = (payload?.formattedDate || "").replace(/[^a-zA-Z0-9]+/g, "-");
    const filename = `RCD-${collector.replace(/[^a-zA-Z0-9]+/g, "-")}-${datePart || "report"}.pdf`;

    const exportRoot = document.createElement("div");
    exportRoot.style.position = "fixed";
    exportRoot.style.left = "-100000px";
    exportRoot.style.top = "0";
    exportRoot.style.background = "#fff";

    const clonedNode = previewElement.cloneNode(true);
    exportRoot.appendChild(clonedNode);
    document.body.appendChild(exportRoot);

    const options = {
      margin: 8,
      filename,
      image: { type: "png", quality: 1 },
      html2canvas: { scale: 3, useCORS: true, backgroundColor: "#ffffff", logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };

    try {
      await html2pdf().set(options).from(exportRoot).save();
    } finally {
      if (exportRoot.parentNode) exportRoot.parentNode.removeChild(exportRoot);
    }
  };

  return (
    <div ref={printRef}>
      <div className="d-flex align-items-center justify-content-between mb-3 no-print">
        <h5 className="m-0 fw-bold">Print Preview</h5>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-light border" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={handleLocalSavePdf}>
            Save PDF
          </button>
          <button type="button" className="btn btn-primary" onClick={handleLocalPrint}>
            Print
          </button>
        </div>
      </div>

       <div id="printableArea">
      <Container
        fluid
        id="rcd-print-preview-root"
        className="mx-auto bg-white"
        style={{ maxWidth: "8.5in", padding: "0.3in", lineHeight: 1.1 }}
      >
        <style>
          {`
            @media print {
              .no-print {
                display: none !important;
              }
            }
          `}
        </style>
      <div className="text-center mb-2">
        <h1 className="fw-bold mb-1" style={{ fontSize: "14px", letterSpacing: "0.02em" }}>
          REPORT OF COLLECTION AND DEPOSIT
        </h1>
        <h2 className="text-decoration-underline fw-medium mb-1" style={{ fontSize: "12px", letterSpacing: "0.2em" }}>
          {header.municipality}
        </h2>
        <p className="mb-0 fw-medium" style={text10}>
          LGU
        </p>
      </div>

      <Row className="pt-2 mb-2" style={text10}>
        <Col xs={8}>
          <div className="d-flex align-items-center mb-2">
            <span style={{ width: 48 }}>Fund:</span>
            <span className="border-bottom border-black fw-bold flex-grow-1 px-1">{header.fund}</span>
          </div>
          <div className="d-flex align-items-center">
            <span style={{ width: 140, whiteSpace: "nowrap" }}>Name of Accountable Officer:</span>
            <span className="border-bottom border-black fw-bold text-uppercase flex-grow-1 px-1">{header.officer}</span>
          </div>
        </Col>
        <Col xs={4} className="ps-4">
          <div className="d-flex align-items-center mb-2">
            <span style={{ width: 48 }}>Date:</span>
            <span className="border-bottom border-black fw-bold text-center text-uppercase flex-grow-1">{formattedDate}</span>
          </div>
          <div className="d-flex align-items-center">
            <span style={{ width: 72, whiteSpace: "nowrap" }}>Report No.</span>
          </div>
        </Col>
      </Row>

      <div className="border border-black mb-0">
        <div className="border-bottom border-black px-2 py-1 fw-bold" style={{ fontSize: "11px" }}>
          A. COLLECTIONS
        </div>
        <div className="border-bottom border-black px-4 py-1 fw-medium" style={text10}>
          1. For Collectors
        </div>
        <Table bordered responsive={false} className="mb-0" style={{ ...text10, tableLayout: "fixed" }}>
          <thead>
            <tr className="text-center">
              <th className="fw-normal align-middle" style={{ width: "28%" }}>
                Type (Form No.)
              </th>
              <th colSpan={2} className="fw-normal align-middle">
                Official Receipt/Serial No.
              </th>
              <th className="fw-normal align-middle" style={{ width: "24%" }}>
                Amount
              </th>
            </tr>
            <tr className="text-center" style={text9}>
              <th></th>
              <th className="fw-normal" style={{ width: "18%" }}>
                From
              </th>
              <th className="fw-normal" style={{ width: "18%" }}>
                To
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {collections.map((item, i) => (
              <tr key={i}>
                <td className="px-2 text-uppercase text-truncate" style={text9}>
                  {item.type}
                </td>
                <td className="text-center font-monospace">{item.from}</td>
                <td className="text-center font-monospace">{item.to}</td>
                <td className="text-end px-2 fw-bold">
                  {Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
            <tr className="fw-bold">
              <td colSpan={3} className="text-end px-3" style={text10}>
                TOTAL COLLECTIONS (PHP)
              </td>
              <td className="text-end px-2 text-decoration-underline">
                {totalCollections.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </Table>
      </div>

      <div className="border border-black border-top-0">
        <div className="border-bottom border-black px-4 py-1 fw-medium" style={text10}>
          2. For Liquidating Officers/Treasurer
        </div>
        <Table bordered responsive={false} className="mb-0" style={{ ...text10, tableLayout: "fixed" }}>
          <thead>
            <tr className="text-center">
              <th className="fw-normal" style={{ width: "45%" }}>
                Name of Accountable Officer
              </th>
              <th className="fw-normal" style={{ width: "20%" }}>
                Report No.
              </th>
              <th className="fw-normal" style={{ width: "35%" }}>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="fw-bold text-uppercase text-center" style={text9}>
                Amabella S. Ramos
              </td>
              <td></td>
              <td className="text-end px-2 fw-bold">
                {totalCollections.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </Table>
        <Table bordered responsive={false} className="mb-0" style={{ ...text10, tableLayout: "fixed" }}>
          <thead>
            <tr className="text-center">
              <th className="fw-normal" style={{ width: "45%" }}>
                Accountable Officer/Bank
              </th>
              <th className="fw-normal" style={{ width: "20%" }}>
                Reference
              </th>
              <th className="fw-normal" style={{ width: "35%" }}></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="fw-bold text-uppercase text-center" style={text9}>
                Paul Ree Ambrose A. Martinez
              </td>
              <td className="fst-italic text-center">OR's</td>
              <td></td>
            </tr>
          </tbody>
        </Table>
      </div>

      <div className="border border-black border-top-0">
        <div className="border-bottom border-black px-2 py-1 fw-bold" style={{ fontSize: "11px" }}>
          C. ACCOUNTABILITY OF ACCOUNTABLE FORMS
        </div>
        <Table bordered responsive={false} className="mb-0 text-center" style={{ ...text8, tableLayout: "fixed", lineHeight: 1 }}>
          <thead>
            <tr className="text-uppercase align-middle">
              <th rowSpan={2} style={{ width: "16%" }}>
                Name of Form
              </th>
              <th colSpan={3} style={{ width: "21%" }}>
                Beg. Balance
              </th>
              <th colSpan={3} style={{ width: "21%" }}>
                Receipt
              </th>
              <th colSpan={3} style={{ width: "21%" }}>
                Issued
              </th>
              <th colSpan={3} style={{ width: "21%" }}>
                Ending Balance
              </th>
            </tr>
            <tr>
              <th>QTY</th>
              <th>From</th>
              <th>To</th>
              <th>QTY</th>
              <th>From</th>
              <th>To</th>
              <th>QTY</th>
              <th>From</th>
              <th>To</th>
              <th>QTY</th>
              <th>From</th>
              <th>To</th>
            </tr>
          </thead>
          <tbody>
            {autoAccountability.map((item, idx) => (
              <tr key={idx}>
                <td className="text-start px-1 text-uppercase fw-medium text-truncate">{item.name}</td>
                <td className="text-secondary fst-italic">{item.begQty || 0}</td>
                <td className="text-secondary">{item.begFrom || 0}</td>
                <td className="text-secondary">{item.begTo || 0}</td>
                <td className="fw-bold">{item.recQty}</td>
                <td className="font-monospace">{item.recFrom || 0}</td>
                <td className="font-monospace">{item.recTo || 0}</td>
                <td className="fw-bold text-danger">{item.issuedQty}</td>
                <td className="font-monospace text-danger">{item.issuedFrom || 0}</td>
                <td className="font-monospace text-danger">{item.issuedTo || 0}</td>
                <td className="fw-bold bg-light">{item.endQty}</td>
                <td className="font-monospace bg-light">{item.endFrom || 0}</td>
                <td className="font-monospace bg-light">{item.endTo || 0}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="border border-black border-top-0 mb-3">
        <div className="border-bottom border-black px-2 py-1 fw-bold text-uppercase" style={{ fontSize: "11px" }}>
          Summary of Collections and Remittances
        </div>
        <Row style={text10}>
          <Col xs={8} className="p-3 fw-medium">
            <p className="mb-1">Beginning Balance</p>
            <p className="mb-1">Add: Collection</p>
            <p className="mb-1">Less: Remittance/Deposit</p>
            <p className="pt-1 mb-0 fw-bold">Ending Balance</p>
          </Col>
          <Col xs={4} className="p-3 text-end fw-bold border-start border-black">
            <p className="mb-1 border-bottom border-black">&nbsp;</p>
            <p className="mb-1 border-bottom border-black">{totalCollections.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            <p className="mb-1 border-bottom border-black pb-1">
              &nbsp;
            </p>
            <p className="pt-1 mb-0 border-bottom border-black">&nbsp;</p>
            <div className="d-flex justify-content-between fw-bolder mt-2 pt-1" style={{ fontSize: "11px" }}>
              <span>TOTAL</span>
            </div>
          </Col>
        </Row>
      </div>

      <Row className="border border-black" style={{ fontSize: "9px", minHeight: 140 }}>
        <Col xs={6} className="border-end border-black p-3 d-flex flex-column justify-content-between">
          <div>
            <p className="fw-bold text-uppercase mb-2">Certification</p>
            <p className="ps-4 fst-italic">
              I hereby certify that the foregoing report of collections and deposits and accountability for accountable forms is true and correct.
            </p>
          </div>
          <Row className="mt-4 text-center align-items-end px-2" style={{ fontSize: "7px" }}>
            <Col xs={8}>
              <p className="border-bottom border-black mb-1 pt-1 fw-bold text-uppercase" style={{ fontSize: "10px" }}>
                {header.officer}
              </p>
              <p className="mb-0 fw-medium text-uppercase">Accountable Officer</p>
            </Col>
            <Col xs={4}>
              <p className="border-bottom border-black mb-1 pt-1 fw-bold" style={{ fontSize: "10px" }}>
                {shortDate}
              </p>
              <p className="mb-0 fw-medium text-uppercase">Date</p>
            </Col>
          </Row>
        </Col>
        <Col xs={6} className="p-3 d-flex flex-column justify-content-between">
          <div>
            <p className="fw-bold text-uppercase mb-2">Verification and Acknowledgment</p>
            <p className="ps-4 fst-italic">
              I hereby certify that the foregoing report of collections has been verified and acknowledge receipt of PHP____________________.
            </p>
          </div>
          <Row className="mt-4 text-center align-items-end px-2" style={{ fontSize: "7px" }}>
            <Col xs={8}>
              <p className="border-bottom border-black mb-1 pt-1 fw-bold text-uppercase" style={{ fontSize: "10px" }}>
                {header.treasurer}
              </p>
              <p className="mb-0 fw-medium text-uppercase">Municipal Treasurer</p>
            </Col>
            <Col xs={4}>
              <p className="border-bottom border-black mb-1 pt-1 fw-bold" style={{ fontSize: "10px" }}>
                {shortDate}
              </p>
              <p className="mb-0 fw-medium text-uppercase">Date</p>
            </Col>
          </Row>
        </Col>
      </Row>
      </Container>
      </div>
    </div>
  );
}

export default RcdPrintTable;
