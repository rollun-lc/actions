# Refresh npm module in node-red

This action refreshes npm module in [node-red](https://flows.nodered.org/add/node);

## Inputs

| Input name     | Description             |
|----------------|-------------------------|
| `name`         | Name of npm module      |
| `node-red-url` | Url of node red website |

## Example usage

```yml
      - uses: rollun-com/actions/refresh-node-red-module@master
        with:
          name: node-red-contrib-rollun-delovod
```
