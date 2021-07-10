import schedule from "node-schedule";
// models
import Admin from "src/models/Admin";
import User from "src/models/User";
import Badge from "src/models/Badge";
// libraries
import { stringToDate, period } from "src/library/date";

export const challengeOpen = schedule.scheduleJob("0 0 0 * * *", async () => {
  console.log("hi");
  const newDate = new Date();
  const today = stringToDate(String(newDate).substr(0, 10));
  const newChallenge = await Admin.findOne({
    challengeStartDT: today,
  });
  // 챌린지 시작하는 경우
  if (newChallenge) {
    const allUsers = await User.find();

    allUsers.map(async (user) => {
      let userBadge = await Badge.findOne({ user: user._id });
      // 1. 이전 챌린지 참가자들에 대해 챌린지 배지 부여
      if (user.isChallenge === true && user.challengeCNT > 2) {
        // 유저 챌린지 배지 개수 파악
        if (userBadge.challengeBadge < 3) {
          // 유저의 챌린지 퍼센트 계산
          let term = period(
            newChallenge.challengeStartDT,
            newChallenge.challengeEndDT
          );
          let totalNum = user.challengeCNT * Math.floor(term / 7);
          let percent = Math.ceil((user.challengeCNT / totalNum) * 100);

          // 80% 이상이면 배지 부여
          if (percent >= 80) {
            await userBadge.update({
              $inc: {
                challengeBadge: 1,
              },
            });
            await userBadge.save();
          }
        }
      }

      // 2. isRegister=true 인 유저들의 isChallenge=true, isRegister=false로 변경
      if (user.isRegist === true) {
        await user.update({
          isChallenge: true,
          isRegist: false,
        });
      }

      // 3. 모든 유저의 기수를 새로 열리는 챌린지에 대한 기수로 변경
      await user.update({
        generation: newChallenge.cardiNum,
      });

      // 4. 가입한지 3달이 지난 유저에게 배지 부여
      let term = period(user.createDT, newDate);
      if (term >= 90 && !userBadge.loginBadge) {
        await userBadge.update({ loginBadge: true });
      }
    });
  }
});
