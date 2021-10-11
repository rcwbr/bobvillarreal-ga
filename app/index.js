const express = require('express')
const app = express()
var analyticsUpdater = require('./updateAnalytics.js')
var env = require('./env.json')
var fs = require('fs')
var https = require('https')
var vistorCountRefreshRate = 30 // minutes

analyticsUpdater.updateAnalyticsLoop(vistorCountRefreshRate)

app.get('/', function (req, res) {
  if (env['access-control-origin'].includes(req.headers.origin)) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', false)
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(analyticsUpdater.analytics))
})

// app.listen(8080, function () {
//   console.log('Server online')
// })

https.createServer({
  key: fs.readFileSync('ssl/privkey.pem'),
  cert: fs.readFileSync('ssl/cert.pem')
}, app).listen(8080, function () {
  console.log('Server online')
})
