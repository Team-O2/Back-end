import express, { Request, Response } from "express";
import { returnCode } from "src/library/returnCode";
import {
  response,
  dataResponse,
  dataTokenResponse,
} from "src/library/response";
import { verify } from "src/library/jwt";
import { IAdminDTO, IAdminListDTO } from "src/interfaces/IAdmin";
import { IConcertAdminDTO } from "src/interfaces/IConcert";
import {
  postAdminList,
  postAdminChallenge,
  postAdminConcert,
} from "src/service/adminService";

const router = express.Router();

/**
 *  @관리자_페이지_조회
 *  @route Get admin
 *  @access Public
 */
router.get<unknown, unknown, IAdminDTO>(
  "/",
  async (req: Request, res: Response) => {
    try {
      // 토큰 검사
      if (req.headers.authorization == null) {
        response(res, returnCode.BAD_REQUEST, "토큰 값이 요청되지 않았습니다");
      }

      //토큰
      const token = req.headers.authorization;
      const decoded = verify(token);

      // 토큰 확인
      if (decoded === -3) {
        response(res, returnCode.UNAUTHORIZED, "만료된 토큰입니다");
      } else if (decoded === -2) {
        response(res, returnCode.UNAUTHORIZED, "적합하지 않은 토큰입니다");
      }

      const userID = decoded.user.id;
      const data = await postAdminList(userID);

      // 유저 id가 관리자가 아님
      if (data === -2) {
        response(res, returnCode.NOT_FOUND, "관리자 아이디가 아닙니다");
      }
      // 관리자 챌린지 등록 성공
      else {
        dataResponse(res, returnCode.OK, "관리자 페이지 조회 성공", data);
      }
    } catch (err) {
      console.error(err.message);
      response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
  }
);

/**yar
 *  @관리자_챌린지_등록
 *  @route Post admin/challenge
 *  @access Public
 */
router.post<unknown, unknown, IAdminDTO>(
  "/challenge",
  async (req: Request, res: Response) => {
    try {
      // 토큰 검사
      if (req.headers.authorization == null) {
        response(res, returnCode.BAD_REQUEST, "토큰 값이 요청되지 않았습니다");
      }

      //토큰
      const token = req.headers.authorization;
      const decoded = verify(token);

      // 토큰 확인
      if (decoded === -3) {
        response(res, returnCode.UNAUTHORIZED, "만료된 토큰입니다");
      } else if (decoded === -2) {
        response(res, returnCode.UNAUTHORIZED, "적합하지 않은 토큰입니다");
      }

      const userID = decoded.user.id;
      const data = await postAdminChallenge(userID, req.body);

      // 요청 바디가 부족할 경우
      if (data === -1) {
        response(res, returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
      }
      // 유저 id가 관리자가 아님
      else if (data === -2) {
        response(res, returnCode.NOT_FOUND, "관리자 아이디가 아닙니다");
      }
      // 챌린지 기간이 신청 기간보다 빠른 경우 or 기간 입력이 잘못된 경우
      else if (data === -3) {
        response(res, returnCode.BAD_REQUEST, "잘못된 기간을 입력하셨습니다");
      }

      // 관리자 챌린지 등록 성공
      else {
        response(res, returnCode.OK, "관리자 챌린지 등록 성공");
      }
    } catch (err) {
      console.error(err.message);
      response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
  }
);

/**yar
 *  @관리자_오픈콘서트_쉐어투게더_게시
 *  @route Post admin/concert
 *  @access Public
 */

router.post<unknown, unknown, IConcertAdminDTO>(
  "/concert",
  async (req: Request, res: Response) => {
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

      const data = await postAdminConcert(userID, req.body);

      console.log(data);
      // 요청 바디가 부족할 경우
      if (data === -1) {
        response(res, returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
      }
      // 유저 id가 관리자가 아님
      else if (data === -2) {
        response(res, returnCode.BAD_REQUEST, "관리자 아이디가 아닙니다");
      } else if (data === -3) {
        response(
          res,
          returnCode.BAD_REQUEST,
          "해당 날짜에 진행되는 기수가 없음"
        );
      }

      // 관리자 챌린지 등록 성공
      else {
        response(res, returnCode.OK, "관리자 오투콘서트 등록 성공");
      }
    } catch (err) {
      console.error(err.message);
      response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
  }
);

module.exports = router;
