import { useEffect } from "react";
import "../firebase";
import {
  getDatabase,
  ref,
  onValue,
} from "firebase/database";

export function useRooms() {
  useEffect(() => {
    const db = getDatabase();
    function getUserList() {
      const userRef = ref(db, "/roomUsers/" + RoomId);
      onValue(userRef, (snapshot) => {
        const userSnapshot = snapshot.val();
        setAllUserList(() => (userSnapshot ? userSnapshot : []));
        // setUserKey(() => Object.keys(userSnapshot));
      });
    }
    getUserList();
    return () => {
      getUserList();
    };
  }, []);
}