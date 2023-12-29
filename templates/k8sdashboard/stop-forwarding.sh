#!/bin/bash

cd <%= deploymentFolderPath %>

ansible-playbook <%= filename %> -vv

if [ -f <%= pidfile %> ]; then
    echo "PID file found. Killing process $(cat <%= pidfile %>)"
    kill -9 $(cat <%= pidfile %>) || true
    rm <%= pidfile %> || true
else
    echo "PID file not found. Process may not have started correctly."
fi

echo "Stop Port forwarding completed."
