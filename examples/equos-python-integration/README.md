# Equos Python Integration
This is the right place to find python-powered examples to build with Equos.

## Pre Requisistes

### Python
You must have Python 3.11+ installed on your machine to run this app.
To install python, follow [the official documentation](https://www.python.org/downloads/).

### Install pipx

- Macos:
```bash
brew install pipx
pipx ensurepath
```

- Ubuntu:
```bash
sudo apt update
sudo apt install pipx
pipx ensurepath
```

### Poetry
Dependencies are managed by poetry.


```bash

pipx install poetry
```


## Get Started

### 1. Clone & Install
```bash
git clone https://github.com/EquosAI/equos-examples.git

cd equos-examples/equos-python-integration

poetry install
```


### 2. Environment
- Copy `.env.template` into `.env`.
- Replace key value for EQUOS_API_KEY.

[What if I don't have an API Key ?](https://docs.equos.ai)

