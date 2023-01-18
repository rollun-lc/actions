# Get update service webhook in d2c by service name

This action gets update webhook by service name, and can add to webhook list of different actions.

## Inputs

| Input name         | Description                                                                                                                                                                                                                                                                                                               |
|--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `service-name`     | Name of service in d2c                                                                                                                                                                                                                                                                                                    |
| `config-path` | Path to config file. includes same data that is required to create/update d2c service |
| `d2c-email`        | Email of d2c account                                                                                                                                                                                                                                                                                                      |
| `d2c-password`     | Password of d2c account                                                                                                                                                                                                                                                                                                   |
| `d2c-base-api-url` | Default value is https://api.rollun.net. Base path of d2c api                                                                                                                                                                                                                                                                                   |
| `actions`          | Default value is updateSources,updateLocalDeps,updateGlobalDeps,updateVersion.<br>List of actions, in string separated by commas with no spaces.<br>Example: [restart,updateLocalDeps], that can be added to update webhook. <br> Available options: restart,updateSources,updateLocalDeps,updateGlobalDeps,updateVersion |

## Example usage

Basic usage with just serviceName.
```yml
      - uses: rollun-com/actions/update-d2c-service@master
        with:
          service-name: tr-parser
          d2c-email: ${{ secrets.D2C_USER }}
          d2c-password: ${{ secrets.D2C_PASSWORD }}
```

Advanced usage with configPath

```yml
      - uses: rollun-com/actions/update-d2c-service@master
        with:
          config-path: ./d2c-service.yaml
          d2c-email: ${{ secrets.D2C_USER }}
          d2c-password: ${{ secrets.D2C_PASSWORD }}
```


Example if config:
```yaml
# only for initial service creation, ignored on updates
initial-service-host: hetzner-staging
d2c-service-config:
  type: docker
  image: ghcr.io/rollun-com/node-services/node-services/image
  version: latest
  # change to the name will result in new service created
  name: new-service
  description: new description
  project: 'Infra'
  ports:
    - value: 80
      protocol: TCP
  crons:
    - active: true
      name: 'test-cron-1'
      command: 'curl https://google.com'
      time: '* * * * *'
    - active: false
      name: 'test-cron'
      command: 'curl https://google.com'
      time: '* * * * *'

```