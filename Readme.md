# Node.js and TypeScript Starter Kit

This is a starter kit for building Node.js applications with TypeScript. It includes configuration files and scripts for linting, formatting, and running your application using `nodemon`.

## Getting Started

To use this starter kit, follow these steps:

1. Clone the repository:
```bash
https://github.com/Bensigo/axiom-nodejs-typescript-starter
```

2. Install dependencies:
```bash
  yarn
```
3. Start the development server:
```bash
  yarn dev
```

This will start the application using `nodemon`, which will automatically restart the server when you make changes to the code.

4. Run the linter:
```bash
  yarn lint
```


This will run the linter and display any errors or warnings in your code.

5. Format your code:
```bash
  yarn format
```

This will format your code using Prettier.


This will run `lint-staged` to ensure that your code is properly formatted and passes the linter before committing.

## Configuration

This starter kit includes the following configuration files:

- `package.json`: This file contains the project metadata and dependencies. It includes scripts for running the development server, running the linter and formatter, and running the `precommit` hook.
- `tsconfig.json`: This file contains TypeScript configuration options.
- `.eslintrc.json`: This file contains ESLint configuration options.
- `.prettierrc.json`: This file contains Prettier configuration options.
- `.env`: This file is used to store environment variables.

## Contributing

Contributions are welcome! If you find any bugs or issues with this starter kit, please open an issue on GitHub.

## License

This starter kit is licensed under the MIT License. See the `LICENSE` file for more information.









