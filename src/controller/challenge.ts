import { Router, Request, Response } from "express";
import { verify } from "src/library/jwt";
import { returnCode } from "src/library/returnCode";
import { response, dataResponse } from "src/library/response";
import {
  getChallengeAll,
  postChallenge,
  patchChallenge,
  postChallengeLike,
} from "src/service/challengeService";
import { IChallengePostDTO } from "src/interfaces/IChallenge";

const router = Router();

/**
 *  @챌린지_회고_전체_가져오기
 *  @route Get challenge
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
    } else if (decoded === -2) {
      response(res, returnCode.UNAUTHORIZED, "적합하지 않은 토큰입니다");
    }
    const data = await getChallengeAll();

    // 회고 전체 불러오기 성공
    const challengeAll = data;
    dataResponse(res, returnCode.OK, "회고 전체 불러오기 성공", challengeAll);
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

/**
 *  @챌린지_회고_등록
 *  @route Post challenge/:userId
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
      } else if (decoded === -2) {
        response(res, returnCode.UNAUTHORIZED, "적합하지 않은 토큰입니다");
      }

      const userID = decoded.user.id;
      const data = await postChallenge(userID, req.body);

      // 요청 바디가 부족할 경우
      if (data === -1) {
        response(res, returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
      }
      // 유저 id 잘못된 경우
      else if (data === -2) {
        response(res, returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
      }
      // 회고 등록 성공
      else {
        const challenge = data;
        dataResponse(res, returnCode.OK, "회고 등록 성공", challenge);
      }
    } catch (err) {
      console.error(err.message);
      response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
    }
  }
);

/**
 *  @챌린지_회고_수정
 *  @route Patch challenge/:challengeId
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
    } else if (decoded === -2) {
      response(res, returnCode.UNAUTHORIZED, "적합하지 않은 토큰입니다");
    }

    const data = await patchChallenge(req.params.id, req.body);

    if (data === -1) {
      response(res, returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
    } else {
      const challenge = data;
      dataResponse(res, returnCode.OK, "회고 수정 성공", challenge);
    }
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

/**
 *  @챌린지_회고_좋아요_등록
 *  @route Post challenge/like
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
    } else if (decoded === -2) {
      response(res, returnCode.UNAUTHORIZED, "적합하지 않은 토큰입니다");
    }

    const userID = decoded.user.id;
    console.log(req.params.id);
    const data = await postChallengeLike(req.params.id, userID);

    if (data === -1) {
      response(res, returnCode.NOT_FOUND, "요청 경로가 올바르지 않습니다");
    } else {
      const challenge = data;
      dataResponse(res, returnCode.OK, "좋아요 등록 성공", challenge);
    }
  } catch (err) {
    console.error(err.message);
    response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
  }
});

module.exports = router;
