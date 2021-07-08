import jwt from "jsonwebtoken";
import config from "src/config";

import { returnCode } from "src/library/returnCode";
import { response } from "src/library/response";

export default (req, res, next) => {
  // 토큰 검사
  if (req.headers.authorization == null) {
    response(res, returnCode.BAD_REQUEST, "토큰 값이 요청되지 않았습니다");
  }
  const token = req.headers.authorization;

  // Verify token
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.body.userID = decoded.user;
    next();
  } catch (err) {
    if (err.message === "jwt expired") {
      response(res, returnCode.UNAUTHORIZED, "만료된 토큰입니다");
    } else {
      response(res, returnCode.UNAUTHORIZED, "적합하지 않은 토큰입니다");
      return -2;
    }
  }
};
