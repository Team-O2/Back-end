import { Router, Request, Response } from "express";
import { returnCode } from "src/library/returnCode";
import {
  response,
  dataResponse,
  dataTokenResponse,
} from "src/library/response";
import { verify } from "src/library/jwt";
import { postRegister } from "src/service/userService";

const router = Router();

/**yar
 *  @User_챌린지_신청하기
 *  @route Post user/register
 *  @access Public
 */

router.post("/register", async (req: Request, res: Response) => {
  try {
    // 토큰 검사
    if (req.headers.authorization == null) {
      response(res, returnCode.BAD_REQUEST, "토큰 값이 요청되지 않았습니다");
    }

    //토큰
    const token = req.headers.authorization;
    const decoded = verify(token);
    const userID = decoded.user.id;

    // 토큰 확인
    if (decoded === -3) {
      response(res, returnCode.UNAUTHORIZED, "만료된 토큰입니다");
    } else if (decoded === -2) {
      response(res, returnCode.UNAUTHORIZED, "적합하지 않은 토큰입니다");
    }

    const data = await postRegister(userID, req.body);

    // 요청 바디가 부족할 경우
    if (data === -1) {
      response(res, returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
    }
    // 유저 id가 관리자 아이디임
    else if (data === -2) {
      response(
        res,
        returnCode.BAD_REQUEST,
        "관리자 아이디는 신청할 수 없습니다"
      );
    } else if (data === -3) {
      response(res, returnCode.BAD_REQUEST, "신청 기간이 아닙니다.");
    }
    // 이미 신청된 아이디일 경우
    else if (data == -4) {
      response(res, returnCode.BAD_REQUEST, "이미 신청이 완료된 사용자.");
    }
    // 신청 인원이 초과되었을 경우
    else if (data === -5) {
      response(res, returnCode.BAD_REQUEST, "신청 인원이 초과되었습니다");
    }

    // 챌린지 신청 성공
    else {
      response(res, returnCode.OK, "챌린지 신청 성공");
    }
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

module.exports = router;
