// backend/controllers/driveController.js
const { google } = require("googleapis");

exports.saveLetterToDrive = async (req, res) => {
  try {
    const { letterContent, title } = req.body;
    if (!letterContent || !title) {
      return res.status(400).json({ error: "Letter content and title are required." });
    }
    
    // Retrieve the user's access token from the session
    const user = req.user;
    if (!user || !user.accessToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Set up OAuth2 client with the user's access token
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.accessToken });
    
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    
    // Check if the "Letters" folder exists; if not, create it
    let folderId;
    const folderName = "Letters";
    
    const folderList = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`,
      fields: "files(id, name)",
      spaces: "drive",
    });
    
    if (folderList.data.files && folderList.data.files.length > 0) {
      folderId = folderList.data.files[0].id;
    } else {
      // Create the folder if it doesn't exist
      const folderMetadata = {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      };
      const folderResponse = await drive.files.create({
        resource: folderMetadata,
        fields: "id",
      });
      folderId = folderResponse.data.id;
    }
    
    // Prepare file metadata for a Google Doc and specify the parent folder
    const fileMetadata = {
      name: title,
      mimeType: "application/vnd.google-apps.document",
      parents: [folderId],
    };
    
    // Prepare the letter content (here as plain text; adjust as needed)
    const media = {
      mimeType: "text/plain",
      body: letterContent,
    };
    
    // Create the file on Google Drive within the specified folder
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });
    
    res.json({ fileId: response.data.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error saving letter to Google Drive" });
  }
};
