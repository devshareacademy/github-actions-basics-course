# Cron Example

A simple project that has a few integration tests that are built with:

* [PactumJS](https://pactumjs.github.io/)
* [CucumbreJS](https://github.com/cucumber/cucumber-js)

This project is written in [Node.js](https://nodejs.org/en/) and uses [Yarn](https://classic.yarnpkg.com/en/) as a package manager.

The project includes 1 simple integration test that runs a GET request to http://httpbin.org/status/418.

## Requirements

In order to run this project, you will need to have Node.js installed on the machine, and it is recommended that you use Yarn to install the project dependencies.

## Setup

To install the project dependencies, please run:

```bash
yarn install --frozen-lockfile
```

## Run Tests

Once the dependencies are installed, to run the tests please run:

```bash
yarn test
```
