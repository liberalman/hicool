#!/bin/sh

docker-compose stop nginx

expect << __EOF
#spawn cp nginx.conf /root/data/nginx/conf.d/
#expect "cp"
#send "y\r"

spawn /usr/bin/docker-compose rm nginx
expect {
    "Are you sure?" { send "y\r" }
}
__EOF

docker-compose create nginx
docker-compose start nginx
docker-compose ps
