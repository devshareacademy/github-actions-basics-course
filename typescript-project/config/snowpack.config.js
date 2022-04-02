/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    "../src": '/',
    "../public": '/'
  },
  devOptions: {
    port: 8080
  },
  buildOptions: {
    out: "dist"
  },
  optimize: {
    bundle: true,
    minify: true,
    sourcemap: false
  }
};
