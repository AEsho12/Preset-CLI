import chalk from "chalk";
import fs from "fs-extra";
import inquirer from "inquirer";
import os from "os";
import path from "path";

const PRESETS_DIR = path.join(os.homedir(), ".project-cli", "presets");

function getPresetPath(name) {
  return path.join(PRESETS_DIR, name);
}

// Handle quit functionality
function handleQuit(input) {
  if (input.toLowerCase() === 'q' || input.toLowerCase() === 'quit') {
    console.log(chalk.yellow('\nOperation cancelled.'));
    process.exit(0);
  }
  return true;
}

export async function savePreset() {
  try {
    const { name } = await inquirer.prompt([
      {
        name: "name",
        message: "Enter a name for this preset (or 'q' to quit):",
        validate: (input) => {
          if (!input) return 'Name is required';
          handleQuit(input);
          return true;
        }
      },
    ]);

    const target = getPresetPath(name);

    if (fs.existsSync(target)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message: `Preset "${name}" already exists. Overwrite? (y/n, or 'q' to quit)`,
          default: false,
          validate: (input) => {
            if (typeof input === 'string') handleQuit(input);
            return true;
          }
        },
      ]);
      if (!overwrite) {
        console.log(chalk.yellow('Operation cancelled.'));
        return;
      }
      fs.removeSync(target);
    }

    fs.ensureDirSync(PRESETS_DIR);
    fs.copySync(process.cwd(), target, {
      filter: (src) => !src.includes("node_modules"),
    });

    console.log(chalk.green(`✅ Preset "${name}" saved successfully.`));
  } catch (error) {
    if (error.message === 'User force quit') {
      console.log(chalk.yellow('\nOperation cancelled.'));
      return;
    }
    console.error(chalk.red(`❌ Error: ${error.message}`));
  }
}

export async function loadPreset(presetName) {
  try {
    if (!presetName) {
      if (!fs.existsSync(PRESETS_DIR)) {
        console.log(chalk.red("❌ No presets found."));
        return;
      }

      const presets = fs.readdirSync(PRESETS_DIR);

      if (presets.length === 0) {
        console.log(chalk.red("❌ No presets saved yet."));
        return;
      }

      const { selectedPreset } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedPreset",
          message: "Select a preset to load (or 'q' to quit):",
          choices: [...presets, new inquirer.Separator(), 'Quit'],
          validate: (input) => {
            if (input === 'Quit') {
              console.log(chalk.yellow('\nOperation cancelled.'));
              process.exit(0);
            }
            return true;
          }
        },
      ]);

      presetName = selectedPreset;
    }

    const source = getPresetPath(presetName);

    if (!fs.existsSync(source)) {
      console.log(chalk.red(`❌ Preset "${presetName}" not found.`));
      return;
    }

    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: `Load preset "${presetName}" into current directory? This may overwrite existing files. (y/n, or 'q' to quit)`,
        default: false,
        validate: (input) => {
          if (typeof input === 'string') handleQuit(input);
          return true;
        }
      },
    ]);

    if (!confirm) {
      console.log(chalk.yellow('Operation cancelled.'));
      return;
    }

    fs.copySync(source, process.cwd(), {
      overwrite: true,
      errorOnExist: false,
      filter: (src) => !src.includes("node_modules"),
    });

    console.log(chalk.green(`✅ Preset "${presetName}" loaded into current directory.`));
  } catch (error) {
    if (error.message === 'User force quit') {
      console.log(chalk.yellow('\nOperation cancelled.'));
      return;
    }
    console.error(chalk.red(`❌ Error: ${error.message}`));
  }
}

export async function updatePreset(presetName) {
  try {
    const target = getPresetPath(presetName);

    if (!fs.existsSync(target)) {
      console.log(chalk.red(`❌ Preset "${presetName}" does not exist.`));
      return;
    }

    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: `Update preset "${presetName}" with current directory? (y/n, or 'q' to quit)`,
        default: false,
        validate: (input) => {
          if (typeof input === 'string') handleQuit(input);
          return true;
        }
      },
    ]);

    if (!confirm) {
      console.log(chalk.yellow('Operation cancelled.'));
      return;
    }

    fs.removeSync(target);
    fs.copySync(process.cwd(), target, {
      filter: (src) => !src.includes("node_modules"),
    });

    console.log(chalk.yellow(`🔁 Preset "${presetName}" updated successfully.`));
  } catch (error) {
    if (error.message === 'User force quit') {
      console.log(chalk.yellow('\nOperation cancelled.'));
      return;
    }
    console.error(chalk.red(`❌ Error: ${error.message}`));
  }
}

export async function removePreset(presetName) {
  try {
    const target = getPresetPath(presetName);

    if (!fs.existsSync(target)) {
      console.log(chalk.red(`❌ Preset "${presetName}" does not exist.`));
      return;
    }

    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: `Are you sure you want to remove preset "${presetName}"? (y/n, or 'q' to quit)`,
        default: false,
        validate: (input) => {
          if (typeof input === 'string') handleQuit(input);
          return true;
        }
      },
    ]);

    if (!confirm) {
      console.log(chalk.yellow('Operation cancelled.'));
      return;
    }

    fs.removeSync(target);
    console.log(chalk.red(`🗑️ Preset "${presetName}" has been removed.`));
  } catch (error) {
    if (error.message === 'User force quit') {
      console.log(chalk.yellow('\nOperation cancelled.'));
      return;
    }
    console.error(chalk.red(`❌ Error: ${error.message}`));
  }
}

export async function listPresets() {
  try {
    if (!fs.existsSync(PRESETS_DIR)) {
      console.log(chalk.gray("No presets found."));
      return;
    }

    const presets = fs.readdirSync(PRESETS_DIR);
    if (presets.length === 0) {
      console.log(chalk.gray("No presets saved yet."));
      return;
    }

    console.log(chalk.cyan("📦 Saved Presets:"));
    presets.forEach((p) => console.log(`- ${p}`));
  } catch (error) {
    console.error(chalk.red(`❌ Error: ${error.message}`));
  }
}
