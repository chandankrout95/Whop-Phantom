import { google } from "googleapis";

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  undefined,
  process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  ["https://www.googleapis.com/auth/spreadsheets"],
);

export async function getSheetRows(sheetId: string, sheetName: string = "Sheet1") {
  const sheets = google.sheets({ version: "v4", auth });
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!A3:W`,
    });
    return res.data.values || [];
  } catch (error: any) {
    console.error(`Error fetching rows: ${error.message}`);
    throw error;
  }
}


export async function updateSheetStatus(
  sheetId: string,
  rowIndex: number,
  tableResults: { status: string; orderId: string }[], 
  sheetName: string = "insta",
  isApproved: boolean = false
) {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const sheet = spreadsheet.data.sheets?.find(s => s.properties?.title?.toLowerCase() === sheetName.toLowerCase());
  const gid = sheet?.properties?.sheetId;

  if (gid === undefined) throw new Error(`Sheet tab "${sheetName}" not found.`);

  const responseColumns = sheetName.toLowerCase().includes("tiktok") 
    ? [3, 9]           
    : [3, 9, 15, 21]; 

  const requests: any[] = tableResults.map((result, i) => {
    const startCol = responseColumns[i];
    if (startCol === undefined) return null; 

    const bgColor = result.status === "completed" 
      ? { red: 0, green: 0.5, blue: 0 } 
      : { red: 0.6, green: 0, blue: 0 };
    
    return {
      updateCells: {
        range: {
          sheetId: gid,
          startRowIndex: rowIndex - 1,
          endRowIndex: rowIndex,
          startColumnIndex: startCol,
          endColumnIndex: startCol + 2,
        },
        rows: [{
          values: [
            {
              userEnteredValue: { stringValue: result.status },
              userEnteredFormat: { backgroundColor: bgColor, textFormat: { foregroundColor: {red:1,green:1,blue:1}, bold: true } }
            },
            {
              userEnteredValue: { stringValue: result.orderId },
              userEnteredFormat: { backgroundColor: bgColor, textFormat: { foregroundColor: {red:1,green:1,blue:1} } }
            }
          ]
        }],
        fields: "userEnteredValue,userEnteredFormat(backgroundColor,textFormat)",
      }
    };
  }).filter(Boolean);

  if (isApproved) {
    requests.push({
      updateCells: {
        range: { sheetId: gid, startRowIndex: rowIndex - 1, endRowIndex: rowIndex, startColumnIndex: 5, endColumnIndex: 6 },
        rows: [{
          values: [{
            userEnteredValue: { stringValue: "APPROVED" },
            userEnteredFormat: { 
              backgroundColor: { red: 0, green: 0, blue: 0.6 }, 
              textFormat: { foregroundColor: {red:1,green:1,blue:1}, bold: true } 
            }
          }]
        }],
        fields: "userEnteredValue,userEnteredFormat(backgroundColor,textFormat)",
      }
    });
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    requestBody: { requests },
  });
}