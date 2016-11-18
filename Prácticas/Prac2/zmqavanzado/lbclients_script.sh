#!/bin/bash

# USAGE: ./lbclients_script.sh ENDPOINT CLIENTS_NUM

number=1

while [ $number -le $2 ]; do
    node lbclient.js $1 "CLIENT$number" "WORK" &
    number=$((number+1))
done