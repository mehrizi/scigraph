#!/bin/bash

# Check if there are arguments
if [ $# -eq 0 ]; then
  echo "Usage: ./dock.sh [npm command]"
  echo "Example: ./dock.sh install"
  exit 1
fi

# Check if the first argument is 'shell'
if [ "$1" = "shell" ]; then
  # Open a shell into the container
  docker compose exec app sh
fi

# Run npm command in the container
docker compose exec app "$@"

