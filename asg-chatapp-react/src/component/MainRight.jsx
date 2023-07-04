import React, { useContext, useEffect, useRef, useState } from "react";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import GlobalContext from "../context/GlobalContext";
import useHelper from "../helper/useHelper";

const MainRight = () => {
  const url = useContext(GlobalContext).url;
  const socket = useContext(GlobalContext).socket;
  const friend = useContext(GlobalContext).friendProfile;
  const profile = useContext(GlobalContext).profile;
  const friendList = useContext(GlobalContext).friendList;
  const setFriendList = useContext(GlobalContext).setFriendList;
  const setBlockedList = useContext(GlobalContext).setBlockedList;
  const headerOptionRef = useContext(GlobalContext).headerOptionRef;
  const contentList = useContext(GlobalContext).contentList;
  const setContentList = useContext(GlobalContext).setContentList;
  const emoji = useRef();
  const messageBox = useRef();
  const messageList = useRef();
  const [username, setUsername] = useState("");
  const helper = useHelper();

  useEffect(() => {
    messageList.current.scrollTop = messageList.current.scrollHeight;
  }, [contentList]);

  useEffect(() => {
    for (const friendship of friendList) {
      socket.on(friendship.conversationId, (message, room, date) => {
        if (room === friend.conversationId) {
          setContentList((prevState) => [...prevState, message]);
        }
        setFriendList((prevFriendList) =>
          prevFriendList.map((friend) => {
            if (friend.conversationId === room) {
              return {
                ...friend,
                lastMessage: message.content,
                date,
              };
            }
            return friend;
          })
        );
      });
    }
    return () => {
      for (const friendship of friendList) {
        socket.off(friendship.conversationId);
      }
    };
  }, [friendList, friend]);

  useEffect(() => {
    setUsername(profile.username);
  }, [profile]);

  useEffect(() => {
    if (friend.conversationId < 1) {
      setContentList([]);
      return;
    }
    fetch(`${url}/api/v1/user/find-all-message`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: friend.conversationId,
        friendId: friend.id,
      }),
    }).then((res) => {
      if (res.ok) {
        res.json().then(setContentList);
      }
    });
  }, [friend]);

  const handleEmojiContainer = () => {
    const isVisible = emoji.current.style.display === "block";
    if (isVisible) emoji.current.style.display = "none";
    else emoji.current.style.display = "block";
  };

  const handleEmojiPicker = (emojiObject) => {
    messageBox.current.value = messageBox.current.value + emojiObject.emoji;
  };

  const sendMessage = () => {
    const message = messageBox.current.value;
    if (message.trim() !== "" && friend.conversationId > 0) {
      socket.emit("send", {
        room: friend.conversationId,
        message,
        username: profile.username,
      });
      messageBox.current.value = "";
    }
  };

  const handleHide = (message) => {
    const index = contentList.indexOf(message);
    return (
      username !== message.username &&
      index - 1 >= 0 &&
      contentList[index - 1].username === message.username
    );
  };

  const handleMessageListScroll = (e) => {
    console.log("SCROLL");
    // if(!messageLoadURL) return
    // if(e.currentTarget.scrollTop === 0) {
    //   fetch(messageLoadURL, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       conversationId: activeChat.conversationId
    //     })
    //   }).then(res => {
    //     if(res.ok) {
    //       res.json().then(({url,list}) => {
    //         setMessageLoadURL(url.next_page_url)
    //         setContentList(prevState => ([
    //           ...list,
    //           ...prevState
    //         ]))
    //       })
    //     }
    //   }).catch(console.log)
    // }
  };

  const handleUnblockAndUnfriend = (id) => {
    fetch(`${url}/api/v1/user/unblock-unfriend`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          helper.findBlockedFriends();
          helper.findAllFriends();
        });
      }
    });
  };

  const handleBlock = (id) => {
    fetch(`${url}/api/v1/user/block`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          setBlockedList(data);
          helper.findAllFriends();
          if (id === friend.id) setContentList([]);
        });
      }
    });
  };

  const handleHeaderOptionToggle = () => {
    if (friend.conversationId < 0) return;
    headerOptionRef.current.classList.toggle("show");
  };

  return (
    <section className="main-two">
      <div className="main-header">
        <h1>{friend.fullName}</h1>
        <div className="dropdown">
          <i
            className="bx bx-dots-vertical-rounded bx-md dropdown-input"
            onClick={handleHeaderOptionToggle}></i>
          <ul ref={headerOptionRef} className="dropdown-list">
            <li onClick={() => handleUnblockAndUnfriend(friend.id)}>
              <i className="bx bx-user-x bx-sm"></i>
              Unfriend
            </li>
            <li onClick={() => handleBlock(friend.id)}>
              <i className="bx bx-block bx-sm"></i>
              Block
            </li>
          </ul>
        </div>
      </div>
      <div className="chat-box">
        <ul
          className={"chatzone"}
          ref={messageList}
          onScroll={handleMessageListScroll}>
          <div></div>
          {contentList.map((message) => (
            <li
              key={message.id}
              id={message.id}
              className={
                (username === message.username ? "main " : "") +
                message.username
              }>
              <span style={{ display: handleHide(message) ? "none" : "" }}>
                {message.fullName}
              </span>
              <div>
                <span
                  style={{
                    opacity:
                      contentList[contentList.indexOf(message) + 1]
                        ?.username === message.username
                        ? "0"
                        : "1",
                  }}>
                  {message.initial}
                </span>
                <p>{message.content}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="chat-keys">
          <div onClick={handleEmojiContainer}>
            <div ref={emoji}>
              <EmojiPicker
                onEmojiClick={handleEmojiPicker}
                emojiStyle={EmojiStyle.GOOGLE}
                style={{ display: "none" }}
              />
            </div>
          </div>
          <textarea ref={messageBox} name={"text"} tabIndex={0}></textarea>
          <input
            type="button"
            className={"btn"}
            defaultValue={"Send"}
            onClick={sendMessage}
          />
        </div>
      </div>
    </section>
  );
};

export default MainRight;
