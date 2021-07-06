import User from "src/models/User";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "src/config";

/**
 *  @회원가입
 *  @route Post api/auth
 *  @body email,password, nickname, marpolicy, interest
 *  @error
 *      1. 요청 바디 부족
 *      2. 아이디 중복
 */

export async function postSignup(body) {
  const { email, password, nickname, gender, marpolicy, interest } = body;

  // 1. 요청 바디 부족
  if (!email || !password || !nickname || !interest) {
    return -1;
  }

  // 2. 아이디 중복
  let user = await User.findOne({ email });
  if (user) {
    return -2;
  }

  user = new User({
    email,
    password,
    nickname,
    gender,
    marpolicy,
    interest,
  });

  // Encrpyt password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  await user.save();

  // Return jsonwebtoken
  const payload = {
    user: {
      id: user.id,
    },
  };

  // access 토큰 발급
  // 유효기간 14일
  let token = jwt.sign(payload, config.jwtSecret, { expiresIn: "14d" });

  return { user, token };
}

/**
 *  @로그인
 *  @route Post auth/siginin
 *  @body email,password
 *  @error
 *      1. 요청 바디 부족
 *      2. 아이디가 존재하지 않음
 *      3. 패스워드가 올바르지 않음
 */

export async function postSignin(body) {
  const { email, password } = body;

  // 1. 요청 바디 부족
  if (!email || !password) {
    return -1;
  }

  // 2. email이 DB에 존재하지 않음
  let user = await User.findOne({ email });
  if (!user) {
    return -2;
  }

  // 3. password가 올바르지 않음
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return -3;
  }

  await user.save();

  const payload = {
    user: {
      id: user.id,
    },
  };

  // access 토큰 발급
  // 유효기간 14일
  let token = jwt.sign(payload, config.jwtSecret, { expiresIn: "14d" });
  return { user, token };
}
