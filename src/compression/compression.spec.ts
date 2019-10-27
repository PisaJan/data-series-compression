import test, { ExecutionContext } from 'ava';

import { IDataPoint } from '../data/point';

import { CompressionService } from './compression.service';

test('When CompressionService is instantiated, it does not throw exception', (t: ExecutionContext): void => {
    t.notThrows((): CompressionService => new CompressionService(0), 'Failed to instantiate class CompressionService');
});

test('When CompressionService is instantiated with wrong deviation argument, it throws exception', (t: ExecutionContext): void => {
    t.throws((): CompressionService => new CompressionService(-1), 'Deviation cannot be set lower than 0', 'Failed to validate deviation argument');
    t.throws((): CompressionService => new CompressionService(2), 'Deviation cannot be set higher than 1', 'Failed to validate deviation argument');
});

test('When first value is equal to second and third value, it returns second data point', (t: ExecutionContext): void => {
    const compression: CompressionService = new CompressionService(0);
    const first: IDataPoint = {
        time: new Date(1546300800000),
        value: 100
    };
    const second: IDataPoint = {
        time: new Date(1546300801000),
        value: 100
    };
    const third: IDataPoint = {
        time: new Date(1546300802000),
        value: 100
    };
    t.deepEqual(compression.compressByRounds([first, second, third], 1), [second], 'Failed to return correct result');
});

test('When first value is equal to second value and second value is not equal to third value, it returns first and third data point', (t: ExecutionContext): void => {
    const compression: CompressionService = new CompressionService(0);
    const first: IDataPoint = {
        time: new Date(1546300800000),
        value: 100
    };
    const second: IDataPoint = {
        time: new Date(1546300801000),
        value: 100
    };
    const third: IDataPoint = {
        time: new Date(1546300802000),
        value: 200
    };
    t.deepEqual(compression.compressByRounds([first, second, third], 1), [first, third], 'Failed to return correct result');
});

test('When first value is less then second value and second value is equal to third value, it returns first and third data point', (t: ExecutionContext): void => {
    const compression: CompressionService = new CompressionService(0);
    const first: IDataPoint = {
        time: new Date(1546300800000),
        value: 100
    };
    const second: IDataPoint = {
        time: new Date(1546300801000),
        value: 200
    };
    const third: IDataPoint = {
        time: new Date(1546300802000),
        value: 200
    };
    t.deepEqual(compression.compressByRounds([first, second, third], 1), [first, third], 'Failed to return correct result');
});

test('When first value is less then second value and second value is less than third value, it returns first, second and third data point', (t: ExecutionContext): void => {
    const compression: CompressionService = new CompressionService(0);
    const first: IDataPoint = {
        time: new Date(1546300800000),
        value: 100
    };
    const second: IDataPoint = {
        time: new Date(1546300801000),
        value: 200
    };
    const third: IDataPoint = {
        time: new Date(1546300802000),
        value: 100
    };
    t.deepEqual(compression.compressByRounds([first, second, third], 1), [first, second, third], 'Failed to return correct result');
});

test('When first value is less then second value and second value is more than third value, it returns first and third data point', (t: ExecutionContext): void => {
    const compression: CompressionService = new CompressionService(0);
    const first: IDataPoint = {
        time: new Date(1546300800000),
        value: 100
    };
    const second: IDataPoint = {
        time: new Date(1546300801000),
        value: 200
    };
    const third: IDataPoint = {
        time: new Date(1546300802000),
        value: 300
    };
    t.deepEqual(compression.compressByRounds([first, second, third], 1), [first, third], 'Failed to return correct result');
});

test('When first value is more then second value and second value is equal to third value, it returns first and third data point', (t: ExecutionContext): void => {
    const compression: CompressionService = new CompressionService(0);
    const first: IDataPoint = {
        time: new Date(1546300800000),
        value: 200
    };
    const second: IDataPoint = {
        time: new Date(1546300801000),
        value: 100
    };
    const third: IDataPoint = {
        time: new Date(1546300802000),
        value: 100
    };
    t.deepEqual(compression.compressByRounds([first, second, third], 1), [first, third], 'Failed to return correct result');
});

test('When first value is more then second value and second value is less than third value, it returns first, second and third data point', (t: ExecutionContext): void => {
    const compression: CompressionService = new CompressionService(0);
    const first: IDataPoint = {
        time: new Date(1546300800000),
        value: 200
    };
    const second: IDataPoint = {
        time: new Date(1546300801000),
        value: 100
    };
    const third: IDataPoint = {
        time: new Date(1546300802000),
        value: 200
    };
    t.deepEqual(compression.compressByRounds([first, second, third], 1), [first, second, third], 'Failed to return correct result');
});

test('When first value is more then second value and second value is more than third value, it returns first and third data point', (t: ExecutionContext): void => {
    const compression: CompressionService = new CompressionService(0);
    const first: IDataPoint = {
        time: new Date(1546300800000),
        value: 300
    };
    const second: IDataPoint = {
        time: new Date(1546300801000),
        value: 200
    };
    const third: IDataPoint = {
        time: new Date(1546300802000),
        value: 100
    };
    t.deepEqual(compression.compressByRounds([first, second, third], 1), [first, third], 'Failed to return correct result');
});

test('When 4 data points are compressed with limit 2, it returns 2 data points', (t: ExecutionContext): void => {
    const compression: CompressionService = new CompressionService(0);
    const first: IDataPoint = {
        time: new Date(1546300800000),
        value: 300
    };
    const second: IDataPoint = {
        time: new Date(1546300801000),
        value: 200
    };
    const third: IDataPoint = {
        time: new Date(1546300802000),
        value: 100
    };
    const fourth: IDataPoint = {
        time: new Date(1546300802000),
        value: 150
    };
    t.is(compression.compressByLimit([first, second, third, fourth], 50).length, 2, 'Failed to return correct result');
});

test('When invalid conversion ratio is set, it throws exception', (t: ExecutionContext): void => {
    const compression: CompressionService = new CompressionService(0);
    t.throws(() => {
        compression.compressByCompressionRatio([], -1);
    }, `Compression percentage cannot be set lower than 0`);
    t.throws(() => {
        compression.compressByCompressionRatio([], 100);
    }, `Compression percentage cannot be set higher than 10`);
});

test('When 4 data points are compressed by ration 1:2, it returns 2 data points', (t: ExecutionContext): void => {
    const compression: CompressionService = new CompressionService(0);
    const first: IDataPoint = {
        time: new Date(1546300800000),
        value: 300
    };
    const second: IDataPoint = {
        time: new Date(1546300801000),
        value: 200
    };
    const third: IDataPoint = {
        time: new Date(1546300802000),
        value: 100
    };
    const fourth: IDataPoint = {
        time: new Date(1546300802000),
        value: 150
    };
    t.is(compression.compressByCompressionRatio([first, second, third, fourth], 2).length, 2, 'Failed to return correct result');
});

test('When original size is 100 and current size is 25, it returns compression ratio is 1:4', (t: ExecutionContext): void => {
    t.is(CompressionService.getCompressionRatio(100, 25), 4, 'Failed to return correct compression rate');
});
