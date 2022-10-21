import { Divider, Grid, Paper, Toolbar } from "@mui/material";
import React, { useEffect, useRef } from "react";
import ChatHeader from "../components/Room/ChatHeader";
import ChatInput from "../components/Room/RoomChatInput";
import { useParams } from "react-router-dom";
import RoomChatMessages from "../components/Room/RoomChatMessages";
import RoomUsersContainer from "../components/Room/RoomUsersContainer";

export default function Room() {
  const messageEndRef = useRef();
  const params = useParams();
  const RoomId = params.id;

  useEffect(() => {
    if (messageEndRef !== undefined) return;
    const setTimeoutId = setTimeout(() => {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, 2000);
    return () => {
      clearTimeout(setTimeoutId);
    };
  }, []);

  return (
    <>
      <Toolbar />
      <ChatHeader />
      <RoomUsersContainer RoomId={RoomId} />
      <Grid
        container
        component={Paper}
        variant="outlined"
        sx={{ mt: 3, position: "relative" }}
      >
        <RoomChatMessages RoomId={RoomId} />
        <Divider />
        <ChatInput RoomId={RoomId} />
      </Grid>
    </>
  );
}
