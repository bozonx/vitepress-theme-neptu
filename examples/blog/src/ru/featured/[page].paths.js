import { makeFeaturedPostsParams } from 'vitepress-theme-neptu/list-helpers/node';
import { PER_PAGE } from "../../.vitepress/config.js";
import getAllPosts from "../getAllPosts.js";

export default {
  async paths() {
    return makeFeaturedPostsParams(await getAllPosts(), PER_PAGE);
  },
};
