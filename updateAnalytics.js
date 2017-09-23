var google = require('googleapis')
var key = require('./serviceAccountInfo.json')
var analyticsRequestParams = require('./visitorCountQuery.json')
var ga = google.analytics('v3')
var analytics = {
  books: {
    clawing: {
      paths: [
        '/clawing',
        '/clawing/'
      ],
      visitorCount: 0
    },
    chronicles: {
      paths: [
        '/chronicles',
        '/chronicles/'
      ],
      visitorCount: 0
    }
  }
}

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
        refreshVisitorCount()
        return
      }
      console.log(
        'Loaded ' +
        new Date() +
        ' -- Total sessions: ' +
        response.totalsForAllResults['ga:sessions']
      )

      for (var bookName in analytics.books) {
        var book = analytics.books[bookName]
        book.visitorCount = 0
        for (var i = 0; i < book.paths.length; i++) {
          var bookPath = book.paths[i]
          for (var j = 0; j < response.rows.length; j++) {
            var pathAnalytics = response.rows[j]
            if (bookPath === pathAnalytics[0]) {
              book.visitorCount += parseInt(pathAnalytics[1])
            }
          }
        }
      }
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
