module.exports = (app) => {
  var express = require('express')
  var assert = require('http-assert')
  var inflection = require('inflection')
  var router = express.Router({
    mergeParams: true,
  })
  //查询详细信息
  router.get('/query', function (req, res, next) {
    req.Model.queryOne(req, res)
  })
  //查询所有列表
  router.get('/queryAll', function (req, res, next) {
    req.Model.queryByType(req, res)
  })
  app.use(
    '/bp/api/:resource',
    function (req, res, next) {
      //将路由名规范化为模块名称
      console.log(req.params)
      let resource = req.params.resource
      let i = resource.indexOf('/')
      resource = i !== -1 ? resource.slice(0, i) : resource
      const modelName = inflection.classify(resource)
      console.log(modelName)
      //引入对应模块
      const model = require(`../../dao/user/${modelName}`)
      //将模块挂在到req中
      req.Model = model
      next()
    },
    router
  )
}
