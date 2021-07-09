import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import config from "src/config";

const s3 = new aws.S3({
  accessKeyId: config.awsS3AccessKey,
  secretAccessKey: config.awsS3SecretAccessKey,
});

export const uploadImg = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.awsBucket,
    acl: "public-read",
    Bucket: "o2-server/img",
    key: function (req, file, cb) {
      cb(
        null,
        "images/origin/" + Date.now() + "." + file.originalname.split(".").pop()
      );
    },
  }),
});

export const uploadVideo = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.awsBucket,
    acl: "public-read",
    Bucket: "o2-server/video",
    key: function (req, file, cb) {
      cb(
        null,
        "images/origin/" + Date.now() + "." + file.originalname.split(".").pop()
      );
    },
  }),
});
