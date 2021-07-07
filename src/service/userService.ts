// models
import Admin from "src/models/Admin";
import User from "src/models/User";
import Badge from "src/models/Badge";

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
