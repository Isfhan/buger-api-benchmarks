# Burger API Benchmarks

This project benchmarks different Node.js and Bun.js HTTP frameworks implementing a burger API. It compares the performance of Express.js, Elysia, and Burger API implementations.

## Quick Start

```bash
# Install all dependencies with one command
./install-all.sh
```

## Project Structure

```
buger-api-benchmarks/
├── my-express-app/       # Express.js implementation using Node
├── my-express-app-2/     # Second Express.js implementation using Bun
├── my-burger-api-app/    # Burger API implementation using Bun
├── my-elysia-app/        # Elysia implementation using Bun
├── benchmark.js          # Main benchmark script
├── install-all.sh        # One-click installation script
└── package.json          # Root package configuration
```

## Prerequisites

Before running the benchmarks, make sure you have the following installed:

- Node.js (for Express.js apps)
- Bun.js (for Burger API and Elysia apps)

## Installation

The project includes a convenient installation script that handles all dependencies:

```bash
./install-all.sh
```

This single script will automatically:

- Install root project dependencies
- Install Express.js app dependencies
- Install second Express.js app dependencies
- Install Burger API app dependencies
- Install Elysia app dependencies

No need to run npm install in each directory manually - the script handles everything!

## Running the Benchmarks

1. Start all the servers (in separate terminals):

```bash
# Terminal 1 - Express.js app
cd my-express-app
node express-server.js

# Terminal 2 - Express.js app 2
cd my-express-app-2
node express-server.js

# Terminal 3 - Burger API app
cd my-burger-api-app
bun index.ts

# Terminal 4 - Elysia app
cd my-elysia-app
bun src/index.ts
```

2. Run the benchmarks:

```bash
npm run benchmark
```

## Benchmark Configuration

The benchmark uses [autocannon](https://github.com/mcollina/autocannon) with the following settings:

- 100 concurrent connections
- 10 seconds duration
- Testing the `/api` endpoint on each server

## Server Ports

- Express.js app: http://localhost:1000
- Express.js app 2: http://localhost:2000
- Burger API app: http://localhost:3000
- Elysia app: http://localhost:4000

## Results

The benchmark results will show:

- Requests per second
- Latency statistics
- Throughput
- Error rates

Results are displayed in a table format for easy comparison between frameworks.

## System Requirements

The benchmark script automatically detects and reports:

- CPU model and cores
- Total system memory
- Operating system
- Node.js version
- Bun version
