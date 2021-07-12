"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.challengeOpen = void 0;
const node_schedule_1 = __importDefault(require("node-schedule"));
// models
const Admin_1 = __importDefault(require("src/models/Admin"));
const User_1 = __importDefault(require("src/models/User"));
const Badge_1 = __importDefault(require("src/models/Badge"));
// libraries
const date_1 = require("src/library/date");
exports.challengeOpen = node_schedule_1.default.scheduleJob("0 0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hi");
    const newDate = date_1.dateToString(new Date());
    const today = date_1.stringToDate(newDate.substr(0, 10));
    const newChallenge = yield Admin_1.default.findOne({
        challengeStartDT: today,
    });
    // 챌린지 시작하는 경우
    if (newChallenge) {
        const allUsers = yield User_1.default.find();
        allUsers.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            let userBadge = yield Badge_1.default.findOne({ user: user._id });
            // 1. 이전 챌린지 참가자들에 대해 챌린지 배지 부여
            if (user.isChallenge === true && user.challengeCNT > 2) {
                // 유저 챌린지 배지 개수 파악
                if (userBadge.challengeBadge < 3) {
                    // 유저의 챌린지 퍼센트 계산
                    let term = date_1.period(newChallenge.challengeStartDT, newChallenge.challengeEndDT);
                    let totalNum = user.challengeCNT * Math.floor(term / 7);
                    let percent = Math.ceil((user.challengeCNT / totalNum) * 100);
                    // 80% 이상이면 배지 부여
                    if (percent >= 80) {
                        yield userBadge.update({
                            $inc: {
                                challengeBadge: 1,
                            },
                        });
                        yield userBadge.save();
                    }
                }
            }
            // 2. isRegister=true 인 유저들의 isChallenge=true, isRegister=false로 변경
            if (user.isRegist === true) {
                yield user.update({
                    isChallenge: true,
                    isRegist: false,
                });
            }
            // 3. 모든 유저의 기수를 새로 열리는 챌린지에 대한 기수로 변경
            yield user.update({
                generation: newChallenge.generation,
            });
            // // 4. 가입한지 3달이 지난 유저에게 배지 부여
            // let term = period(user.createDT, newDate);
            // if (term >= 90 && !userBadge.loginBadge) {
            //   await userBadge.update({ loginBadge: true });
            // }
        }));
    }
}));
//# sourceMappingURL=schedulerService.js.map