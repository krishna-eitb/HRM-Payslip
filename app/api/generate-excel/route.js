import * as XLSX from 'xlsx';

export async function POST(req) {
  const { users } = await req.json(); // Extract the user data from the request

  // Convert user data into an Excel sheet
  const worksheet = XLSX.utils.json_to_sheet(users);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

  // Generate the Excel file as a buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

  // Send the Excel file as a response
  return new Response(excelBuffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=user_profiles.xlsx',
    },
  });
}
