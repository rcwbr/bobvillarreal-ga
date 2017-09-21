var google = require('googleapis')
var key = require('./serviceAccountInfo.json')
var analyticsRequestParams = require('./visitorCountQuery.json')
var ga = google.analytics('v3')
var analytics = {visitorCount: 0}

var jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/analytics.readonly'],
  null
)

function refreshVisitorCount () {
  jwtClient.authorize(function (err, tokens) {
    if (err) {
      console.log(err)
      return
    }

    analyticsRequestParams.auth = jwtClient
    ga.data.ga.get(analyticsRequestParams, null, function (err, response) {
      if (err) {
        console.log(err)
        return
      }
      console.log(
        'Loaded ' +
        new Date() +
        ' -- Total sessions: ' +
        response.totalsForAllResults['ga:sessions']
      )
      analytics.visitorCount = response.totalsForAllResults['ga:sessions']
    })
  })
}

module.exports.updateAnalyticsLoop = function (rate) {
  console.log('Loading visitor count... ')
  refreshVisitorCount()
  setInterval(function () {
    console.log('Refresing visitor count... ')
    refreshVisitorCount()
  }, rate * 60 * 1000)
}

module.exports.analytics = analytics
