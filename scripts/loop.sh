#!/bin/bash
while true;
do
  echo "running daily_exp_snapshots.js"
  node daily_exp_snapshots.js
  echo "running daily_exp_snapshots_manual.js"
  node daily_exp_snapshots_manual.js
  echo "successfully ran both scripts. If there were any errors, you'd see them in this console right now."
  echo "sleeping for 12 hours now"
  sleep 86400 ;
done
