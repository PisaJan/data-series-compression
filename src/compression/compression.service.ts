import { IDataPoint } from '../data/point';

import { Compare } from './../compare/compare.model';

export class CompressionService {
    public constructor(private readonly deviation: number, private readonly rounds: number = 1) {}

    private getCompressedResult(first: IDataPoint, second: IDataPoint, third: IDataPoint): IDataPoint[] {
        if (Compare.isEqual(first, second, this.deviation)) {
            /* first value ≈ second value */
            if (Compare.isEqual(second, third, this.deviation)) {
                /*
                    second value ≈ third value
                    shape -- is almost straight line (dependent on deviation) -> 66% compression
                */
                return [second];
            } else {
                /*
                    second value ≠ third value
                    shape _/ or shape ¯\ can be interpolated by connecting first and third point -> 33% compression
                 */
                return [first, third];
            }
        } else if (first < second) {
            /* first value < second value */
            if (Compare.isEqual(second, third, this.deviation)) {
                /*
                    second value ≈ third value
                    shape /¯ can be interpolated by connecting first and third point -> 33% compression
                 */
                return [first, third];
            } else if (second < third) {
                /*
                    second value < third value
                    shape / can be interpolated by connecting first and third point -> 33% compression
                */
                return [first, third];
            } else {
                /*
                    second value > third value
                    shape /\ is local maximum -> no compression
                */
                return [first, second, third];
            }
        } else {
            /* first value > second value */
            if (Compare.isEqual(second, third, this.deviation)) {
                /*
                    second value ≈ third value
                    shape \_ can be interpolated by connecting first and third point -> 33% compression
                */
                return [first, third];
            } else if (second < third) {
                /*
                    second value < third value
                    shape \/ is local minimum -> no compression
                */
                return [first, second, third];
            } else {
                /*
                    second value > third value
                    shape \ can be interpolated by connecting first and third point -> 33% compression
                */
                return [first, third];
            }
        }
    }

    private compress(dataPoints: IDataPoint[]): IDataPoint[] {
        const result: IDataPoint[] = [];
        for (let i: number = 0; i < dataPoints.length - 2; i += 3) {
            result.push(...this.getCompressedResult(dataPoints[i], dataPoints[i + 1], dataPoints[i + 2]));
        }
        return result;
    }

    public compressRounds(dataPoints: IDataPoint[], rounds: number = this.rounds): IDataPoint[] {
        let result = dataPoints;
        for (let round: number = 0; round < rounds; round++) {
            result = this.compress(result);
        }
        return result;
    }
}
