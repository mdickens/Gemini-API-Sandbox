#!/bin/bash -x 
#rm -rf ~/Downloads/*.mp3 ~/Downloads/index.html  ~/Downloads/tests ~/Downloads/script.js ~/Downloads/style.css ~/Downloads/script.js; cp -p -f -v -r *.html *.js *.mp3 *.json *.css tests ~/Downloads  # old
rm -rf ~/Downloads/chess
mkdir ~/Downloads/chess
cp -p -f -v -r tests modules *.css *.js *.html *.mp3 ~/Downloads/chess
