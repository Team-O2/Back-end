// models
import Admin from "src/models/Admin";
import User from "src/models/User";
import Badge from "src/models/Badge";
import Concert from "src/models/Concert";
import Challenge from "src/models/Challenge";

// library
import { dateToNumber } from "src/library/date";

//
import { deleteChallengeScrap } from "src/service/challengeService";

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
  if (user.ischallenge) {
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
