#!/bin/bash

pkill -f pm2

npm install pm2@0.9.6 --save
./node_modules/pm2/bin/pm2 start test/child.js -i max

npm install pm2@0.10.6 --save
./node_modules/pm2/bin/pm2 list

cd ../pm2 ; npm install

cd -

echo "############################## PHASE 2 ### Upgrade 0.9.x to 0.11.x"
#
#
#

pkill -f pm2

npm install pm2@0.9.6 --save
./node_modules/pm2/bin/pm2 start test/child.js -i max

npm install pm2@0.10.6 --save
./node_modules/pm2/bin/pm2 list

cd ../pm2 ; npm install
