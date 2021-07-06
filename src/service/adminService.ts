// models
import Admin from "src/models/Admin";
import User from "src/models/User";
import Concert from "src/models/Concert";

// library
import { stringToDate } from "src/library/date";
import { IAdminListDTO } from "src/interfaces/IAdmin";
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
      img: false,
      __v: false,
    }
  );

  const adminList = Promise.all(
    admins.map(async function (admin) {
      let totalNum = await Challenge.aggregate([
        {
          $match: { generation: admin.cardiNum },
        },
        {
          $group: {
            _id: "$user",
            // 신청 인원
            apply: { $sum: 1 },
            // 참여 인원
            participants: { $sum: 1 },
          },
        },
        { $project: { _id: 0 } },
      ]);
      const admintemp = {
        registerStartDT: admin.registerStartDT,
        registerEndDT: admin.registerEndDT,
        challengeStartDT: admin.challengeStartDT,
        challengeEndDT: admin.challengeEndDT,
        cardiNum: admin.cardiNum,
        createdDT: admin.createdDT,
        // 신청 인원
        totalNum: totalNum[0],
        postNum: await Challenge.find({ generation: admin.cardiNum }).count(),
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
  const changeCardiNum = (await Admin.find().count()) + 1;
  const admin = new Admin({
    title,
    registerStartDT: stringToDate(registerStartDT),
    registerEndDT: stringToDate(registerEndDT),
    challengeStartDT: stringToDate(challengeStartDT),
    challengeEndDT: stringToDate(challengeEndDT),
    cardiNum: changeCardiNum,
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
 *  @body createdAt, title, videoLink, text, interest, hashtag
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 id가 관리자가 아님
 *      3. 해당 날짜에 진행되는 기수가 없음
 */

export const postAdminConcert = async (userID, body) => {
  const { createdAt, title, videoLink, text, interest, hashtag } = body;

  // 1. 요청 바디 부족
  if (!createdAt || !title || !videoLink || !text || !interest || !hashtag) {
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
    createdAt: stringToDate(createdAt),
    videoLink,
    text,
    generation: gen.cardiNum,
    interest,
    hashtag,
  });

  await concert.save();
};
