# Get update service webhook in d2c by service name

This action gets update webhook by service name, and can add to webhook list of different actions.

## Inputs

| Input name         | Description                                                                                                                                                                                                                                                                                                               |
|--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `service-name`     | Name of service in d2c                                                                                                                                                                                                                                                                                                    |
| `config-path`      | Path to config file. includes same data that is required to create/update d2c service                                                                                                                                                                                                                                     |
| `d2c-email`        | Email of d2c account                                                                                                                                                                                                                                                                                                      |
| `d2c-password`     | Password of d2c account                                                                                                                                                                                                                                                                                                   |
| `d2c-base-api-url` | Default value is https://api.rollun.net. Base path of d2c api                                                                                                                                                                                                                                                             |
| `sm-user`          | Username of secrets manager account                                                                                                                                                                                                                                                                                       |
| `sm-password`      | Password of secrets manager account                                                                                                                                                                                                                                                                                       |
| `sm-url`           | Default value is https://rollun.net/api/datastore/Secrets. Base path of secrets manager api                                                                                                                                                                                                                               |
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
          sm-user: ${{ secrets.SM_USER }}
          sm-password: ${{ secrets.SM_PASSWORD }}
```


Example docker service definition config:
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
  env:
    - name: NODE_ENV
      value: production
    - name: PORT
      value: '80'
    # note that values support env variables
    - name: MONGO_URI
      value: mongodb://${MONGO_USER}:${MONGO_PASS}@mongo:27017
    # this syntax will take value by key from secrets datastore - https://rollun.net/api/datastore/Secrets
    - name: SOME_SECRET_VALUE
      value: sm://SOME_SECRET_VALUE
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

Example nginx service definition config:
```yaml
# only for initial service creation, ignored on updates
initial-service-host: hetzner-staging
d2c-service-config:
  type: nginx
  version: '1.19'
  remoteAccess: false
  # optional link to php fastcgi service
  services:
    - name: rollun-crm-php
      # Supported types:
      # - fastcgi
      # - custom - if type = custom, 'file' property is required
      type: fastcgi
      appRoot: /var/www/app/public_a

  # change to the name will result in new service created
  name: test-nginx
  description: new description
  project: 'Test'
  ports:
    - value: 80
      protocol: TCP
```
