import fs from 'fs-extra';
import { join } from 'path';
import Init from './commands/init';
import { CLIError } from '@oclif/errors';

/**
 * Represent the configuration file
 */
export class Config {
  /** Owner of the project */
  owner: string;
  /** Main directory, where config files are stored */
  dir: string;
  /** Supported smart Contracts descriptor's formats */
  formats: string[];
  /** Online registry URL [optional] */
  registry?: string;

  constructor(owner: string, dir: string, formats: string[], registry?: string) {
    this.owner = owner;
    this.dir = dir;
    this.formats = formats;
    if (registry) {
      this.registry = registry;
    }
  }
}

/**
 * Loads the configuration file from the current directory
 * @param path string path where try to find the config file
 * @returns a promise containing the Config object
 * @throws CLIError if the file was not found
 */
export async function loadConfig(path?: string | undefined): Promise<Config> {
  try {
		const value = await fs.readJSON(path === undefined ? join(process.cwd(), Init.file) : path);
		return new Config(value.owner, value.dir, value.formats, value.registry);
	}
	catch (err) {
		throw new CLIError(err.message);
	}
}
