import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
const returnCode = require("../library/returnCode");
const authService = require("../service/authService");
const {
  response,
  dataResponse,
  dataTokenResponse,
} = require("../library/response");

const router = express.Router();

/**
 *  @회원가입
 *  @route Post api/auth
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
      const data = await authService.postSignup(req.body);

      // 요청 바디가 부족할 경우
      if (data == -1) {
        response(res, returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
      }

      // 이미 존재하는 아이디
      if (data == -2) {
        response(res, returnCode.CONFLICT, "중복된 아이디 입니다");
      }

      const { userInfo, token } = data;

      dataTokenResponse(
        res,
        returnCode.CREATED,
        "회원가입 성공",
        userInfo,
        token
      );
    } catch (err) {
      console.error(err.message);
      response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
  }
);

module.exports = router;
