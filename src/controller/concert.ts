// import express, { Request, Response } from "express";
// import { verify } from "library/jwt";
// import { returnCode } from "library/returnCode";
// import { response, dataResponse, dataTokenResponse } from "library/response";
// import { concertService } from "service/concertService";

// const router = express.Router();

// /**
//  *  @오투콘서트 (share together) 전체 조회
//  *  @route Get concert
//  *  @access Public
//  */
// router.post("/", async (req: Request, res: Response) => {
//   try {
//     // 토큰 검사
//     if (req.headers.authorization == null) {
//       response(res, returnCode.BAD_REQUEST, "토큰 값이 요청되지 않았습니다");
//     }

//     //토큰
//     const token = req.headers.authorization;
//     const decoded = verify(token);
//     const userId = decoded.userIdx;

//     // 토큰 확인
//     if (decoded == -3) {
//       response(res, returnCode.UNAUTHORIZED, "만료된 토큰입니다");
//     } else if (decoded == -2) {
//       response(res, returnCode.UNAUTHORIZED, "적합하지 않은 토큰입니다");
//     }

//     const data = await concertService.getConcertList(req.body);
//   } catch (err) {
//     console.error(err.message);
//     response(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
//   }
// });

// module.exports = router;
