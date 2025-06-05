#!/usr/bin/env node

import { Command } from "commander";
import {
    listPresets,
    loadPreset,
    removePreset,
    savePreset,
    updatePreset,
} from "../lib/commands.js";

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\x1b[33m%s\x1b[0m', 'Operation cancelled by user.');
  process.exit(0);
});

// Display ASCII art logo
console.log("\x1b[32m%s\x1b[0m", `
██████╗ ██████╗ ███████╗███████╗███████╗████████╗
██╔══██╗██╔══██╗██╔════╝██╔════╝██╔════╝╚══██╔══╝
██████╔╝██████╔╝█████╗  ███████╗█████╗     ██║
██╔═══╝ ██╔══██╗██╔══╝  ╚════██║██╔══╝     ██║
██║     ██║  ██║███████╗███████║███████╗   ██║
╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝   ╚═╝
`);

const program = new Command("preset");

program
  .description("CLI tool to manage project presets")
  .version("1.0.0");

program
  .command("save")
  .description("Save current directory as a preset")
  .action(savePreset);

program
  .command("load [preset]")
  .description("Load a preset into a new project folder")
  .action(loadPreset);

program
  .command("update <preset>")
  .description("Update an existing preset from current directory")
  .action(updatePreset);

program
  .command("remove <preset>")
  .description("Remove a saved preset")
  .action(removePreset);

program
  .command("list")
  .description("List all saved presets")
  .action(listPresets);

program.parse(process.argv);
