const Jwt = require('../../utils/jwtUtils')
const Utils = require('../../utils')
const Tips = require('../../utils/tip')
const isProd = process.env.NODE_ENV === 'production';

module.exports = class Img_dao extends require('../../model/common/curd') {
  static async imgUpload(req, res) {
    const file = req.file
    const { uid } = await Jwt.verifysync(
      req.headers.authorization,
      global.globalkey
    )
    const create_time = Utils.getDate19()
    try {
      //填入相关开发环境的文件上传地址
      file.url = isProd ?  `http://xxx/static/${file.filename}` : `http://xxx/static/${file.filename}`
      res.send(file)
    } catch (err) {
      console.log(err)
      res.send(Tips[1008])
    }
  }
}
