import {
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
} from "@mui/material";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import React, { useCallback, useState } from "react";
import "../../firebase";
import {
  getDatabase,
  push,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";
import { useSelector } from "react-redux";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

export default function RoomChatInput({ RoomId }) {
  const { user } = useSelector((state) => state);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [ImageModalOpen, setImageModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [percent, setPercent] = useState(0);
  const handleClickOpen = useCallback(() => setImageModalOpen(true), []);


  const handleTogglePicker = useCallback(
    () => setShowEmoji((show) => !show),
    []
  );

  const handleChange = useCallback((e) => setMessage(e.target.value), []);

  const createMessage = useCallback(
    () => ({
      timestamp: serverTimestamp(),
      user: {
        id: user.currentUser.uid,
        name: user.currentUser.displayName,
        avatar: user.currentUser.photoURL,
      },
      content: message,
    }),
    [
      message,
      user.currentUser.uid,
      user.currentUser.displayName,
      user.currentUser.photoURL,
    ]
  );
  const clickSendMessage = useCallback(async () => {
    if (!message) return;
    setLoading(true);
    try {
      await set(
        push(ref(getDatabase(), "messages/" + RoomId)),
        createMessage()
      );
      setLoading(false);
      setMessage("");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [message, RoomId, createMessage]);

  const handleSelectEmoji = useCallback((e) => {
    const sym = e.unified.split("-");
    const codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    const emoji = String.fromCodePoint(...codesArray);
    setMessage((messageValue) => messageValue + emoji);
  }, []);
  
  return (
    <Grid container sx={{ p: "20px" }}>
      <Grid item xs={12} sx={{ position: "relative" }}>
        {showEmoji && (
          <Picker
            set="google"
            className="emojipicker"
            title="???????????? ???????????????."
            onSelect={handleSelectEmoji}
            emoji="point_up"
            style={{ position: "absolute", bottom: "80px" }}
          />
        )}
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={handleTogglePicker}>
                  <InsertEmoticonIcon />
                </IconButton>
                <IconButton onClick={handleClickOpen}>
                  <ImageIcon />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="start">
                <IconButton disabled={loading} onClick={clickSendMessage}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          autoComplete="off"
          label="????????? ??????"
          fullWidth
          value={message}
          onChange={handleChange}
        />
        {uploading ? (
          <Grid item xs={12} sx={{ m: "10px" }}>
            <LinearProgress variant="determinate" value={percent} />
          </Grid>
        ) : null}
      </Grid>
    </Grid>
  );
}
