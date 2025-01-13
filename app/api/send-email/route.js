// import nodemailer from "nodemailer";

// export async function POST(req) {
//   try {
//     const { email, subject, text, pdfData } = await req.json();

//     // Create Nodemailer transporter
//     const transporter = nodemailer.createTransport({
//       service: "gmail", // or use a custom SMTP service
//       auth: {
//         user: process.env.EMAIL_USER, // Use environment variable for security
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     // Decode base64 PDF data into a buffer
//     const pdfBuffer = Buffer.from(pdfData, "base64");

//     // Send the email
//     const info = await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject,
//       text,
//       attachments: [
//         {
//           filename: "Payslip.pdf",
//           content: pdfBuffer,
//         },
//       ],
//     });

//     return new Response(
//       JSON.stringify({ message: "Email sent successfully", info }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error sending email:", error);
//     return new Response(
//       JSON.stringify({ message: "Failed to send email", error }),
//       { status: 500 }
//     );
//   }
// }

import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email, subject, text, pdfData } = await req.json();

    // Validate input
    if (!email || !subject || !text || !pdfData) {
      return new Response(
        JSON.stringify({ message: "Invalid input data" }),
        { status: 400 }
      );
    }

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use a custom SMTP service
      auth: {
        user: process.env.EMAIL_USER, // Use environment variable for security
        pass: process.env.EMAIL_PASS,
      },
    });

    // Decode base64 PDF data into a buffer
    const pdfBuffer = Buffer.from(pdfData, "base64");

    // Send the email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text,
      attachments: [
        {
          filename: "Payslip.pdf",
          content: pdfBuffer,
        },
      ],
    });

    console.log("Email sent successfully:", info);

    return new Response(
      JSON.stringify({ message: "Email sent successfully", info }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ message: "Failed to send email", error: error.message }),
      { status: 500 }
    );
  }
}

