# unhype

A CLI tool for Unhype lessons

## Usage

Run the command

```bash
npx unhype
```

will

- Ask you to create a folder for your project (default: "unhype")
- Save a session ID in `.unhype.json` to save your progress

### Subsequent usage

Running `npx unhype` opens up the unhype.dev browser tab from where you left off.

## Development

```bash
# Install dependencies
bun install

# Build
bun run build

# Test locally
bun run index.js
```

## License

MIT
