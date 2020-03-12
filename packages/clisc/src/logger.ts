import * as fs from 'fs-extra';
import ora = require('ora');

export enum State {
  SENT = 'sent', // the request was sent toward the gateway
  SUCCEED = 'succeed', // the synchronous response was received with success, asynchronous responses are still pending
  CLOSED = 'closed', // asynchronous responses received or subscription canceled
  FAILED = 'failed', // the request failed
  INVALID = 'invalid', // invalid response received
}

export interface Entry {
  /** Request type, e.g., Invocation, Subscription and etc. */
  request: string;
  /** Request state, e.g., sent, active, closed and etc. */
  state: State;
  /** Request note, e.g., failure motivation, etc. */
  note: string;
  /** Request asynchronous results, e.g., subscription occurrences, function invocation results and etc. */
  results: any[];
}

/**
 * Update the state of an entry inside the logger
 * @param path where the logger is located
 * @param correlationIdentifier corrId of the entry
 * @param state new state
 * @param note new note
 */
export function updateState(path: string, correlationIdentifier: string, state: State, note: string, results?: any[]) {
  const spinner = ora({
    text: `Logger: updating entry ${correlationIdentifier}...`,
  }).start();

  try {
    const logger = fs.readJSONSync(path);
    if (logger[correlationIdentifier] === undefined) {
      spinner.fail(`No entry with '${correlationIdentifier}' as correlation identifier!`);
    } else {
      logger[correlationIdentifier].state = state;
      logger[correlationIdentifier].note = note;
      if (results !== undefined) {
        logger[correlationIdentifier].results.push(results);
      }

      try {
        fs.writeJSONSync(path, logger, { spaces: '\t' });
        spinner.succeed(`Logger: entry ${correlationIdentifier} updated!`);
      } catch (err) {
        spinner.fail(`Logger: entry ${correlationIdentifier} updated failed! ` + err.message);
      }
    }
  } catch (err) {
    spinner.fail(`Logger: entry ${correlationIdentifier} updated failed! ` + err.message);
  }
}

/**
 * Add a new entry inside the logger
 * @param path where the logger is located
 * @param correlationIdentifier new correlation identifier
 * @param content new content (Entry)
 */
export function addEntry(path: string, correlationIdentifier: string, content: Entry) {
  const spinner = ora({
    text: 'Logger: adding entry...',
  }).start();

  try {
    const logger = fs.readJSONSync(path);
    logger[correlationIdentifier] = content;
    try {
      fs.writeJSONSync(path, logger, { spaces: '\t' });
      spinner.succeed('Logger: new entry added!');
    } catch (err) {
      spinner.fail('Logger: adding entry failed! ' + err.message);
    }
  } catch (err) {
    spinner.fail('Logger: adding entry failed! ' + err.message);
  }
}
