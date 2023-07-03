import { useState, useRef } from "react";
import { createContext } from "react";

const GlobalContext = createContext([]);
export default GlobalContext;

export const GlobalVariable = () => {
  const [url, setUrl] = useState("http://localhost:3010");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [text, setText] = useState("");
  const [friendList, setFriendList] = useState([]);
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
  const modalRef = useRef();

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
    setFriendList
  };
};
