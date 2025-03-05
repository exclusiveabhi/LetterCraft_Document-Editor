import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  TextField,
  Alert,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import Editor from "./Editor";
import Swal from "sweetalert2";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [letterTitle, setLetterTitle] = useState("");
  const [letterContent, setLetterContent] = useState("");
  const [fileId, setFileId] = useState(null);

// filepath: /C:/Users/asusa/OneDrive/Desktop/New folder/frontend/src/components/Dashboard.jsx
useEffect(() => {
  axios
    .get(`${import.meta.env.VITE_BACKEND_URL}/auth/current_user`, {
      withCredentials: true,
    })
    .then((res) => {
      console.log("User data:", res.data); // Add this line to log the response
      setUser(res.data);
    })
    .catch((err) => {
      console.error("Error fetching user:", err);
      console.log("Error response:", err.response); // Add this line to log the error response
    });
}, []);

  // Helper function to strip HTML tags from a string
  const stripHtmlTags = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const handleSave = async () => {
    // Convert the HTML content into plain text before saving
    const plainTextContent = stripHtmlTags(letterContent);

    // Show a processing alert
    Swal.fire({
      title: "Saving...",
      text: "Please wait while we save your document.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/drive/save`,
        { title: letterTitle, letterContent: plainTextContent },
        { withCredentials: true }
      );
      setFileId(response.data.fileId);
      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Letter saved to Google Drive successfully.",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      console.error("Error saving letter:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save the letter. Please try again.",
      });
    }
  };

  const handleLogout = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/logout`;
  };

  return (
    <>
      {/* Full-width top navigation bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main content area with a light gray background */}
      <Box
        sx={{
          backgroundColor: "#f7f7f7",
          minHeight: "90vh",
          py: 4,
          px: 2,
        }}
      >
        {!user ? (
          <Box sx={{ mx: "auto", maxWidth: 600 }}>
            <Alert severity="info">Loading user info...</Alert>
          </Box>
        ) : (
          <Box sx={{ mx: "auto", maxWidth: "1200px" }}>
            {/* Render welcome message only if user exists */}
            <Typography variant="h4" align="center" gutterBottom>
              Welcome, {user && user.displayName}
            </Typography>

            <Grid container spacing={3} sx={{ mt: 4 }}>
              {/* Left Column (Document Title & Save) */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Document Title
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Enter a title..."
                      value={letterTitle}
                      onChange={(e) => setLetterTitle(e.target.value)}
                    />
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        fullWidth
                      >
                        Save to Google Drive
                      </Button>
                    </Box>
                    {fileId && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body1">
                          Saved file ID: {fileId}
                        </Typography>
                        <Button
                          variant="outlined"
                          color="secondary"
                          href={`https://drive.google.com/open?id=${fileId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ mt: 1 }}
                          fullWidth
                        >
                          View Document
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Right Column (Document Editor) */}
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Document Editor
                    </Typography>
                    <Editor
                      content={letterContent}
                      setContent={setLetterContent}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Dashboard;
