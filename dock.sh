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
  docker compose exec --user node app sh
  exit 0
fi

# Run npm command in the container
docker compose exec --user node app "$@"

# Get the current host user UID and GID
# HOST_UID=$(id -u)
# HOST_GID=$(id -g)



# Fix ownership of newly created files
# echo "Fixing file ownership..."
# sudo chown -R $HOST_UID:$HOST_GID ./models/seeds
