import User from "src/models/User";
import Badge from "src/models/Badge";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "src/config";

import { smtpTransport } from 'src/library/emailSender'
import ejs from "ejs";

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

  // 인증번호를 user에 저장 -> 제한 시간 설정하기!
  const authNum = Math.random().toString().substr(2, 6);
  user.emailCode = authNum;
  await user.save();

  let emailTemplate;
  ejs.renderFile(
    "src/library/emailTemplete.ejs",
    { authCode: authNum },
    (err, data) => {
      if (err) {
        console.log(err);
      }
      emailTemplate = data;
    }
  );

  const mailOptions = {
    front: "hyunjin5697@gmail.com",
    to: email,
    subject: "메일 제목",
    text: "메일 내용",
    html: emailTemplate,
  };

  await smtpTransport.sendMail(mailOptions, (error, info) => {
    if (error) {
      // res.json({ msg: "err" });
      console.log(error);
    } else {
      // res.json({ msg: "sucess" });
      console.log("success");
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
 *      2. 유저가 존재하지 않음
 */
export async function postCode(body) {
  // 저장해놓은 authNum이랑 body로 온 인증번호랑 비교
  const { email, emailCode } = body;

  // 1. 요청 바디 부족
  if (!email || !emailCode) {
    return -1;
  }

  // 2. 유저가 존재하지 않음
  // isDeleted = false 인 유저를 찾아야함
  // 회원 탈퇴했다가 다시 가입한 경우 생각하기
  let user = await User.findOne({ email: email });
  if (!user) {
    return -2;
  }

  if (emailCode !== user.emailCode) {
    // 인증번호가 일치하지 않음
    return -3;
  }
  else {
    // 인증번호 일치
    return 0;
  }
}

/**
 *  @비밀번호_재설정
 *  @route Patch auth/pw
 *  @body email
 *  @error
 *      1. 요청 바디 부족
 *      2. 아이디가 존재하지 않음
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

  // 비밀번호 변경 로직
  user.password = password;
  await user.save();
}
