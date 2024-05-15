A TypeScript string interpolation library that allows inspecting strings pre-compilation

[![Run tests](https://github.com/recon-struct/strix/actions/workflows/run-tests.js.yml/badge.svg)](https://github.com/recon-struct/strix/actions/workflows/run-tests.js.yml)

![recon-struct logo](https://avatars.githubusercontent.com/u/168223311?s=300)

# 𝔯𝔢𝔠𝔬𝔫-𝔰𝔱𝔯𝔲𝔠𝔱 / strix

This library enables string interpolation in TypeScript, allowing you to inspect
strings before they are compiled. This is useful for debugging, logging, and
code completion through tools like Github Copilot.

## Installation

```shell
npm i -D @recon-struct/utility-types
npm i @recon-struct/strix
```

## Usage

The `strix` library takes a deeply nested object of string templates and returns
a function that can be used to interpolate strings. The function takes a key
corresponding to a template and an object of values to interpolate.

Using the `as const` assertion is recommended to ensure that the object of
templates and variables is treated as a readonly object. This enables the string
interpolation function to provide better type checking and code completion.

Tools like Github Copilot can use the literal string returned by the
interpolation function to provide better code completion.

```typescript
const templates = {
  greeting: 'Hello, {{name}}!',
  farewell: 'Goodbye, {{name}}!',
} as const

const t = strix(templates)

const helloWorld = t('greeting', { name: 'world' } as const) // 'Hello, world!'
```

## Debugging

If you are using pnpm or any other package manager that hoists dependencies, or
if you are using symlinked packages, you may need to add the following to your
`tsconfig.json`:

```json
{
  "compilerOptions": {
    "preserveSymlinks": true
  }
}
```

Due to the way that TypeScript resolves modules, the `strix` library may not be
able to find the templates if they are in a different package or if the package
is symlinked. Setting `preserveSymlinks` to `true` will ensure that the
templates and types are found.