"use strict";
const AWS = require("aws-sdk");
const fs = require("fs").promises;

module.exports = {
  async upload(ctx) {
    try {
      const { tags } = ctx.request.body;
      const { files } = ctx.request.files;

      if (files && tags) {
        const uploadedFiles = await strapi.plugins[
          "upload"
        ].services.upload.upload({
          data: {
            fileInfo: {
              caption: tags,
              tags: JSON.parse(tags),
            },
            tags: JSON.parse(tags),
          },
          files,
        });

        if (Array.isArray(uploadedFiles)) {
          for (const file of uploadedFiles) {
            await strapi.query("plugin::upload.file").update({
              where: { id: file.id },
              data: {
                tags: tags,
                caption: "",
              },
            });
          }
        }

        ctx.send({
          message: "File uploaded successfully",
          fileUrl: uploadedFiles[0].url,
        });
      } else {
        ctx.send({ message: "File or text content missing" }, 400);
      }
    } catch (error) {
      ctx.throw(500, error);
    }
  },
  async update(ctx) {
    try {
      const { tags, key } = ctx.request.body;
      const { id } = ctx.request.query;
      const { files } = ctx.request.files;

      if (id && tags) {
        // Update tags  first in your database
        await strapi.query("plugin::upload.file").update({
          where: { id: id },
          data: {
            tags: tags,
          },
        });

        // Fetch the existing file data from the database
        const fileData = await strapi.query("plugin::upload.file").findOne({
          where: { id: id },
        });

        if (!fileData) {
          ctx.send({ message: "File not found" }, 404);
          return;
        }

        // Configure AWS SDK with your S3 credentials and region
        AWS.config.update({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_ACCESS_SECRET,
          region: process.env.AWS_REGION,
        });

        const s3 = new AWS.S3();

        const tagsObject = JSON.parse(tags);

        const taggingParams = {
          Bucket: process.env.AWS_BUCKET,
          Key: key,
          Tagging: {
            TagSet: tagsObject.map((obj) => {
              return {
                Key: obj.key,
                Value: obj.value,
              };
            }),
          },
        };

        // Update the tags on the object
        await s3.putObjectTagging(taggingParams).promise();

        const readFileIntoBuffer = async (filePath) => {
          try {
            const buffer = await fs.readFile(filePath);
            return buffer;
          } catch (error) {
            console.error(`Error reading file into buffer: ${error}`);
            throw error;
          }
        };

        if (files) {
          const buffer = await readFileIntoBuffer(files.path);
          const uploadParams = {
            Bucket: process.env.AWS_BUCKET,
            Key: key,
            Body: buffer,
            ContentType: files.mime,
          };

          await s3.upload(uploadParams).promise();

          ctx.send({
            message: "File and tags updated successfully",
            fileUrl: `https://${fileData.bucket}.s3.amazonaws.com/${fileData.path}`,
          });
        } else {
          ctx.send({
            message: "Tags updated successfully",
          });
        }
      } else {
        ctx.send({ message: "File or text content missing" }, 400);
      }
    } catch (error) {
      ctx.throw(500, error);
    }
  },
};
