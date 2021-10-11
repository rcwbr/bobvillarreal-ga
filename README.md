# bobvillarreal-ga
A node.js server to query Google Analytics for data about bobvillarreal.com and provide API access to that data

The server uses the [node.js Google APIs Client](https://github.com/google/google-api-nodejs-client) to query Google Analytics at a set time interval.

## serviceAccountInfo.json

Instructions to create a Google Analytics service account, and to generate a JSON file for that account, can be found in the Google Identity Platform documentation, under [Creating a service account](https://developers.google.com/identity/protocols/OAuth2ServiceAccount#creatinganaccount). An example JSON file is provided.

## visitorCountQuery.json

The `ids` field is for the view id being accessed. This can be found with the [Google Analytics Account Explorer](https://ga-dev-tools.appspot.com/account-explorer/) under `Table ID`. The remaining fields can be explored and testing in the [Google Analytics Query Explorer](https://ga-dev-tools.appspot.com/query-explorer/). An example JSON file is provided.

## Support HTTPS

Follow [bluehost instructions](https://my.bluehost.com/hosting/help/508) to create a DNS A record for the GCP instance IP.

Follow directions from [itnext.io](https://itnext.io/node-express-letsencrypt-generate-a-free-ssl-certificate-and-run-an-https-server-in-5-minutes-a730fbe528ca)

If renewal in `/etc/cron.d/certbot` fails, try adding `eric sudo certbot renew && sudo chown -R eric:eric /etc/letsencrypt` to `/etc/crontab`

## Provision instance

### Install Docker
```
sudo apt-get update
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
sudo usermod -aG docker $USER
```

### Request cert
```
docker run -it --rm --name certbot \
  -p 80:80 \
  -p 443:443 \
  -v "$(pwd)/etc_letsencrypt:/etc/letsencrypt" \
  -v "$(pwd)/lib_letsencrypt:/var/lib/letsencrypt" \
  certbot/certbot certonly \
    -d ga.bobvillarreal.com \
    --standalone \
    --agree-tos \
    -m villarreal@weber.lol \
    -n
```

### Or get from Cloudflare

https://dash.cloudflare.com/cd0e5aaa17a8634849f34b10eee6b41b/bobvillarreal.com/ssl-tls/origin

Paste into `cloudflare_keys/privkey.pem` and `cloudflare_keys/cert.pem`

### Build image
```
cd app
docker build -t ga.bobvillarreal.com/ga-api --file ../Dockerfile .
```

### Run image
```
docker run \
  -d \
  --restart unless-stopped \
  --name ga-bobvillarreal \
  -p 443:8080 \
  -v $(pwd)/serviceAccountInfo.json:/app/serviceAccountInfo.json \
  -v $(pwd)/visitorCountQuery.json:/app/visitorCountQuery.json \
  -v $(pwd)/env.json:/app/env.json \
  -v $(pwd)/cloudflare_keys:/app/ssl \
  ga.bobvillarreal.com/ga-api:latest
```