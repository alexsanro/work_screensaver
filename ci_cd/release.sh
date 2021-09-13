#!/bin/bash -e
echo "Publishing on Github..."

PACKAGE_VERSION=$(node -p -e "require('./package.json').version")
TAG=$PACKAGE_VERSION
NAME="workscreen_saver v"$TAG
MESSAGE=""
DESCRIPTION=""

release=$(curl -v -XPOST -H "Authorization:token $GITHUB_CREDENTIALS_PSW" --data "{\"tag_name\": \"$TAG\", \"target_commitish\": \"master\", \"name\": \"$NAME\", \"body\": \"$DESCRIPTION\", \"draft\": false, \"prerelease\": false}" https://api.github.com/repos/alexsanro/work_screensaver/releases)
id=$(echo "$release" | sed -n -e 's/"id":\ \([0-9]\+\),/\1/p' | head -n 1 | sed 's/[[:blank:]]//g')

echo "Upload release... "
curl -v -XPOST -H "Authorization:token $GITHUB_CREDENTIALS_PSW" -H "Content-Type:application/octet-stream" --data-binary @release/workscreen_saver.zip https://uploads.github.com/repos/alexsanro/work_screensaver/releases/$id/assets?name=workscreen_saver.zip
curl -v -XPOST -H "Authorization:token $GITHUB_CREDENTIALS_PSW" -H "Content-Type:application/octet-stream" --data-binary @release/workscreen_saver_unpacked.zip https://uploads.github.com/repos/alexsanro/work_screensaver/releases/$id/assets?name=workscreen_saver_unpacked.zip
