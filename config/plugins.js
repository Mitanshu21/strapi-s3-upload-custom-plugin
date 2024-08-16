const path = require("path");

module.exports = ({ env }) => ({
  "custom-upload": {
    enabled: true,
    resolve: "./src/plugins/custom-upload",
  },
  upload: {
    config: {
      provider: path.resolve(
        __dirname,
        "../src/extensions/upload/providers/custom-provider"
      ),
      providerOptions: {
        accessKeyId: env("AWS_ACCESS_KEY_ID"),
        secretAccessKey: env("AWS_ACCESS_SECRET"),
        region: env("AWS_REGION"),
        params: {
          ACL: env("AWS_ACL", "public-read"),
          signedUrlExpires: env("AWS_SIGNED_URL_EXPIRES", 15 * 60),
          Bucket: env("AWS_BUCKET"),
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});
