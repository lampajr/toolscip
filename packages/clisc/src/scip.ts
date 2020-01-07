import { Input } from '@oclif/parser';
import { CLIError } from '@oclif/errors';
import { Contract } from '@toolusci/scdl-lib';
import scip, { types, ScipRequest } from '@toolusci/scip-lib';
import { AxiosResponse } from 'axios';
import * as fs from 'fs-extra';
import chalk = require('chalk');
import BaseCommand from './base';
import shared from './shared';
import Config from './config';

export default abstract class extends BaseCommand {
  static flags = {
    ...BaseCommand.flags,
    auth: shared.auth,
    id: shared.id,
    file: shared.file,
  };

  static args = [{ name: 'contract', description: `name of the contract to interact with`, required: true }];

  contract: Contract | undefined;

  /**
   * Generates a SCIP request from command line parameters
   * and send it to the target gateway
   */
  abstract fromFlags(): Promise<AxiosResponse<types.ScipError | types.ScipSuccess>>;

  /**
   * Generates a SCIP request from a JSON file
   * and send it to the target gateway
   */
  abstract fromFile(): Promise<AxiosResponse<types.ScipError | types.ScipSuccess>>;

  /**
   * Parses a generic data into a ScipRequest object, if valid.
   * @param data JSON data to parse
   * @returns a Proomis of a ScipRequest
   */
  async parseRequest(): Promise<ScipRequest> {
    let data: any = null;
    let request: ScipRequest;

    if (this.contract === undefined) {
      throw new CLIError(`Contract has not been initialized. Fatal error!`);
    }

    try {
      data = await fs.readJSON(this.flags.file);
    } catch (err) {
      throw new CLIError(`Unable to find a file at '${this.flags.file}'`);
    }

    try {
      request = scip.parseRequest(data);
    } catch (err) {
      throw new CLIError(`Malformed request - ${err.data}`);
    }

    if (request === undefined) {
      throw new CLIError(`Unexpected error!`);
    }

    return request;
  }

  /**
   * Handle synchronous SCIP response
   * @param data response body
   */
  handleResponse(data: any) {
    try {
      const response = scip.parseResponse(data);
      if (response instanceof types.ScipQueryResult) {
        const queryResult = response.result as types.QueryResult;
        queryResult.occurrences.forEach((occurrence, i) => {
          this.logOccurrence(occurrence, i);
        });
      } else if (response instanceof types.ScipSuccess) {
        this.logSucceedResponse(response);
      } else if (response instanceof types.ScipError) {
        this.logErrorResponse(response);
      }
    } catch (err) {
      this.log(JSON.stringify(err), 'err');
    }
  }

  logOccurrence(occurrence: types.Occurrence, num: number) {
    this.log(chalk.yellow(`========== OCCURRENCE ${num}`));
    const padding = 13;
    this.log('Timestamp'.padEnd(padding) + `=> ${occurrence.timestamp}`);
    occurrence.params.forEach((param, count) => {
      this.log(`${param.name !== '' ? param.name : 'param' + count}`.padEnd(padding) + `=> ${param.value}`);
    });
    this.log(`========== END OCCURRENCE `);
  }

  logSucceedResponse(res: types.ScipSuccess) {
    this.log(chalk.green(`========== REQUEST SUCCEED`));
    this.log('Request id  => ' + res.id, 'err');
    this.log('Result      => ' + res.result);
    this.log(`========== END RESPONSE`);
  }

  logErrorResponse(err: types.ScipError) {
    this.log(chalk.red(`========== REQUEST FAILED`), 'err');
    this.log('Request id  => ' + err.id, 'err');
    this.log('Code        => ' + err.error.code, 'err');
    this.log('Message     => ' + err.error.message, 'err');
    if (err.error.data) {
      this.log('Info:       => ' + err.error.data, 'err');
    }
    this.log(`========== END RESPONSE`, 'err');
  }

  async init() {
    const { args, flags } = this.parse(this.constructor as Input<any>);
    this.flags = flags;
    this.args = args;
    this.cliscConfig = await Config.loadConfig(flags.path);
    // retrieve the contract's information
    const filename: string = this.args.contract + '.json';
    const descriptor = await Config.getDescriptor(filename, this.cliscConfig.descriptorsFolder());
    // initialize the [[Contract]] object starting from its descriptor
    this.contract = new Contract(descriptor, this.flags.auth);
  }

  async run() {
    if (this.flags.file) {
      try {
        await this.fromFile()
          .then(res => {
            this.handleResponse(res.data);
          })
          .catch(err => {
            throw err;
          });
      } catch (err) {
        throw err;
      }
    } else {
      if (!this.flags.id) {
        throw new CLIError(`Missing required flag: -I --id`);
      }
      await this.fromFlags()
        .then(res => {
          this.handleResponse(res.data);
        })
        .catch(err => {
          throw err;
        });
    }
  }
}
