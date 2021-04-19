#!/usr/bin/env bash

set -e

echo "Compiling typescript to dist/"
npm run build

echo "Changing directories"
cd ../

echo "Tarring libace to libace.tar.gz"
tar czf libace.tar.gz libace/

echo "Moving libace.tar.gz to ~/gitclone/ace_client2/"
mv libace.tar.gz ~/gitclone/ace_client2/

echo "Changing to ace_client2 dir"
cd ~/gitclone/ace_client2/

echo "Removing old libace"
npm remove libace

echo "Install new libace"
npm install libace.tar.gz
