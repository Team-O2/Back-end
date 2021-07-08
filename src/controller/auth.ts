import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { returnCode } from "src/library/returnCode";
import { patchPassword, postCode, postEmail, postSignin, postSignup } from "src/service/authService";
import {
  response,
  dataResponse,
  dataTokenResponse,
  tokenResponse,
} from "src/library/response";

const router = express.Router();

/**yar
 *  @회원가입
 *  @route Post auth/signup
 *  @access Public
 */
router.post(
  "/signup",
  [
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const data = await postSignup(req.body);

      // 요청 바디가 부족할 경우
      if (data == -1) {
        response(res, returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
      } // 이미 존재하는 아이디
      else if (data == -2) {
        response(res, returnCode.CONFLICT, "중복된 아이디 입니다");
      }
      // 회원가입 성공
      else {
        const { user, token } = data;
        tokenResponse(res, returnCode.CREATED, "회원가입 성공", token);
      }
    } catch (err) {
      console.error(err.message);
      response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
  }
);

/**
 *  @로그인
 *  @route Post auth/signin
 *  @desc Authenticate user & get token
 *  @access Public
 */

router.post(
  "/signin",
  [check("email", "Please include a valid email").isEmail()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const data = await postSignin(req.body);

      // 요청 바디가 부족할 경우
      if (data == -1) {
        response(res, returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
      }
      // email이 DB에 없을 경우
      else if (data == -2) {
        response(res, returnCode.BAD_REQUEST, "아이디가 존재하지 않습니다");
      }
      // password가 틀렸을 경우
      else if (data == -3) {
        response(res, returnCode.BAD_REQUEST, "비밀번호가 틀렸습니다");
      }
      // 로그인 성공
      else {
        const { user, token } = data;
        tokenResponse(res, returnCode.OK, "로그인 성공", token);
      }
    } catch (err) {
      console.error(err.message);
      response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
  }
);

/**
 *  @이메일_인증번호_전송
 *  @route Post auth/email
 *  @access Public
 */

router.post(
  "/email",
  [check("email", "Please include a valid email").isEmail()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const data = await postEmail(req.body);

      // 요청 바디가 부족할 경우
      if (data == -1) {
        response(res, returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
      }
      // email이 DB에 없을 경우
      if (data == -2) {
        response(res, returnCode.BAD_REQUEST, "아이디가 존재하지 않습니다");
      }
      // 성공
      response(res, returnCode.OK, "로그인 성공");
    } catch (err) {
      console.error(err.message);
      response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
  }
);

/**
 *  @인증번호_확인
 *  @route Post auth/code
 *  @access Public
 */

router.post(
  "/code",
  async (req: Request, res: Response) => {
    try {
      const data = await postCode(req.body);

      // 요청 바디가 부족할 경우
      if (data === -1) {
        response(res, returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
      }
      // email이 DB에 없을 경우
      if (data === -2) {
        response(res, returnCode.BAD_REQUEST, "아이디가 존재하지 않습니다");
      }
      // 인증번호가 올바르지 않은 경우
      if (data === -3) {
        dataResponse(res, returnCode.OK, "인증번호 인증 실패", { isOkay: false })
      }
      // 인증번호 인증 성공
      dataResponse(res, returnCode.OK, "인증번호 인증 성공", { isOkay: true });
    } catch (err) {
      console.error(err.message);
      response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
  }
);

/**
 *  @비밀번호_변경
 *  @route Patch auth/pw
 *  @desc Authenticate user & get token
 *  @access Public
 */

router.patch(
  "/pw",
  [
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const data = await patchPassword(req.body);

      // 요청 바디가 부족할 경우
      if (data === -1) {
        response(res, returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
      }
      // email이 DB에 없을 경우
      if (data === -2) {
        response(res, returnCode.BAD_REQUEST, "아이디가 존재하지 않습니다");
      }
      // 성공
      dataResponse(res, returnCode.OK, "비밀번호 변경 성공", data);
    } catch (err) {
      console.error(err.message);
      response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
  }
);

module.exports = router;
