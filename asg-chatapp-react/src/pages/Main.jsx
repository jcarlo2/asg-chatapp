import React, { useContext, useEffect } from "react";
import MainLeft from "../component/MainLeft";
import MainRight from "../component/MainRight";
import GlobalContext from "../context/GlobalContext";
import useHelper from "../helper/useHelper";

const Main = () => {
  const url = useContext(GlobalContext).url;
  const socket = useContext(GlobalContext).socket;
  const setFriendList = useContext(GlobalContext).setFriendList;
  const setBlockedList = useContext(GlobalContext).setBlockedList;
  const setRequestList = useContext(GlobalContext).setRequestList;
  const setSearchList = useContext(GlobalContext).setSearchList;
  const profile = useContext(GlobalContext).profile;
  const searchInputRef = useContext(GlobalContext).searchInputRef;
  const helper = useHelper();

  useEffect(() => {
    socket.on(`change-list-${profile.id}`, (action) => {
      helper.findAllFriends(url, setFriendList);
      helper.findBlockedFriends(url, setBlockedList);
      helper.findFriendRequest(url, setRequestList);
      helper.findSearchRequest(url, setSearchList, searchInputRef.current.value);
    });
  }, [profile]);
  
  return (
    <div className="main-container">
      <MainLeft />
      <MainRight />
    </div>
  );
};

export default Main;
