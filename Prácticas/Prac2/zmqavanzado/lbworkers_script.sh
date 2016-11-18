#!/bin/bash

# USAGE: ./lbworkers_script.sh ENDPOINT WORKERS_NUM

number=1

while [ $number -le $2 ]; do
    node lbworker.js $1 "SERVER$number" "Ready" "DONE" false &
    number=$((number+1))
done