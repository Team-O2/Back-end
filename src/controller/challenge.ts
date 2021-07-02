import express, { Request, Response } from "express";
import { verify } from "library/jwt";
import { returnCode } from "library/returnCode";
import { response, dataResponse } from "library/response";
import { postChallenge } from "service/challengeService";
import { IChallengePostDTO } from "interfaces/IChallenge";

const router = express.Router();

/**
 *  @챌린지_회고_등록
 *  @route Post challenge/:id
 *  @access Public
 */

router.post<unknown, unknown, IChallengePostDTO>(
  "/:id",
  async (req: Request, res: Response) => {
    try {
      // 토큰 검사
      if (req.headers.authorization == null) {
        response(res, returnCode.BAD_REQUEST, "토큰 값이 요청되지 않았습니다");
      }

      //토큰
      const token = req.headers.authorization;
      const decoded = verify(token);
      const userId = decoded.userIdx;

      // 토큰 확인
      if (decoded == -3) {
        response(res, returnCode.UNAUTHORIZED, "만료된 토큰입니다");
      } else if (decoded == -2) {
        response(res, returnCode.UNAUTHORIZED, "적합하지 않은 토큰입니다");
      }
      const data = await postChallenge(req.params.id, req.body);

      // 요청 바디가 부족할 경우
      if (data == -1) {
        response(res, returnCode.BAD_REQUEST, "요청 값이 올바르지 않습니다");
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

// router.patch("/:id", async (req: Request, res: Response) => {
//   try {
//     // const data = await
//   }
// });

module.exports = router;
