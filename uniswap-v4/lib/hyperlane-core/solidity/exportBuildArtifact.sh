#!/bin/sh

# set script location as working directory
cd "$(dirname "$0")"

# Define the artifacts directory
artifactsDir="./artifacts/build-info"
# Define the output file
outputFile="./buildArtifact.json"

# log that we're in the script
echo 'Finding and processing hardhat build artifact...'

# Find most recently modified JSON build artifact
if [ "$(uname)" = "Darwin" ]; then
    # for local flow
    jsonFiles=$(find "$artifactsDir" -type f -name "*.json" -exec stat -f "%m %N" {} \; | sort -rn | head -n 1 | cut -d' ' -f2-)
else
    # for CI flow
    jsonFiles=$(find "$artifactsDir" -type f -name "*.json" -exec stat -c "%Y %n" {} \; | sort -rn | head -n 1 | cut -d' ' -f2-)
fi

if [ ! -f "$jsonFiles" ]; then
  echo 'Failed to find build artifact'
  exit 1
fi

# Extract required keys and write to outputFile
if jq -c '{input, solcLongVersion}' "$jsonFiles" > "$outputFile"; then
  echo 'Finished processing build artifact.'
else
  echo 'Failed to process build artifact with jq'
  exit 1
fi
