# bobvillarreal-ga
A node.js server to query Google Analytics for data about bobvillarreal.com and provide API access to that data

The server uses the [node.js Google APIs Client](https://github.com/google/google-api-nodejs-client) to query Google Analytics at a set time interval.

## serviceAccountInfo.json

Instructions to create a Google Analytics service account, and to generate a JSON file for that account, can be found in the Google Identity Platform documentation, under [Creating a service account](https://developers.google.com/identity/protocols/OAuth2ServiceAccount#creatinganaccount). An example JSON file is provided.

## visitorCountQuery.json

The `ids` field is for the view id being accessed. This can be found with the [Google Analytics Account Explorer](https://ga-dev-tools.appspot.com/account-explorer/) under `Table ID`. The remaining fields can be explored and testing in the [Google Analytics Query Explorer](https://ga-dev-tools.appspot.com/query-explorer/). An example JSON file is provided.
