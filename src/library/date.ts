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
