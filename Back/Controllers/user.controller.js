const User = require('../Models/user');
const userController = {}

userController.saveUser = async(userName, sid) => {
  // 이미 있는 유저인지 확인
  let user = await User.findOne({ name: userName });
  // 없으면 생성
  if(!user) {
    user = new User({
      name: userName,
      token: sid,
      online: true
    });
  }
  // 있으면 연결정보 token값만 변경
  user.token = sid;
  user.online = true;
  await user.save();
  return user;
};

userController.getUser = async(sid) => {
  const user = await User.findOne({ token: sid });
  if(!user) throw new Error("user not found")
  return user;
}

// 유저를 오프라인 상태로 설정하는 메서드
userController.setUserOffline = async(sid) => {
  const user = await User.findOne({ token: sid });
  if (user) {
    user.online = false;
    await user.save();
  }
  return user;
};

// 온라인 상태인 유저 목록을 가져오는 메서드
userController.getOnlineUsers = async() => {
  return await User.find({ online: true });
};

module.exports = userController