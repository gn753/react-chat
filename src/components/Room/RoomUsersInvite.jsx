import React, { useCallback } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import "../../firebase";
import { update, getDatabase, ref, set } from "firebase/database";
import { useSelector } from "react-redux";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function RoomUsersInvite({
  open,
  handleClose,
  allUsers,
  RoomId,
  currentUsers,
}) {
  const { roomDetails } = useSelector((state) => state.room);

  const objectFromArray = ({ ...data }) => {
    return { ...data };
  };

  const allUsersKey = Object.keys(allUsers);
  const handleInvite = useCallback(
    async (userId) => {
      if (!userId) return;
      if (currentUsers.includes(userId)) return;
      const db = getDatabase();
      const postData = [...currentUsers, userId];
      const roomIdFilter = roomDetails.filter((it) => it.id === RoomId);
      const updates = {};
      updates[`/userOwenedRooms/${userId}/` + RoomId] = objectFromArray(
        ...roomIdFilter
      );

      try {
        await set(ref(db, "roomUsers/" + RoomId), postData);
        await update(ref(db), updates);
      } catch (error) {
        console.error(error);
      }
    },
    [RoomId, currentUsers, roomDetails]
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <List>
            {allUsersKey &&
              allUsersKey.length > 0 &&
              allUsersKey.map((userKey) => (
                <ListItem
                  key={allUsers[userKey].name}
                  button
                  onClick={() => handleInvite(userKey)}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={allUsers[userKey].avatar}
                      alt={allUsers[userKey].avatar}
                    ></Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={allUsers[userKey].name} />
                </ListItem>
              ))}
          </List>
        </Box>
      </Modal>
    </div>
  );
}
