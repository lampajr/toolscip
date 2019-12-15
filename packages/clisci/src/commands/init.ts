import { Command, flags } from '@oclif/command';
import * as fs from 'fs-extra';
import { join } from 'path';
import * as inquirer from 'inquirer';
import { redBright } from 'chalk';
import { textSync } from 'figlet';
import { Config } from '../utils';

export default class Init extends Command {
  static description = `Command used to initialize the 'clisci' configuration files, this command MUST be executed in the directory where the user wants to store the project.`;

  static flags = {
    help: flags.help({ char: 'h' }),
    server: flags.boolean({
      char: 's',
      description: "Initialize a simple 'express.js' server for receive asynchronous responses",
    }),
  };

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
        type: 'checkbox',
        name: 'formats',
        message: 'Which formats do you want to use?',
        choices: Config.supportedFormats,
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
        const clisciConfig = new Config(answers.owner, process.cwd(), answers.formats, answers.registry);
        const configDir: string = join(clisciConfig.dir, Config.configFolder);
        const descriptorsDir: string = join(configDir, Config.descriptorsFolder);

        this.createDirectory(configDir);
        for (const format of clisciConfig.formats) {
          this.createDirectory(join(descriptorsDir, format));
        }

        fs.writeJSON(join(clisciConfig.dir, Config.configFile), clisciConfig, {
          spaces: '\t',
        })
          .then(value => {
            console.log(`Configuration file '${Config.configFile}' successfully created!`);
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
