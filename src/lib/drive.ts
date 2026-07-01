import { google } from "googleapis"

function getAuth(extraScopes: string[] = []) {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/documents",
      ...extraScopes,
    ],
  })
}

export async function createClientFolder(clientName: string): Promise<string> {
  const auth = getAuth()
  const drive = google.drive({ version: "v3", auth })

  const res = await drive.files.create({
    requestBody: {
      name: clientName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [process.env.GOOGLE_DRIVE_CLIENTS_FOLDER_ID!],
    },
    fields: "id",
  })

  return res.data.id!
}

export async function setupClientFolder(
  clientName: string
): Promise<{ folderId: string; sheetUrl: string }> {
  const auth = getAuth(["https://www.googleapis.com/auth/spreadsheets"])
  const drive = google.drive({ version: "v3", auth })
  const sheets = google.sheets({ version: "v4", auth })

  const folderRes = await drive.files.create({
    requestBody: {
      name: clientName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [process.env.GOOGLE_DRIVE_CLIENTS_FOLDER_ID!],
    },
    fields: "id",
  })
  const folderId = folderRes.data.id!

  const sheetRes = await drive.files.create({
    requestBody: {
      name: "Workout Log",
      mimeType: "application/vnd.google-apps.spreadsheet",
      parents: [folderId],
    },
    fields: "id",
  })
  const sheetId = sheetRes.data.id!

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: "Sheet1!A1:F1",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [["Week", "Session (First/Last)", "Exercise", "Weight (lbs)", "Reps", "Sets"]],
    },
  })

  await Promise.all([
    drive.files.create({
      requestBody: {
        name: "Progress Photos",
        mimeType: "application/vnd.google-apps.folder",
        parents: [folderId],
      },
      fields: "id",
    }),
    drive.files.create({
      requestBody: {
        name: "Form Check Videos",
        mimeType: "application/vnd.google-apps.folder",
        parents: [folderId],
      },
      fields: "id",
    }),
  ])

  return {
    folderId,
    sheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/edit`,
  }
}

export async function createGoogleDoc(
  folderId: string,
  title: string,
  content: string
): Promise<string> {
  const auth = getAuth()
  const drive = google.drive({ version: "v3", auth })
  const docs = google.docs({ version: "v1", auth })

  const file = await drive.files.create({
    requestBody: {
      name: title,
      mimeType: "application/vnd.google-apps.document",
      parents: [folderId],
    },
    fields: "id",
  })

  const docId = file.data.id!

  await docs.documents.batchUpdate({
    documentId: docId,
    requestBody: {
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: content,
          },
        },
      ],
    },
  })

  return `https://docs.google.com/document/d/${docId}/edit`
}
