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

```typescript
const templates = {
  greeting: 'Hello, {{name}}!',
  farewell: 'Goodbye, {{name}}!',
} as const

const t = strix(templates)

const helloWorld = t('greeting', { name: 'world' } as const) // 'Hello, world!'
```