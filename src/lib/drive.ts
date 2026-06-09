import { google } from "googleapis"

function getAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/documents",
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
