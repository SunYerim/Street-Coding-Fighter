import axios from "axios";

function getRecord(userId) {
  axios({
    method: "GET",
    url: `/profile/record/${userId}`,
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

export default getRecord;
