import axios from "axios";

function getProfile(userId) {
  axios({
    method: "GET",
    url: "/user/profile",
    data: {
      userId,
    },
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

export default getProfile;
