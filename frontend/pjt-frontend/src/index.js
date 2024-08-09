const now = new Date(); // 현재 날짜 및 시간
const hours = now.getHours();
const minutes = now.getMinutes();
document.getElementById('root');
if(0 <= minutes <30){
  document.body.style.backgroundImage = `url("/background1.gif")`;
} else {
  document.body.style.backgroundImage = `url("/background2.gif")`;
}

// if (6 <= hours < 18) {
//   document.body.style.backgroundImage = `url("/background1.gif")`;
// } else {
//   document.body.style.backgroundImage = `url("/background2.gif")`;
// }
