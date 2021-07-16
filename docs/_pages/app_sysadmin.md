---
layout: page
title: System administrator
parent: Roles
nav_order: 3
---

There are several ways to deploy the FusionAuth Role Manager.

- Local using the [docker image](https://hub.docker.com/r/molgenis/molgenis-auth)

Or for a specific application like the Armadillo
- On a kubernetes cluster using a [helm chart](https://github.com/molgenis/molgenis-ops-helm/tree/master/charts/molgenis-armadillo)
- On VM's using an [Ansible Galaxy collection](https://galaxy.ansible.com/molgenis/armadillo)

The FusionAuth Role Manager needs the following properties at deploy time. These are all environment variables and need to be treated as such during the deployment of the service.

#### FusionAuth Role Manager specific properties
- `SERVER_PORT=4000`
  > <sub><sup>The default server port is 4000</sup></sub>
- `BASE_URL=http://localhost:4000`
  > <sub><sup>The base url of the FusionAuth Role Manager</sup></sub>
- `REDIRECT_URI=http://localhost:4000/oauth-callback`
  > <sub><sup>This is the redirect url for the service. Within an actual deployment it will be something like this: `https://example.org/oauth-callback`</sup></sub>
- `APP_SESSION_SECRET=xxxxxxxxxxx`
  > <sub><sup>A random uuid to secure the deployment of the service</sup></sub>

#### FusionAuth specific properties
- `FUSION_API_TOKEN='xxxxxxxx'`
  > <sub><sup>Fusion API token is generated in the FusionAuth for this application</sup></sub>
- `ISSUER_BASE_URL=https://auth.molgenis.org/`
  > <sub><sup>Issuer base url is the baseurl of the FusionAuth tied to this application</sup></sub>
- `CLIENT_ID=xxxxxx-xxxxxxx-xxxxxxxx` and `CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxx`
  > <sub><sup>ClientID and ClientSecret are used to identify the application within the FusionAuth server</sup></sub>

