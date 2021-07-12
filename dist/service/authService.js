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
exports.patchPassword = exports.postCode = exports.postEmail = exports.postSignin = exports.postSignup = void 0;
const User_1 = __importDefault(require("src/models/User"));
const Badge_1 = __importDefault(require("src/models/Badge"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("src/config"));
const emailSender_1 = require("src/library/emailSender");
const ejs_1 = __importDefault(require("ejs"));
/**
 *  @회원가입
 *  @route Post api/auth
 *  @body email,password, nickname, marpolicy, interest
 *  @error
 *      1. 요청 바디 부족
 *      2. 아이디 중복
 */
function postSignup(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password, nickname, gender, marpolicy, interest } = body;
        // 1. 요청 바디 부족
        if (!email || !password || !nickname || !interest) {
            return -1;
        }
        // 2. 아이디 중복
        let user = yield User_1.default.findOne({ email });
        if (user) {
            return -2;
        }
        user = new User_1.default({
            email,
            password,
            nickname,
            gender,
            marpolicy,
            interest,
        });
        const badge = new Badge_1.default({
            user: user.id,
        });
        yield badge.save();
        // Encrpyt password
        const salt = yield bcryptjs_1.default.genSalt(10);
        user.password = yield bcryptjs_1.default.hash(password, salt);
        yield user.save();
        // console.log(user);
        yield user.updateOne({ badge: badge._id });
        // 마케팅 동의(marpolicy == true) 시 뱃지 발급
        if (user.marpolicy) {
            yield Badge_1.default.findOneAndUpdate({ user: user.id }, { $set: { marketingBadge: true } });
        }
        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id,
            },
        };
        // access 토큰 발급
        // 유효기간 14일
        let token = jsonwebtoken_1.default.sign(payload, config_1.default.jwtSecret, { expiresIn: "14d" });
        return { user, token };
    });
}
exports.postSignup = postSignup;
/**
 *  @로그인
 *  @route Post auth/siginin
 *  @body email,password
 *  @error
 *      1. 요청 바디 부족
 *      2. 아이디가 존재하지 않음
 *      3. 패스워드가 올바르지 않음
 */
function postSignin(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = body;
        // 1. 요청 바디 부족
        if (!email || !password) {
            return -1;
        }
        // 2. email이 DB에 존재하지 않음
        let user = yield User_1.default.findOne({ email });
        if (!user) {
            return -2;
        }
        // 3. password가 올바르지 않음
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return -3;
        }
        yield user.save();
        const payload = {
            user: {
                id: user.id,
            },
        };
        // access 토큰 발급
        // 유효기간 14일
        let token = jsonwebtoken_1.default.sign(payload, config_1.default.jwtSecret, { expiresIn: "14d" });
        return { user, token };
    });
}
exports.postSignin = postSignin;
/**
 *  @이메일_인증번호_전송
 *  @route Post auth/email
 *  @body email
 *  @error
 *      1. 요청 바디 부족
 *      2. 아이디가 존재하지 않음
 */
function postEmail(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email } = body;
        // 1. 요청 바디 부족
        if (!email) {
            return -1;
        }
        // 2. email이 DB에 존재하지 않음
        let user = yield User_1.default.findOne({ email });
        if (!user) {
            return -2;
        }
        // 인증번호를 user에 저장 -> 제한 시간 설정하기!
        const authNum = Math.random().toString().substr(2, 6);
        user.emailCode = authNum;
        yield user.save();
        let emailTemplate;
        ejs_1.default.renderFile("src/library/emailTemplete.ejs", { authCode: authNum }, (err, data) => {
            if (err) {
                console.log(err);
            }
            emailTemplate = data;
        });
        const mailOptions = {
            front: "hyunjin5697@gmail.com",
            to: email,
            subject: "메일 제목",
            text: "메일 내용",
            html: emailTemplate,
        };
        yield emailSender_1.smtpTransport.sendMail(mailOptions, (error, info) => {
            if (error) {
                // res.json({ msg: "err" });
                console.log(error);
            }
            else {
                // res.json({ msg: "sucess" });
                console.log("success");
            }
            emailSender_1.smtpTransport.close();
        });
        return 0;
    });
}
exports.postEmail = postEmail;
/**
 *  @인증번호_인증
 *  @route Post auth/code
 *  @body email
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저가 존재하지 않음
 */
function postCode(body) {
    return __awaiter(this, void 0, void 0, function* () {
        // 저장해놓은 authNum이랑 body로 온 인증번호랑 비교
        const { email, emailCode } = body;
        // 1. 요청 바디 부족
        if (!email || !emailCode) {
            return -1;
        }
        // 2. 유저가 존재하지 않음
        // isDeleted = false 인 유저를 찾아야함
        // 회원 탈퇴했다가 다시 가입한 경우 생각하기
        let user = yield User_1.default.findOne({ email: email });
        if (!user) {
            return -2;
        }
        if (emailCode !== user.emailCode) {
            // 인증번호가 일치하지 않음
            return -3;
        }
        else {
            // 인증번호 일치
            return 0;
        }
    });
}
exports.postCode = postCode;
/**
 *  @비밀번호_재설정
 *  @route Patch auth/pw
 *  @body email
 *  @error
 *      1. 요청 바디 부족
 *      2. 아이디가 존재하지 않음
 */
function patchPassword(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = body;
        // 1. 요청 바디 부족
        if (!email || !password) {
            return -1;
        }
        // 2. email이 DB에 존재하지 않음
        let user = yield User_1.default.findOne({ email });
        if (!user) {
            return -2;
        }
        // 비밀번호 변경 로직
        // Encrpyt password
        const salt = yield bcryptjs_1.default.genSalt(10);
        user.password = yield bcryptjs_1.default.hash(password, salt);
        yield user.save();
    });
}
exports.patchPassword = patchPassword;
//# sourceMappingURL=authService.js.map