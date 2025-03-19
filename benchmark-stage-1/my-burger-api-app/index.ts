import { Burger } from "burger-api";

const burger = new Burger({
  title: "My Custom API",
  description: "Custom API with auto-generated docs and validation",
  apiDir: "api",
  version: "1.0.0",
  debug: true, // Enable debug mode for detailed logging and stack trace page
});

const port = 5000;

// Start the server on port 4000 with a callback
burger.serve(port, () => {
  console.log(`Server is running on port ${port}`);
});
