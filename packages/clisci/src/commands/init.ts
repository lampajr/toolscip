import { Command, flags } from '@oclif/command';
import * as fs from 'fs-extra';
import { join } from 'path';
import * as inquirer from 'inquirer';
import { redBright } from 'chalk';
import { textSync } from 'figlet';
import { Config } from '../utils';

export default class Init extends Command {
  static folder = '.clisci';
  static descriptors = 'descriptors';
  static file = 'sciconfig.json';
  static supportedFormats = ['scdl'];
  static description = `Initialize the 'clisci' command line tool.`;

  static flags = {
    help: flags.help({ char: 'h' }),
    global: flags.boolean({ char: 'g', description: "Initialize the folder in the user's home directory." }),
  };

  static args = [{ name: 'file' }];

  /**
   * Prompts the initialization questions
   * TODO: check that folder is not empty
   */
  private async ask() {
    const checked = ['scdl'];

    return inquirer.prompt([
      {
        type: 'input',
        name: 'owner',
        message: `Who is the project's owner?`,
      },
      {
        type: 'input',
        name: 'dir',
        message: 'Where do you want to store the configuration files?',
        default: process.cwd(),
      },
      {
        type: 'checkbox',
        name: 'formats',
        message: 'Which formats do you want to use?',
        choices: Init.supportedFormats,
        default: checked,
      },
      {
        type: 'confirm',
        name: 'useRegistry',
        message: 'Do you want to associate to an online registry?',
        default: true,
      },
      {
        type: 'input',
        name: 'registry',
        message: "What is the registry's URL?",
        default: 'https://scdlregistry.herokuapp.com',
        when: answers => {
          return answers.useRegistry;
        },
      },
    ]);
  }

  /**
   * Create a directory at given path
   * @param path where the directory should be created
   */
  private createDirectory(path: string) {
    fs.mkdirp(path)
      .then(_ => {
        console.log(`Directory at '${path}' successfully created!`);
      })
      .catch(err => {
        console.error(err);
      });
  }

  async run() {
    const { args, flags } = this.parse(Init);

    // TODO: clear the console

    // print a nice banner
    console.log(redBright(textSync('clisci', { horizontalLayout: 'full' })));

    // ask questions
    this.ask()
      .then(answers => {
        const clisciConfig = new Config(answers.owner, answers.dir, answers.formats, answers.registry);
        const configDir: string = join(clisciConfig.dir, Init.folder);
        const descriptorsDir: string = join(configDir, Init.descriptors);

        this.createDirectory(configDir);
        for (const format of clisciConfig.formats) {
          this.createDirectory(join(descriptorsDir, format));
        }

        fs.writeJSON(join(clisciConfig.dir, Init.file), clisciConfig, {
          spaces: '\t',
        })
          .then(value => {
            console.log(`Configuration file '${Init.file}' successfully created!`);
          })
          .catch(err => {
            console.error(err);
          });
      })
      .catch(err => {
        console.error(err);
      });
  }
}
