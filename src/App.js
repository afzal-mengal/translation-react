import "./App.css";
import { useState } from "react";
import { Box, Container } from "@mui/material";
import Transcription from "./Transcription";
import Translation from "./Translation";

function App() {
  const [transcription, setTranscription] = useState("");

  return (
    <Container maxWidth="sm" sx={{ marginTop: 5 }}>
      {/* Main Content */}
      <Box
        sx={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 3 }}
      >
        {/* Transcription Panel */}
        <Transcription
          transcription={transcription}
          setTranscription={setTranscription}
        ></Transcription>
        {/* Translation Panel */}
        <Translation transcription={transcription}></Translation>
      </Box>
    </Container>
  );
}

export default App;
