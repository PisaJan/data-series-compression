import test, { ExecutionContext } from 'ava';
import { IDataPoint } from '../data/point';
import { CompressionService } from './compression.service';

const MEDIUM_DATASET_FIXTURE: IDataPoint[] = [
    {
        time: new Date(1546300800000),
        value: 125
    },
    {
        time: new Date(1546300801000),
        value: 130
    },
    {
        time: new Date(1546300802000),
        value: 137
    },
    {
        time: new Date(1546300803000),
        value: 64
    },
    {
        time: new Date(1546300804000),
        value: 69
    },
    {
        time: new Date(1546300805000),
        value: 88
    },
    {
        time: new Date(1546300806000),
        value: 89
    },
    {
        time: new Date(1546300807000),
        value: 90
    },
    {
        time: new Date(1546300808000),
        value: 95
    },
    {
        time: new Date(1546300809000),
        value: 45
    },
    {
        time: new Date(1546300810000),
        value: 48
    },
    {
        time: new Date(1546300811000),
        value: 52
    }
];

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
        time: new Date(1546300803000),
        value: 50
    };
    t.is(compression.compressByLimit([first, second, third, fourth], 2).length, 2, 'Failed to return correct result');
});

test('When invalid limit is set, it throws exception', (t: ExecutionContext): void => {
    const compression: CompressionService = new CompressionService(0);
    const first: IDataPoint = {
        time: new Date(1546300800000),
        value: 300
    };
    t.throws(() => {
        compression.compressByLimit([first], 0);
    }, `Limit cannot be set lower than 0.2`);
});

test('When invalid conversion ratio is set, it throws exception', (t: ExecutionContext): void => {
    const compression: CompressionService = new CompressionService(0);
    t.throws(() => {
        compression.compressByCompressionRatio([], 0.5);
    }, `Compression percentage cannot be set lower than 1`);
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
        time: new Date(1546300803000),
        value: 50
    };
    t.is(compression.compressByCompressionRatio([first, second, third, fourth], 2).length, 2, 'Failed to return correct result');
});

test.only('Compression ratio results differs for different float ratios', (t: ExecutionContext): void => {
    const compression: CompressionService = new CompressionService(0);
    const zeroCompressionCount = compression.compressByCompressionRatio(MEDIUM_DATASET_FIXTURE, 1).length;
    const onePointFiveCompressionCount = compression.compressByCompressionRatio(MEDIUM_DATASET_FIXTURE, 1.5).length;
    const onePointSevenCompressionCount = compression.compressByCompressionRatio(MEDIUM_DATASET_FIXTURE, 1.7).length;
    const halfCompressionCount = compression.compressByCompressionRatio(MEDIUM_DATASET_FIXTURE, 2).length;
    t.is(zeroCompressionCount, MEDIUM_DATASET_FIXTURE.length, 'Compression ratio 1 is broken');
    t.is(onePointFiveCompressionCount, Math.floor(MEDIUM_DATASET_FIXTURE.length / 1.5), 'Compression ratio 1.5 is broken');
    t.is(onePointSevenCompressionCount, Math.floor(MEDIUM_DATASET_FIXTURE.length / 1.7), 'Compression ratio 1.7 is broken');
    t.is(halfCompressionCount, Math.floor(MEDIUM_DATASET_FIXTURE.length / 2), 'Compression ratio 2 is broken');
});

test('When first value is less then second value and second value is equal to third value and fourth value is less than third value, it returns first, third and fourth data point', (t: ExecutionContext): void => {
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
    const fourth: IDataPoint = {
        time: new Date(1546300802000),
        value: 100
    };
    t.deepEqual(compression.compressByRounds([first, second, third, fourth], 1), [first, third, fourth], 'Failed to return correct result');
});

test('When original size is 100 and current size is 25, it returns compression ratio is 1:4', (t: ExecutionContext): void => {
    t.is(CompressionService.getCompressionRatio(100, 25), 4, 'Failed to return correct compression rate');
});
