import Challenge from "models/Challenge";
// DTO
import { IChallengePostDTO } from "interfaces/IChallenge";

/**
 *  @챌린지_회고_등록
 *  @route Post api/challenge
 *  @body author, good, bad, learn, interest, generation
 *  @error
 *      1. 요청 바디 부족
 *      2. 토큰 에러
 */

export const postChallenge = async (userId, body) => {
  const { good, bad, learn, interest, generation } = body;

  // 1. 요청 바디 부족
  if (!good || !bad || !learn || !interest || !generation) {
    return -1;
  }

  // 2. 토큰 에러

  const challenge = new Challenge({
    user: userId,
    good,
    bad,
    learn,
    interest,
    generation,
  });

  await challenge.save();

  let data = Challenge.findOne({ user: userId }).populate("user", ["nickname"]);

  return data;
};
