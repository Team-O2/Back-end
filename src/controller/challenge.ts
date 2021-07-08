import { Router, Request, Response } from "express";
import { verify } from "src/library/jwt";
import { returnCode } from "src/library/returnCode";
import { response, dataResponse } from "src/library/response";
// service
import {
  getChallengeAll,
  getChallengeSearch,
  postChallenge,
  patchChallenge,
  deleteChallenge,
  postChallengeComment,
  postChallengeLike,
  deleteChallengeLike,
  postChallengeScrap,
  deleteChallengeScrap,
} from "src/service/challengeService";
// DTO
import { IChallengePostDTO } from "src/interfaces/IChallenge";
// allow cors
import cors from 'cors';

const router = Router();

router.use(cors({
  credentials: true
}))

/**
 *  @챌린지_회고_전체_가져오기
 *  @route Get /challenge
 *  @access Private
 */

router.get("/", async (req: Request, res: Response) => {
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
    }
    if (decoded === -2) {
      response(res, returnCode.UNAUTHORIZED, "적합하지 않은 토큰입니다");
    }
    const data = await getChallengeAll(req.query.offset);

    // 회고 전체 불러오기 성공
    const challengeAll = data;
    dataResponse(res, returnCode.OK, "회고 전체 불러오기 성공", challengeAll);
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

/**
 *  @챌린지_회고_검색_또는_필터
 *  @route Get /challenge/search
 *  @access Private
 */

router.get("/search", async (req: Request, res: Response) => {
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
    }
    if (decoded === -2) {
      response(res, returnCode.UNAUTHORIZED, "적합하지 않은 토큰입니다");
    }

    const data = await getChallengeSearch(
      req.query.tag,
      req.query.isMine,
      req.query.keyword,
      req.query.offset,
      decoded.user.id
    );

    // 회고 전체 불러오기 성공
    const challengeSearch = data;
    dataResponse(res, returnCode.OK, "검색 성공", challengeSearch);
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

/**
 *  @챌린지_회고_등록
 *  @route Post /challenge/:userId
 *  @access Private
 */

router.post<unknown, unknown, IChallengePostDTO>(
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
      }
      if (decoded === -2) {
        response(res, returnCode.UNAUTHORIZED, "적합하지 않은 토큰입니다");
      }

      const userID = decoded.user.id;
      const data = await postChallenge(userID, req.body);

      // 요청 바디가 부족할 경우
      if (data === -1) {
        response(res, returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
      }
      // 유저 id 잘못된 경우
      if (data === -2) {
        response(res, returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
      }
      // 회고 등록 성공
      const challenge = data;
      dataResponse(res, returnCode.OK, "회고 등록 성공", challenge);
    } catch (err) {
      console.error(err.message);
      response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
  }
);

/**
 *  @챌린지_회고_수정
 *  @route Patch /challenge/:challengeId
 *  @access Private
 */

router.patch("/:id", async (req: Request, res: Response) => {
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
    }
    if (decoded === -2) {
      response(res, returnCode.UNAUTHORIZED, "적합하지 않은 토큰입니다");
    }

    const data = await patchChallenge(req.params.id, req.body);

    // 회고 id가 잘못된 경우
    if (data === -1) {
      response(res, returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
    }
    // 요청 바디가 부족한 경우
    if (data === -2) {
      response(res, returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
    }
    //회고 수정 성공
    const challenge = data;
    dataResponse(res, returnCode.OK, "회고 수정 성공", challenge);
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

/**
 *  @챌린지_회고_삭제
 *  @route Delete /challenge/:challengeId
 *  @access Private
 */

router.delete("/:id", async (req: Request, res: Response) => {
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

    const data = await deleteChallenge(req.params.id);

    // 회고 id가 잘못된 경우
    if (data === -1) {
      response(res, returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
    }
    // 회고 삭제 성공
    const challengeID = data;
    dataResponse(res, returnCode.OK, "회고 삭제 성공", challengeID);
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

/**
 *  @챌린지_회고_댓글_등록
 *  @route Post /challenge/comment/:challengeID
 *  @access Private
 */

router.post("/comment/:id", async (req: Request, res: Response) => {
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
    }
    if (decoded === -2) {
      response(res, returnCode.UNAUTHORIZED, "적합하지 않은 토큰입니다");
    }

    const userID = decoded.user.id;
    const data = await postChallengeComment(req.params.id, userID, req.body);

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
    const challengeID = data;
    dataResponse(res, returnCode.OK, "댓글 등록 성공", challengeID);
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

/**
 *  @챌린지_회고_좋아요_등록
 *  @route Post /challenge/like/:challengeID
 *  @access Private
 */

router.post("/like/:id", async (req: Request, res: Response) => {
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
    }
    if (decoded === -2) {
      response(res, returnCode.UNAUTHORIZED, "적합하지 않은 토큰입니다");
    }

    const userID = decoded.user.id;
    const data = await postChallengeLike(req.params.id, userID);

    // 회고 id가 잘못된 경우
    if (data === -1) {
      response(res, returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
    }
    // 이미 좋아요 한 글일 경우
    if (data === -2) {
      response(res, returnCode.BAD_REQUEST, "이미 좋아요 한 글입니다");
    }
    // 좋아요 등록 성공
    const challengeID = data;
    dataResponse(res, returnCode.OK, "좋아요 등록 성공", challengeID);
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

/**
 *  @챌린지_회고_좋아요_삭제하기
 *  @route Delete /challenge/like/:challengeID
 *  @access Private
 */

router.delete("/like/:id", async (req: Request, res: Response) => {
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
    }
    if (decoded === -2) {
      response(res, returnCode.UNAUTHORIZED, "적합하지 않은 토큰입니다");
    }

    const userID = decoded.user.id;
    const data = await deleteChallengeLike(req.params.id, userID);

    // 회고 id가 잘못된 경우
    if (data === -1) {
      response(res, returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
    } // 좋아요 한 개수가 0인 경우
    if (data === -2) {
      response(res, returnCode.BAD_REQUEST, "좋아요 개수가 0");
    }
    // 좋아요 삭제 성공
    const challengeID = data;
    dataResponse(res, returnCode.OK, "좋아요 삭제 성공", challengeID);
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

/**
 *  @유저_챌린지_회고_스크랩하기
 *  @route Post /challenge/scrap/:challengeID
 *  @access Private
 */
router.post("/scrap/:id", async (req: Request, res: Response) => {
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
    }
    if (decoded === -2) {
      response(res, returnCode.UNAUTHORIZED, "적합하지 않은 토큰입니다");
    }
    const data = await postChallengeScrap(req.params.id, decoded.user.id);

    // 회고 id가 잘못된 경우
    if (data === -1) {
      response(res, returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
    }
    // 이미 유저가 스크랩한 글일 경우
    if (data === -2) {
      response(res, returnCode.BAD_REQUEST, "이미 스크랩 된 글입니다");
    }
    // 회고 스크랩 성공
    dataResponse(res, returnCode.OK, "회고 스크랩 성공", data);
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

/**
 *  @유저_챌린지_회고_스크랩_취소하기
 *  @route Delete /challenge/scrap/:challengeID
 *  @access Private
 */
router.delete("/scrap/:id", async (req: Request, res: Response) => {
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
    }
    if (decoded === -2) {
      response(res, returnCode.UNAUTHORIZED, "적합하지 않은 토큰입니다");
    }
    const data = await deleteChallengeScrap(req.params.id, decoded.user.id);

    // 회고 id가 잘못된 경우
    if (data === -1) {
      response(res, returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
    }
    // 스크랩 하지 않은 글일 경우
    if (data === -2) {
      response(res, returnCode.BAD_REQUEST, "스크랩 하지 않은 글입니다");
    }
    // 스크랩 취소 성공
    dataResponse(res, returnCode.OK, "회고 스크랩 취소 성공", data);
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

module.exports = router;
