var express = require('express')
var router = express.Router()
const user = require('../../dao/admin/Admin')
/* GET users listing. */
router.post('/login', function (req, res, next) {
  user.login(req, res)
})
router.get('/fetchUserInfo', function (req, res, next) {
  user.getUserInfo(req, res)
})
router.post('/quit', function (req, res, next) {
  user.logout(req, res)
})
module.exports = router
