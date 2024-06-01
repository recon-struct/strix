A TypeScript string interpolation library that allows inspecting strings pre-compilation

[![Run tests](https://github.com/recon-struct/strix/actions/workflows/run-tests.js.yml/badge.svg)](https://github.com/recon-struct/strix/actions/workflows/run-tests.js.yml)

![recon-struct logo](https://avatars.githubusercontent.com/u/168223311?s=300)

# 𝔯𝔢𝔠𝔬𝔫-𝔰𝔱𝔯𝔲𝔠𝔱 / strix

This library enables string interpolation in TypeScript, allowing you to inspect
strings before they are compiled. This is useful for debugging, logging, and
code completion through tools like Github Copilot.

## Links

- [Documentation](https://recon-struct.github.io/strix/)

### Blog Series

- [Strix Announcement](https://blog.hox.io/articles/2024-05-20)

## Installation

```shell
npm i @recon-struct/strix
```

## Usage

The `strix` library takes a deeply nested object of string templates and returns
a function that can be used to interpolate strings. The function takes a key
corresponding to a template and an object of values to interpolate.

### Templates

String templates are defined as a deeply nested object. The keys are used to
access the templates, and the values are the templates themselves. The templates
can contain placeholders in the form of `{{key}}`, where `key` is a variable to
be interpolated.

```typescript
const templates = {
  greeting: 'Hello, {{name}}!',
  farewell: 'Goodbye, {{name}}!',
} as const
```

### Strix function

The `strix` function returns a function that takes a key and an optional object
of values. It is strongly typed to ensure that the key is a valid key in the
templates object and that the variables object contains all the required keys.

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

### Usage of const

The `as const` assertion is used to ensure that the object of templates and
variables is treated as a readonly object. This enables the string interpolation
function to provide better type checking and code completion.

You can see in this example that you can achieve better type checking through
the use of `as const`.

```typescript
// With `as const`
const hello1 = t('greeting', { name: 'world' } as const) // 'Hello, world!'

// Without `as const`
const hello2 = t('greeting', { name: 'world' }) // 'Hello, ${string}!'
```
