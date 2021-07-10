// models
import Admin from "src/models/Admin";
import User from "src/models/User";
import Badge from "src/models/Badge";
import Concert from "src/models/Concert";
import Challenge from "src/models/Challenge";
import Comment from "src/models/Comment";

// library
import { dateToNumber, period } from "src/library/date";

/**
 *  @User_챌린지_신청하기
 *  @route Post user/register
 *  @body challengeCNT
 *  @access private
 */

export const postRegister = async (userID, body) => {
  const challengeCNT = body.challengeCNT;

  // 1. 요청 바디 부족
  if (!challengeCNT) {
    return -1;
  }

  // 2. 유저 id가 관리자 아이디임
  let user = await User.findById(userID);
  if (user.userType === 1) {
    return -2;
  }

  // 신청 기간을 확인
  let dateNow = new Date();
  const admin = await Admin.findOne({
    $and: [
      { registerStartDT: { $lte: dateNow } },
      { registerEndDT: { $gte: dateNow } },
    ],
  });

  // 3. 신청 기간이 아님
  if (!admin) {
    return -3;
  }

  // 4. 이미 신청이 완료된 사용자
  if (user.isRegist) {
    return -4;
  }

  // 5. 신청 인원을 초과함
  if (admin.applyNum > admin.limitNum) {
    return -5;
  }

  // 신청 성공
  // applyNum 증가
  await Admin.findOneAndUpdate(
    {
      $and: [
        { registerStartDT: { $lte: dateNow } },
        { registerEndDT: { $gte: dateNow } },
      ],
    },
    {
      $inc: { applyNum: 1 },
    }
  );

  // ischallenge true
  await user.update({ $set: { ischallenge: true } });
  await User.findByIdAndUpdate(userID, {
    $set: { challengeCNT: challengeCNT },
  });

  // 첫 챌린지 참여 시 뱃지 부여
  const badge = await Badge.findOne(
    { user: userID },
    { firstJoinBadge: true, _id: false }
  );

  if (!badge.firstJoinBadge) {
    await Badge.findOneAndUpdate(
      { user: userID },
      { $set: { firstJoinBadge: true } }
    );
  }
};

/**
 *  @User_마이페이지_콘서트_스크랩
 *  @route Post user/mypage/concert
 *  @access private
 */

export const getMypageConcert = async (userID) => {
  const userScraps = await (
    await User.findOne({ _id: userID })
  ).scraps.concertScraps;

  if (!userScraps[0]) {
    return -1;
  }

  const concertList = await Promise.all(
    userScraps.map(async function (scrap) {
      let concertScrap = await Concert.find(
        { _id: scrap },
        { isDeleted: false }
      )
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
      return concertScrap;
    })
  );
  const mypageConcert = concertList.sort(function (a, b) {
    return dateToNumber(b[0].createdAt) - dateToNumber(a[0].createdAt);
  });

  return mypageConcert;
};

/**
 *  @User_마이페이지_회고_스크랩
 *  @route Post user/mypage/challenge
 *  @access private
 */

export const getMypageChallenge = async (userID) => {
  const userScraps = await (
    await User.findOne({ _id: userID })
  ).scraps.challengeScraps;

  if (!userScraps[0]) {
    return -1;
  }

  const challengeList = await Promise.all(
    userScraps.map(async function (scrap) {
      let challengeScrap = await Challenge.find(
        { _id: scrap },
        { isDeleted: false }
      )
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
      return challengeScrap;
    })
  );
  const mypageChallenge = challengeList.sort(function (a, b) {
    return dateToNumber(b[0].createdAt) - dateToNumber(a[0].createdAt);
  });

  return mypageChallenge;
};

/**
 *  @User_마이페이지_Info
 *  @route Get user/mypage/info
 *  @access private
 */
