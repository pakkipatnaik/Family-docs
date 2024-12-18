import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    AppBar,
    Toolbar,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    Alert,
    IconButton,
    Avatar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

function FamilyDoc() {
    const [documents, setDocuments] = useState([]);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [formData, setFormData] = useState({
        documentName: '',
        uploaderName: '',
        file: null,
    });
    const [editData, setEditData] = useState({
        id: '',
        documentName: '',
        uploaderName: '',
    });
    const [profileData, setProfileData] = useState({
        familyName: 'The Smiths',
        profilePicture: '',
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    useEffect(() => {
        fetchDocuments();
        fetchProfile();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await axios.get('http://localhost:5000/documents');
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
            setSnackbar({ open: true, message: 'Failed to fetch documents.', severity: 'error' });
        }
    };

    const fetchProfile = async () => {
        try {
            const response = await axios.get('http://localhost:5000/profile');
            setProfileData(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setSnackbar({ open: true, message: 'Failed to fetch profile.', severity: 'error' });
        }
    };

    const handleUpload = async () => {
        const formDataToSend = new FormData();
        formDataToSend.append('documentName', formData.documentName);
        formDataToSend.append('uploaderName', formData.uploaderName);
        formDataToSend.append('file', formData.file);

        try {
            await axios.post('http://localhost:5000/upload', formDataToSend);
            fetchDocuments();
            setOpen(false);
            setFormData({ documentName: '', uploaderName: '', file: null });
            setSnackbar({ open: true, message: 'Document uploaded successfully!', severity: 'success' });
        } catch (error) {
            console.error('Error uploading document:', error);
            setSnackbar({ open: true, message: 'Failed to upload document.', severity: 'error' });
        }
    };

    const handleEdit = async () => {
        try {
            await axios.put(`http://localhost:5000/documents/${editData.id}`, {
                documentName: editData.documentName,
                uploaderName: editData.uploaderName,
            });
            fetchDocuments();
            setEditOpen(false);
            setSnackbar({ open: true, message: 'Document updated successfully!', severity: 'success' });
        } catch (error) {
            console.error('Error updating document:', error);
            setSnackbar({ open: true, message: 'Failed to update document.', severity: 'error' });
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/documents/${id}`);
            fetchDocuments();
            setSnackbar({ open: true, message: 'Document deleted successfully!', severity: 'success' });
        } catch (error) {
            console.error('Error deleting document:', error);
            setSnackbar({ open: true, message: 'Failed to delete document.', severity: 'error' });
        }
    };

    // const handleUploadProfile = async () => {
    //     const formDataToSend = new FormData();
    //     formDataToSend.append('familyName', profileData.familyName);
    //     formDataToSend.append('profilePicture', profileData.profilePicture);

    //     try {
    //         const response = await axios.post('http://localhost:5000/profile', formDataToSend, {
    //             headers: { 'Content-Type': 'multipart/form-data' },
    //         });

    //         // Update state immediately after a successful response
    //         if (response.data.success) {
    //             setProfileData((prevState) => ({
    //                 ...prevState,
    //                 profilePicture: response.data.profilePicture, // Backend should return the filename
    //             }));
    //             setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    //         }
    //         setProfileOpen(false);
    //     } catch (error) {
    //         console.error('Error updating profile:', error);
    //         setSnackbar({ open: true, message: 'Failed to update profile.', severity: 'error' });
    //     }
    // };


      const handleUploadProfile = async () => {
        const formDataToSend = new FormData();
        formDataToSend.append('familyName', profileData.familyName);
        formDataToSend.append('profilePicture', profileData.profilePicture);

        try {
          await axios.post('http://localhost:5000/profile', formDataToSend);
          fetchProfile();
          setProfileOpen(false);
          setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
        } catch (error) {
          console.error('Error updating profile:', error);
          setSnackbar({ open: true, message: 'Failed to update profile.', severity: 'error' });
        }
      };

    return (
        <div>
            <AppBar position="static">
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Family Document Management</Typography>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" style={{ marginRight: 10 }}>
                            {profileData.familyName}
                        </Typography>
                        <Avatar
                            src={`http://localhost:5000/uploads/${profileData.profilePicture}`}
                            style={{
                                width: 40,
                                height: 40,
                                cursor: 'pointer',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                            onClick={() => setProfileOpen(true)}
                        />
                    </div>
                </Toolbar>
            </AppBar>
            <Grid container spacing={3} style={{ padding: 20 }}>
                {documents.map((doc) => (
                    <Grid item xs={12} sm={6} md={4} key={doc._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{doc.documentName}</Typography>
                                <Typography variant="body2">Uploaded by: {doc.uploaderName}</Typography>
                                <Typography variant="body2">Type: {doc.fileType}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    color="primary"
                                    href={`http://localhost:5000/${doc.filePath}`}
                                    target="_blank"
                                >
                                    View
                                </Button>
                                <Button
                                    size="small"
                                    color="secondary"
                                    onClick={() => handleDelete(doc._id)}
                                >
                                    Delete
                                </Button>
                                <IconButton
                                    color="primary"
                                    onClick={() => {
                                        setEditData({ id: doc._id, documentName: doc.documentName, uploaderName: doc.uploaderName });
                                        setEditOpen(true);
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setOpen(true)}
                style={{ margin: 20 }}
            >
                Upload Document
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Document Name"
                        fullWidth
                        margin="dense"
                        value={formData.documentName}
                        onChange={(e) => setFormData({ ...formData, documentName: e.target.value })}
                    />
                    <TextField
                        label="Uploader Name"
                        fullWidth
                        margin="dense"
                        value={formData.uploaderName}
                        onChange={(e) => setFormData({ ...formData, uploaderName: e.target.value })}
                    />
                    <input
                        type="file"
                        onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                        style={{ marginTop: 10 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleUpload} color="primary">Upload</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogTitle>Edit Document</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Document Name"
                        fullWidth
                        margin="dense"
                        value={editData.documentName}
                        onChange={(e) => setEditData({ ...editData, documentName: e.target.value })}
                    />
                    <TextField
                        label="Uploader Name"
                        fullWidth
                        margin="dense"
                        value={editData.uploaderName}
                        onChange={(e) => setEditData({ ...editData, uploaderName: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleEdit} color="primary">Save Changes</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={profileOpen} onClose={() => setProfileOpen(false)}>
                <DialogTitle>Update Profile</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Family Name"
                        fullWidth
                        margin="dense"
                        value={profileData.familyName}
                        onChange={(e) => setProfileData({ ...profileData, familyName: e.target.value })}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfileData({ ...profileData, profilePicture: e.target.files[0] })}
                        style={{ marginTop: 10 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setProfileOpen(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleUploadProfile} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default FamilyDoc;
