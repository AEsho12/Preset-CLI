# Preset CLI

A powerful command-line tool that helps you save and deploy project templates instantly. Stop wasting time setting up the same project structure over and over again.

## Features

- 💾 **Instant Project Saving**: Save any project structure as a reusable preset
- ⚡ **Lightning Fast Deployment**: Deploy saved presets to any directory instantly
- 🔄 **Smart Updates**: Keep your presets current with the latest improvements
- 🛡️ **Safe Operations**: Built-in confirmation prompts and smart filtering
- 🎯 **Zero Configuration**: Works with any project type - React, Vue, Node.js, Python, etc.
- 📦 **Organized Management**: List, update, and remove presets with simple commands

## Installation

```bash
npm install -g preset-cli
```

## Quick Start

1. **Save a project as a preset**:
   ```bash
   cd your-project
   preset save my-template
   ```

2. **Load a preset into a new directory**:
   ```bash
   cd new-project
   preset load my-template
   ```

## Available Commands

- `preset save <name>` - Save current directory as a preset
- `preset load <name>` - Load a preset into current directory
- `preset list` - List all available presets
- `preset update <name>` - Update an existing preset
- `preset remove <name>` - Remove a preset

## Examples

### Saving a React Project
```bash
cd my-react-app
preset save react-template
```

### Loading a Preset
```bash
mkdir new-project
cd new-project
preset load react-template
```

### Updating a Preset
```bash
cd my-react-app
# Make changes to your project
preset update react-template
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [AEsho12](https://github.com/AEsho12)