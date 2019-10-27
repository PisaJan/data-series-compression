import test, { ExecutionContext } from 'ava';

import { Point } from './point.model';

test('When Point is instantiated, it does not throw exception', (t: ExecutionContext): void => {
    t.notThrows((): Point => new Point(new Date(0), 1), 'Failed to instantiate class Point');
});

test('When Point is instantiated with specific time, property time equals that time', (t: ExecutionContext): void => {
    const point: Point = new Point(new Date(0), 2);
    t.is(point.time.getTime(), 0, 'Failed to read expected time property');
});

test('When Point is instantiated with specific value, property value equals that value', (t: ExecutionContext): void => {
    const point: Point = new Point(new Date(0), 3);
    t.is(point.value, 3, 'Failed to read expected value property');
});
