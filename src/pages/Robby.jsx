import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import "../firebase";
import {
  child,
  getDatabase,
  onChildAdded,
  push,
  ref,
  update,
} from "firebase/database";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setRoom } from "../store/roomReducer";

export default function Robby() {
  const { user } = useSelector((state) => state);
  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomDetail, setRoomDetail] = useState("");
  const [rooms, setRooms] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = onChildAdded(
      ref(getDatabase(), "userOwenedRooms/" + user.currentUser.uid),
      (snapshot) => {
        setRooms((roomArr) => [...roomArr, snapshot.val()]);
      }
    );
    return () => {
      setRooms([]);
      unsubscribe();
    };
  }, [user.currentUser.uid]);

  useEffect(() => {
    dispatch(setRoom(rooms));
  }, [dispatch, rooms]);

  const handleClickOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);
  const handleChangeRoomName = useCallback(
    (e) => setRoomName(e.target.value),
    []
  );

  const handleChangeRoomDetail = useCallback(
    (e) => setRoomDetail(e.target.value),
    []
  );

  //채널리스트 불러오기

  //유저소유채널 생성
  const handleSubmit = useCallback(
    async (userId) => {
      const db = getDatabase();
      const key = push(child(ref(db), "userOwenedRooms/" + userId)).key;
      const newRoom = {
        id: key,
        name: roomName,
        details: roomDetail,
      };
      const newRoomUsers = [userId];

      const userOwenedRoomsUpdates = {};
      userOwenedRoomsUpdates[`/userOwenedRooms/${userId}/` + key] = newRoom; // 각 유저가 소유한 채팅방목록
      const roomUsersUpdates = {};
      roomUsersUpdates[`/roomUsers/${key}`] = newRoomUsers;

      try {
        await update(ref(db), userOwenedRoomsUpdates);
        await update(ref(db), roomUsersUpdates);
        setRoomName("");
        setRoomDetail("");
        handleClose();
      } catch (error) {
        console.error(error);
      }
    },
    [handleClose, roomDetail, roomName]
  );

  return (
    <>
      <Header />
      <List component="div" disablePadding sx={{ pl: 3 }}>
        {rooms.map((room, index) => (
          <ListItem button key={room.id + `-` + index}>
            <Link to={`/room/${room.id}`}>
              <ListItemText
                key={index}
                primary={`# ${room.name}`}
                sx={{ wordBreak: "break-all", color: "#918890" }}
              />
            </Link>
          </ListItem>
        ))}
      </List>
      <button onClick={handleClickOpen}>생성하기</button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>방 추가</DialogTitle>
        <DialogContent>
          <DialogContentText>
            생성할 방이름과 설명을 입력해주세요.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="방이름"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleChangeRoomName}
            autoComplete="off"
          />
          <TextField
            margin="dense"
            label="설명"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleChangeRoomDetail}
            autoComplete="off"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={() => handleSubmit(user.currentUser.uid)}>
            생성
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
