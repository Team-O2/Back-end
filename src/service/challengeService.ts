//
import Challenge from "src/models/Challenge";
import User from "src/models/User";
// DTO
import { IChallengePostDTO } from "src/interfaces/IChallenge";

/**
 *  @챌린지_회고_등록
 *  @route Post api/challenge/:id
 *  @body author, good, bad, learn, interest, generation
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 id 잘못됨
 */

export const postChallenge = async (userId, body) => {
  const { good, bad, learn, interest, generation } = body;

  // 1. 요청 바디 부족
  if (!good || !bad || !learn || !interest || !generation) {
    return -1;
  }

  // 2. 유저 id 잘못됨
  let user = await User.findById(userId);
  if (!user) {
    return -2;
  }

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

/**
 *  @챌린지_회고_수정
 *  @route Post api/challenge/:id
 *  @body good, bad, learn
 *  @error
 *      1. 요청 바디 부족
 */

export const patchChallenge = async (challengeId, body) => {
  const { good, bad, learn } = body;

  // 1. 회고록 id 잘못됨
  const challenge = await Challenge.findById(challengeId);
  if (!challenge) {
    return -1;
  }

  await Challenge.update(
    { _id: challengeId },
    {
      good,
      bad,
      learn,
    }
  );
};
