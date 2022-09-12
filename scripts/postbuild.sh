#!/bin/bash

rm -f build/version.txt && git rev-parse --short=7 HEAD > build/version.txt && cat build/version.txt

EXPECTED_BRANCH="release"
EXPECTED_ENVIRONMENT="production"

if [[ "$CF_PAGES_BRANCH" != "$EXPECTED_BRANCH" ]]; then
  echo "Not the $EXPECTED_BRANCH branch but $BRANCH, exiting";
  exit 0;
fi

# non-prod branch or env?
if [[ "$REACT_APP_ENVIRONMENT" != "$EXPECTED_ENVIRONMENT" ]]; then
  echo "Not the '$EXPECTED_ENVIRONMENT' environment but '$REACT_APP_ENVIRONMENT', exiting";
  exit 0;
fi

# prod branch and env?
RELEASE_START=$(date +'%Y-%m-%d %H:%M:%S') && echo $RELEASE_START > ./release_start.txt
export RELEASE_START
TITLE="Release $(cat ./build/version.txt) at $(cat ./release_start.txt)" && echo $TITLE > ./build/release_title.txt
export TITLE

cat ./build/version.txt
cat ./release_start.txt

curl -v -d "version=$(cat ./build/version.txt)&release_start=$(cat ./release_start.txt)&title=$(cat ./build/release_title.txt)" -u "$AMPLITUDE_API_KEY:$AMPLITUDE_SECRET_KEY" -X POST https://amplitude.com/api/2/release
curl -X POST 'https://api.cloudflare.com/client/v4/zones/2899733e465b753b01f5e55a29e095f0/purge_cache' -H "$CLOUDFLARE_AUTH"  --data-raw '{"purge_everything":true}'
