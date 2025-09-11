# Equos NestJS integration example.
This is a nextjs equos integration example app.

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

cd equos-examples/equos-nextjs-integration

# This assumes you installed nodejs with the snippet above.
nvm use 

npm install
```

### 2. Environment
- Copy `.env.template` into `.env`.
- Replace key value for EQUOS_API_KEY.

[What if I don't have an API Key ?](https://docs.equos.ai)

### 3. Start the app
```bash
npm run dev

# Go to http://localhost:3000
```

## Authors
- [Loïc Combis](https://www.linkedin.com/in/lo%C3%AFc-combis-a211a813a/)
