"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateToString = exports.period = exports.dateToNumber = exports.stringToEndDate = exports.stringToDate = void 0;
function stringToDate(str) {
    var dateParts = str.split("-");
    return new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
}
exports.stringToDate = stringToDate;
function stringToEndDate(str) {
    var dateParts = str.split("-");
    return new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]), 23, 59, 59);
}
exports.stringToEndDate = stringToEndDate;
function dateToNumber(Dt) {
    return new Date(Dt).getTime();
}
exports.dateToNumber = dateToNumber;
// 두 날짜 차이
function period(start, end) {
    var diff = Math.abs(end.getTime() - start.getTime());
    diff = Math.ceil(diff / (1000 * 3600 * 24));
    return diff;
}
exports.period = period;
// Date to String
function dateToString(dt) {
    var date = new Date();
    var year = date.getFullYear();
    var month = new String(date.getMonth() + 1);
    month = Number(month) >= 10 ? month : "0" + month; // month 두자리로 저장
    var day = new String(date.getDate());
    day = Number(day) >= 10 ? day : "0" + day;
    return year + "-" + month + "-" + day;
}
exports.dateToString = dateToString;
//# sourceMappingURL=date.js.map