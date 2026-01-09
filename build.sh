#!/usr/bin/env bash
set -o errexit
set -o nounset

echo "Enabling Corepack..."
corepack enable

echo "Activating Yarn 4.12.0..."
corepack prepare yarn@4.12.0 --activate

echo "Verifying Yarn version..."
yarn --version

echo "Installing dependencies..."
yarn install

echo "Building application..."
yarn build

echo "Build complete!"
