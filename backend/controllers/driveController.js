const { google } = require('googleapis');

exports.saveLetterToDrive = async (req, res) => {
  try {
    const { letterContent, title } = req.body;
    if (!letterContent || !title) {
      return res.status(400).json({ error: 'Letter content and title are required.' });
    }
    // Retrieve the user's access token from the session
    const user = req.user;
    if (!user || !user.accessToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Set up OAuth2 client with the user's access token
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.accessToken });
    
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    
    // Prepare file metadata for a Google Doc
    const fileMetadata = {
      name: title,
      mimeType: 'application/vnd.google-apps.document'
    };
    
    // Prepare the letter content as plain text
    const media = {
      mimeType: 'text/plain',
      body: letterContent
    };
    
    // Create the file on Google Drive
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    });
    
    res.json({ fileId: response.data.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error saving letter to Google Drive' });
  }
};
