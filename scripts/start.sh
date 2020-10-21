#!/bin/bash

case "$(uname -s)" in
  Darwin)
    echo 'Mac OS X'
  ;;
  Linux)
    echo 'Linux'
  ;;
  *)
    echo 'Unsupported OS'
    exit 1
esac

case "$1" in
  monitor)
    export NODE_ENV=monitor
    node ../monitor.js
  ;;
  sistem)
    export NODE_ENV=sistem
    node ../sistema.js
  ;;
  web)
    export NODE_ENV=web
    node ../index.js
  ;;
  *)
    echo "Usage: {monitor|sistem|web}"
    exit 1
  ;;
esac