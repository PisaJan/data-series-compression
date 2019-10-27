import { IPoint } from './point.interface';

export class Point implements IPoint {
    public constructor(public readonly time: Date, public readonly value: number) {}
}
