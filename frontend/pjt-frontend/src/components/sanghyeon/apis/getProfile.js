import axios from "axios";

function getProfile(userId) {
  axios({
    method: "GET",
    url: `/profile/${userId}`,
    data: {
      userId,
    },
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      alert(error);
    });
}

export default getProfile;
