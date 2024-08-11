# Buildog

1. [Getting started](#getting-started)
   - [Install dependencies](#install-dependencies)
2. [Local development](#local-development)
   - [Fork the repo](#fork-the-repo)
   - [Clone the repo](#clone-the-repo)
   - [Running turborepo](#running-turborepo)
     - [Environment variables](#environment-variables)
     - [Shared components](#shared-components)
     - [Adding new component on @repo/ui](#adding-new-component-on-@repo/ui)
     - [Installing packages](#installing-packages)
3. [Create a pull request](#create-a-pull-request)

## Getting started

Thank you for your interest in Buildog and your willingness to contribute!

To get started, it’s helpful to understand what Buildog is and how it operates:

- **[What is buildog?](https://github.com/buildog-dev/buildog/wiki/What-is-Buildog):**
Buildog is a web-based application designed to help bloggers write, schedule, and publish their content efficiently. It aims to streamline the blogging process and provide valuable insights into content performance.

- **[How Buildog Works?](https://github.com/buildog-dev/buildog/wiki/How-Buildog-works%3F):**
This section provides a high-level overview of Buildog's functionality and user interface. It outlines the key features and components that you’ll interact with, offering insight into how the application supports your tasks and workflows. It’s a great starting point to understand how to navigate and utilize Buildog effectively.

### Install dependencies

You will need to install and configure the following dependencies on your machine to build Buildog:

- Git
- Node.js v18.x (LTS)
- pnpm version 8.x.x

## Local development

This repo uses [Turborepo](https://turbo.build/repo).

### Fork the repo

To contribute code to Buildog, you must fork the [Buildog](https://github.com/burasibizim/buildog) repo.

### Clone the repo

1. Clone your GitHub forked repo:

```sh
git clone https://github.com/<github_username>/buildog.git
```

2. Go to the Buildog directory:

```sh
cd buildog
```

### Install dependencies

1. Install the dependencies in the root of the repo.

```sh
pnpm install # install dependencies
```

2. After that you can run the apps simultaneously with the following.

```sh
pnpm dev
```

| Directory       | Description                   | Local development server |
| --------------- | ----------------------------- | ------------------------ |
| `/apps/buildog` | The main web application.     | http://localhost:3000    |
| `/apps/api`     | The main backend application. | http://localhost:3010    |

#### Environment variables

Auth0 - [How to setup Auth0](https://github.com/burasibizim/buildog/wiki/Auth0-Implementation)

#### Shared components

The monorepo has a set of shared components under /packages:

- `/packages/ui`: [shadcn/ui](https://ui.shadcn.com) components.
- `/packages/typescript-config`: Shared Typescript settings
- `/packages/eslint-config`: Shared eslint settings

#### Adding new component on @repo/ui

Use the pre-made script:

```sh
pnpm ui:add <shadcn/ui-component-name>
```

> This works just like the add command in the `shadcn/ui` CLI.

#### Installing packages

Installing a package with pnpm workspaces requires you to add the `--filter` flag to tell pnpm which workspace you want to install into. Do not install dependencies in their local folder, install them from the route using the --filter flag.

```sh
pnpm add <package> --filter <workspace>
pnpm uninstall <package> --filter <workspace>
```

For example:

- `pnpm add react --filter buildog` installs into ./apps/buildog

## Create a pull request

After making any changes, open a pull request.
Once your PR has been merged, you will be proudly listed as a contributor.