export const getMypageInfo = async (userID) => {
  const user = await User.findById(userID);
  const userBadge = await Badge.findOne({ user: userID });

  const couponBook = {
    welcomeBadge: userBadge.welcomeBadge,
    firstJoinBadge: userBadge.firstJoinBadge,
    firstWriteBadge: userBadge.firstWriteBadge,
    oneCommentBadge: userBadge.oneCommentBadge,
    fiveCommentBadge: userBadge.fiveCommentBadge,
    oneLikeBadge: userBadge.oneLikeBadge,
    fiveLikeBadge: userBadge.fiveLikeBadge,
    loginBadge: userBadge.loginBadge,
    marketingBadge: userBadge.marketingBadge,
    runMySelfBadge: userBadge.runMySelfBadge,
    firstReplyBadge: userBadge.firstReplyBadge,
    concertScrapBadge: userBadge.concertScrapBadge,
    challengeBadge: userBadge.challengeBadge,
  };

  const shareTogether = await Concert.find(
    { user: userID },
    { _id: true, title: true }
  );

  // 현재 작성 완료 개수
  const userRM = await Challenge.find(
    { user: userID },
    { generation: user.generation }
  ).count();

  const admin = await Admin.findOne({ cardiNum: user.generation });
  // ischallenge 가 false 이면서 admin === null 이면 현재기수 참여 x
  if (!user.isRegist && !admin) {
    return {
      nickname: user.nickname,
      runMyselfAchieve: [],
      shareTogether,
      couponBook,
    };
  }
  // 현재기수 참여
  else {
    const term = await period(admin.challengeStartDT, admin.challengeEndDT);
    // 내림을 취해서 최대한 많은 %를 달성할 수 있도록 한다
    const totalNum = user.challengeCNT * Math.floor(term / 7);

    // 퍼센트 올림을 취함
    const percent = Math.ceil((user.challengeCNT / totalNum) * 100);

    const runMyselfAchieve = {
      percent,
      totalNum,
      completeNum: userRM,
      startDT: admin.challengeStartDT,
      endDT: admin.challengeEndDT,
    };

    return {
      nickname: user.nickname,
      runMyselfAchieve,
      shareTogether,
      couponBook,
    };
  }
};

/**
 *  @User_마이페이지_회고_스크랩_취소토글
 *  @route Delete user/mypage/challenge/:challengeID
 *  @access private
 */

export const deleteMypageChallenge = async (userID, challengeID) => {
  // 1. 회고 id 잘못됨
  let challenge = await Challenge.findById(challengeID);
  if (!challenge) {
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

  return { _id: challengeID };
};

/**
 *  @마이페이지_내가_쓴_글
 *  @route Get user/mypage/write
 *  @error
 *    1.
 */
export const getMyWritings = async (userID, offset) => {
  let challenges;
  if (offset) {
    challenges = await Challenge.find({
      isDeleted: false,
      _id: { $gt: offset },
      user: userID,
    })
      .limit(Number(process.env.PAGE_SIZE))
      .sort({ _id: -1 })
      .populate("user", ["nickname"])
      .populate({
        path: "comments",
        select: { userID: 1, text: 1 },
        options: { sort: { _id: -1 } },
        populate: [
          {
            path: "childrenComment",
            select: { userID: 1, text: 1 },
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
    challenges = await Challenge.find({ isDeleted: false, user: userID })
      .limit(Number(process.env.PAGE_SIZE))
      .sort({ _id: -1 })
      .populate("user", ["nickname"])
      .populate({
        path: "comments",
        select: { userID: 1, text: 1 },
        options: { sort: { _id: -1 } },
        populate: [
          {
            path: "childrenComment",
            select: { userID: 1, text: 1 },
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
 *  @마이페이지_내가_쓴_댓글
 *  @route Get user/mypage/comment
 */
export const getMyComments = async (userID) => {
  const comments = await Comment.find({
    isDeleted: false,
    userID,
  }).sort({ _id: -1 });
  return comments;
};

/**
 *  @마이페이지_내가_쓴_댓글_삭제
 *  @route Delete user/mypage/comment
 *  @error
 *    1. 요청 바디가 부족할 경우
 */
export const deleteMyComments = async (body) => {
  const { userID, commentID } = body;

  //1. 요청 바디가 부족할 경우
  if (!commentID || commentID.length === 0) {
    return -1;
  }

  commentID.map(async (cmtID) => {
    // 삭제하려는 댓글 isDelete = true로 변경
    await Comment.findOneAndUpdate(
      {
        _id: cmtID,
        userID: userID.id,
      },
      { isDeleted: true }
    );
    // 게시글 댓글 수 1 감소
    let comment = await Comment.findById(cmtID);
    if (comment.postModel === "Challenge") {
      // challenge
      await Challenge.findOneAndUpdate(
        {
          _id: comment.post,
        },
        { $inc: { commentNum: -1 } }
      );
    } else {
      // concert
      await Concert.findOneAndUpdate(
        {
          _id: comment.post,
        },
        { $inc: { commentNum: -1 } }
      );
    }
    // 유저 댓글 수 1 감소
    // 과연 필요할까??
    await User.findOneAndUpdate(
      {
        _id: userID.id,
      },
      {
        $inc: { commentCNT: -1 },
      }
    );
  });
};
