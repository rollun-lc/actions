# Get update service webhook in d2c by service name

This action gets update webhook by service name, and can add to webhook list of different actions.

## Inputs

| Input name  | Default value | Description|
| ------------- | ------------- | ------------- |
| `service-name`  | - | Name of service in d2c |
| `d2c-email` | - | Email of d2c account |
| `d2c-password` | - | Password of d2c account |
| `actions` | updateSources,updateLocalDeps,updateGlobalDeps,updateVersion | List of actions, in string separated by commas with no spaces.<br>Example: [restart,updateLocalDeps], that can be added to update webhook. <br> Available options: restart,updateSources,updateLocalDeps,updateGlobalDeps,updateVersion |

## Outputs

### `result`

Outputs update service webhook

## Example usage

```yml
      - uses: rollun-com/actions/update-d2c-service@master
        with:
          service-name: tr-parser
          email: test@email.com
          password: somepassowrd
          actions: restart,updateSources,updateLocalDeps,updateGlobalDeps,updateVersion
```