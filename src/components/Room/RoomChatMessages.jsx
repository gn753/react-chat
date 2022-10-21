import React, { useEffect, useRef, useState } from "react";
import { Divider, Grid, List, Paper, Toolbar } from "@mui/material";
import { useSelector } from "react-redux";
import {
  child,
  get,
  getDatabase,
  onChildAdded,
  orderByChild,
  query,
  ref,
  startAt,
} from "firebase/database";
import "../../firebase";
import RoomChatMessage from "./RoomChatMessage";

export default function RoomChatMessages({ RoomId }) {
  const [messages, setMessages] = useState([]);
  const messageEndRef = useRef();
  const { user } = useSelector((state) => state);

  useEffect(() => {
    if (!RoomId) return;
    async function getMessages() {
      const snapShot = await get(
        child(ref(getDatabase()), "messages/" + RoomId)
      );
      setMessages(snapShot.val() ? Object.values(snapShot.val()) : []);
    }
    getMessages();
    return () => {
      setMessages([]);
    };
  }, [RoomId]);

  useEffect(() => {
    if (!RoomId) return;
    const sorted = query(
      ref(getDatabase(), "messages/" + RoomId),
      orderByChild("timestamp")
    );
    const unsubscribe = onChildAdded(
      query(sorted, startAt(Date.now())),
      (snapshot) =>
        setMessages((oldMessages) => [...oldMessages, snapshot.val()])
    );
    return () => {
      unsubscribe?.();
    };
  }, [RoomId]);
  
  return (
    <>
      <List
        sx={{
          height: "calc(100vh - 350px)",
          overflow: "scroll",
          width: "100%",
          position: "relative",
        }}
      >
        {messages.map((message) => (
          <RoomChatMessage
            key={message.timestamp}
            message={message}
            user={user}
          />
        ))}
        <div ref={messageEndRef}></div>
      </List>
    </>
  );
}
