export function stringToDate(str: String) {
  var dateParts = str.split("-");

  return new Date(
    parseInt(dateParts[0]),
    parseInt(dateParts[1]) - 1,
    parseInt(dateParts[2])
  );
}

export function dateToNumber(Dt: Date) {
  return new Date(Dt).getTime();
}

// 두 날짜 차이
export function period(start: Date, end: Date) {
  var diff = Math.abs(end.getTime() - start.getTime());
  diff = Math.ceil(diff / (1000 * 3600 * 24));

  return diff;
}
