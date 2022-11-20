# data-series-compression

[![Coverage Status](https://coveralls.io/repos/istanbuljs/nyc/badge.svg?branch=)](https://coveralls.io/r/istanbuljs/nyc?branch=master)
[![GitHub issues](https://img.shields.io/github/issues/pisajan/data-series-compression)](https://github.com/PisaJan/data-series-compression/issues)

[![Npm version](https://img.shields.io/npm/v/data-series-compression?color=blue)](https://www.npmjs.com/package/data-series-compression)
[![Minified size](https://img.shields.io/bundlephobia/min/data-series-compression)](https://www.npmjs.com/package/data-series-compression)
[![Npm downloads](https://img.shields.io/npm/dm/data-series-compression?color=blue)](https://www.npmjs.com/package/data-series-compression)

[![License MIT](https://img.shields.io/npm/l/data-series-compression?color=orange)](https://en.wikipedia.org/wiki/MIT_License)

Simple library aimed to reduce number of data points without loss of significant values (local extremes).

## Features

-   Compress data by specified number of rounds (one round removes ~30% of values).
-   Compress data by limit (compression will stop after reaching desired count of values).
-   Compress data by ratio (ratio = original size / current size).

## Installation

```sh
npm install data-series-compression
```

## Usage

```ts
import { CompressionService, IDataPoint } from 'data-series-compression';

const compression: CompressionService = new CompressionService(0.1);

const dataPoints: IDataPoint[] = [
    {
        time: new Date(1546300800000),
        value: 300
    },
    {
        time: new Date(1546300801000),
        value: 200
    },
    {
        time: new Date(1546300802000),
        value: 100
    },
    {
        time: new Date(1546300802000),
        value: 150
    };
];

const result: IDataPoint[] = compression.compressByCompressionRatio(dataPoints, 2);

for (const dataPoint of result) {
    console.log(dataPoint.value); // 300 // 100
}
```

## Parameters

### Constructor

-   `deviation` defines percentage deviation of first value during comparison (eg. deviation 0.5 means that values 1 and 1.4 are considered equal and therefore more values will be removed during one round of compression)
-   `rounds` defines default number of rounds for `compressByRounds` method

### Methods

-   `compressByRounds` - `rounds` parameter defines how many rounds of compression will be executed before returning the result set
-   `compressByLimit` - `limit` parameter defines maximum of how many values will be returned in the result set
-   `compressByCompressionRatio` - `compressionRatio` parameter defines number of values in the input set that should be converted to one value in the result set

## License

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
