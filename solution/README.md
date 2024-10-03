# GitHub Gist API Web Server

## Overview

This project implements a simple HTTP web server API that interacts with the GitHub API to retrieve and display publicly available gists for a given GitHub user. It also includes automated tests to ensure that the API functions correctly and is containerized using Docker.

## Features

- Responds to requests on `/<USER>` to fetch publicly available gists for a specified GitHub user.
- Automated test included to validate functionality using the example user `octocat`.
- Packaged into a Docker container, listening on port 8080.
- Supports Pagination

## Technologies Used

- **Programming Language:** Python with FastAPI
- **GitHub API**: [`GET /users/{username}/gists`](https://docs.github.com/en/rest/gists/gists?apiVersion=2022-11-28)
- **Docker:** To containerize the web server API.
- **Automated Testing Framework:** pytest

## Setup Instructions

### Prerequisites

- [Install Docker](https://docs.docker.com/get-docker/)
- [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

#### Optional (for running tests)

- Install pytest using pip:

   ```bash
   pip install pytest
   ```


### Running the Web Server

1. Clone the repository:

   ```bash
   git clone git@github.com:EqualExperts-Assignments/equal-experts-pleasant-considerate-gallant-ability-798c040df8be.git
   cd solution
   ```

2. Build the Docker container:

   ```bash
   docker build -t gists-api-server .
   ```

3. Run the Docker container::

   ```bash
   docker run -d -p 8080:8080 gists-api-server
   ```

4. Access the API in your browser or use a tool like curl to fetch gists for a specific GitHub user:

   ```
   http://localhost:8080/<USER>
   ```

   Example:

   ```bash
   curl http://localhost:8080/octocat
   ```

## Testing

The project includes automated tests to validate that the API works as expected. Run the tests using the following command:


```bash
solution> pytest .
```

## API Endpoints

GET `/<USER>` : Fetches a list of publicly available gists for the specified GitHub user

```bash
curl http://localhost:8080/octocat
```

### Customization Options

Pagination is implemented to fetch additional pages of gists by adding 
`
?page=<page_number>&per_page=<items_per_page>
`

- **`page=<page_number>`**: Specify the page number (e.g., `page=2`)
- **`per_page=<items_per_page>`**: Specify the number of gists per page (e.g., `per_page=5`)

#### Example:

To get the second page of gists for `octocat`, with 5 gists per page:

```bash
curl "http://localhost:8080/octocat?page=2&per_page=5"
```


