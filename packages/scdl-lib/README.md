# `scdl-lib`

This library provides an programmatic way to interact with different smart contracts simply using their descriptors (i.e. [Smart Contract Description Language]()). The interaction is implemented with a [SCIP]() compliant communication, which is performed through the [scip-lib]() module.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [SCDL Specification](scdl-specification)
- [Examples](#examples)
- [Contributing](#contributing)

## Installation

This package can be installed via [npm](https://www.npmjs.com/) as follow:

```bash
npm install --save @lampajr/scdl-lib
```

## Usage

In order to use this module you just have to import it like any other package:

_JavaScript_ import

```javascript
const scdl = require('@lampajr/scdl-lib');
```

_Typescript_ import

```typescript
import scdl from '@lampajr/scdl-lib';
// or
import { scdl } from '@lampajr/scdl-lib';
```

This package was mainly written to provide an automatic way to interact with smart contracts simply using their _SCDL-based_ descriptors. In order to do so the package simply provide a single class object `Contract` that must be instantiated providing a descriptor as parameter and then once instantiated the resulting object is a new one that exposes new properties, which are exactly named as its functions and events. These properties are instances of specific classes (i.e. `Method` and `Event` respectively) which allow a client to perform all allowed _SCIP_ requests (i.e. _invocation, subscription, unsubscription_ and _query_) by simply invoking the corresponding function on the property object (i.e. `invoke`, `subscribe`, `unsubscribe`, and `query`). All these function, since perform http requests, returns `AxiosResponse` promises.

```typescript
// import the 'Contract' class
import { Contract } from '@lampajr/scdl-lib';
// or using the package 'scdl.Contract'

const descriptor = {
  /*...*/
}; // scdl descriptor
const contract = new Contract(descriptor); // new contract instance
```

Now once you have created the `Contract` object, you can easily access its functions and events simply accessing the `methods` and `events` property respectively.

```typescript
contract.methods; // all contract's functions
```

```typescript
contract.events; // all contract's events
```

Suppose that you want to invoke a specific function (e.g. named 'balanceOf'), then you just have to use its name as property of the `contract.methods` object and then call the `invoke` function on it. Note

```typescript
// performs a SCIP invocation request
contract.methods.balanceOf
  .invoke(/*...*/)
  .then(res => {
    // ...
  })
  .catch(err => {
    // ...
  });
```

**Note**: In order to understand how to correctly invoke, subscribe, unsubscribe and query specific functions and/or events please refer to the [scip-lib](https://github.com/lampajr/toolscip/tree/master/packages/scip-lib) documentation, which fully describe the meaning of all required parameters.

## SCDL Specification

## Examples

## Contributing
