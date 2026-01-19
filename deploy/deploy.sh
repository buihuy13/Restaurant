#!/bin/bash -e
#deploy.sh <version>

version=$1
tag=v$version

if [[ "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Deploying version $tag"
else
    echo "Invalid version format. Please use semantic versioning (e.g., 1.0.0)."
    exit 1
fi

echo "Checking out git tag: $tag"
git checkout $tag

github_username=buihuy13
registry=ghcr.io

cat ghcr.pem | docker login $registry -u $github_username --password-stdin

# Build and push Docker images
echo "Building images"
docker build -t $registry/$github_username/api-gateway:$version ../backend/api-gateway
docker build -t $registry/$github_username/user-service:$version ../backend/user-service
docker build -t $registry/$github_username/order-service:$version ../backend/order-service
docker build -t $registry/$github_username/chat-service:$version ../backend/chat-service
docker build -t $registry/$github_username/payment-service:$version ../backend/payment-service
docker build -t $registry/$github_username/notification-service:$version ../backend/notification-service
docker build -t $registry/$github_username/restaurant-service:$version ../backend/restaurant-service
docker build -t $registry/$github_username/service-discovery:$version ../backend/service-discovery
docker build -t $registry/$github_username/blog-service:$version ../backend/blog-service
docker build -t $registry/$github_username/frontend:$version ../frontend

echo "Pushing images to $registry"
docker push $registry/$github_username/api-gateway:$version
docker push $registry/$github_username/user-service:$version
docker push $registry/$github_username/order-service:$version
docker push $registry/$github_username/chat-service:$version
docker push $registry/$github_username/payment-service:$version
docker push $registry/$github_username/notification-service:$version
docker push $registry/$github_username/restaurant-service:$version
docker push $registry/$github_username/service-discovery:$version
docker push $registry/$github_username/frontend:$version
docker push $registry/$github_username/blog-service:$version

deploy_host=4.194.34.185
deploy_host_username=quochuy
deploy_host_private_key=key.pem

remote_dir=/home/$deploy_host_username/restaurant/$tag
echo "Creating remote directory $remote_dir on $deploy_host..."

# ssh vào remote vm và tạo thư mục
ssh -vv -i $deploy_host_private_key $deploy_host_username@$deploy_host mkdir -p $remote_dir

echo "Uploading config and docker-compose files"
scp -i $deploy_host_private_key \
    ../caddy/Caddyfile.prod \
    ./update-containers.sh \
    ../docker-compose.prod.yml \
    ../.env \
    $deploy_host_username@$deploy_host:$remote_dir/

echo "Executing upgrade script on remote host"
ssh -i $deploy_host_private_key $deploy_host_username@$deploy_host "export VERSION=$version GITHUB_USER=$github_username; cd $remote_dir && bash ./update-containers.sh"

echo "Deployment of version $tag completed successfully."