const Jwt = require('../../utils/jwtUtils')
const Utils = require('../../utils')
const Tips = require('../../utils/tip')
const { number } = require('is')

module.exports = class Blog_dao extends require('../../model/common/curd') {
  //查询博客详情
  static async queryOne(req, res) {
    const data = Utils.filter(req.query, ['tag_id'])
    const result = Utils.formatData(data, [
      {
        key: 'blog_id',
        type: 'number',
      },
    ])
    if (!result) {
      return res.send({
        ...Tips[1007],
      })
    }
    let { blog_id } = data
    blog_id = parseInt(blog_id)
    try {
      const queryRes = await this.queryOneOfField(
        't_blog',
        [
          'title',
          'content',
          'blog_id',
          'brief',
          'publish',
          'create_time',
          'update_time',
        ],
        ['blog_id', 'is_delete'],
        blog_id,
        0
      )
      const queryTags = await this.queryOneOfField(
        't_tag',
        ['name'],
        ['blog_id', 'is_delete'],
        blog_id,
        0
      )
      res.send({
        ...Tips[0],
        data: {
          ...queryRes[0],
          tags: queryTags,
        },
      })
    } catch (err) {
      console.log(err)
      res.send(Tips[1008])
    }
  }
  //查询所有标签
  static async queryByType(req, res) {
    const { uid } = await Jwt.verifysync(
      req.headers.authorization,
      global.globalkey
    )
    if (!uid) {
      return res.send({
        ...Tips[1005],
      })
    }
    try {
      const list = await this.queryAllOfField(
        "t_tag",
        ["name", "tag_id"],
        ["create_time"],
        ["is_delete", "publish"],
        0,
        1
      );
      // let handleList = Utils.unique(list, 'name')
      res.send({
        ...Tips[0],
        data: list,
      });
    } catch (err) {
      console.log(err);
      res.send(Tips[1008]);
    }
  }
}
