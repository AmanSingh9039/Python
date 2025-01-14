#!/bin/bash
sudo docker stop $(sudo docker ps -aq)
sudo docker ru $(sudo docker ps -aq)
sudo docker rmi $(sudo docker images -q)
sudo docker volume rm $(sudo docker volume ls -q)
sudo docker network rm $(sudo docker network ls -q)
