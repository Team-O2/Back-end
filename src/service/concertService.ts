// models
import Concert from "src/models/Concert";
import User from "src/models/User";
import Comment from "src/models/Comment";
// DTO
import { IConcertPostDTO } from "src/interfaces/IConcert";

/**
 *  @오투콘서트_전체_가져오기
 *  @route Get /concert
 */
export const getConcertAll = async () => {
  // 댓글, 답글 populate
  // isDelete = true 인 애들만 가져오기
  const concerts = await Concert.find({ isDeleted: false })
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

  return concerts;
};

/**
 *  @오투콘서트_Detail
 *  @route Get /concert/:concertID
 */
export const getConcertOne = async (concertID) => {
  // 댓글, 답글 populate
  // isDelete = true 인 애들만 가져오기
  const concert = await Concert.find({ _id: concertID }, { isDeleted: false })
    .populate("user", ["nickname"])
    .populate({
      path: "comments",
      select: { userID: 1, text: 1 },
      populate: [
        {
          path: "childrenComment",
          select: { userID: 1, text: 1 },
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

  return concert;
};

/**
 *  @오투콘서트_검색_또는_필터
 *  @route Get /concert/search?tag=관심분야&ismine=내글만보기여부&keyword=검색할단어
 */
export const getConcertSearch = async (tag, isMine, keyword, userID) => {
  // 댓글, 답글 populate
  // isDelete = true 인 애들만 가져오기
  const concerts = await Concert.find({ isDeleted: false })
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

  let filteredData = concerts;

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
        fd.text.includes(keyword) ||
        fd.title.includes(keyword) ||
        fd.hashtag.includes(keyword)
      )
        return fd;
    });
  }

  return filteredData;
};

/**
 *  @콘서트_댓글_등록
 *  @route Post /concert/comment/:concertID
 *  @access Private
 *  @error
 *      1. 회고록 id 잘못됨
 *      2. 요청 바디 부족
 *      3. 부모 댓글 id 값이 유효하지 않을 경우
 */
export const postConcertComment = async (concertID, userID, body) => {
  const { parentID, text } = body;

  // 1. 회고록 id 잘못됨
  const concert = await Concert.findById(concertID);

  if (!concert) {
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
      postModel: "Concert",
      post: concertID,
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
      postModel: "Concert",
      post: concertID,
      userID: userID,
      text,
    });

    await comment.save();
    await concert.comments.push(comment._id);
    await concert.save();
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
 *  @오투콘서트_좋아요_등록
 *  @route Post /concert/like/:concertID
 *  @error
 *      1. 콘서트 id 잘못됨
 *      2. 이미 좋아요 한 글일 경우
 */
export const postConcertLike = async (concertID, userID) => {
  // 1. 콘서트 id 잘못됨
  const concert = await Concert.findById(concertID);

  if (!concert) {
    return -1;
  }

  const user = await User.findById(userID);
  // 2. 이미 좋아요 한 글일 경우
  if (user.likes.concertLikes.includes(concertID)) {
    return -2;
  }

  // 챌린지 글의 like 1 증가
  await Concert.findOneAndUpdate(
    { _id: concertID },
    {
      $inc: { likes: 1 },
    }
  );
  // 유저 likes 필드에 챌린지 id 추가
  user.likes.concertLikes.push(concertID);
  await user.save();

  return { _id: concertID };
};

/**
 *  @오투콘서트_좋아요_삭제
 *  @route Delete /concert/like/:concertID
 *  @error
 *      1. 회고록 id 잘못됨
 *      2. 좋아요 개수가 0
 */
export const deleteConcertLike = async (concertID, userID) => {
  const concert = await Concert.findById(concertID);

  // 1. 회고록 id 잘못됨
  if (!concert) {
    return -1;
  }

  // 2. 좋아요 개수가 0
  if (concert.likes === 0) {
    return -2;
  }

  // 챌린지 글의 like 1 감소
  await Concert.findOneAndUpdate(
    { _id: concertID },
    {
      $inc: { likes: -1 },
    }
  );
  // 유저 likes 필드에 챌린지 id 삭제
  const user = await User.findById(userID);

  const idx = user.likes.concertLikes.indexOf(concertID);
  user.likes.concertLikes.splice(idx, 1);

  await user.save();

  return { _id: concertID };
};

/**
 *  @오투콘서트_회고_스크랩하기
 *  @route Post /user/concert/:concertID
 *  @error
 *      1. 콘서트 id 잘못됨
 *      2. 이미 스크랩 한 회고일 경우
 */
export const postConcertScrap = async (concertID, userID) => {
  // 1. 회고 id 잘못됨
  let concert = await Concert.findById(concertID);
  if (!concert) {
    return -1;
  }

  const user = await User.findById(userID);

  // 2. 이미 스크랩 한 회고인 경우
  if (user.scraps.concertScraps.includes(concertID)) {
    return -2;
  }

  user.scraps.concertScraps.push(concertID);
  await user.save();

  return { _id: concertID };
};

/**
 *  @유저_챌린지_회고_스크랩_취소하기
 *  @route Delete /user/concert/:concertID
 *  @error
 *      1. 콘서트 id 잘못됨
 *      2. 스크랩 하지 않은 글일 경우
 */
export const deleteConcertScrap = async (concertID, userID) => {
  // 1. 회고 id 잘못됨
  let concert = await Concert.findById(concertID);
  if (!concert) {
    return -1;
  }

  const user = await User.findById(userID);
  // 2. 스크랩하지 않은 글일 경우
  if (!user.scraps.concertScraps.includes(concertID)) {
    return -2;
  }

  // 유저 likes 필드에 챌린지 id 삭제
  const idx = user.scraps.concertScraps.indexOf(concertID);
  user.scraps.concertScraps.splice(idx, 1);
  await user.save();

  return { _id: concertID };
};
