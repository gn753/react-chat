import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import AddIcon from "@mui/icons-material/Add";
import Avatar from "@mui/material/Avatar";

export default function RoomUsers({ currentUsers, handleOpen }) {
  return (
    <div>
      <List sx={{ pt: 0 }}>
        {currentUsers &&
          currentUsers.map((currentUser) => (
            <ListItem key={currentUser.name}>
              <ListItemAvatar>
                <Avatar
                  src={currentUser.avatar}
                  alt={currentUser.avatar}
                ></Avatar>
              </ListItemAvatar>
              <ListItemText primary={currentUser.name} />
            </ListItem>
          ))}
        <ListItem button onClick={handleOpen}>
          <ListItemAvatar>
            <Avatar>
              <AddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Add account" />
        </ListItem>
      </List>
    </div>
  );
}
