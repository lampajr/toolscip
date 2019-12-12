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
