import { IDataPoint } from '../data/point';

export class Compare {
    public static isEqual(a: IDataPoint, b: IDataPoint, deviation: number = 0): boolean {
        return Math.abs(a.value - b.value) <= a.value * deviation;
    }
    public static isLessThan(a: IDataPoint, b: IDataPoint): boolean {
        return a.value < b.value;
    }
}
