# Equos React integration example.
This is a sample react app integrating equos react sdk.

## Pre Requisistes

### NodeJs
You must have NodeJs installed on your machine to run this app.
To install node js, follow [the official documentation](https://nodejs.org/en), or for a quick setup:

```bash
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 22.18.0

# Verify the Node.js version:
node -v # Should print "v22.19.0".

# Verify npm version:
npm -v # Should print "10.9.3".
```

## Get Started

### 1. Clone & Install
```bash
git clone https://github.com/EquosAI/equos-examples.git

cd equos-examples/examples/equos-react-integration

npm install
```

### 2. SDK & Agent Configuration
- In `src/App.tsx`, set your CLIENT key:
```ts
  const equos = initEquosBrowser("");
```

⚠️ Use a **CLIENT PUBLIC** Key, not a secret api key. Newer versions of client keys start with `pk_`

- In `src/App.tsx`, replace the agent configuration:
```ts
  const agent = useRef({
    agentId: "", // Your agent id
    avatarId: "", // Your avatar id
    name: "", // Your avatar name
    thumbnailUrl: "", // Use url of avatar image (can be copied from equos studio).
  });
```

[What if I don't have a Client Key ?](https://docs.equos.ai)

### 3. Start the app
```bash
npm run dev

# Go to http://localhost:5173
```

## Authors
- [Loïc Combis](https://www.linkedin.com/in/lo%C3%AFc-combis-a211a813a/)
