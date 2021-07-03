// models
import Challenge from "src/models/Challenge";
import User from "src/models/User";
import Comment from "src/models/Comment";
// DTO
import { IChallengePostDTO } from "src/interfaces/IChallenge";

/**
 *  @챌린지_회고_전체_가져오기
 *  @route Get /challenge
 */

export const getChallengeAll = async () => {
  // 댓글, 답글 populate
  // isDelete = true 인 애들만 가져오기
  const challenges = await Challenge.find({ isDeleted: false })
    .populate("user", ["nickname"])
    .populate({
      path: "comments",
      select: ["userID, text"],
      populate: [
        {
          path: "childrenComment",
          select: ["userID", "text"],
          populate: {
            path: "userID",
            select: ["nickname"],
          },
        },
        {
          path: "userID",
          select: ["nickname"],
        },
      ],
    });

  return challenges;
};

/**
 *  @챌린지_회고_검색_또는_필터
 *  @route Get /challenge/search
 */

export const getChallengeSearch = async (tag, isMine, keyword, userID) => {
  console.log(tag, isMine, keyword, userID);
  // 댓글, 답글 populate
  // isDelete = true 인 애들만 가져오기
  const challenges = await Challenge.find({ isDeleted: false })
    .populate("user", ["nickname"])
    .populate({
      path: "comments",
      select: ["userID, text"],
      populate: [
        {
          path: "childrenComment",
          select: ["userID", "text"],
          populate: {
            path: "userID",
            select: ["nickname"],
          },
        },
        {
          path: "userID",
          select: ["nickname"],
        },
      ],
    });

  let filteredData = challenges;

  // 관심분야 필터링
  if (tag !== "") {
    filteredData = filteredData.filter((fd) => {
      if (fd.interest.includes(tag)) return fd;
    });
  }

  // 내가 쓴 글 필터링
  if (isMine === "1") {
    filteredData = filteredData.filter((fd) => {
      if (fd.user._id === userID) return fd;
    });
  }

  // 검색 단어 필터링
  if (keyword !== "") {
    filteredData = filteredData.filter((fd) => {
      if (
        fd.good.includes(keyword) ||
        fd.bad.includes(keyword) ||
        fd.learn.includes(keyword)
      )
        return fd;
    });
  }

  return filteredData;
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

export const deleteChallenge = async (challengeID) => {
  // 1. 회고록 id 잘못됨
  const challenge = await Challenge.findById(challengeID);
  if (!challenge) {
    return -1;
  }

  await Challenge.findByIdAndUpdate(
    { _id: challengeID },
    { $set: { isDeleted: true } }
  );

  return { _id: challenge._id };
};

/**
 *  @챌린지_회고_댓글_등록
 *  @route POST /challenge/comment/:challengeID
 *  @error
 *      1. 회고록 id 잘못됨
 *      2. 요청 바디 부족
 *      3. 부모 댓글 id 값이 유효하지 않을 경우
 */

export const postChallengeComment = async (challengeID, userID, body) => {
  const { parentID, text } = body;

  // 1. 회고록 id 잘못됨
  const challenge = await Challenge.findById(challengeID);

  if (!challenge) {
    return -1;
  }
  // 2. 요청 바디 부족
  if (!text) {
    return -2;
  }

  let comment;
  // 답글인 경우
  if (parentID) {
    const parentComment = await Comment.findById(parentID);

    // 3. 부모 댓글 id 값이 유효하지 않을 경우
    if (!parentComment) {
      return -3;
    }

    comment = new Comment({
      postModel: "Challenge",
      post: challengeID,
      userID: userID,
      parentComment: parentID,
      text,
    });
    await comment.save();

    await parentComment.childrenComment.push(comment._id);
    await parentComment.save();
  } else {
    // 댓글인 경우
    comment = new Comment({
      postModel: "Challenge",
      post: challengeID,
      userID: userID,
      text,
    });

    await comment.save();
  }

  const user = await User.findById(userID);

  return {
    _id: comment._id,
    nickname: user.nickname,
    text: text,
    createdAt: comment.createdAt,
  };
};

/**
 *  @챌린지_회고_좋아요_등록
 *  @route POST /challenge/like/:challengeID
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

/**
 *  @챌린지_회고_좋아요_삭제
 *  @route DELETE /challenge/like/:challengeID
 *  @error
 *      1. 회고록 id 잘못됨
 */

export const deleteChallengeLike = async (challengeID, userID) => {
  // 1. 회고록 id 잘못됨
  const challenge = await Challenge.findById(challengeID);

  if (!challenge) {
    return -1;
  }
  if (challenge.likes === 0) {
    return -2;
  }

  // 챌린지 글의 like 1 감소
  await Challenge.findOneAndUpdate(
    { _id: challengeID },
    {
      $inc: { likes: -1 },
    }
  );
  // 유저 likes 필드에 챌린지 id 삭제
  await User.findOneAndUpdate(
    { _id: userID },
    {
      $set: {
        likes: {
          $pullAll: { challengeLikes: [challengeID] },
        },
      },
    }
  );

  return { _id: challengeID };
};
