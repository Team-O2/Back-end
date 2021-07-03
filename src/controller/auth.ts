import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { returnCode } from "src/library/returnCode";
import { postSignin, postSignup } from "src/service/authService";
import { response, dataTokenResponse } from "src/library/response";

const router = Router();

/**
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
        dataTokenResponse(
          res,
          returnCode.CREATED,
          "회원가입 성공",
          user,
          token
        );
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
        dataTokenResponse(res, returnCode.OK, "로그인 성공", user, token);
      }
    } catch (err) {
      console.error(err.message);
      response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
  }
);

module.exports = router;
