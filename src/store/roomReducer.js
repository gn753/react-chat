const DETAIL_ROOM = "DETAIL_ROOM";

export const setRoom = (infomation) => ({
  type: DETAIL_ROOM,
  roomDetails: infomation,
});

const initialState = {
  roomDetails: null,
};

const roomReducer = (state = initialState, action) => {
  switch (action.type) {
    case DETAIL_ROOM:
      return {
        roomDetails: action.roomDetails,
      };
    default:
      return state;
  }
};

export default roomReducer;
