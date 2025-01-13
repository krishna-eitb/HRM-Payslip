"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const UploadXLSX = () => {
  const [file, setFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    if (
      uploadedFile &&
      uploadedFile.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setError("Please upload a valid XLSX file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        setUsers(jsonData);
        setError(null);
      } catch (e) {
        setError("Failed to parse the file");
      }
    };
    reader.readAsBinaryString(uploadedFile);
  };

  const addHeader = (doc) => {
    doc.setFillColor(233, 32, 79);
    doc.rect(0, 0, 210, 30, "F");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("EITB Global Info Solution Pvt Ltd", 50, 20);
  };

  const addFooter = (doc) => {
    doc.setFillColor(233, 32, 79);
    doc.rect(0, 270, 210, 30, "F");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(
      "Melbourne | Contact Info | www.Elephantintheboardroom.com.au",
      10,
      275
    );
  };

  const generatePayslipPDF = (user) => {
    const doc = new jsPDF();

    addHeader(doc); // Add header with logo and background color

    // Title Section: Payslip
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Black text
    doc.text(`Payslip - ${user["employee name"]}`, 14, 40);

    // Date Section
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 50);

    // Employee Information Section with border
    doc.setFontSize(12);
    doc.setTextColor(29, 53, 87); // Dark blue
    doc.text("Employee Information:", 14, 60);

    doc.setDrawColor(0, 0, 0); // Black border
    doc.setLineWidth(0.5);
    doc.rect(14, 65, 180, 50); // Employee info box
    doc.setTextColor(0, 0, 0); // Black text
    doc.text(`Employee Name: ${user["employee name"]}`, 20, 75);
    doc.text(`Employee ID: ${user["employee id"]}`, 100, 75);
    doc.text(`Email: ${user["email"]}`, 20, 85);
    doc.text(`Designation: ${user["designation"]}`, 100, 85);
    doc.text(`Days Worked: ${user["Days Worked"]}`, 20, 95);
    doc.text(`Salary Month: ${user["Salary Month"]}`, 100, 95);
    doc.text(`Paid Leaves: ${user["Paid Leaves"]}`, 20, 105);
    doc.text(`Loss of Pay: ${user["Loss of Pay"]}`, 100, 105);

    // Add a horizontal divider between sections
    doc.setLineWidth(1);
    doc.line(14, 115, 196, 115); // Horizontal line

    // Earnings and Deductions Section
    const earnings = [
      { description: "Basic Salary", amount: user["Basic Salary"] || "1000" },
      { description: "HRA", amount: user["HRA"] || "200" },
      { description: "Bonus", amount: user["Bonus"] || "100" },
    ];
    const deductions = [
      { description: "Tax", amount: user["Tax"] || "100" },
      { description: "Provident Fund", amount: user["Provident Fund"] || "50" },
    ];

    let yOffset = 120; // Start position for salary table
    doc.setFontSize(12);

    // Earnings Table with divider
    doc.setTextColor(29, 53, 87); // Dark blue for headers
    doc.text("Earnings:", 14, yOffset);
    yOffset += 10;
    doc.setTextColor(0, 0, 0); // Black text for data
    earnings.forEach((item) => {
      doc.text(`${item.description}: ${item.amount}`, 14, yOffset);
      yOffset += 10;
    });

    // Add a horizontal divider between earnings and deductions
    doc.setLineWidth(1);
    doc.line(14, yOffset, 196, yOffset); // Horizontal line
    yOffset += 5;

    // Deductions Table with divider
    doc.setTextColor(29, 53, 87); // Dark blue for headers
    doc.text("Deductions:", 14, yOffset);
    yOffset += 10;
    doc.setTextColor(0, 0, 0); // Black text for data
    deductions.forEach((item) => {
      doc.text(`${item.description}: ${item.amount}`, 14, yOffset);
      yOffset += 10;
    });

    // Net Pay Calculation and Display
    const totalEarnings = earnings.reduce(
      (acc, item) => acc + parseFloat(item.amount),
      0
    );
    const totalDeductions = deductions.reduce(
      (acc, item) => acc + parseFloat(item.amount),
      0
    );
    const netPay = totalEarnings - totalDeductions;

    doc.setFontSize(14);
    doc.text(`Net Pay: ₹${netPay.toFixed(2)}`, 14, yOffset);

    addFooter(doc); // Add footer with company info

    return doc;
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();

    users.forEach((user) => {
      const doc = generatePayslipPDF(user);
      const pdfData = doc.output("arraybuffer");
      zip.file(`${user["employee name"]}.pdf`, pdfData);
    });

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "users_pdfs.zip");
    });
  };

  const handleSendEmail = async (user) => {
    const doc = generatePayslipPDF(user);
    const pdfData = doc.output("datauristring").split(",")[1]; // Extract base64 data

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user["email"],
          subject: "Your Payslip",
          text: "Please find your payslip attached.",
          pdfData,
        }),
      });

      if (response.ok) {
        alert(`Payslip emailed to ${user["email"]}`);
      } else {
        const errorData = await response.json();
        console.log(`Failed to send email: ${errorData.message}`);
      }
    } catch (error) {
      alert("Error sending email.");
    }
  };

  const handleSendEmailAll = async () => {
    for (const user of users) {
      await handleSendEmail(user);
    }
    alert("Payslips emailed to all users");
  };

  const handleDownloadUser = (user) => {
    const doc = generatePayslipPDF(user);
    doc.save(`${user["employee name"]}.pdf`);
  };

  const handlePreviewUser = (user) => {
    const doc = generatePayslipPDF(user);
    setPreviewData(doc.output("datauristring"));
  };

  return (
    <div className="py-[100px] border-t-2">
      <h3 className="font-mono text-3xl mb-8 font-semibold mr-10">
        Upload your XLSX File here
      </h3>
      <input
        className="bg-primary px-6 py-4 mb-8 rounded-full text-white font-mono text-lg"
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}

      {users.length > 0 && (
        <div className="border-solid border-2 p-6 mt-6 t border-[#eaeaea] rounded-3xl">
          <h3 className="font-mono text-3xl font-semibold ">User Details:</h3>
          <ul>
            {users.map((user, index) => (
              <li
                className="p-4 flex justify-between items-center border-solid border-b-2 border-[#eaeaea] round font-mono"
                key={index}
              >
                <span className="font-semibold">{user["employee name"]}</span>{" "}
                <span className="mx-3 font-semibold">
                  Designation:{" "}
                  <span className="text-primary font-semibold">
                    {user["designation"]}
                  </span>
                </span>
                <button
                  className="bg-white border-2 border-primary rounded-full px-4  p-2 text-black font-mono font-semibold"
                  onClick={() => handleDownloadUser(user)}
                >
                  Download Payslip PDF
                </button>
                <button
                  className="bg-primary text-white rounded-full px-4 p-2 font-mono font-semibold ml-4"
                  onClick={() => handleSendEmail(user)}
                >
                  Send Email
                </button>
                <button
                  className="bg-gray-600 text-white rounded-full px-4 p-2 font-mono font-semibold ml-4"
                  onClick={() => handlePreviewUser(user)}
                >
                  Preview
                </button>
              </li>
            ))}
          </ul>
          <button
            className="mt-[60px] mb-[30px] bg-primary font-mono text-xl text-white px-4 py-2 rounded-full hover:border-solid border-2 hover:border-primary hover:bg-white hover:text-slate-400"
            onClick={handleDownloadAll}
          >
            Download All Payslips
          </button>
          <button
            className="mt-4 ml-[40px] font-mono border-primary text-black text-xl  px-4 py-2 rounded-full hover:border-solid border-2 hover:border-primary  hover:bg-primary hover:text-white"
            onClick={handleSendEmailAll}
          >
            Send All Emails
          </button>
        </div>
      )}

{previewData && (
       <div className={`preview-modal fixed inset-0 z-50 flex items-center justify-center ${previewData ? "block" : "hidden"}`}>
       <div className="overlay fixed inset-0 bg-black bg-opacity-50"></div>
       <div className="modal-content bg-white rounded-lg shadow-lg p-6 relative w-4/5 max-w-3xl">
         <iframe
           src={previewData}
           className="w-full h-[500px] border border-gray-200"
           title="PDF Preview"
         ></iframe>
         <button
           className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
           onClick={() => setPreviewData(null)}
         >
           Close
         </button>
       </div>
     </div>
     
      )}
    </div>
  );
};

export default UploadXLSX;