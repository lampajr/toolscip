import { Input } from '@oclif/parser';
import { CLIError } from '@oclif/errors';
import { Contract } from '@toolscip/scdl-lib';
import scip, { types, ScipRequest } from '@toolscip/scip-lib';
import { AxiosResponse } from 'axios';
import * as fs from 'fs-extra';
import BaseCommand from './base';
import shared from './shared';
import Config from './config';
import ora = require('ora');
import chalk = require('chalk');
import { join } from 'path';
import { updateState, State } from './logger';

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
      throw new CLIError(`Fatal error: Contract has not been initialized!`);
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
   * Handle SCIP response
   * @param data SCIP response to handle
   * @param spinner started spinner, if any
   */
  onResponse(data: any, spinner: ora.Ora) {
    try {
      const response = scip.parseResponse(data);
      if (response instanceof types.ScipQueryResult) {
        spinner.succeed('Request succeed!');
        const queryResult = response.result as types.QueryResult;
        // TODO: improve occurences print format
        // TODO: check whether empty set
        this.log(chalk.yellow('===== OCCURRENCES ====='));
        queryResult.occurrences.forEach((occurrence, i) => {
          this.onOccurrence(occurrence, i);
        });
        if (this.flags.logger) {
          updateState(
            this.loggerFilename as string,
            `${this.contract?.descriptor.name}.${
              this.flags.method !== undefined ? this.flags.method : this.flags.event
            }`,
            State.SUCCEED,
            'Request succeed',
            queryResult.occurrences,
          );
        }
      } else if (response instanceof types.ScipSuccess) {
        spinner.succeed(`Request ${response.id} succeed: ${response.result}`);
        if (this.flags.logger) {
          updateState(
            this.loggerFilename as string,
            this.flags.corrId,
            State.SUCCEED,
            'Request succeed, asynchronous responses are still pending',
          );
        }
      } else if (response instanceof types.ScipError) {
        spinner.fail(`Request ${response.id} failed: ${response.error.message} (code: ${response.error.code})`);
        if (this.flags.logger) {
          updateState(
            this.loggerFilename as string,
            this.flags.corrId,
            State.FAILED,
            response.error.data !== undefined ? response.error.data : response.error.message,
          );
        }
      } else {
        spinner.fail(`Unexpacted behaviour!`);
        if (this.flags.logger) {
          updateState(this.loggerFilename as string, this.flags.corrId, State.INVALID, 'Unexpected behaviour');
        }
      }
    } catch (err) {
      spinner.fail(`Invalid response: ${err.data !== undefined ? err.data : err.message}`);
      if (this.flags.logger) {
        updateState(this.loggerFilename as string, this.flags.corrId, State.INVALID, err.message);
      }
    }
  }

  // TODO: improve print format quality
  onOccurrence(occurrence: types.Occurrence, num: number) {
    const padding = 15;
    const text = `${num + 1}:  ${occurrence.isoTimestamp}`;
    this.log('-'.repeat(text.length));
    this.log(text);
    this.log('-'.repeat(text.length));
    occurrence.parameters.forEach((param, count) => {
      this.log(`${param.name !== '' ? param.name : 'param' + count}`.padEnd(padding) + `=> ${param.value}`);
    });
    this.log('');
  }

  async init() {
    const { args, flags } = this.parse(this.constructor as Input<any>);
    this.flags = flags;
    this.args = args;
    // this.cliscConfig = await Config.load(flags.path);
    // this.loggerFilename = join(this.cliscConfig.dir, this.cliscConfig.logger);
    // // retrieve the contract's information
    // const filename: string = this.args.contract + '.json';
    // const descriptor = await Config.getDescriptor(filename, this.cliscConfig.descriptorsFolder());
    // // initialize the [[Contract]] object starting from its descriptor
    // this.contract = new Contract(descriptor, this.flags.auth);
  }

  async run() {
    this.cliscConfig = await Config.load(this.flags.path);
    this.loggerFilename = join(this.cliscConfig.dir, this.cliscConfig.logger);

    if (this.cliscConfig === undefined) {
      throw new CLIError('Unable to load configuration files!');
    }

    if (this.loggerFilename === undefined) {
      throw new CLIError('Unable to load logger file!');
    }

    const spinner = ora({
      text: 'Sending request...',
    }).start();

    try {
      // retrieve the contract's information
      const filename: string = this.args.contract + '.json';
      const descriptor = await Config.getDescriptor(filename, this.cliscConfig.descriptorsFolder());
      // initialize the [[Contract]] object starting from its descriptor
      this.contract = new Contract(descriptor, this.flags.auth);

      if (this.flags.file) {
        try {
          await this.fromFile()
            .then(res => {
              this.onResponse(res.data, spinner);
            })
            .catch(err => {
              spinner.fail(`Malformed request: ${err.message}`);
            });
        } catch (err) {
          spinner.fail(`Request failed: ${err.message}`);
        }
      } else {
        if (!this.flags.id) {
          spinner.fail('Missing required jsonrpc id: use flag -I --id');
        } else {
          try {
            this.fromFlags()
              .then(res => {
                this.onResponse(res.data, spinner);
              })
              .catch(err => {
                spinner.fail(`Malformed request: ${err.message}`);
                if (this.flags.logger) {
                  updateState(
                    this.loggerFilename as string,
                    this.flags.corrId !== undefined ? this.flags.corrId : '',
                    State.FAILED,
                    err.message,
                  );
                }
              });
          } catch (err) {
            spinner.fail(`Request failed: ${err.message}`);
            // updateState(
            //   this.loggerFilename as string,
            //   this.flags.corrId !== undefined ? this.flags.corrId : '',
            //   State.FAILED,
            //   err.message,
            // );
          }
        }
      }
    } catch (err) {
      spinner.fail(`Fatal error: ${err.message}`);
    }
  }
}
