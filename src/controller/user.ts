import { Router, Request, Response } from "express";
import { returnCode } from "src/library/returnCode";
import {
  response,
  dataResponse,
  dataTokenResponse,
} from "src/library/response";
import { verify } from "src/library/jwt";
import {
  postRegister,
  getMypageConcert,
  getMypageChallenge,
  deleteMypageChallenge,
  getMypageInfo,
} from "src/service/userService";

// middleware
import auth from "src/middleware/auth";

const router = Router();

/**
 *  @User_챌린지_신청하기
 *  @route Post user/register
 *  @access Public
 */

router.post("/register", auth, async (req: Request, res: Response) => {
  try {
    const data = await postRegister(req.body.userID.id, req.body);

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

/**
 *  @User_마이페이지_콘서트_스크랩
 *  @route Get user/mypage/concert
 *  @access Public
 */

router.get("/mypage/concert", auth, async (req: Request, res: Response) => {
  try {
    const data = await getMypageConcert(req.body.userID.id);

    // 1. no content
    if (data == -1) {
      response(
        res,
        returnCode.NO_CONTENT,
        "스크랩한 Share Together가 없습니다."
      );
    }

    // 마이페이지 콘서트 조회 성공
    else {
      dataResponse(res, returnCode.OK, "Share Together 스크랩 조회 성공", data);
    }
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

/**
 *  @User_마이페이지_회고_스크랩
 *  @route Get user/mypage/challenge
 *  @access Public
 */

router.get("/mypage/challenge", auth, async (req: Request, res: Response) => {
  try {
    const data = await getMypageChallenge(req.body.userID.id);

    // 1. no content
    if (data == -1) {
      response(res, returnCode.NO_CONTENT, "스크랩한 Run Myself가 없습니다.");
    }

    // 마이페이지 콘서트 조회 성공
    else {
      dataResponse(res, returnCode.OK, "Run Myself 스크랩 조회 성공", data);
    }
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

/**
 *  @User_마이페이지_Info
 *  @route Get user/mypage/info
 *  @access private
 */
router.get("/mypage/info", auth, async (req: Request, res: Response) => {
  try {
    const data = await getMypageInfo(req.body.userID.id);

    // 유저정보 조회 성공
    dataResponse(res, returnCode.OK, "마이페이지 유저정보 검색 성공", data);
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

/**
 *  @User_마이페이지_회고_스크랩_취소토글
 *  @route Delete user/mypage/challenge/:challengeID
 *  @access private
 */

router.delete(
  "/mypage/challenge/:id",
  auth,
  async (req: Request, res: Response) => {
    try {
      const data = await deleteMypageChallenge(
        req.body.userID.id,
        req.params.id
      );
      // 회고 id가 잘못된 경우
      if (data === -1) {
        response(res, returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
      }
      // 스크랩 하지 않은 글일 경우
      if (data === -2) {
        response(res, returnCode.BAD_REQUEST, "스크랩 하지 않은 글입니다");
      }
      // 마이페이지 회고 스크랩 취소
      response(res, returnCode.OK, "스크랩 취소 성공");
    } catch (err) {
      console.error(err.message);
      response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
  }
);

module.exports = router;
