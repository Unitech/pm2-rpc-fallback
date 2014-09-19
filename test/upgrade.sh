#!/bin/bash

pkill -f pm2

npm install pm2@0.9.6
./node_modules/pm2/bin/pm2 start test/child.js -i max

npm install pm2@0.10.6
./node_modules/pm2/bin/pm2 list

npm install pm2@rc


cd -

echo "############################## PHASE 2 ### Upgrade 0.9.x to 0.11.x"
#
#
#

pkill -f pm2

npm install pm2@0.9.6
./node_modules/pm2/bin/pm2 start test/child.js -i max

npm install pm2@0.10.6

npm install pm2@rc

echo "############################## PHASE 3 ### Upgrade 0.11.x to 0.11.x"
#
#
#

pkill -f pm2

npm install pm2@rc

./node_modules/pm2/bin/pm2 start test/child.js -i max

npm install pm2@rc
