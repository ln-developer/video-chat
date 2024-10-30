import { v4 } from "uuid";
import moment from "moment";
import ACTIONS from "../socket/actions";

export const createRoom = (userName, roomName, roomId) => {
  return {
    type: ACTIONS.CREATE_ROOM,
    userName,
    roomName,
    roomId,
  };
};

export const emitCreateRoom = (socket, userName, roomName, history) => {
  return (dispatch, getState) => {
    const uniqueRoomId = v4();
    dispatch(createRoom(userName, roomName, uniqueRoomId));
    socket.emit(ACTIONS.CREATE_ROOM, {
      roomName: getState().chat.roomName,
      roomId: getState().chat.roomId,
      userName: getState().chat.userName,
    });
    history.push(`/room/${uniqueRoomId}`);
  };
};

export const addToRoom = (userName, roomId) => {
  return {
    type: ACTIONS.ADD_TO_ROOM,
    userName,
    roomId,
  };
};

export const emitAddToRoom = (socket, userName, roomId, history) => {
  return (dispatch, getState) => {
    dispatch(addToRoom(userName, roomId));
    socket.emit(ACTIONS.ADD_TO_ROOM, {
      roomId: getState().chat.roomId,
      userName: getState().chat.userName,
    });
    history.push(`/room/${getState().chat.roomId}`);
  };
};

export const getName = (roomId) => {
  return {
    type: ACTIONS.GET_NAME,
    roomId,
  };
};

export const emitGetName = (socket, roomId) => {
  return (dispatch, getState) => {
    dispatch(getName(roomId));
    socket.emit(ACTIONS.GET_NAME, { roomId: getState().chat.roomId });
  };
};

export const sendName = (userName) => {
  return {
    type: ACTIONS.SEND_NAME,
    userName,
  };
};

export const onSendName = (socket, roomId) => {
  return (dispatch) => {
    dispatch(emitGetName(socket, roomId));
    socket.on(ACTIONS.SEND_NAME, ({ name: userName }) => {
      dispatch(sendName(userName));
    });
  };
};

export const shareRooms = (rooms) => {
  return {
    type: ACTIONS.SHARE_ROOMS,
    rooms,
  };
};

export const onShareRooms = (socket) => {
  return (dispatch) => {
    socket.on(ACTIONS.SHARE_ROOMS, ({ rooms }) => {
      dispatch(shareRooms(rooms));
    });
  };
};

export const getMsg = (message) => {
  return {
    type: ACTIONS.GET_MESSAGE,
    message,
  };
};

export const onGetMsg = (socket) => {
  return (dispatch) => {
    socket.on(ACTIONS.GET_MESSAGE, (message) => {
      dispatch(getMsg(message));
    });
  };
};

export const sendMsg = (roomId, userId, userName, time, text) => {
  return {
    type: ACTIONS.SEND_MESSAGE,
    roomId,
    userId,
    userName,
    time,
    text,
  };
};

export const emitSendMsg = (socket, roomId, userName, text) => {
  return (dispatch, getState) => {
    const time = moment().format("LT");
    dispatch(sendMsg(roomId, socket.id, userName, time, text));
    socket.emit(ACTIONS.SEND_MESSAGE, {
      room: getState().chat.roomId,
      userId: getState().chat.userId,
      userName: getState().chat.userName,
      time: getState().chat.time,
      text: getState().chat.text,
    });
  };
};

export const getUsersList = (users) => {
  return {
    type: ACTIONS.GET_USERS_LIST,
    users,
  };
};

export const onGetUsersList = (socket) => {
  return (dispatch) => {
    socket.on(ACTIONS.GET_USERS_LIST, ({ usersList }) => {
      dispatch(getUsersList(usersList));
    });
  };
};

export const leaveRoom = () => {
  return {
    type: ACTIONS.LEAVE_ROOM,
  };
};

export const emitLeaveRoom = (socket, history) => {
  return (dispatch) => {
    socket.emit(ACTIONS.LEAVE_ROOM);
    dispatch(leaveRoom());
    history.push("/");
  };
};
