#!/bin/bash

echo "Installing root dependencies..."
npm install

echo -e "\nInstalling Express.js app dependencies..."
cd my-express-app
npm install
cd ..

echo -e "\nInstalling Express.js app 2 dependencies..."
cd my-express-app-2
npm install
cd ..

echo -e "\nInstalling Burger API app dependencies..."
cd my-burger-api-app
bun install
cd ..

echo -e "\nInstalling Elysia app dependencies..."
cd my-elysia-app
bun install
cd ..

echo -e "\nAll installations completed!" 