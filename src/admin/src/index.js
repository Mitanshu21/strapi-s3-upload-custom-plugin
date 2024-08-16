// src/admin/src/index.js
import pluginId from "./pluginId";
import CustomFileField from "./components/CustomFileField";

const registerComponents = (app) => {
  app.customFields.register({
    name: "extraField",
    pluginId,
    type: "text",
    intlLabel: {
      id: "customField.label",
      defaultMessage: "Extra Field",
    },
    components: {
      Input: CustomFileField,
    },
  });
};

export default {
  register(app) {
    registerComponents(app);
  },
};
