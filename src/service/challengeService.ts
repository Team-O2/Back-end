// models
import Challenge from "src/models/Challenge";
import User from "src/models/User";
// DTO
import { IChallengePostDTO } from "src/interfaces/IChallenge";

/**
 *  @챌린지_회고_전체_가져오기
 *  @route Get /challenge
 */

export const getChallengeAll = async () => {
  const data = await Challenge.find();
  // 코멘트 추가하기

  return data;
};

/**
 *  @챌린지_회고_등록
 *  @route Post api/challenge/:userId
 *  @body author, good, bad, learn, interest, generation
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 id 잘못됨
 */

export const postChallenge = async (userID, body) => {
  const { good, bad, learn, interest, generation } = body;

  // 1. 요청 바디 부족
  if (!good || !bad || !learn || !interest || !generation) {
    return -1;
  }

  // 2. 유저 id 잘못됨
  let user = await User.findById(userID);
  if (!user) {
    return -2;
  }

  const challenge = new Challenge({
    user: userID,
    good,
    bad,
    learn,
    interest,
    generation,
  });

  await challenge.save();

  let data = Challenge.findOne({ user: userID }).populate("user", ["nickname"]);

  return data;
};

/**
 *  @챌린지_회고_수정
 *  @route PATCH api/challenge/:challengeId
 *  @body good, bad, learn
 *  @error
 *      1. 회고록 id 잘못됨
 */

export const patchChallenge = async (challengeID, body) => {
  const { good, bad, learn } = body;

  // 1. 회고록 id 잘못됨
  const challenge = await Challenge.findById(challengeID);
  if (!challenge) {
    return -1;
  }

  const updateDate = new Date();

  await Challenge.update(
    { _id: challengeID },
    {
      good,
      bad,
      learn,
      updatedAt: updateDate,
    }
  );
};

/**
 *  @챌린지_회고_삭제
 *  @route DELETE api/challenge/:challengeId
 *  @error
 *      1. 회고록 id 잘못됨
 */

//  export const deleteChallenge = async (challengeID) => {

//   // 1. 회고록 id 잘못됨
//   const challenge = await Challenge.findById(challengeID);
//   if (!challenge) {
//     return -1;
//   }

// };

/**
 *  @챌린지_회고_좋아요_등록
 *  @route POST /challenge/like
 *  @error
 *      1. 회고록 id 잘못됨
 */

export const postChallengeLike = async (challengeID, userID) => {
  // 1. 회고록 id 잘못됨
  const challenge = await Challenge.findById(challengeID);

  if (!challenge) {
    return -1;
  }

  // 챌린지 글의 like 1 증가
  await Challenge.findOneAndUpdate(
    { _id: challengeID },
    {
      $inc: { likes: 1 },
    }
  );
  // 유저 likes 필드에 챌린지 id 추가
  const user = await User.findById(userID);
  user.likes.chanllengeLikes.push(challengeID);
  await user.save();

  return { _id: challengeID };
};
