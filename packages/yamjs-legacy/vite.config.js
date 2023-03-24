import { yamJsViteConfig } from "../build";

export default yamJsViteConfig({root: __dirname, name: 'yamjs-legacy', external: ["@yam-js/core"]})