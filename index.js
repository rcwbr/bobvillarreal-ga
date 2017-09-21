const express = require('express')
const app = express()
var analyticsUpdater = require('./updateAnalytics.js')
var vistorCountRefreshRate = 30 // minutes

analyticsUpdater.updateAnalyticsLoop(vistorCountRefreshRate)

app.get('/', function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4567')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', false)
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(analyticsUpdater.analytics))
})

app.listen(8080, function () {
  console.log('Server online')
})
