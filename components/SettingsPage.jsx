'use client'
import React, { useState } from "react";
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Switch,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormGroup,
    FormControlLabel,
    Avatar,
    Slider
} from "@mui/material";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export default function SettingsPage() {
    const [tab, setTab] = useState(0);
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState("en");
    const [emailNotif, setEmailNotif] = useState(true);
    const [pushNotif, setPushNotif] = useState(false);
    const [volume, setVolume] = useState(50);

    const handleTabChange = (event, newValue ) => {
        setTab(newValue);
    };

    return (
        <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Settings
            </Typography>
            <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
                <Tab label="Profile" />
                <Tab label="Notifications" />
                <Tab label="Appearance" />
                <Tab label="Account" />
            </Tabs>

            {/* Profile Tab */}
            <TabPanel value={tab} index={0}>
                <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ width: 56, height: 56, mr: 2 }} />
                    <Button variant="outlined">Change Avatar</Button>
                </Box>
                <TextField fullWidth label="Display Name" margin="normal" />
                <TextField fullWidth label="Email" margin="normal" />
                <Button variant="contained" sx={{ mt: 2 }}>Save Profile</Button>
            </TabPanel>

            {/* Notifications Tab */}
            <TabPanel value={tab} index={1}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={emailNotif}
                                onChange={() => setEmailNotif(!emailNotif)}
                            />
                        }
                        label="Email Notifications"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={pushNotif}
                                onChange={() => setPushNotif(!pushNotif)}
                            />
                        }
                        label="Push Notifications"
                    />
                </FormGroup>
                <Box mt={2}>
                    <Typography gutterBottom>Notification Volume</Typography>
                    <Slider
                        value={volume}
                        onChange={(_, v) => setVolume(v)}
                        min={0}
                        max={100}
                        valueLabelDisplay="auto"
                    />
                </Box>
                <Button variant="contained" sx={{ mt: 2 }}>Save Notifications</Button>
            </TabPanel>

            {/* Appearance Tab */}
            <TabPanel value={tab} index={2}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Language</InputLabel>
                    <Select
                        value={language}
                        label="Language"
                        onChange={e => setLanguage(e.target.value)}
                    >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="es">Spanish</MenuItem>
                        <MenuItem value="fr">French</MenuItem>
                    </Select>
                </FormControl>
                <FormControlLabel
                    control={
                        <Switch
                            checked={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                        />
                    }
                    label="Dark Mode"
                />
                <Button variant="contained" sx={{ mt: 2 }}>Save Appearance</Button>
            </TabPanel>

            {/* Account Tab */}
            <TabPanel value={tab} index={3}>
                <Button variant="outlined" color="error" sx={{ mb: 2 }}>
                    Change Password
                </Button>
                <Button variant="contained" color="error">
                    Delete Account
                </Button>
            </TabPanel>
        </Box>
    );
}
