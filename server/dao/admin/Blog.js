const Jwt = require('../../utils/jwtUtils')
const Utils = require('../../utils')
const Tips = require('../../utils/tip')
const { number, array } = require('is')

module.exports = class Blog_dao extends require('../../model/common/curd') {
  //新增博客
  static async add(req, res) {
    const data = Utils.filter(req.body, [
      'title',
      'publish',
      'content',
      'tags',
      'brief',
      'is_top'
    ])
    const { uid } = await Jwt.verifysync(
      req.headers.authorization,
      global.globalkey
    )
    if (!uid) {
      return res.send({
        ...Tips[1005],
      })
    }
    data.isTop = data.isTop || 0
    //字段校验
    const result = Utils.formatData(data, [
      {
        key: 'tags',
        type: 'array',
      },
      {
        key: 'title',
        type: 'string',
      },
      {
        key: 'brief',
        type: 'string',
      },
      {
        key: 'content',
        type: 'string',
      },
      {
        key: 'publish',
        type: 'number',
      },
      {
        key: 'is_top',
        type: 'number',
      },
    ])
    if (!result) {
      return res.send({
        ...Tips[1007],
      })
    }
    let {
      title = '无标题',
      content = '',
      tags = '',
      brief = '',
      publish = 0,
      create_time = '',
      is_top = 0
    } = data
    create_time = Utils.getDate19()
    try {
      let { insertId } = await this.addField(
        't_blog',
        [
          'title',
          'content',
          'create_time',
          'update_time',
          'publish',
          'brief',
          'is_top',
          'uid',
        ],
        title,
        content,
        create_time,
        create_time,
        publish,
        brief,
        is_top,
        uid
      )
      for (let i = 0; i < tags.length; i++) {
        await this.addField(
          't_tag',
          ['name', 'blog_id', 'create_time', 'update_time', 'uid', 'publish'],
          tags[i].name,
          insertId,
          create_time,
          create_time,
          uid,
          publish
        )
      }
      res.send(Tips[0])
    } catch (err) {
      res.send(Tips[1008])
    }
  }
  //删除博客
  static async delete(req, res) {
    const data = Utils.filter(req.body, ['blog_id'])
    const { uid } = await Jwt.verifysync(
      req.headers.authorization,
      global.globalkey
    )
    if (!uid) {
      return res.send({
        ...Tips[1005],
      })
    }
    let result = Utils.formatData(data, [
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
    const { blog_id } = data
    try {
      await this.deleteField('t_blog', ['blog_id', 'uid'], blog_id, uid)
      await this.deleteField('t_tag', ['blog_id', 'uid'], blog_id, uid)
      res.send(Tips[0])
    } catch (err) {
      res.send(Tips[1008])
    }
  }
  //修改
  static async edit(req, res) {
    const data = Utils.filter(req.body, [
      'title',
      'content',
      'tags',
      'blog_id',
      'brief',
      'publish',
      'is_top'
    ])
    const { uid } = await Jwt.verifysync(
      req.headers.authorization,
      global.globalkey
    )
    if (!uid) {
      return res.send({
        ...Tips[1005],
      })
    }
    data.isTop = data.isTop || 0

    const result = Utils.formatData(data, [
      {
        key: 'tags',
        type: 'array',
      },
      {
        key: 'blog_id',
        type: 'number',
      },
      {
        key: 'title',
        type: 'string',
      },
      {
        key: 'brief',
        type: 'string',
      },
      {
        key: 'content',
        type: 'string',
      },
      {
        key: 'publish',
        type: 'number',
      },
      {
        key: 'is_top',
        type: 'number',
      },
    ])
    if (!result) {
      return res.send({
        ...Tips[1007],
      })
    }
    let {
      title,
      content,
      tags,
      blog_id,
      brief,
      publish = 0,
      update_time = '',
      is_top = 0
    } = data
    blog_id = Number(blog_id)
    update_time = Utils.getDate19()
    try {
      await this.editField(
        't_blog ',
        ['title', 'content', 'brief', 'publish','is_top', 'update_time'],
        ['blog_id', 'uid'],
        title,
        content,
        brief,
        publish,
        is_top,
        update_time,
        blog_id,
        uid
      )
      await this.deleteField('t_tag', ['blog_id', 'uid'], blog_id, uid)
      for (let i = 0; i < tags.length; i++) {
        await this.addField(
          't_tag',
          ['name', 'blog_id', 'create_time', 'update_time', 'uid', 'publish'],
          tags[i].name,
          blog_id,
          update_time,
          update_time,
          uid,
          publish
        )
      }
      res.send(Tips[0])
    } catch (err) {
      console.log(err)
      res.send(Tips[1008])
    }
  }
  //置顶博客
  static async changeBlogTopStatus(req, res) {
    const data = Utils.filter(req.body, ['blog_id', 'is_top'])
    const { uid } = await Jwt.verifysync(
      req.headers.authorization,
      global.globalkey
    )
    if (!uid) {
      return res.send({
        ...Tips[1005],
      })
    }
    const result = Utils.formatData(data, [
      {
        key: 'blog_id',
        type: 'number',
      },
      {
        key: 'is_top',
        type: 'number',
      },
    ])
    if (!result) {
      return res.send({
        ...Tips[1007],
      })
    }
    const { blog_id, is_top } = data
    const update_time = Utils.getDate19()
    try {
      let { changedRows } = await this.editField(
        't_blog',
        ['is_top'],
        ['uid', 'blog_id'],
        is_top,
        uid,
        blog_id
      )
      changedRows ? res.send(Tips[0]) : res.send(Tips[1011])
    } catch (err) {
      console.log(err)
      res.send(Tips[1008])
    }
  }
   //发布博客
   static async changeBlogPublicStatus(req, res) {
    const data = Utils.filter(req.body, ['blog_id', 'publish'])
    const { uid } = await Jwt.verifysync(
      req.headers.authorization,
      global.globalkey
    )
    if (!uid) {
      return res.send({
        ...Tips[1005],
      })
    }
    const result = Utils.formatData(data, [
      {
        key: 'blog_id',
        type: 'number',
      },
      {
        key: 'publish',
        type: 'number',
      },
    ])
    if (!result) {
      return res.send({
        ...Tips[1007],
      })
    }
    const { blog_id, publish } = data
    const update_time = Utils.getDate19()
    try {
      let { changedRows } = await this.editField(
        't_blog',
        ['publish'],
        ['uid', 'blog_id'],
        publish,
        uid,
        blog_id
      )
      await this.editField(
        't_tag',
        ['publish'],
        ['uid', 'blog_id'],
        publish,
        uid,
        blog_id
      )
      changedRows ? res.send(Tips[0]) : res.send(Tips[1011])
    } catch (err) {
      console.log(err)
      res.send(Tips[1008])
    }
  }
  //查询博客详情
  static async queryOne(req, res) {
    const data = Utils.filter(req.query, ['blog_id'])
    const { uid } = await Jwt.verifysync(
      req.headers.authorization,
      global.globalkey
    )
    if (!uid) {
      return res.send({
        ...Tips[1005],
      })
    }
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
          'is_top',
          'create_time',
          'update_time',
        ],
        ['blog_id', 'is_delete', 'uid'],
        blog_id,
        0,
        uid
      )
      const queryTags = await this.queryOneOfField(
        't_tag',
        ['name'],
        ['blog_id', 'is_delete', 'uid'],
        blog_id,
        0,
        uid
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
  //分页查询所有博客
  static async queryByType(req, res) {
    const data = Utils.filter(req.query, ['pageSize', 'pageNum'])
    const { uid } = await Jwt.verifysync(
      req.headers.authorization,
      global.globalkey
    )
    if (!uid) {
      return res.send({
        ...Tips[1005],
      })
    }
    const result = Utils.formatData(data, [
      {
        key: 'pageSize',
        type: 'number',
      },
      {
        key: 'pageNum',
        type: 'number',
      },
    ])
    if (!result) {
      return res.send({
        ...Tips[1007],
      })
    }
    let { pageSize = 10, pageNum = 1, type = 0, tag_id } = data
    pageSize = Number(pageSize)
    pageNum = Number(pageNum)
    let tags_id = tag_id ? tag_id.split(',') : ''
    const offset = (pageNum - 1) * pageSize
    const { id } = data
    try {
      const count = await this.querySumOfField(
        't_blog',
        ['uid', 'is_delete'],
        uid,
        0
      )
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
        ['is_top','update_time'],
        ['uid', 'is_delete'],
        offset,
        pageSize,
        uid,
        0
      )
      res.send({
        ...Tips[0],
        total: count[0]['count(1)'],
        data: list,
        pageNum,
        pageSize,
      })
    } catch (err) {
      console.log(err)
      res.send(Tips[1008])
    }
  }
}
