const getters = {
  sideBoxOpen: (state) => state.side.sideBoxOpen,
  tags: (state) => state.side.tags,
  selectTags: (state) => state.side.selectTags,
  selectTagsId: (state) => state.side.selectTagsId,
  blogs: (state) => state.list.blogs,
  pageNum: (state) => state.list.pageNum,
  pageSize: (state) => state.list.pageSize,
  currentlyCompiledBlog: (state) => state.list.currentlyCompiledBlog,
  currentBlog: (state) => state.list.currentBlog || "",
  total: (state) => state.list.total,
  isInList: (state) => state.side.isInList,
  articleDir: (state) => state.side.articleDir,
};
export default getters;
