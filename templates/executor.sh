#!/bin/bash

# Function to convert exported variables from a file into JSON format
source_and_output_json() {
    local file=$1
    if [ -f "$file" ]; then
        echo "{"
        local first=true
        while IFS='=' read -r key value; do
            if [[ $key == export* ]]; then
                if [ "$first" = true ]; then
                    first=false
                else
                    echo ","
                fi
                key=$(echo $key | sed 's/export //')
                echo "\"$key\": \"$value\""
            fi
        done < <(grep 'export ' "$file")
        echo "}"
    fi
}

# Define the files to check
FILES_TO_CHECK=(
    "/etc/profile"
    "/etc/bash.bashrc"
    "/etc/environment"
    "$HOME/.bash_profile"
    "$HOME/.bash_login"
    "$HOME/.profile"
    "$HOME/.bashrc"
)

# Process each file and combine the outputs into a single JSON object
echo "{"
first_file=true
for file in "${FILES_TO_CHECK[@]}"; do
    if [ "$first_file" = true ]; then
        first_file=false
    else
        echo ","
    fi
    source_and_output_json "$file"
done
echo "}"
