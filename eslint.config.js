import vuetify from "eslint-config-vuetify";

export default [
  ...vuetify(),
  {
    rules: {
      "@stylistic/*": "off",
    },
  },
];
