import test, { ExecutionContext } from 'ava';

import { IDataPoint } from '../data/point';

import { Compare } from './compare.model';

test('When equal data points are compared to be equal, it returns true', (t: ExecutionContext): void => {
    const first: IDataPoint = {
        time: new Date(1546300800000),
        value: 100
    };
    const second: IDataPoint = {
        time: new Date(1546300801000),
        value: 100
    };
    t.true(Compare.isEqual(first, second), 'Failed to correctly compare data points');
});

test('When almost equal data points are compared to be equal with proper deviation, it returns true', (t: ExecutionContext): void => {
    const first: IDataPoint = {
        time: new Date(1546300800000),
        value: 100
    };
    const second: IDataPoint = {
        time: new Date(1546300801000),
        value: 110
    };
    t.true(Compare.isEqual(first, second, 0.1), 'Failed to correctly compare data points');
});

test('When almost equal data points are compared to be equal with 0 deviation, it returns false', (t: ExecutionContext): void => {
    const first: IDataPoint = {
        time: new Date(1546300800000),
        value: 100
    };
    const second: IDataPoint = {
        time: new Date(1546300801000),
        value: 110
    };
    t.false(Compare.isEqual(first, second, 0), 'Failed to correctly compare data points');
});

test('When lower value data point is compared to be less than higher value data point, it returns true', (t: ExecutionContext): void => {
    const first: IDataPoint = {
        time: new Date(1546300800000),
        value: 100
    };
    const second: IDataPoint = {
        time: new Date(1546300801000),
        value: 200
    };
    t.true(Compare.isLessThan(first, second), 'Failed to correctly compare data points');
});
