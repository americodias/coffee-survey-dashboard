#!/bin/bash
rm -rf build
rm -rf node_modules/.cache

npm run build 
npm run deploy