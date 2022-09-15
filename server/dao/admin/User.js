const Jwt = require('../../utils/jwtUtils')
const Utils = require('../../utils')
const Tips = require('../../utils/tip')

module.exports = class Note_dao extends require('../../model/common/curd') {
  //新增管理员
  static async add(req, res) {
    const data = Utils.filter(req.body, ['name', 'password'])
    const { uid } = await Jwt.verifysync(
      req.headers.authorization,
      global.globalkey
    )
    if (!uid) {
      return res.send({
        ...Tips[1005],
      })
    }
    //字段校验
    const result = Utils.formatData(data, [
      {
        key: 'name',
        type: 'string',
      },
      {
        key: 'password',
        type: 'string',
      },
    ])
    if (!result) {
      return res.send({
        ...Tips[1007],
      })
    }
    const { name, password } = data
    const create_time = Utils.getDate19()
    try {
      await this.addField(
        't_user',
        ['name', 'password', 'create_time', 'is_delete'],
        name,
        password,
        create_time,
        0
      )
      res.send(Tips[0])
    } catch (err) {
      res.send(Tips[1008])
    }
  }
  //删除管理员
  static async delete(req, res) {
    const data = Utils.filter(req.body, ['user_id'])
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
        key: 'user_id',
        type: 'number',
      },
    ])
    if (!result) {
      return res.send({
        ...Tips[1007],
      })
    } else if (data.user_id == 1) {
      return res.send({
        ...Tips[1012],
      })
    }
    let { user_id } = data
    try {
      await this.deleteField('t_user', ['uid'], user_id)
      res.send(Tips[0])
    } catch (err) {
      res.send(Tips[1008])
    }
  }
  //修改
  static async edit(req, res) {
    const data = Utils.filter(req.body, ['uid', 'name', 'password'])
    const { uid } = await Jwt.verifysync(
      req.headers.authorization,
      global.globalkey
    )
    if (!uid) {
      return res.send({
        ...Tips[1005],
      })
    }
    console.log(data)
    const result = Utils.formatData(data, [
      {
        key: 'uid',
        type: 'number',
      },
      {
        key: 'name',
        type: 'string',
      },
      {
        key: 'password',
        type: 'string',
      },
    ])
    if (!result) {
      return res.send({
        ...Tips[1007],
      })
    }
    const { uid: user_id, name, password } = data
    const update_time = Utils.getDate19()
    try {
      await this.editField(
        't_user',
        ['name', 'password', 'update_time'],
        ['uid'],
        name,
        password,
        update_time,
        user_id
      )
      res.send(Tips[0])
    } catch (err) {
      console.log(err)
      res.send(Tips[1008])
    }
  }
  //查询管理员详情
  static async queryOne(req, res) {
    const data = Utils.filter(req.query, ['user_id'])
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
        key: 'user_id',
        type: 'number',
      },
    ])
    if (!result) {
      return res.send({
        ...Tips[1007],
      })
    }
    let { user_id } = data
    user_id = parseInt(user_id)
    try {
      const queryRes = await this.queryOneOfField(
        't_user',
        ['uid', 'name', 'create_time', 'update_time'],
        ['uid', 'is_delete'],
        user_id,
        0
      )
      res.send({
        ...Tips[0],
        data: {
          ...queryRes[0],
        },
      })
    } catch (err) {
      console.log(err)
      res.send(Tips[1008])
    }
  }
  //查询所有用户(type：0 分页查询)
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
    let { pageSize = 10, pageNum = 1 } = data
    pageSize = Number(pageSize)
    pageNum = Number(pageNum)
    const offset = (pageNum - 1) * pageSize
    try {
      const count = await this.querySumOfField('t_user', ['is_delete'], 0)
      const list = await this.QueryFieldByPage(
        't_user',
        ['name', 'uid', 'create_time', 'update_time'],
        ['update_time'],
        ['is_delete'],
        offset,
        pageSize,
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
