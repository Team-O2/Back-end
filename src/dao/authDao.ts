// import User from "../models/User";
// import { IUser, IUserDTO } from "../interfaces/IUser";

// /* 회원가입
// user = email, password, nickname, gender, marpolicy
// 1. 요청 데이터가 부족할 경우
// 2. 아이디가 중복일 경우
// */

// async function postUserDAO(body) {
//   const { email, password, nickname, gender, marpolicy } = body;
//   let user = new IUserDTO({
//     email,
//     password,
//     nickname,
//     gender,
//     marpolicy,
//   });
//   await user.save();
// }

// module.exports = {
//     postUserDAO,
// };
