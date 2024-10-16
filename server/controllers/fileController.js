  const { PassThrough } = require('stream');
  const { google } = require('googleapis');
  const File = require("../models/fileModel");
  const TryCatch = require("../middlewares/errorHandler.js");
  const Log = require("../models/logModel");

  // Auth with service account
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/drive'] // Scopes
  );

  // Initialize drive client
  const drive = google.drive({ version: 'v3', auth });

  // Upload Files
  const uploadFile = TryCatch(async (req, res) => {
    const stream = new PassThrough();
    stream.end(req.file.buffer);
  
    const fileMetadata = {
      name: req.file.originalname,
      parents: ['1HHB4A6YjLc90ZMlUbYcX97Gr51bEldfV'],
    };
  
    const media = {
      mimeType: req.file.mimetype,
      body: stream,
    };
  
    try {
      // Upload the file
      const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
      });
  
      console.log("File created with ID:", response.data.id);
  
      // Set the file to be publicly accessible
      try {
        await drive.permissions.create({
          fileId: response.data.id,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        });
        console.log("Permissions set for file:", response.data.id);
      } catch (permissionError) {
        console.error("Error setting file permissions:", permissionError);
        // Continue execution even i permission setting fails
      }
  
      // Get the updated file with web view link
      const file = await drive.files.get({
        fileId: response.data.id,
        fields: 'webViewLink, webContentLink',
      });
  
      console.log("File links:", file.data);
  
      const newFile = new File({
        filename: req.file.originalname,
        fileUrl: file.data.webContentLink || `https://drive.google.com/uc?export=download&id=${response.data.id}`,
        viewUrl: file.data.webViewLink || `https://drive.google.com/file/d/${response.data.id}/view?usp=drivesdk`,
        title: req.body.title,
        subject: req.body.subject,
        semester: req.body.semester,
        keyword: req.body.keyword,
        user: req.user._id,
      });
      await newFile.save();
  
      // Log entry
      const newLog = new Log({
        user: req.user._id,
        action: "Uploaded file",
        details: `Uploaded ${req.file.originalname}`,
        fileId: newFile._id,
      });
      await newLog.save();
  
      res.status(200).json({
        message: "File uploaded successfully",
        fileUrl: newFile.fileUrl,
        viewUrl: newFile.viewUrl,
      });
    } catch (error) {
      console.error("Error uploading file to Google Drive:", error);
      return res.status(500).json({ message: "File upload failed", error: error.message });
    }
  });  

  // Get files
  const getFiles = TryCatch(async (req, res) => {
    const files = await File.find().populate(
      "user",
      "userId name enrollmentNo semester accountType"
    );
    res.status(200).json(files);
  });

  // Get files uploaded by the logged-in user
  const getUserFiles = TryCatch(async (req, res) => {
    const userFiles = await File.find({ user: req.user._id }).populate(
      "user",
      "userId name enrollmentNo semester"
    );
    res.status(200).json(userFiles);
  });

  // Delete file by note ID
  const deleteFile = TryCatch(async (req, res) => {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
  
    // Ensure the user requesting the deletion is the owner of the file
    if (file.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
  
    // Extract file ID from URL
    const fileId = extractFileIdFromUrl(file.fileUrl);
  
    // Delete the file from Google Drive
    try {
      if (fileId) {
        await drive.files.delete({ fileId: fileId });
      } else {
        console.warn("Could not extract file ID from URL. Skipping Google Drive deletion.");
      }
  
      // Delete the file record from the database
      await File.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error("Error deleting file from Google Drive:", error);
      // If the file is not found in Google Drive, we still delete it from our database
      if (error.code === 404) {
        await File.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: 'File deleted from database, but not found in Google Drive' });
      }
      return res.status(500).json({ message: "File deletion failed", error: error.message });
    }
  });
  
  // Helper function to extract file ID from Google Drive URL
  function extractFileIdFromUrl(url) {
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : null;
  }

  module.exports = { uploadFile, getFiles, getUserFiles,deleteFile};
