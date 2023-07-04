const useHelper = () => {
  const findAllFriends = (url, setFriendList) => {
    fetch(`${url}/api/v1/user/find-all-friends`, {
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          console.log(data, " FRIEND");
          setFriendList(data);
        });
      }
    });
  };

  const findBlockedFriends = (url, setBlockedList) => {
    fetch(`${url}/api/v1/user/find-blocked-friend`, {
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          setBlockedList(data);
          console.log(data, " BLOCKED");
        });
      }
    });
  };

  const findFriendRequest = (url, setRequestList) => {
    fetch(`${url}/api/v1/user/find-friend-request`, {
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          setRequestList(data);
          console.log(data, " REQUEST");
        });
      }
    });
  };

  const findSearchRequest = (url, setSearchList, search) => {
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
  return {
    findAllFriends,
    findBlockedFriends,
    findFriendRequest,
    findSearchRequest,
  };
};

export default useHelper;
