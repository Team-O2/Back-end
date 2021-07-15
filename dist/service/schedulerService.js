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
const Admin_1 = __importDefault(require("../models/Admin"));
const User_1 = __importDefault(require("../models/User"));
const Badge_1 = __importDefault(require("../models/Badge"));
// libraries
const date_1 = require("../library/date");
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
            // 1. 이전 챌린지 참가자들에 대해
            if (user.isChallenge === true) {
                // 일주일에 2개 이상 작성 기준인 경우
                if (user.conditionCNT > 2) {
                    // 유저 챌린지 배지 개수 파악
                    if (userBadge.challengeBadge < 3) {
                        // 유저의 챌린지 퍼센트 계산
                        let term = date_1.period(newChallenge.challengeStartDT, newChallenge.challengeEndDT);
                        let totalNum = user.conditionCNT * Math.floor(term / 7);
                        let percent = Math.ceil((user.writingCNT / totalNum) * 100);
                        // 80% 이상이면 배지 부여 ->ok
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
                // 작성 회고 글 개수 0으로 초기화 ->ok
                // 챌린지 동안 일주일 작성 글 개수 기준 0으로 초기화 ->ok
                // 챌린지 여부 초기화 ->ok
                yield user.update({
                    isChallenge: false,
                    writingCNT: 0,
                    conditionCNT: 0,
                });
            }
            // 2. 챌린지를 신청한 유저들에 대해
            if (user.isRegist === true) {
                // isChallenge=true, isRegister=false로 변경 ->ok
                // 신청할 때 저장한 챌린지 작성 글 개수 기준으로 변경 ->ok
                // 신청할 때 챌린지 작성 글 개수 기준 0으로 초기화 ->ok
                // 유저의 기수를 새로 열리는 챌린지에 대한 기수로 변경 ->ok
                const newConditionCNT = user.challengeCNT;
                yield user.update({
                    isChallenge: true,
                    isRegist: false,
                    challengeCNT: 0,
                    conditionCNT: newConditionCNT,
                    generation: newChallenge.generation,
                });
            }
            // 3. 가입한지 3달이 지난 유저에게 배지 부여 ->ok
            let term = date_1.period(user.createDT, new Date());
            if (term >= 90 && !userBadge.loginBadge) {
                yield userBadge.update({ loginBadge: true });
            }
        }));
    }
}));
//# sourceMappingURL=schedulerService.js.map