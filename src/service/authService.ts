import User from "src/models/User";
import Badge from "src/models/Badge";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "src/config";
import nodemailer from 'nodemailer';

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

  const badge = new Badge({
    user: user.id,
  });
  await badge.save();

  // Encrpyt password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  await user.save();
  // console.log(user);
  await user.updateOne({ badge: badge._id });

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


/**
 *  @이메일_인증번호_전송
 *  @route Post auth/email
 *  @body email
 *  @error
 *      1. 요청 바디 부족
 *      2. 아이디가 존재하지 않음
 */
export async function postEmail(body) {
  const { email } = body;

  // 1. 요청 바디 부족
  if (!email) {
    return -1;
  }

  // 2. email이 DB에 존재하지 않음
  let user = await User.findOne({ email });
  if (!user) {
    return -2;
  }

  const mailOptions = {
    front: "hyunjin5697@gmail.com",
    to: email,
    subject: "메일 제목",
    text: "메일 내용",
  }

  await smtpTransport.sendMail(mailOptions, (error, res) =>{
    if(error){
        res.json({msg:'err'});
    }else{
        res.json({msg:'sucess'});
    }
    smtpTransport.close();
  });
  return 0;
}


/**
 *  @인증번호_인증
 *  @route Post auth/code
 *  @body email
 *  @error
 *      1. 요청 바디 부족
 *      2. 인증번호가 일치하지 않음
 */
export async function postCode(body) {
  
}


/**
 *  @비밀번호_재설정
 *  @route Post auth/email
 *  @body email
 *  @error
 *      1. 요청 바디 부족
 *      2. 아이디가 존재하지 않음
 *      3. 비밀번호가 형식에 맞지 않음
 */
export async function patchPassword(body) {
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

  // 비밀번호 변경 로직

  await user.save();

  const payload = {
    user: {
      id: user.id,
    },
  };
}


// admin email 주소랑 비밀번호 -> .env에 넣어놓기
const smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
      user: "hyunjin5697@gmail.com",
      pass: "password"
  },
  tls: {
      rejectUnauthorized: false
  }
});

