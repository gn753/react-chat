import React, { useEffect, useState } from "react";
import "../../firebase";
import { getDatabase, ref, onValue } from "firebase/database";
import RoomUsers from "./RoomUsers";
import RoomUsersInvite from "./RoomUsersInvite";

export default function RoomUsersContainer({ RoomId }) {
  const [roomUsers, setRommUsers] = useState();
  const [allUsers, setAllUsers] = useState();
  const [currentUsers, setCurrentUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const getRoomUsers = () => {
      const db = getDatabase();
      const userRef = ref(db, "roomUsers/" + RoomId);
      onValue(userRef, (snapshot) => {
        const userSnapshot = snapshot.val();
        setRommUsers(() => (userSnapshot ? userSnapshot : []));
      });
    };

    const getAllUsers = () => {
      const db = getDatabase();
      const userRef = ref(db, "users/");
      onValue(userRef, (snapshot) => {
        const userSnapshot = snapshot.val();
        setAllUsers(() => (userSnapshot ? userSnapshot : []));
      });
    };

    getRoomUsers();
    getAllUsers();
    return () => {
      getRoomUsers();
      getAllUsers();
    };
  }, [RoomId]);

  //채팅방 참여자들만을 계산
  const calcCurrentUsers = (현재유저, 전체유저) => {
    if (!전체유저) return;
    if (!현재유저) return;
    let users = [];
    for (let 유저 of 현재유저) {
      if (전체유저[유저]) {
        let dataKey = {};
        dataKey = 전체유저[유저];
        dataKey["userId"] = 유저;
        users.push(dataKey);
      }
    }
    return users;
  };

  useEffect(() => {
    const showCurrentUsers = () => {
      const result = calcCurrentUsers(roomUsers, allUsers);
      setCurrentUsers(() => result);
    };
    showCurrentUsers();

    return () => {
      showCurrentUsers();
    };
  }, [allUsers, roomUsers]);
  return (
    <>
      {currentUsers && currentUsers.length > 0 && (
        <RoomUsers
          RoomId={RoomId}
          currentUsers={currentUsers}
          allUsers={allUsers}
          handleOpen={handleOpen}
        />
      )}
      {allUsers && (
        <RoomUsersInvite
          open={open}
          handleClose={handleClose}
          allUsers={allUsers}
          RoomId={RoomId}
          currentUsers={roomUsers}
        />
      )}
    </>
  );
}
