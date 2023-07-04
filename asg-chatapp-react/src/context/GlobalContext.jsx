import { useState, useRef, createContext } from "react";
import { io } from "socket.io-client";

const GlobalContext = createContext([]);
export default GlobalContext;

export const GlobalVariable = () => {
  const [url, setUrl] = useState("http://localhost:3010");
  const socket = io.connect(url);

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [text, setText] = useState("");
  const [friendList, setFriendList] = useState([]);
  const [blockedList, setBlockedList] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [contentList, setContentList] = useState([]);
  const [friendProfile, setFriendProfile] = useState({
    id: "",
    conversationId: -1,
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    birthdate: "",
  });
  const [profile, setProfile] = useState({
    id: "",
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    birthdate: "",
  });
  const headerOptionRef = useRef();
  const modalRef = useRef();
  const searchInputRef = useRef();

  return {
    url,
    setUrl,
    isAuthorized,
    setIsAuthorized,
    text,
    setText,
    modalRef,
    friendProfile,
    setFriendProfile,
    profile,
    setProfile,
    friendList,
    setFriendList,
    blockedList,
    setBlockedList,
    requestList,
    setRequestList,
    searchList,
    setSearchList,
    headerOptionRef,
    contentList,
    setContentList,
    socket,
    searchInputRef,
  };
};
