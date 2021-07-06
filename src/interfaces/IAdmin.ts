export interface IAdmin {
  title: String;
  registerStartDT: Date;
  registerEndDT: Date;
  challengeStartDT: Date;
  challengeEndDT: Date;
  cardiNum: Number;
  limitNum: Number;
  img: String;
  createdDT: Date;
  applyNum: Number;
}

export interface IAdminDTO {
  title: String;
  registerStartDT: Date;
  registerEndDT: Date;
  challengeStartDT: Date;
  challengeEndDT: Date;
  cardiNum: Number;
  limitNum: Number;
  img: String;
}

export interface IAdminListDTO {
  generation: Number;
  createdDT: Date;
  challengeStartDT: Date;
  challengeEndDT: Date;
  registerStartDT: Date;
  registerEndDT: Date;

  // 신청인원
  applyNum: Number;

  //참여자
  participants: Number;
  postNum: String;
}
