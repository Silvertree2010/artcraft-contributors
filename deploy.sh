#!/bin/sh
set -e
rsync -a --delete --exclude data --exclude secrets --exclude .git ./ apollo:artcraft/
ssh apollo 'cd ~/artcraft && mkdir -p data secrets && chmod 700 secrets && docker compose up -d --build'
