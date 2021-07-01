const authDao = require("../dao/authDao");
const jwt = require("../library/jwt");
import User from "../models/User";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";

/**
 *  @회원가입
 *  @route Post api/auth
 *  @body email,password, nickname, marpolicy, interest
 *  @error
 *      1. 요청 바디 부족
 *      2. 아이디 중복
 */

async function postSignup(body) {
  const { email, password, nickname, marpolicy, interest } = body;

  // 1. 요청 바디 부족
  if (!email || !password || !nickname || !marpolicy || !interest) {
    return -1;
  }

  // 2. 아이디 중복
  let user = await User.findOne({ email });
  if (user) {
    return -2;
  }

  let userInfo = new User({
    email,
    password,
    nickname,
    marpolicy,
    interest,
  });
  // Encrpyt password
  const salt = await bcrypt.genSalt(10);
  const hashPW = await bcrypt.hash(password, salt);

  // Return jsonwebtoken
  const payload = {
    user: {
      id: userInfo.id,
    },
  };
  jwt.sign(payload, config.jwtSecret, { expiresIn: 36000 }, (err, token) => {
    if (err) throw err;
    return { userInfo, token };
  });
}
module.exports = {
  postSignup,
};
