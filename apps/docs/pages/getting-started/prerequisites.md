# Prerequisites

### Overview

This documentation guide provides instructions for installing the proper prerequisites to run Buildog on your local environment. 

### Programming Languages Setup

- Go (version 1.20 or later)
- JavaScript (ES6+)

#### Go Setup
1. Download Go from the [official website](https://golang.org/dl/)
2. Follow the installation instructions for your operating system
3. Verify installation:

   ```bash
   go version
   ```

### Packages

- Node.js (version 18 LTS or later)
- pnpm (version 8.x.x)

#### Node.js and pnpm Setup
1. Install Node.js:
   - Download from [Node.js website](https://nodejs.org/)
   - Choose the LTS version (18.x or later)
2. Install pnpm globally:

   ```bash
   npm install -g pnpm@8.15.4
   ```
3. Verify installations:

   ```bash
   node --version
   pnpm --version
   ```

### Tools

- PostgreSQL (version 15 or later)

#### PostgreSQL Setup
1. Download PostgreSQL from the [official website](https://www.postgresql.org/download/)
2. Follow the installation wizard for your operating system
3. Remember to note down your superuser password during installation
4. Verify installation:

   ```bash
   psql --version
   ```