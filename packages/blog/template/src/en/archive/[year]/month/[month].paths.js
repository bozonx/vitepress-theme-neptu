import { makeMonthsParams } from 'vitepress-theme-neptu/list-helpers/node';
import getAllPosts from "../../../getAllPosts.js";

export default {
  async paths() {
    return makeMonthsParams(await getAllPosts());
  },
};
