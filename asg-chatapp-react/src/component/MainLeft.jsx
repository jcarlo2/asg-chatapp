import React, { useRef, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlobalContext from "../context/GlobalContext";

const MainLeft = () => {
  const navigate = useNavigate();
  const url = useContext(GlobalContext).url;
  const modalRef = useContext(GlobalContext).modalRef;
  const setText = useContext(GlobalContext).setText;
  const profile = useContext(GlobalContext).profile;
  const setProfile = useContext(GlobalContext).setProfile;
  const setFriendProfile = useContext(GlobalContext).setFriendProfile;
  const friendList = useContext(GlobalContext).friendList;
  const setFriendList = useContext(GlobalContext).setFriendList;
  const sidebarUl = useRef();
  const notificationContainer = useRef();
  const contactContainer = useRef();
  const messageContainer = useRef();
  const profileContainer = useRef();
  const searchListRef = useRef();
  const searchInputRef = useRef();
  const savedContactRef = useRef();
  const [messageFriend, setMessageFriend] = useState([]);
  const [blockedList, setBlockedList] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  

  useEffect(() => {
    findProfile();
    findAllFriends();
    findBlockedFriends();
    findFriendRequest();
  }, []);

  useEffect(() => {
    setMessageFriend(
      friendList.sort((a, b) => new Date(b.date) - new Date(a.date))
    );
  }, [friendList]);

  const findProfile = () => {
    fetch(`${url}/api/v1/user/find-profile`, {
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        res.json().then(setProfile);
      }
    });
  };

  const findAllFriends = () => {
    fetch(`${url}/api/v1/user/find-all-friends`, {
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        res.json().then(setFriendList);
      }
    });
  };

  const findBlockedFriends = () => {
    fetch(`${url}/api/v1/user/find-blocked-friend`, {
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        res.json().then(setBlockedList);
      }
    });
  };

  const findFriendRequest = () => {
    fetch(`${url}/api/v1/user/find-friend-request`, {
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        res.json().then(setRequestList);
      }
    });
  };

  const handleSideBarTab = (num) => {
    const list = sidebarUl.current.querySelectorAll("li");
    list.forEach((element) => {
      element.classList.remove("active");
    });
    list[num - 1].classList.add("active");
    // FIX MESSAGE CONTAINER ** should show not hide if on mobile view
    notificationContainer.current.classList.remove("show");
    contactContainer.current.classList.remove("show");
    messageContainer.current.classList.remove("show");
    profileContainer.current.classList.remove("show");
    if (num === 1) notificationContainer.current.classList.add("show");
    else if (num === 2) contactContainer.current.classList.add("show");
    else if (num === 3) messageContainer.current.classList.add("show");
    else profileContainer.current.classList.add("show");
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    fetch(`${url}/api/v1/user/profile-update`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ profile }),
    }).then((res) => {
      if (res.ok) {
        res.json().then(() => {
          setText("Profile updated successfully");
          modalRef.current.classList.add("show");
          setTimeout(() => {
            modalRef.current.classList.remove("show");
          }, 3000);
        });
      }
    });
  };

  const handleSearch = (search) => {
    if (search.trim() === "") {
      setSearchList([]);
      searchListRef.current.classList.remove("show");
      savedContactRef.current.classList.add("show");
      return;
    }
    searchListRef.current.classList.add("show");
    savedContactRef.current.classList.remove("show");
    fetch(`${url}/api/v1/user/search`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ search }),
    }).then((res) => {
      if (res.ok) {
        res.json().then(setSearchList);
      }
    });
  };

  const handleUnblockAndUnfriend = (id) => {
    console.log(id);
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
          findBlockedFriends();
          findAllFriends();
          findFriendRequest();
          const search = searchInputRef.current.value;
          handleSearch(search);
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
          const search = searchInputRef.current.value;
          setBlockedList(data);
          findAllFriends();
          handleSearch(search);
        });
      }
    });
  };

  const handleSearchOption = (target, id) => {
    let fullUrl = "";
    const str = target.textContent;
    const search = searchInputRef.current.value;
    if (str === "Accept") fullUrl = `${url}/api/v1/user/accept`;
    else if (str === "Add") fullUrl = `${url}/api/v1/user/add`;
    else {
      handleUnblockAndUnfriend(id, 1);
      findFriendRequest();
      handleSearch(search);
      return;
    }
    fetch(fullUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    }).then((res) => {
      if (res.ok) {
        res.json().then(() => {
          findAllFriends();
          findFriendRequest();
          handleSearch(search);
        });
      }
    });
  };

  const logout = () => {
    fetch(`${url}/api/v1/user/logout`, {
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        navigate("/login");
      }
    });
  };

  return (
    <section className="main-one">
      <h1>
        <i className="bx bxl-ok-ru bx-md"></i> Chat App
      </h1>
      <ul ref={sidebarUl}>
        <li className="active" onClick={() => handleSideBarTab(1)}>
          <i className="bx bxs-bell bx-sm"></i>
        </li>
        <li onClick={() => handleSideBarTab(2)}>
          <i className="bx bxs-contact bx-sm"></i>
        </li>
        <li onClick={() => handleSideBarTab(3)}>
          <i className="bx bxs-message-dots bx-sm"></i>
        </li>
        <li onClick={() => handleSideBarTab(4)}>
          <i className="bx bxs-user-circle bx-sm"></i>
        </li>
      </ul>
      <div ref={notificationContainer} className="notification-container">
        <div className="active">
          <div>JV</div>
          <div>
            <div>07-02-2023 09:28</div>
            <p>
              notification message aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            </p>
          </div>
        </div>
      </div>
      <div ref={contactContainer} className="contact-container">
        <div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search someone ..."
            onChange={(e) => handleSearch(e.target.value)}
          />
          <i className="bx bx-search bx-md"></i>
        </div>
        <ul ref={searchListRef} className="search-list">
          {searchList.map((friend) => (
            <li key={`search-${friend.id}`}>
              <div>{friend.initial}</div>
              <div>
                <p>{friend.fullName}</p>
                <div>
                  <a
                    onClick={(e) =>
                      handleSearchOption(e.currentTarget, friend.id)
                    }>
                    {friend.status === ""
                      ? "Add"
                      : friend.status === "PENDING APPROVED"
                      ? "Accept"
                      : friend.status === "FRIEND"
                      ? "Unfriend"
                      : "Pending"}
                  </a>
                  {friend.status == "PENDING APPROVED" && (
                    <a onClick={() => handleUnblockAndUnfriend(friend.id)}>
                      Decline
                    </a>
                  )}
                  <a onClick={() => handleBlock(friend.id)}>Block</a>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div ref={savedContactRef} className="saved-contact show">
          <details className="friend-request">
            <summary>Request List</summary>
            <ul className="contact-list show">
              {requestList.map((friend) => (
                <li key={`request-${friend.id}`}>
                  <div>{friend.initial}</div>
                  <div>
                    <p>{friend.fullName}</p>
                    <div>
                      <a
                        onClick={(e) =>
                          handleSearchOption(e.target, friend.id)
                        }>
                        {friend.status === "PENDING REQUEST"
                          ? "Pending"
                          : "Accept"}
                      </a>
                      {friend.status === "PENDING APPROVED" && (
                        <a
                          onClick={(e) =>
                            handleSearchOption(e.target, friend.id)
                          }>
                          Decline
                        </a>
                      )}
                      <a onClick={() => handleBlock(friend.id)}>Block</a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </details>
          <details className="friend-list">
            <summary>Friend List</summary>
            <ul className="contact-list show">
              {friendList.map((friend) => (
                <li key={`friend-${friend.id}`}>
                  <div>{friend.initial}</div>
                  <div>
                    <p>{friend.fullName}</p>
                    <div>
                      <a onClick={() => handleUnblockAndUnfriend(friend.id, 1)}>
                        Unfriend
                      </a>
                      <a onClick={() => handleBlock(friend.id)}>Block</a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </details>
          <details className="block-request">
            <summary>Block List</summary>
            <ul className="contact-list show">
              {blockedList.map((block) => (
                <li key={`block-${block.id}`}>
                  <div>{block.initial}</div>
                  <div>
                    <p>{block.fullName}</p>
                    <div>
                      <a onClick={() => handleUnblockAndUnfriend(block.id, 0)}>
                        Unblock
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
      <div ref={profileContainer} className="profile-container">
        <form onSubmit={handleProfileUpdate}>
          <div>
            <p>Username</p>
            <input
              type="text"
              name="username"
              readOnly
              required
              defaultValue={profile.username}
            />
          </div>
          <div>
            <p>First Name</p>
            <input
              className="changeable"
              type="text"
              name="firstName"
              required
              value={profile.firstName}
              onChange={(e) =>
                setProfile((prevState) => ({
                  ...prevState,
                  firstName: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <p>Last Name</p>
            <input
              className="changeable"
              type="text"
              name="lastName"
              required
              value={profile.lastName}
              onChange={(e) =>
                setProfile((prevState) => ({
                  ...prevState,
                  lastName: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <p>Gender</p>
            <select
              className="changeable"
              name="gender"
              value={profile.gender}
              onChange={(e) =>
                setProfile({ ...profile, gender: e.target.value })
              }>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <p>Email</p>
            <input
              type="text"
              name="username"
              readOnly
              required
              value={profile.email}
            />
          </div>
          <div>
            <p>Birthdate</p>
            <input
              type="text"
              name="username"
              readOnly
              required
              value={profile.birthdate}
            />
          </div>

          <input type="submit" value="Update" />
        </form>
        <Link to={"/change-password"}>Change Password</Link>
        <a onClick={logout}>Logout</a>
      </div>
      <div ref={messageContainer} className="message-container show">
        {messageFriend.map((friend) => (
          <div
            key={`message-${friend.id}`}
            className="active"
            onClick={() => setFriendProfile(friend)}>
            <div>{friend.initial}</div>
            <div>
              <div>{friend.date}</div>
              <p>{friend.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MainLeft;
