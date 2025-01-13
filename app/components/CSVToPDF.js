'use client';

import { useState } from 'react';
import Papa from 'papaparse';

const CSVToPDF = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [users, setUsers] = useState([]);

  // Handle CSV file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);

    // Parse CSV file using PapaParse
    Papa.parse(file, {
      complete: (result) => {
        setUsers(result.data);
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  // Handle the "Download All" button click (PDFs)
  const handleDownloadAllPDF = async () => {
    if (!users.length) return;

    // Send users data to the API route for PDF generation
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ users }),
    });

    const blob = await response.blob();

    // Create a link to download the ZIP file
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'user_profiles.zip';
    link.click();
  };

  // Handle the "Download Excel" button click
  const handleDownloadExcel = async () => {
    if (!users.length) return;

    // Send users data to the API route for Excel generation
    const response = await fetch('/api/generate-excel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ users }),
    });

    const blob = await response.blob();

    // Create a link to download the Excel file
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'user_profiles.xlsx';
    link.click();
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleDownloadAllPDF}>Download All PDFs</button>
      <button onClick={handleDownloadExcel}>Download Excel</button>
      <div>
        {users.map((user, index) => (
          <div key={index}>
            <span>{user.firstName} {user.lastName}</span>
            <a href={`/api/generate-pdf?user=${encodeURIComponent(JSON.stringify(user))}`} download={`${user.firstName}_${user.lastName}_Profile.pdf`}>Download PDF</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CSVToPDF;
