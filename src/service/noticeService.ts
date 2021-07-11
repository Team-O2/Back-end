// models
import Concert from "src/models/Concert";
import User from "src/models/User";
import Badge from "src/models/Badge";
import Comment from "src/models/Comment";

/**
 *  @공지사항_전체_가져오기
 *  @route Get /notice
 */
export const getNoticeAll = async (offset) => {
  // isDelete = true 인 애들만 가져오기
  // offset 뒤에서 부터 가져오기
  // 최신순으로 정렬
  // 댓글, 답글 populate
  // 댓글, 답글 최신순으로 정렬
  let notices;
  if (offset) {
    notices = await Concert.find({
      isDeleted: false,
      isNotice: true,
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
    notices = await Concert.find({ isDeleted: false, isNotice: true })
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

  return { notices, totalNoticeNum: notices.length };
};

/**
 *  @공지사항_Detail
 *  @route Get /notice/:noticeID
 */
export const getNoticeOne = async (noticeID) => {
  // 댓글, 답글 populate
  // isDelete = true 인 애들만 가져오기
  // isNotice: true
  const notice = await Concert.find({ _id: noticeID }, { isDeleted: false })
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

  return notice;
};

/**
 *  @공지사항_검색_또는_필터
 *  @route Get /notice/search?keyword=검색할단어
 */
export const getNoticeSearch = async (keyword, offset) => {
  // isDelete = true 인 애들만 가져오기
  // isNotice: true
  // offset 뒤에서 부터 가져오기
  // 최신순으로 정렬
  // 댓글, 답글 populate
  let notices;
  if (offset) {
    notices = await Concert.find({
      isDeleted: false,
      isNotice: true,
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
    notices = await Concert.find({ isDeleted: false, isNotice: true })
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

  let filteredData = notices;

  // 검색 단어 필터링
  if (keyword !== "") {
    filteredData = filteredData.filter((fd) => {
      if (
        fd.text.includes(keyword.toLowerCase().trim()) ||
        fd.title.includes(keyword.toLowerCase().trim()) ||
        fd.hashtag.includes(keyword.toLowerCase().trim()) ||
        fd.interest.includes(keyword.toLowerCase().trim())
      )
        return fd;
    });
  }

  return filteredData;
};

/**
 *  @공지사항_댓글_등록
 *  @route POST /notice/comment/:noticeID
 *  @error
 *      1. 공지사항 id 잘못됨
 *      2. 요청 바디 부족
 *      3. 부모 댓글 id 값이 유효하지 않을 경우
 */
export const postNoticeComment = async (noticeID, userID, body) => {
  const { parentID, text } = body;

  // 1. 공지사항 id 잘못됨
  const notice = await Concert.findById(noticeID);

  if (!notice || notice.isDeleted) {
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
      post: noticeID,
      userID: userID,
      parentComment: parentID,
      text,
    });
    await comment.save();

    await parentComment.childrenComment.push(comment._id);
    await parentComment.save();

    // 첫 답글 작성 시 뱃지 추가
    const badge = await Badge.findOne({ user: userID });
    if (!badge.firstReplyBadge) {
      badge.firstReplyBadge = true;
      await badge.save();
    }
  } else {
    // 댓글인 경우
    comment = new Comment({
      postModel: "Concert",
      post: noticeID,
      userID: userID,
      text,
    });

    await comment.save();
    notice.comments.push(comment._id);
    await notice.save();

    // 댓글 1개 작성 시 뱃지 추가
    const badge = await Badge.findOne({ user: userID });
    if (!badge.oneCommentBadge) {
      badge.oneCommentBadge = true;
      await badge.save();
    }
    // 댓글 5개 작성 시 뱃지 추가
    const user = await User.findById(userID);
    if (!badge.fiveCommentBadge && user.commentCNT === 4) {
      badge.fiveCommentBadge = true;
      await badge.save();
    }

    // 유저 댓글 수 1 증가
    await user.update({
      commentCNT: user.commentCNT + 1,
    });
  }

  // 게시글 댓글 수 1 증가
  await Concert.findOneAndUpdate(
    { _id: noticeID },
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
