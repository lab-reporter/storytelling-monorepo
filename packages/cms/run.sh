#!/usr/bin/env bash
# set -eo pipefail

# Create mount directory for service
mkdir -p $MNT_DIR

echo "Mounting GCS Fuse."
# gcsfuse --debug_gcs --debug_fuse $GCS_BUCKET $MNT_DIR
gcsfuse --debug_gcs $GCS_BUCKET $MNT_DIR
echo "Mounting completed."

# Mirgate DB schema and data if needed
yarn run db-migrate

#for http/2 proxy
if [ "$HTTP2_ENABLED" = "true" ]
then
  echo "Try to run HTTP2 reverse proxy server and Keystone server."
  PORT=$KEYSTONE_SERVER_PORT yarn start &

  echo "Run Keystone server on the background."

  isServerRunning=`lsof -Pi :$KEYSTONE_SERVER_PORT -sTCP:LISTEN -t`
  while [ -z "$isServerRunning" ]
  do
    echo "Keystone server is not ready."
    sleep 5
    isServerRunning=`lsof -Pi :$KEYSTONE_SERVER_PORT -sTCP:LISTEN -t`
  done

  echo "Keystone server is ready."

  # Run the http2 reverse proxy server, which proxies http2 request to keystone server
  echo "HTTP2 reverse proxy server is starting..."
  PORT=$REVERSE_PROXY_PORT yarn run start-http2-proxy-server &
else
  # Run keystone server
  PORT=$KEYSTONE_SERVER_PORT yarn start &
fi

# Exit immediately when one of the background processes terminate.
wait -n
