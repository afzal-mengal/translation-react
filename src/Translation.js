import { useState, useEffect, useRef } from "react";
import { TextField, Button, Select, MenuItem } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

function Translation({ transcription }) {
  const [translation, setTranslation] = useState("");
  const [language, setLanguage] = useState("es-ES");
  const speechSynthesisRef = useRef(window.speechSynthesis);

  const handleSpeak = () => {
    // Cancel any ongoing speech

    if (speechSynthesisRef.current.speaking) {
      speechSynthesisRef.current.cancel();
    }

    // Create a new utterance with only the text
    const utterance = new SpeechSynthesisUtterance(translation);
    utterance.lang = language;

    // Speak the utterance with all default parameters
    speechSynthesisRef.current.speak(utterance);
    console.log("speack");
  };

  useEffect(() => {
    if (transcription) {
      translateText(transcription, language);
    }
  }, [transcription, language]);

  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  console.log(apiKey);

  const translateText = async (text, targetLang) => {
    const prompt = `Translate the following text to ${targetLang} while maintaining the accuracy of medical terms ,only output the translation nothing else: ${text}`;

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`, // Replace with your OpenAI API key
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo", // You can use gpt-4 if you have access
            messages: [{ role: "user", content: prompt }],
          }),
        }
      );

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        setTranslation(data.choices[0].message.content);
      }
    } catch (error) {
      console.error("Translation failed:", error);
    }
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <>
      {/* Language Selector */}
      <Select
        defaultValue="es-ES"
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
        value={translation}
        placeholder="Your speech transcription will appear here"
        inputProps={{
          readOnly: true,
        }}
      />

      {/* Translate Button */}
      <Button
        variant="contained"
        startIcon={<VolumeUpIcon />}
        color="primary"
        fullWidth
        onClick={handleSpeak}
      >
        Speak
      </Button>
    </>
  );
}

export default Translation;
