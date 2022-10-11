# This action used to deploy a service to D2C

## Example

```yaml

- name: Deploy
  uses: rollun-com/actions/composite/deploy@master
  env:
    IMAGE: ghcr.io/$GITHUB_REPOSITORY/$(basename $PWD)/prod
    SERVICE_NAME: test-service
  with:
    docker-user: ${{ secrets.DOCKER_USER }}
    docker-password: ${{ secrets.DOCKER_PASS }}
    image: ${{ env.IMAGE }}
    service-name: ${{ env.SERVICE_NAME }}
    d2c-username: ${{ secrets.D2C_USER }}
    d2c-password: ${{ secrets.D2C_PASSWORD }}
    dockerfile-path: ./Dockerfile
```
