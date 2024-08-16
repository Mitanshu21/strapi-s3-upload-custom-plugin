module.exports = {
  routes: [
    {
      method: "POST",
      path: "/upload-custom",
      handler: "custom-upload.upload",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/update-custom",
      handler: "custom-upload.update",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
