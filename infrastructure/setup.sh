#!/bin/bash

# install docker
yum update -y
yum install docker -y
systemctl start docker
usermod -a -G docker $(whoami)
newgrp docker 

# install docker compose
DOCKER_CONFIG=/usr/local/lib/docker VERSION="2.29.1"
mkdir -p $DOCKER_CONFIG/cli-plugins
curl -SL \
"https://github.com/docker/compose/releases/download/v$VERSION/docker-compose-$(uname -s)-$(uname -m)" \
-o $DOCKER_CONFIG/cli-plugins/docker-compose
chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose

# install Taskfile
sh -c "$(curl -L https://taskfile.dev/install.sh)" -- -d
mv ./bin/task /usr/local/bin/task
chmod +x /usr/local/bin/task

# install migrate
VERSION="4.17.1" OS=$(uname -s) ARCH=$(uname -m)
if [ "$ARCH" == "x86_64" ]
then
  ARCH="386"
elif [ "$ARCH" == "aarch64" ]
then
  ARCH="arm64"
fi
mkdir ~/TMP_DIR
cd ~/TMP_DIR
curl -L \
"https://github.com/golang-migrate/migrate/releases/download/v$VERSION/migrate.$OS-$ARCH.tar.gz" \
| tar xvz
chmod +x migrate
mv migrate /usr/local/bin/migrate
cd ..
rm -rf TMP_DIR