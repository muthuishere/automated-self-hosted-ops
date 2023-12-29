#!/bin/bash

# Change to the parent directory of the script


cd <%= deploymentFolderPath %>



ansible-playbook <%= filename %> -vv


ssh -L <%= localport %>:localhost:<%= remoteport %> <%= user_at_host %> -N &> ssh_forwarding.log &
echo $! > <%= pidfile %>
echo "SSH forwarding setup complete. PID: $(cat <%= pidfile %>)"
echo "You can now access the dashboard at https://localhost:<%= localport %>"