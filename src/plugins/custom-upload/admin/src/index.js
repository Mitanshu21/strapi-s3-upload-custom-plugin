import { prefixPluginTranslations } from "@strapi/helper-plugin";
import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import Initializer from "./components/Initializer";
import PluginIcon from "./components/PluginIcon";

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    // First Menu Link
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: name,
      },
      Component: async () => {
        const component = await import("./pages/App");
        return component;
      },
      permissions: [
        // Set permissions for this link if needed
      ],
    });

    // Second Menu Link
    app.addMenuLink({
      to: `/plugins/${pluginId}/custom-link-1`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.customLink1.name`,
        defaultMessage: "Upload media with tags",
      },
      Component: async () => {
        const component = await import("./pages/CustomPage1"); // Create this component
        return component;
      },
      permissions: [
        // Set permissions for this link if needed
      ],
    });

    // Register the main plugin
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });
  },

  bootstrap(app) {},

  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
