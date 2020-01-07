import { IDataPoint } from '../data/point';

import { Compare } from './../compare/compare.model';

export class Compression {
    private result: Set<IDataPoint>;

    public constructor(private readonly deviation: number, dataPoints: IDataPoint[]) {
        this.result = new Set([...dataPoints]);
        for (let i: number = 0; i < dataPoints.length - 2; i += 1) {
            this.compressThreeDataPoints(dataPoints[i], dataPoints[i + 1], dataPoints[i + 2]);
        }
    }

    private handleFirstIsEqualToSecond(first: IDataPoint, second: IDataPoint, third: IDataPoint): void {
        /* first value ≈ second value */
        if (Compare.isEqual(second, third, this.deviation)) {
            /*
                second value ≈ third value
                shape -- is almost straight line (dependent on deviation) -> 66% compression
            */
            this.result.delete(first);
            this.result.delete(third);
        } else {
            /*
                second value ≠ third value
                shape _/ or shape ¯\ can be interpolated by connecting first and third point -> 33% compression
             */
            this.result.delete(second);
        }
    }

    private handleFirstIsLessThanSecond(second: IDataPoint, third: IDataPoint): void {
        /* first value < second value */
        if (Compare.isEqual(second, third, this.deviation)) {
            /*
                second value ≈ third value
                shape /¯ can be interpolated by connecting first and third point -> 33% compression
             */
            this.result.delete(second);
        } else if (Compare.isLessThan(second, third)) {
            /*
                second value < third value
                shape / can be interpolated by connecting first and third point -> 33% compression
            */
            this.result.delete(second);
        }
        /*
            second value > third value
            shape /\ is local maximum -> no compression
        */
    }

    private handleFirstIsMoreThanSecond(second: IDataPoint, third: IDataPoint): void {
        /* first value > second value */
        if (Compare.isEqual(second, third, this.deviation)) {
            /*
                second value ≈ third value
                shape \_ can be interpolated by connecting first and third point -> 33% compression
            */
            this.result.delete(second);
        } else if (Compare.isLessThan(second, third)) {
            /*
                second value < third value
                shape \/ is local minimum -> no compression
            */
        } else {
            /*
                second value > third value
                shape \ can be interpolated by connecting first and third point -> 33% compression
            */
            this.result.delete(second);
        }
    }

    private compressThreeDataPoints(first: IDataPoint, second: IDataPoint, third: IDataPoint) {
        if (Compare.isEqual(first, second, this.deviation)) {
            this.handleFirstIsEqualToSecond(first, second, third);
        } else if (Compare.isLessThan(first, second)) {
            this.handleFirstIsLessThanSecond(second, third);
        } else {
            this.handleFirstIsMoreThanSecond(second, third);
        }
    }

    public getResult(): IDataPoint[] {
        return Array.from(this.result.values());
    }
}
