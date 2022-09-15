const Jwt = require('../../utils/jwtUtils')
const Utils = require('../../utils')
const Tips = require('../../utils/tip')

module.exports = class Note_dao extends require('../../model/common/curd') {
  //新增随笔
  static async add(req, res) {
    const data = Utils.filter(req.body, ['content','publish'])
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
        key: 'content',
        type: 'string',
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
    let { content='',publish=0 } = data
    const create_time = Utils.getDate19()
    try {
      await this.addField(
        't_note',
        ['content', 'uid', 'create_time','publish'],
        content,
        uid,
        create_time,
        publish
      )
      res.send(Tips[0])
    } catch (err) {
      res.send(Tips[1008])
    }
  }
  //删除随笔
  static async delete(req, res) {
    const data = Utils.filter(req.body, ['note_id'])
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
        key: 'note_id',
        type: 'number',
      },
    ])
    if (!result) {
      return res.send({
        ...Tips[1007],
      })
    }
    const { note_id } = data
    try {
      await this.deleteField('t_note', ['note_id', 'uid'], note_id, uid)
      res.send(Tips[0])
    } catch (err) {
      res.send(Tips[1008])
    }
  }
  //发布随笔
  static async changeNotePublicStatus(req, res) {
    const data = Utils.filter(req.body, ['note_id', 'publish'])
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
        key: 'note_id',
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
    const { note_id, publish } = data
    const update_time = Utils.getDate19()
    try {
      let { changedRows } = await this.editField(
        't_note',
        ['publish'],
        ['uid', 'note_id'],
        publish,
        uid,
        note_id
      )
      changedRows ? res.send(Tips[0]) : res.send(Tips[1011])
    } catch (err) {
      console.log(err)
      res.send(Tips[1008])
    }
  }
  //查询所有随笔(type：0所有type：1分页)
  static async queryByType(req, res) {
    const data = Utils.filter(req.query, ['pageSize', 'pageNum', 'type'])
    const { uid } = await Jwt.verifysync(
      req.headers.authorization,
      global.globalkey
    )
    const result = Utils.formatData(data, [
      {
        key: 'type',
        type: 'number',
      },
    ])
    if (!result) {
      return res.send({
        ...Tips[1007],
      })
    }
    let { pageSize = 10, pageNum = 1, type = 0 } = data
    pageSize = Number(pageSize)
    pageNum = Number(pageNum)
    const offset = (pageNum - 1) * pageSize
    try {
      const count = await this.querySumOfField(
        't_note',
        ['uid', 'is_delete'],
        uid,
        0
      )
      if (type == 1) {
        const list = await this.QueryFieldByPage(
          't_note',
          ['note_id', 'content','publish', 'create_time'],
          ['create_time'],
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
      } else {
        const list = await this.queryAllOfField(
          't_note',
          ['note_id', 'content','publish', 'create_time'],
          ['create_time'],
          ['uid', 'is_delete'],
          uid,
          0
        )
        res.send({
          ...Tips[0],
          total: count[0]['count(1)'],
          data: list,
        })
      }
    } catch (err) {
      console.log(err)
      res.send(Tips[1008])
    }
  }
}
