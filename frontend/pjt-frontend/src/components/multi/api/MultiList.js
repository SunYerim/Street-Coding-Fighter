import axios from "axios";

function getMultiList(id, title, headerUser, userMax, userCount, isLock) {
  console.log(id, title, headerUser, userMax, userCount, isLock);

  axios({
    method: "GET",
    url: "/battle",
    data: {
      username,
      password,
    },
  }).then((response) => {
    console.log(response);
  });
  return;
}

export default getMultiList;
