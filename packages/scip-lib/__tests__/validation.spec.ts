import 'mocha';
import { expect } from 'chai';
import {
  validateErrorMessage,
  validateErrorCode,
  validateTimestamp,
  validateSignature,
  validateTimeout,
  validateDoc,
  validateCorrId,
  validateIdentifier,
} from '../src/validation';

describe('Test validation.ts', () => {
  /** Validate the Error Message */
  describe('#validateErrorMessage', () => {
    it('Should throw an error if the object does not have a required `message` property', () => {
      const obj = {
        param: 'param',
      };
      try {
        validateErrorMessage(obj, true);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('Error message is missing, but it is required!');
      }
    });

    it('Should throw an error if the `message` property is not in string format', () => {
      const obj1 = {
        message: 3,
      };
      const obj2 = {
        message: { param: 3 },
      };

      try {
        validateErrorMessage(obj1, true);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('The error message, if present, MUST be of string type!');
      }

      try {
        validateErrorMessage(obj2, true);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('The error message, if present, MUST be of string type!');
      }
    });

    it('A valid error message should not throw anything', () => {
      const obj = {
        message: 'This is an error',
      };
      expect(() => validateErrorMessage(obj)).not.to.throw();
      expect(() => validateErrorMessage(obj, false)).not.to.throw();
    });

    it('If the error message is not required and it is missing it should not throw anything', () => {
      const obj = {
        param: 3,
      };
      expect(() => validateErrorMessage(obj, false)).not.to.throw();
    });
  });

  /** Validate the Error Code */
  describe('#validateErrorCode', () => {
    it('Should throw an error if the object does not have a required `code` property', () => {
      const obj = {
        param: 'param',
      };
      try {
        validateErrorCode(obj, true);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('Error code is missing, but it is required!');
      }
    });

    it('Should throw an error if the `code` property is not a negative integer', () => {
      const obj1 = {
        code: '3',
      };
      const obj2 = {
        code: { param: 3 },
      };
      const obj3 = {
        code: 1039,
      };

      try {
        validateErrorCode(obj1, true);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('The error code, if present, MUST be a negative integer!');
      }

      try {
        validateErrorCode(obj2, true);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('The error code, if present, MUST be a negative integer!');
      }

      try {
        validateErrorCode(obj3, true);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('The error code, if present, MUST be a negative integer!');
      }
    });

    it('A valid error code should not throw anything', () => {
      const obj = {
        code: -23455,
      };
      expect(() => validateErrorCode(obj)).not.to.throw();
      expect(() => validateErrorCode(obj, false)).not.to.throw();
    });

    it('If the error code is not required and it is missing it should not throw anything', () => {
      const obj = {
        param: 3,
      };
      expect(() => validateErrorCode(obj, false)).not.to.throw();
    });
  });

  /** Validate the Time */
  // tslint:disable-next-line:no-empty
  describe('#validateTime', () => {});

  /** Validate the Timestamp */
  describe('#validateTimestamp', () => {
    it('Should throw an error if the object does not have a required `timestamp` property', () => {
      const obj = {
        param: 'param',
      };
      try {
        validateTimestamp(obj, true);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('Timestamp is missing, but it is required!');
      }
    });

    it('Should throw an error if the `timestamp` property is not in string format', () => {
      const obj1 = {
        timestamp: 23,
      };
      const obj2 = {
        timestamp: { param: 3 },
      };

      try {
        validateTimestamp(obj1, true);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('The timestamp, if present, MUST be of string type!');
      }

      try {
        validateTimestamp(obj2, true);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('The timestamp, if present, MUST be of string type!');
      }
    });

    it('A valid timestamp should not throw anything', () => {
      const obj = {
        code: -23455,
      };
      expect(() => validateTimestamp(obj)).not.to.throw();
      expect(() => validateTimestamp(obj, false)).not.to.throw();
    });

    it('If the timestamp is not required and it is missing it should not throw anything', () => {
      const obj = {
        param: 3,
      };
      expect(() => validateTimestamp(obj, false)).not.to.throw();
    });
  });

  /** Validate the Signature */
  describe('#validateSignature', () => {
    it('Should throw an error if the object does not have a required `signature` property', () => {
      const obj = {
        param: 'param',
      };
      try {
        validateSignature(obj, true);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('Signature is missing, but it is required!');
      }
    });

    it('Should throw an error if the `signature` property is not in string format', () => {
      const obj1 = {
        signature: 23,
      };
      const obj2 = {
        signature: { param: 3 },
      };

      try {
        validateSignature(obj1, true);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('The signature, if present, MUST be of string type!');
      }

      try {
        validateSignature(obj2, true);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('The signature, if present, MUST be of string type!');
      }
    });

    it('A valid signature should not throw anything', () => {
      const obj = {
        signature: 'abcdefg',
      };
      expect(() => validateSignature(obj)).not.to.throw();
      expect(() => validateSignature(obj, false)).not.to.throw();
    });

    it('If the signature is not required and it is missing it should not throw anything', () => {
      const obj = {
        param: 3,
      };
      expect(() => validateSignature(obj, false)).not.to.throw();
    });
  });

  /** Validate the Timeout */
  describe('#validateTimeout', () => {
    it('Should throw an error if the object does not have a required `timeout` property', () => {
      const obj = {
        param: 'param',
      };
      try {
        validateTimeout(obj, true);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('Timeout is missing, but it is required!');
      }
    });

    it('Should throw an error if the `timeout` property is not in integer format', () => {
      const obj1 = {
        timeout: '3',
      };
      const obj2 = {
        timeout: { param: 3 },
      };

      try {
        validateTimeout(obj1, true);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('The timeout, if present, MUST be of integer type!');
      }

      try {
        validateTimeout(obj2, true);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('The timeout, if present, MUST be of integer type!');
      }
    });

    it('A valid timeout should not throw anything', () => {
      const obj = {
        timeout: 23455,
      };
      expect(() => validateTimeout(obj)).not.to.throw();
      expect(() => validateTimeout(obj, false)).not.to.throw();
    });

    it('If the timeout is not required and it is missing it should not throw anything', () => {
      const obj = {
        param: 3,
      };
      expect(() => validateTimeout(obj, false)).not.to.throw();
    });
  });

  /** Validate the Filter */
  // tslint:disable-next-line:no-empty
  describe('#validateFilter', () => {});

  /** Validate the Callback Url */
  // tslint:disable-next-line:no-empty
  describe('#validateCallbackUrl', () => {});

  /** Validate the Degree of Confidence */
  describe('#validateDoc', () => {
    it('Should throw an error if the object does not have a required `doc` property', () => {
      const obj = {
        param: 'param',
      };
      try {
        validateDoc(obj, true);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('Degree of confidence is missing, but it is required!');
      }
    });

    it('Should throw an error if the `doc` property is not in integer format', () => {
      const obj1 = {
        doc: '3',
      };
      const obj2 = {
        doc: { param: 3 },
      };

      try {
        validateDoc(obj1, true);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('Degree of confidence, if present, MUST be of number type!');
      }

      try {
        validateDoc(obj2, true);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('Degree of confidence, if present, MUST be of number type!');
      }
    });

    it('A valid degree of confidence should not throw anything', () => {
      const obj = {
        timeout: 23455,
      };
      expect(() => validateDoc(obj)).not.to.throw();
      expect(() => validateDoc(obj, false)).not.to.throw();
    });

    it('If the degree of confidence is not required and it is missing it should not throw anything', () => {
      const obj = {
        param: 3,
      };
      expect(() => validateDoc(obj, false)).not.to.throw();
    });
  });

  /** Validate the Correlation Identifier */
  describe('#validateCorrId', () => {
    it('Should throw an error if the object does not have a required `corrId` property', () => {
      const obj = {
        param: 'param',
      };
      try {
        validateCorrId(obj, true);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('Correlation identifier is missing, but it is required!');
      }
    });

    it('Should throw an error if the `signature` property is not in string format', () => {
      const obj1 = {
        corrId: 23,
      };
      const obj2 = {
        corrId: { param: 3 },
      };

      try {
        validateCorrId(obj1, true);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('Correlation identifier, if present, MUST be of string type!');
      }

      try {
        validateCorrId(obj2, true);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('Correlation identifier, if present, MUST be of string type!');
      }
    });

    it('A valid correlation identifier should not throw anything', () => {
      const obj = {
        corrId: 'abcdefg',
      };
      expect(() => validateCorrId(obj)).not.to.throw();
      expect(() => validateCorrId(obj, false)).not.to.throw();
    });

    it('If the correlation identifier is not required and it is missing it should not throw anything', () => {
      const obj = {
        param: 3,
      };
      expect(() => validateCorrId(obj, false)).not.to.throw();
    });
  });

  /** Validate the Function or Event identifier */
  describe('#validateIdentifier', () => {
    it('Should throw an error if the object does not have a required `functionId` property', () => {
      const obj = {
        param: 'param',
      };
      try {
        validateIdentifier(obj, 'functionId');
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('The functionId is missing, but it is required!');
      }
    });

    it('Should throw an error if the object does not have a required `eventId` property', () => {
      const obj = {
        param: 'param',
      };
      try {
        validateIdentifier(obj, 'eventId');
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('The eventId is missing, but it is required!');
      }
    });

    it('Should throw an error if the `functionId` property is not in string format', () => {
      const obj1 = {
        functionId: 23,
      };
      const obj2 = {
        functionId: { param: 3 },
      };

      try {
        validateIdentifier(obj1);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('The identifier MUST be of string type!');
      }

      try {
        validateIdentifier(obj2);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('The identifier MUST be of string type!');
      }
    });

    it('A valid function identifier should not throw anything', () => {
      const obj = {
        functionId: 'balanceOf',
      };
      expect(() => validateIdentifier(obj)).not.to.throw();
      expect(() => validateIdentifier(obj)).not.to.throw();
    });

    it('A valid event identifier should not throw anything', () => {
      const obj = {
        eventId: 'Sent',
      };
      expect(() => validateIdentifier(obj, 'eventId')).not.to.throw();
      expect(() => validateIdentifier(obj, 'eventId')).not.to.throw();
    });
  });

  /** Validate the Occurrences */
  // tslint:disable-next-line:no-empty
  describe('#validateOccurrences', () => {});

  /** Validate the Param */
  // tslint:disable-next-line:no-empty
  describe('#validateParam', () => {});

  /** Validate the Value */
  // tslint:disable-next-line:no-empty
  describe('#validateValue', () => {});

  /** Validate the Name */
  // tslint:disable-next-line:no-empty
  describe('#validateName', () => {});

  /** Validate the Params */
  // tslint:disable-next-line:no-empty
  describe('#validateParams', () => {});

  /** Validate the Type */
  // tslint:disable-next-line:no-empty
  describe('#validateType', () => {});
});
