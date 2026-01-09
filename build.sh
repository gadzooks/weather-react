#!/bin/bash
set -e

echo "Enabling Corepack for Yarn 4.12.0..."
corepack enable

echo "Installing dependencies..."
yarn install

echo "Building application..."
yarn build

echo "Build complete!"
