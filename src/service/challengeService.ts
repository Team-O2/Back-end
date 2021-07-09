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
export const getChallengeAll = async (offset) => {
  // isDelete = true 인 애들만 가져오기
  // offset 뒤에서 부터 가져오기
  // 최신순으로 정렬
  // 댓글, 답글 populate
  // 댓글, 답글 최신순으로 정렬
  let challenges;
  if (offset) {
    challenges = await Challenge.find({
      isDeleted: false,
      _id: { $gt: offset },
    })
      .limit(Number(process.env.PAGE_SIZE))
      .sort({ _id: -1 })
      .populate("user", ["nickname"])
      .populate({
        path: "comments",
        select: { userID: 1, text: 1, isDeleted: 1 },
        options: { sort: { _id: -1 } },
        populate: [
          {
            path: "childrenComment",
            select: { userID: 1, text: 1, isDeleted: 1 },
            options: { sort: { _id: -1 } },
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
  } else {
    challenges = await Challenge.find({ isDeleted: false })
      .limit(Number(process.env.PAGE_SIZE))
      .sort({ _id: -1 })
      .populate("user", ["nickname"])
      .populate({
        path: "comments",
        select: { userID: 1, text: 1, isDeleted: 1 },
        options: { sort: { _id: -1 } },
        populate: [
          {
            path: "childrenComment",
            select: { userID: 1, text: 1, isDeleted: 1 },
            options: { sort: { _id: -1 } },
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
  }
  return challenges;
};

/**
 *  @챌린지_회고_검색_또는_필터
 *  @route Get /challenge/search
 */
export const getChallengeSearch = async (
  tag,
  isMine,
  keyword,
  offset,
  userID
) => {
  // isDelete = true 인 애들만 가져오기
  // offset 뒤에서 부터 가져오기
  // 최신순으로 정렬
  // 댓글, 답글 populate
  let challenges;
  if (offset) {
    challenges = await Challenge.find({
      isDeleted: false,
      _id: { $gt: offset },
    })
      .limit(Number(process.env.PAGE_SIZE))
      .sort({ _id: -1 })
      .populate("user", ["nickname"])
      .populate({
        path: "comments",
        select: { userID: 1, text: 1, isDeleted: 1 },
        options: { sort: { _id: -1 } },
        populate: [
          {
            path: "childrenComment",
            select: { userID: 1, text: 1, isDeleted: 1 },
            options: { sort: { _id: -1 } },
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
  } else {
    challenges = await Challenge.find({ isDeleted: false })
      .limit(Number(process.env.PAGE_SIZE))
      .sort({ _id: -1 })
      .populate("user", ["nickname"])
      .populate({
        path: "comments",
        select: { userID: 1, text: 1, isDeleted: 1 },
        options: { sort: { _id: -1 } },
        populate: [
          {
            path: "childrenComment",
            select: { userID: 1, text: 1, isDeleted: 1 },
            options: { sort: { _id: -1 } },
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
  }

  let filteredData = challenges;

  // 관심분야 필터링
  if (tag !== "") {
    filteredData = filteredData.filter((fd) => {
      if (fd.interest.includes(tag.toLowerCase())) return fd;
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
        fd.good.includes(keyword.toLowerCase()) ||
        fd.bad.includes(keyword.toLowerCase()) ||
        fd.learn.includes(keyword.toLowerCase())
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
    good: good.toLowerCase(),
    bad: bad.toLowerCase(),
    learn: learn.toLowerCase(),
    interest: interest.map((it) => it.toLowerCase()),
    generation,
  });

  await challenge.save();

  let data = Challenge.findById(challenge._id).populate("user", ["nickname"]);

  return data;
};

/**
 *  @챌린지_회고_수정
 *  @route PATCH api/challenge/:challengeId
 *  @body good, bad, learn
 *  @error
 *      1. 회고록 id 잘못됨
 *      2. 요청 바디 부족
 */
export const patchChallenge = async (challengeID, body) => {
  const { good, bad, learn } = body;

  // 1. 회고록 id 잘못됨
  const challenge = await Challenge.findById(challengeID);
  if (!challenge || challenge.isDeleted) {
    return -1;
  }
  // 2. 요청 바디 부족
  if (!good || !bad || !learn) {
    return -2;
  }

  const updateDate = new Date();

  await Challenge.update(
    { _id: challengeID },
    {
      good: good.toLowerCase(),
      bad: bad.toLowerCase(),
      learn: learn.toLowerCase(),
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
  if (!challenge || challenge.isDeleted) {
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

  if (!challenge || challenge.isDeleted) {
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
    challenge.comments.push(comment._id);
    await challenge.save();
  }

  // 게시글 댓글 수 1 증가
  await Challenge.findOneAndUpdate(
    { _id: challengeID },
    {
      $inc: { commentNum: 1 },
    }
  );

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
 *      2. 이미 좋아요 한 글일 경우
 */
export const postChallengeLike = async (challengeID, userID) => {
  // 1. 회고록 id 잘못됨
  const challenge = await Challenge.findById(challengeID);

  if (!challenge || challenge.isDeleted) {
    return -1;
  }

  const user = await User.findById(userID);
  // 2. 이미 좋아요 한 글일 경우
  if (user.likes.challengeLikes.includes(challengeID)) {
    return -2;
  }

  // 챌린지 글의 like 1 증가
  await Challenge.findOneAndUpdate(
    { _id: challengeID },
    {
      $inc: { likes: 1 },
    }
  );
  // 유저 likes 필드에 챌린지 id 추가
  user.likes.challengeLikes.push(challengeID);
  await user.save();

  return { _id: challengeID };
};

/**
 *  @챌린지_회고_좋아요_삭제
 *  @route DELETE /challenge/like/:challengeID
 *  @error
 *      1. 회고록 id 잘못됨
 *      2. 좋아요 개수가 0
 */
export const deleteChallengeLike = async (challengeID, userID) => {
  const challenge = await Challenge.findById(challengeID);

  // 1. 회고록 id 잘못됨
  if (!challenge || challenge.isDeleted) {
    return -1;
  }

  // 2. 좋아요 개수가 0
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
  const user = await User.findById(userID);
  const idx = user.likes.challengeLikes.indexOf(challengeID);
  user.likes.challengeLikes.splice(idx, 1);
  await user.save();

  return { _id: challengeID };
};

/**
 *  @유저_챌린지_회고_스크랩하기
 *  @route Post /user/challenge/:challengeID
 *  @error
 *      1. 회고록 id 잘못됨
 *      2. 이미 스크랩 한 회고일 경우
 */
export const postChallengeScrap = async (challengeID, userID) => {
  // 1. 회고 id 잘못됨
  let challenge = await Challenge.findById(challengeID);
  if (!challenge || challenge.isDeleted) {
    return -1;
  }

  const user = await User.findById(userID);

  // 2. 이미 스크랩 한 회고인 경우
  if (user.scraps.challengeScraps.includes(challengeID)) {
    return -2;
  }

  user.scraps.challengeScraps.push(challengeID);
  await user.save();

  // 게시글 스크랩 수 1 증가
  await Challenge.findOneAndUpdate(
    { _id: challengeID },
    {
      $inc: { scrapNum: 1 },
    }
  );

  return { _id: challengeID };
};

/**
 *  @유저_챌린지_회고_스크랩_취소하기
 *  @route Delete /user/challenge/:challengeID
 *  @error
 *      1. 회고록 id 잘못됨
 *      2. 스크랩 하지 않은 글일 경우
 */
export const deleteChallengeScrap = async (challengeID, userID) => {
  // 1. 회고 id 잘못됨
  let challenge = await Challenge.findById(challengeID);
  if (!challenge || challenge.isDeleted) {
    return -1;
  }

  const user = await User.findById(userID);
  // 2. 스크랩하지 않은 글일 경우
  if (!user.scraps.challengeScraps.includes(challengeID)) {
    return -2;
  }

  // 유저 scraps 필드에 챌린지 id 삭제
  const idx = user.scraps.challengeScraps.indexOf(challengeID);
  user.scraps.challengeScraps.splice(idx, 1);
  await user.save();

  // 게시글 스크랩 수 1 감소
  await Challenge.findOneAndUpdate(
    { _id: challengeID },
    {
      $inc: { scrapNum: -1 },
    }
  );

  return { _id: challengeID };
};
