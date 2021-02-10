Todoist Activity Fetcher
===

A handy script or docker container for fetching all of your todoist activity history.
**Note**: Activity log functionality is only available to Todoist Premium users.

## Environment Variables
```sh
TOKEN=12345678abcdef012345 # Todoist Token (Required)
OBJECT_EVENT_TYPES=["item:completed"] # Filter activities by type (Default [])
EMPTY_PAGE_LIMIT=3 # How many empty pages before stopping (Default 3)
OUTPUT_DEST=./output.json # Destination file (Default: ./output.json)
SINCE=2020-01-01 # Only fetch data since this date (Default: null)
```

**Note**: You can set these values in an `.env` file in the app directory

## Docker Compose

```yml
version: '3.4'
services:
  todoist-activity:
    build: .
    container_name: todoist-activity
    environment:
      - TOKEN=12345678abcdef012345
    volumes:
      - ./todoist-activities.json:/usr/src/app/output.json
```