// models
import Admin from "src/models/Admin";
import User from "src/models/User";
import Concert from "src/models/Concert";

// library
import { stringToDate } from "src/library/date";
import Challenge from "src/models/Challenge";

/**
 *  @관리자_페이지_조회
 *  @route Get admin
 *  @body
 *  @error
 *      1. 유저 id가 관리자가 아님
 */

export const postAdminList = async (userID) => {
  // 1. 유저 id가 관리자가 아님
  let user = await User.findById(userID);
  if (!(user.userType === 1)) {
    return -2;
  }

  const admins = await Admin.find(
    {},
    {
      _id: false,
      title: false,
      limitNum: false,
      __v: false,
    }
  );

  const adminList = await Promise.all(
    admins.map(async function (admin) {
      let totalNum = await Challenge.aggregate([
        {
          $match: { generation: admin.generation },
        },
        {
          $group: {
            _id: "$user",
            // 참여 인원
            total: { $sum: 1 },
          },
        },
        { $project: { _id: 0 } },
      ]);
      let participants = 0;
      if (totalNum[0]) {
        participants = totalNum[0]["total"];
      }
      const admintemp = {
        registerStartDT: admin.registerStartDT,
        registerEndDT: admin.registerEndDT,
        challengeStartDT: admin.challengeStartDT,
        challengeEndDT: admin.challengeEndDT,
        generation: admin.generation,
        createdDT: admin.createdDT,
        // 신청 인원
        applyNum: admin.applyNum,
        // 참여 인원
        participants,
        postNum: await Challenge.find({ generation: admin.generation }).count(),
        img: admin.img,
      };
      return admintemp;
    })
  );

  return adminList;
};

/**
 *  @관리자_챌린지_등록
 *  @route Post admin/challenge
 *  @body registerStartDT, registerEndDT, challengeStartDT, challengeEndDT, limitNum, img
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 id가 관리자가 아님
 *      3. 챌린지 기간이 잘못됨
 */
export const postAdminChallenge = async (userID, body) => {
  const {
    title,
    registerStartDT,
    registerEndDT,
    challengeStartDT,
    challengeEndDT,
    limitNum,
    img,
  } = body;

  // 1. 요청 바디 부족
  if (
    !title ||
    !registerStartDT ||
    !registerEndDT ||
    !challengeStartDT ||
    !challengeEndDT ||
    !limitNum ||
    !img
  ) {
    return -1;
  }

  // 2. 유저 id가 관리자가 아님
  let user = await User.findById(userID);
  if (!(user.userType === 1)) {
    return -2;
  }

  /*
    var = new Date('2020-10-23');
    var date2 = new Date('2020-10-22');

    console.log(date1 > date2); // true
  */

  //기수 증가
  const changeGen = (await Admin.find().count()) + 1;
  const admin = new Admin({
    title,
    registerStartDT: stringToDate(registerStartDT),
    registerEndDT: stringToDate(registerEndDT),
    challengeStartDT: stringToDate(challengeStartDT),
    challengeEndDT: stringToDate(challengeEndDT),
    generation: changeGen,
    limitNum,
    img,
    createdAt: new Date(),
  });
  // 3. 챌린지 기간이 잘못됨
  // 신청 마감날짜가 신청 시작 날짜보다 빠름
  if (registerEndDT < registerStartDT) {
    return -3;
  }
  // 챌린지 끝나는 날짜가 챌린지 시작하는 날짜보다 빠름
  else if (challengeEndDT < challengeStartDT) {
    return -3;
  }
  // 챌린지가 시작하는 날짜가 신청 마감 날짜보다 빠름
  else if (challengeStartDT < registerEndDT) {
    return -3;
  }
  await admin.save();
};

/**
 *  @관리자_오투콘서트_등록
 *  @route Post admin/concert
 *  @body createdAt, title, videoLink, text, interest, hashtag, authorNickname
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 id가 관리자가 아님
 *      3. 해당 날짜에 진행되는 기수가 없음
 */

export const postAdminConcert = async (userID, body) => {
  const { title, videoLink, text, interest, hashtag, authorNickname } = body;

  // 1. 요청 바디 부족
  if (
    !title ||
    !videoLink ||
    !text ||
    !interest ||
    !hashtag ||
    !authorNickname
  ) {
    return -1;
  }

  // 2. 유저 id가 관리자가 아님
  let user = await User.findById(userID);
  if (!(user.userType === 1)) {
    return -2;
  }

  /*
    var = new Date('2020-10-23');
    var date2 = new Date('2020-10-22');

    console.log(date1 > date2); // true
  */

  // 현재 기수(generation)를 확인하여 오투콘서트에 삽입
  let dateNow = new Date();
  const gen = await Admin.findOne({
    $and: [
      { challengeStartDT: { $lte: dateNow } },
      { challengeEndDT: { $gte: dateNow } },
    ],
  });

  // 3. 해당 날짜에 진행되는 기수가 없음
  if (!gen) {
    return -3;
  }
  const concert = new Concert({
    title,
    user: userID,
    createdAt: dateNow,
    videoLink,
    text,
    generation: gen.generation,
    interest,
    hashtag,
    authorNickname,
  });

  await concert.save();
};

/**
 *  @관리자_공지사항_등록
 *  @route Post admin/notice
 *  @body
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 id가 관리자가 아님
 */

export const postAdminNotice = async (userID, body, url) => {
  const { title, text } = body;
  let interest = body.interest.slice(1, -1).replace(/"/gi, "").split(/,\s?/);
  let hashtag = body.hashtag.slice(1, -1).replace(/"/gi, "").split(/,\s?/);

  // 1. 요청 바디 부족
  if (!title || !text || !interest || !hashtag) {
    return -1;
  }

  // 2. 유저 id가 관리자가 아님
  let user = await User.findById(userID);
  if (!(user.userType === 1)) {
    return -2;
  }

  const notice = new Concert({
    title,
    interest,
    user: userID,
    isNotice: true,
    videoLink: url.videoLink,
    imgThumbnail: url.imgThumbnail,
    text,
    hashtag,
  });

  await notice.save();
};
