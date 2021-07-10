import { Router, Request, Response } from "express";
// libraries
import { returnCode } from "src/library/returnCode";
import { response, dataResponse } from "src/library/response";
//middlewares
import auth from "src/middleware/auth";
const upload = require("src/modules/upload");
// interfaces
import { IAdmin } from "src/interfaces/IAdmin";
import { IConcert } from "src/interfaces/IConcert";
//services
import {
  postAdminList,
  postAdminChallenge,
  postAdminConcert,
  postAdminNotice,
} from "src/service/adminService";

const router = Router();

/**
 *  @관리자_페이지_조회
 *  @route Get admin
 *  @access private
 */
router.get<unknown, unknown, IAdmin>(
  "/",
  auth,
  async (req: Request, res: Response) => {
    try {
      const data = await postAdminList(req.body.userID.id);

      // 유저 id가 관리자가 아님
      if (data === -2) {
        response(res, returnCode.NOT_FOUND, "관리자 아이디가 아닙니다");
      }
      // 관리자 챌린지 조회 성공
      else {
        dataResponse(res, returnCode.OK, "관리자 페이지 조회 성공", data);
      }
    } catch (err) {
      console.error(err.message);
      response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
  }
);

/**
 *  @관리자_챌린지_등록
 *  @route Post admin/challenge
 *  @access private
 */
router.post<unknown, unknown, IAdmin>(
  "/challenge",
  auth,
  async (req: Request, res: Response) => {
    try {
      const data = await postAdminChallenge(req.body.userID.id, req.body);

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

/**
 *  @관리자_오픈콘서트_등록
 *  @route Post admin/concert
 *  @access private
 */

router.post<unknown, unknown, IConcert>(
  "/concert",
  upload.fields([
    { name: "videoLink", maxCount: 1 },
    { name: "imgThumbnail", maxCount: 1 },
  ]),
  auth,
  async (req: Request, res: Response) => {
    try {
      const url = {
        videoLink: (req as any).files.videoLink
          ? (req as any).files.videoLink[0].location
          : "",
        imgThumbnail: (req as any).files.imgThumbnail
          ? (req as any).files.imgThumbnail[0].location
          : "",
      };
      const data = await postAdminConcert(req.body.userID.id, req.body, url);

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

/**
 *  @관리자_공지사항_등록
 *  @route Post admin/notice
 *  @access private
 */

router.post<unknown, unknown, IConcert>(
  "/notice",
  upload.fields([
    { name: "videoLink", maxCount: 1 },
    { name: "imgThumbnail", maxCount: 1 },
  ]),
  auth,
  async (req: Request, res: Response) => {
    try {
      const url = {
        videoLink: (req as any).files.videoLink
          ? (req as any).files.videoLink[0].location
          : "",
        imgThumbnail: (req as any).files.imgThumbnail
          ? (req as any).files.imgThumbnail[0].location
          : "",
      };

      const data = await postAdminNotice(
        req.body.userID.id,
        req.body,
        // JSON.parse(req.body.json),
        url
      );

      // 요청 바디가 부족할 경우
      if (data === -1) {
        response(res, returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
      }
      // 유저 id가 관리자가 아님
      else if (data === -2) {
        response(res, returnCode.BAD_REQUEST, "관리자 아이디가 아닙니다");
      }

      // 관리자 공지사항 등록 성공
      else {
        response(res, returnCode.OK, "관리자 공지사항 등록 성공");
      }
    } catch (err) {
      console.error(err.message);
      response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
  }
);

module.exports = router;
