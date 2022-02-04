#!/bin/sh
##########################################
# commands to run simultaneously
cmmmnd1="tsc -b -w v13"
cmmmnd2="nodemon --watch build -e js"
##########################################


echo -e "running : \033[0;32m\n$cmmmnd1\n$cmmmnd2\033[0m"
sleep .6s

$cmmmnd1 & pid1=$!
$cmmmnd2 & pid2=$!

trap "kill $pid1 $pid2" INT
echo "Press Ctrl-C to stop!"
echo
wait $pid1 $pid2
echo " : exit"
