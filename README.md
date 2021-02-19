# Permission manager
Permission manager for Fusion Auth applications.

## Architrecture
There are 2 components in this repository. 

- An Apollo server
  This server communicates with a Fusion Auth server.
- An authentication user interface
  This allows you to add roles and users to a Fusion Auth application.

This is deployed via one docker which serves both services.

## Usage
We use lerna to link the packages together.

>We use `npx` to execute `lerna` locally.

- `npx lerna bootstrap`

### Client
Navigate to a the *client* directory: `package/client`

- `npm install`
- `npm run serve`

#### Build for production* 
You need to run this target as well when you want to use the package in the `server`.

- `npm run build`

### Client configuration
You need to check: [server configuration](#server-configuration)

### Server
Navigate to the *server* directory `packages/server`

Run in *production* mode (make sure you installed and published the )

- `npm run start`

Run in *dev* mode

- `npm run dev`

### Server configuration
There is a `.env.example` to configure the Apollo `server` with the right configuration. This file is used by the `client` as well.
Check the example file for documentation regarding the variables.