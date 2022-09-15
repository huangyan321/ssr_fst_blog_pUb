const Utils = require('../../utils');
const Tips = require('../../utils/tip');
const { number, array } = require('is');

module.exports = class Blog_dao extends require('../../model/common/curd') {
  //查询博客详情
  static async queryOne(req, res) {
    const data = Utils.filter(req.query, ['blog_id']);
    const result = Utils.formatData(data, [
      {
        key: 'blog_id',
        type: 'number',
      },
    ]);
    if (!result) {
      return res.send({
        ...Tips[1007],
      });
    }
    let { blog_id } = data;
    blog_id = parseInt(blog_id);
    try {
      const queryRes = await this.queryOneOfField(
        't_blog',
        ['title', 'content', 'blog_id', 'brief', 'publish', 'create_time'],
        ['blog_id', 'is_delete'],
        blog_id,
        0
      );
      const queryTags = await this.queryOneOfField(
        't_tag',
        ['name'],
        ['blog_id', 'is_delete'],
        blog_id,
        0
      );
      res.send({
        ...Tips[0],
        data: {
          ...queryRes[0],
          tags: queryTags,
        },
      });
    } catch (err) {
      console.log(err);
      res.send(Tips[1008]);
    }
  }
  //查询所有博客(type：0 分页查询 type：1根据标签查询)
  static async queryByType(req, res) {
    const data = Utils.filter(req.query, [
      'pageSize',
      'pageNum',
      'tag_id',
      'type',
      'words',
    ]);
    const result = Utils.formatData(data, [
      {
        key: 'type',
        type: 'number',
      },
    ]);
    if (!result) {
      return res.send({
        ...Tips[1007],
      });
    }
    let { pageSize = 10, pageNum = 1, type = 0, tag_id, words = '' } = data;
    pageSize = Number(pageSize);
    pageNum = Number(pageNum);
    let tags_id = tag_id ? tag_id.split(',') : '';
    const offset = (pageNum - 1) * pageSize;
    const { id } = data;
    const uid = 1;
    try {
      if (type == 1) {
        const list = await this.queryTagNameByTagsId(
          't_tag',
          ['name'],
          ['update_time'],
          tags_id,
          ['uid', 'is_delete'],
          uid,
          0
        );
        const list1 = await this.queryBlogsIdByTagsName(
          't_tag',
          ['blog_id'],
          ['update_time'],
          list,
          ['uid', 'is_delete'],
          uid,
          0
        );
        const count = await this.querySumOfBlogByBlogIds(
          't_blog',
          [
            'title',
            'blog_id',
            'brief',
            'publish',
            'create_time',
            'update_time',
          ],
          ['is_top', 'create_time'],
          Array.from(new Set(list1)),
          ['uid', 'is_delete', 'publish'],
          uid,
          0,
          1
        );
        const list2 = await this.queryBlogByBlogIds(
          't_blog',
          ['title', 'blog_id', 'brief', 'is_top', 'publish'],
          ['is_top', 'create_time'],
          Array.from(new Set(list1)),
          ['uid', 'is_delete', 'publish'],
          offset,
          pageSize,
          uid,
          0,
          1
        );
        res.send({
          ...Tips[0],
          total: count.length,
          data: list2,
          pageNum,
          pageSize,
        });
      } else if (type == 0) {
        const count = await this.querySumOfField(
          't_blog',
          ['uid', 'is_delete', 'publish'],
          uid,
          0,
          1
        );
        const list = await this.QueryFieldByPage(
          't_blog',
          [
            'blog_id',
            'title',
            'content',
            'create_time',
            'update_time',
            'publish',
            'brief',
            'is_top',
            'ext_info',
          ],
          ['is_top', 'create_time'],
          ['uid', 'is_delete', 'publish'],
          offset,
          pageSize,
          uid,
          0,
          1
        );
        res.send({
          ...Tips[0],
          total: count[0]['count(1)'],
          data: list,
          pageNum,
          pageSize,
        });
      } else {
        const list = await this.queryBlogByLikeWords(
          't_blog',
          ['blog_id', 'title'],
          ['uid', 'is_delete', 'publish'],
          words,
          uid,
          0,
          1
        );
        res.send({
          ...Tips[0],
          data: list,
        });
      }
    } catch (err) {
      console.log(err);
      res.send(Tips[1008]);
    }
  }
};
