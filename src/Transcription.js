import { useState, useEffect, useRef } from "react";
import { TextField, IconButton, Select, MenuItem } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";

function Transcription({ transcription, setTranscription }) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const [language, setLanguage] = useState("en-US");

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true; // Keep recognizing until stopped
      recog.interimResults = true; // Show results even while recognizing
      recog.lang = language; // Set language for transcription

      recog.onresult = (event) => {
        const currentTranscription = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join(" ");
        setTranscription(currentTranscription);
      };

      recog.onend = () => {
        if (isRecording) {
          recog.start(); // Restart if still recording
        }
      };

      recognitionRef.current = recog;
    } else {
      console.error("Speech recognition not supported in this browser.");
    }
  }, [language]);

  useEffect(() => {
    if (isRecording) {
      recognitionRef.current?.start();
    } else {
      recognitionRef.current?.stop();
    }
  }, [isRecording]);

  const handleRecordToggle = () => {
    if (isRecording) {
      setIsRecording((prev) => !prev); // Toggle recording state
    } else {
      setTranscription(""); // Clear previous transcription
      setIsRecording((prev) => !prev); // Toggle recording state
    }
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }
  };

  return (
    <>
      {/* Language Selector */}
      <Select
        defaultValue="en-US"
        fullWidth
        variant="outlined"
        onChange={handleLanguageChange}
        label="Target Language"
      >
        <MenuItem value="en-US">English</MenuItem>
        <MenuItem value="hi-IN">Hindi</MenuItem>
        <MenuItem value="es-ES">Spanish</MenuItem>
        {/* Add more languages as needed */}
      </Select>

      <TextField
        variant="outlined"
        label="Speech Transcription"
        multiline
        rows={4}
        fullWidth
        value={transcription}
        placeholder="Your speech transcription will appear here"
        inputProps={{
          readOnly: true,
        }}
      />

      {/* Record Button */}
      <IconButton
        color="primary"
        aria-label={isRecording ? "stop recording" : "start recording"}
        size="large"
        onClick={handleRecordToggle}
        sx={{ alignSelf: "center", marginTop: 2 }}
      >
        <MicIcon fontSize="inherit" />
      </IconButton>
    </>
  );
}

export default Transcription;
