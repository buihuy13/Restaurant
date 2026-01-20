#!/bin/bash -e

VERSION=${VERSION:-latest}
GITHUB_USER=${GITHUB_USER:-buihuy13}
REGISTRY="ghcr.io"

DOCKER_COMPOSE_CMD="docker compose -f docker-compose.prod.yml"

echo "Logging in to pull images from $REGISTRY"
if [ -f ~/ghcr.pem ]; then
    cat ~/ghcr.pem | docker login $REGISTRY -u $GITHUB_USER --password-stdin
else
    echo "Error: ~/ghcr.pem not found"
    exit 1
fi

echo "Pulling images version $VERSION..."
$DOCKER_COMPOSE_CMD pull

echo "Starting containers in detached mode..."
$DOCKER_COMPOSE_CMD up -d

echo "Checking container status..."
#Investigate cải thiện thêm
sleep 300

EXITED=$(docker compose -f docker-compose.prod.yml ps | grep Exit | wc -l)
if [ "$EXITED" -gt 0 ]; then
    echo "Some containers failed to start"
    $DOCKER_COMPOSE_CMD ps
    exit 1
else
    echo "All containers are running successfully"
    $DOCKER_COMPOSE_CMD ps
fi

echo "Clean up unused images"
docker image prune -f
docker logout $REGISTRY

echo "Update completed successfully."