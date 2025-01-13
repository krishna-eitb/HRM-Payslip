import * as XLSX from 'xlsx';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file || file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    return new Response('Invalid file type', { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  // Assuming the first sheet contains user data
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const users = XLSX.utils.sheet_to_json(worksheet);

  return new Response(JSON.stringify({ users }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
