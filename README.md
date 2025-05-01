# Burger API Benchmarks

This project benchmarks various HTTP frameworks built with Node.js and Bun.js. It compares the performance of following frameworks:
Express.js, Elysia, Hono and BurgerAPI.

### Available Stages

- benchmark-stage-1
- benchmark-stage-2

## Prerequisites

Before running the benchmarks, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (required for Express.js apps)
- [Bun.js](https://bun.sh/) (required for Burger API and Elysia apps)

## Quick Start

Clone the repository and install the required dependencies:

```bash
# Clone the repository
git clone https://github.com/Isfhan/burger-api-benchmarks.git
cd burger-api-benchmarks

# Navigate to the Stage 1 benchmark directory and install dependencies
cd benchmark-stage-1
./install-all.sh
```

```bash
# Navigate to the Stage 2 benchmark directory and install dependencies
cd benchmark-stage-2
./install-all.sh
```

## Running the Benchmarks

To run the benchmarks, navigate to the benchmark directory and run the following command:

```bash
# Navigate to the Stage 1 benchmark directory and run the benchmarks
cd benchmark-stage-1
bun run benchmark.js
```

```bash
# Navigate to the Stage 2 benchmark directory and run the benchmarks
cd benchmark-stage-2
bun run benchmark.js
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Contact

For any questions or feedback, please contact me at [Isfhan](mailto:isfhan@gmail.com).
