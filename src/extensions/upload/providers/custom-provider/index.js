const AWS = require("aws-sdk");

module.exports = {
  init(config) {
    const s3 = new AWS.S3({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: config.region,
    });

    return {
      upload(file, options = {}) {
        return new Promise((resolve, reject) => {
          const tagsOption = file.caption ? JSON.parse(file.caption) : "";
          const params = {
            Bucket: config.params.Bucket,
            Key: `${file.hash}${file.ext}`,
            Body: Buffer.from(file.buffer, "binary"),
            ContentType: file.mime,
            Tagging: tagsOption[0]?.key
              ? tagsOption.map((tag) => `${tag.key}=${tag.value}`).join("&")
              : "",
          };

          s3.upload(params, (err, data) => {
            if (err) {
              return reject(err);
            }
            file.url = data.Location;
            resolve();
          });
        });
      },

      delete(file) {
        return new Promise((resolve, reject) => {
          const params = {
            Bucket: config.params.Bucket,
            Key: `${file.hash}${file.ext}`,
          };

          s3.deleteObject(params, (err, data) => {
            if (err) {
              return reject(err);
            }
            resolve();
          });
        });
      },
    };
  },
};
