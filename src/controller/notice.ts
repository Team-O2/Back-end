import { Router, Request, Response } from "express";
// libraries
import { returnCode } from "src/library/returnCode";
import { response, dataResponse } from "src/library/response";
// services
import {
  getNoticeAll,
  getNoticeOne,
  getNoticeSearch,
  postNoticeComment,
} from "src/service/noticeService";

// middlewares
import auth from "src/middleware/auth";

const router = Router();

/**
 *  @공지사항_전체_가져오기
 *  @route Get /notice
 *  @access private
 */

router.get("/", auth, async (req: Request, res: Response) => {
  try {
    const data = await getNoticeAll(req.query.offset);

    // 공지사항 불러오기 성공
    const notice = data;
    dataResponse(res, returnCode.OK, "공지사항 불러오기 성공", notice);
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

/**
 *  @공지사항_검색_또는_필터
 *  @route Get /notice/search?keyword=검색할단어
 *  @access private
 */

router.get("/search", auth, async (req: Request, res: Response) => {
  try {
    const data = await getNoticeSearch(req.query.keyword, req.query.offset);

    // 검색 불러오기 성공
    const noticeSearch = data;
    dataResponse(res, returnCode.OK, "검색 성공", noticeSearch);
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

/**
 *  @공지사항_디테일
 *  @route Get /notice/:noticeID
 *  @access private
 */

router.get("/:id", auth, async (req: Request, res: Response) => {
  try {
    const data = await getNoticeOne(req.params.id);

    const notice = data;
    dataResponse(res, returnCode.OK, "해당 공지사항 불러오기 성공", notice);
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

/**
 *  @공지사항_댓글_등록
 *  @route Post /notice/comment/:noticeID
 *  @access private
 */
router.post("/comment/:id", auth, async (req: Request, res: Response) => {
  try {
    const data = await postNoticeComment(
      req.params.id,
      req.body.userID.id,
      req.body
    );

    // 공지사항 id가 잘못된 경우
    if (data === -1) {
      response(res, returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
    }
    //  요청 바디가 부족한 경우
    if (data === -2) {
      response(res, returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
    }
    // 부모 댓글 id가 잘못된 경우
    if (data === -3) {
      response(res, returnCode.BAD_REQUEST, "부모 댓글 id가 올바르지 않습니다");
    }
    // 댓글 등록 성공
    const noticeID = data;
    dataResponse(res, returnCode.OK, "댓글 등록 성공", noticeID);
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

module.exports = router;
