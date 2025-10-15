# Equos Vanilla Integration
This is the right place to see how one can integrate equos components in vanilla js apps.

![Equos Vanilla Integration Preview](./public/preview.png)

|
 Note, this should also help for frontend frameworks such as Angular, Vuejs... For react users, see our [react sample app](../equos-react-integration/README.md)
|

## Pre requisites
Make sure you have `nodejs`, `npm` & `npx` installed.

## Installation

### 1. Clone & Install
```bash
git clone https://github.com/EquosAI/equos-examples.git

cd equos-examples/examples/equos-vanilla-integration

npm install
```

### 2. Set Env
- Create a `env.ts` file in the app root folder (next to `index.html`)
- Add public key and trigger configuration:

```ts
export const PUBLIC_KEY = "your equos public key"; // Make sure to use a public/client key, not an API/secret/private key.

export const AGENT = {
  agentId: "your equos agent id",
  avatarId: "your equos avatar id",
  name: "",
  thumbnailUrl:
    "your avatar image url", // Use thumbnail url in the dashboard.
};
```

### 3. Run the app

`npx vite dev`


Then go to [http://localhost:5173](http://localhost:5173).