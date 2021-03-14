const express = require('express')
const router = express.Router()

router.get(['/', 'admin-portal'], function (req, res) { // home page

    res.render('admin_portal', { server_port: '4000' })
})

module.exports = router;