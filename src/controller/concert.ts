import { Router, Request, Response } from "express";
// libraries
import { returnCode } from "src/library/returnCode";
import { response, dataResponse } from "src/library/response";
// services
import {
  postConcertComment,
  postConcertLike,
  deleteConcertLike,
  getConcertAll,
  getConcertSearch,
  postConcertScrap,
  deleteConcertScrap,
  getConcertOne,
} from "src/service/concertService";

// middlewares
import auth from "src/middleware/auth";
// DTO
import { IConcertPostDTO } from "src/interfaces/IConcert";

const router = Router();

/**
 *  @오투콘서트_전체_가져오기
 *  @route Get /concert
 *  @access Private
 */

router.get("/", auth, async (req: Request, res: Response) => {
  try {
    const data = await getConcertAll(req.query.offset);

    // 회고 전체 불러오기 성공
    const concert = data;
    dataResponse(res, returnCode.OK, "콘서트 전체 불러오기 성공", concert);
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

/**
 *  @오투콘서트_검색_또는_필터
 *  @route Get /concert/search?tag=관심분야&ismine=내글만보기여부&keyword=검색할단어
 *  @access Private
 */

router.get("/search", auth, async (req: Request, res: Response) => {
  try {
    const data = await getConcertSearch(
      req.query.tag,
      req.query.keyword,
      req.query.offset
    );

    // 검색 불러오기 성공
    const concertSearch = data;
    dataResponse(res, returnCode.OK, "검색 성공", concertSearch);
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

/**
 *  @오투콘서트_Detail
 *  @route Get /concert/:concertID
 */
router.get("/:id", auth, async (req: Request, res: Response) => {
  try {
    const data = await getConcertOne(req.params.id);

    const concert = data;
    dataResponse(
      res,
      returnCode.OK,
      "해당 콘서트 게시글 불러오기 성공",
      concert
    );
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

/**
 *  @콘서트_댓글_등록
 *  @route Post /concert/comment/:concertID
 *  @access Private
 */

router.post("/comment/:id", auth, async (req: Request, res: Response) => {
  try {
    const data = await postConcertComment(
      req.params.id,
      req.body.userID.id,
      req.body
    );

    // 회고 id가 잘못된 경우
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
    const concertComment = data;
    dataResponse(res, returnCode.OK, "댓글 등록 성공", concertComment);
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

/**
 *  @오투콘서트_좋아요_등록
 *  @route Post /concert/like/:concertID
 *  @access Private
 */

router.post("/like/:id", auth, async (req: Request, res: Response) => {
  try {
    const data = await postConcertLike(req.params.id, req.body.userID.id);

    // 회고 id가 잘못된 경우
    if (data === -1) {
      response(res, returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
    }
    // 이미 좋아요 한 글일 경우
    if (data === -2) {
      response(res, returnCode.BAD_REQUEST, "이미 좋아요 한 글입니다");
    }
    // 좋아요 등록 성공
    const concert = data;
    dataResponse(res, returnCode.OK, "좋아요 등록 성공", concert);
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

/**
 *  @오투콘서트_좋아요_삭제하기
 *  @route Delete /concert/like/:concertID
 *  @access Private
 */

router.delete("/like/:id", auth, async (req: Request, res: Response) => {
  try {
    const data = await deleteConcertLike(req.params.id, req.body.userID.id);

    // 콘서트 id가 잘못된 경우
    if (data === -1) {
      response(res, returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
    } // 좋아요 한 개수가 0인 경우
    if (data === -2) {
      response(res, returnCode.BAD_REQUEST, "좋아요 개수가 0");
    }
    // 좋아요 삭제 성공
    const concert = data;
    dataResponse(res, returnCode.OK, "좋아요 삭제 성공", concert);
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});
/**
 *  @유저_챌린지_회고_스크랩하기
 *  @route Post /concert/scrap/:concertID
 *  @access Private
 */
router.post("/scrap/:id", auth, async (req: Request, res: Response) => {
  try {
    const data = await postConcertScrap(req.params.id, req.body.userID.id);

    // 회고 id가 잘못된 경우
    if (data === -1) {
      response(res, returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
    }
    // 이미 유저가 스크랩한 글일 경우
    if (data === -2) {
      response(res, returnCode.BAD_REQUEST, "이미 스크랩 된 글입니다");
    }
    // 회고 스크랩 성공
    dataResponse(res, returnCode.OK, "콘서트 스크랩 성공", data);
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

/**
 *  @오투콘서트_회고_스크랩_취소하기
 *  @route Delete /concert/scrap/:concertID
 *  @access Private
 */
router.delete("/scrap/:id", auth, async (req: Request, res: Response) => {
  try {
    const data = await deleteConcertScrap(req.params.id, req.body.userID.id);

    // 콘서트 id가 잘못된 경우
    if (data === -1) {
      response(res, returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
    }
    // 스크랩 하지 않은 글일 경우
    if (data === -2) {
      response(res, returnCode.BAD_REQUEST, "스크랩 하지 않은 글입니다");
    }
    // 스크랩 취소 성공
    dataResponse(res, returnCode.OK, "콘서트 스크랩 취소 성공", data);
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

module.exports = router;
