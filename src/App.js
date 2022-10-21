import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { CircularProgress, Stack } from "@mui/material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { clearUser, setUser } from "./store/userReducer";
import Join from "./pages/Join";
import Login from "./pages/Login";
import Robby from "./pages/Robby";
import Room from "./pages/Room";

function App() {
  const dispatch = useDispatch();
  const { isLoading, currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (!!user) {
        dispatch(setUser(user));
      } else {
        dispatch(clearUser());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" height="100vh">
        <CircularProgress color="secondary" size={150} />
      </Stack>
    );
  }

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={currentUser ? <Robby /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/join"
          element={currentUser ? <Navigate to="/" /> : <Join />}
        />
        <Route path="/room/:id" element={<Room />} />
      </Routes>
    </div>
  );
}

export default App;
