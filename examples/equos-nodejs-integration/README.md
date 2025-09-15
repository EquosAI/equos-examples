# Equos NodeJS Integration
This is the right place to find NodeJS-powered examples to build with Equos.

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

cd equos-examples/equos-nodejs-integration

# This assumes you installed nodejs with the snippet above.
nvm use 

npm install
```


### 2. Environment
- Copy `.env.template` into `.env`.
- Replace key value for EQUOS_API_KEY.

[What if I don't have an API Key ?](https://docs.equos.ai)

### 3. Build

```bash
npm run build
```

### 4. Run Tools

```bash
# Create an agent.
node dist/create-agent.js

# Create an avatar.
node dist/create-avatar.js

# Run a session.
# Note: This requires setting EQUOS_AGENT_ID & EQUOS_AVATAR_ID in env variables.
node dist/run-session.js
```

Need an e2e integration example? [Check out NextJS integration example](../equos-nextjs-integration/README.md)