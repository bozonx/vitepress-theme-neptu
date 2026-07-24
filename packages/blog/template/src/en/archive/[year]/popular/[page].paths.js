import { makeYearPostsParams } from 'vitepress-theme-neptu-blog/list-helpers/node';
import { PER_PAGE } from "../../../../.vitepress/config.js";
import getAllPosts from "../../../getAllPosts.js";

export default {
  async paths() {
    return makeYearPostsParams(await getAllPosts(), PER_PAGE);
  },
};
