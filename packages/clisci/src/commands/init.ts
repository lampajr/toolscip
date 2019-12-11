import { Command, flags } from '@oclif/command';
import * as fs from 'fs-extra';
import { join } from 'path';

export default class Init extends Command {
  static folder = '.clisci';
  static description = 'Creates a new folder in the home directory';

  static flags = {
    help: flags.help({ char: 'h' }),
    global: flags.boolean({char: 'g', description: "Initialize the folder in the user's home directory."})
  };

  static args = [{ name: 'file' }];

  async run() {
    const { args, flags } = this.parse(Init);
    const dir = join((flags.global ? this.config.home : process.cwd()), Init.folder);
    fs.mkdir(dir);  // create a clisci's configuration folder
  }
}
