import { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { TextField, IconButton, Select, MenuItem } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";

function Transcription({ transcription, setTranscription }) {
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    listening,
  } = useSpeechRecognition();
  const [language, setLanguage] = useState("en-US");

  useEffect(() => {
    if (transcript) {
      setTranscription(transcript);
    }
  }, [transcript, setTranscription]);

  useEffect(() => {
    if (listening) {
      SpeechRecognition.stopListening(); // Stop listening when language changes
    }
    resetTranscript();
  }, [language]);

  const handleRecordToggle = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript(); // Clear previous transcription
      SpeechRecognition.startListening({ continuous: true, language }); // Start listening with the selected language
    }
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>Speech recognition is not supported in your browser.</p>;
  }

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
        aria-label={listening ? "stop recording" : "start recording"}
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
