import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import JSZip from 'jszip';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
  },
  userDetails: {
    fontSize: 12,
    marginTop: 5,
  },
  line: {
    borderBottom: '1px solid black',
    marginBottom: 10,
    marginTop: 5,
  },
});

export async function POST(req) {
  const { users } = await req.json(); // Get users data from the request

  const zip = new JSZip();

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    const MyDocument = () => (
      <Document>
        <Page style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>User Profile</Text>
            <View style={styles.line}></View>
            <Text style={styles.userDetails}>Name: {user.firstName} {user.lastName}</Text>
            <Text style={styles.userDetails}>Designation: {user.designation}</Text>
            <Text style={styles.userDetails}>Phone: {user.phone}</Text>
            <Text style={styles.userDetails}>Email: {user.email}</Text>
          </View>
        </Page>
      </Document>
    );

    // Generate the PDF as a Blob and add it to the ZIP
    const pdfBlob = await pdf(<MyDocument />).toBlob();
    zip.file(`${user.firstName}_${user.lastName}_Profile.pdf`, pdfBlob);
  }

  // Generate ZIP content as a blob
  const zipContent = await zip.generateAsync({ type: 'nodebuffer' });

  return new Response(zipContent, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename=user_profiles.zip',
    },
  });
}
