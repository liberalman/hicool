#!/usr/bin/env bash

CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o search

docker build -f Dockerfile -t liberalman/search .

# docker run -it -p 8080:8080 -v weibo_search:weibo_search liberalman/search:latest