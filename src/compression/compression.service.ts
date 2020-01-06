import { IDataPoint } from '../data/point';

import { Compare } from './../compare/compare.model';

export class CompressionService {
    private static readonly MINIMUM_LIMIT_THRESHOLD: number = 0.2;
    private static readonly MINIMUM_COMPRESSION_RATIO: number = 1;
    private static readonly MAXIMUM_COMPRESSION_RATIO: number = 10;

    public constructor(private readonly deviation: number, private readonly rounds: number = 1) {
        if (deviation < 0) {
            throw new Error('Deviation cannot be set lower than 0');
        }
        if (deviation > 1) {
            throw new Error('Deviation cannot be set higher than 1');
        }
    }

    private getFirstIsEqualToSecond(first: IDataPoint, second: IDataPoint, third: IDataPoint): IDataPoint[] {
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
    }

    private getFirstIsLessThanSecond(first: IDataPoint, second: IDataPoint, third: IDataPoint): IDataPoint[] {
        /* first value < second value */
        if (Compare.isEqual(second, third, this.deviation)) {
            /*
                second value ≈ third value
                shape /¯ can be interpolated by connecting first and third point -> 33% compression
             */
            return [first, third];
        } else if (Compare.isLessThan(second, third)) {
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
    }

    private getFirstIsMoreThanSecond(first: IDataPoint, second: IDataPoint, third: IDataPoint): IDataPoint[] {
        /* first value > second value */
        if (Compare.isEqual(second, third, this.deviation)) {
            /*
                second value ≈ third value
                shape \_ can be interpolated by connecting first and third point -> 33% compression
            */
            return [first, third];
        } else if (Compare.isLessThan(second, third)) {
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

    private compressThreeDataPoints(first: IDataPoint, second: IDataPoint, third: IDataPoint): IDataPoint[] {
        if (Compare.isEqual(first, second, this.deviation)) {
            return this.getFirstIsEqualToSecond(first, second, third);
        } else if (Compare.isLessThan(first, second)) {
            return this.getFirstIsLessThanSecond(first, second, third);
        } else {
            return this.getFirstIsMoreThanSecond(first, second, third);
        }
    }

    private compress(dataPoints: IDataPoint[]): IDataPoint[] {
        const result: Set<IDataPoint> = new Set();
        for (let i: number = 0; i < dataPoints.length - 2; i += 1) {
            for (const dataPoint of this.compressThreeDataPoints(dataPoints[i], dataPoints[i + 1], dataPoints[i + 2])) {
                result.add(dataPoint);
            }
        }
        result.add(dataPoints[dataPoints.length - 2]);
        result.add(dataPoints[dataPoints.length - 1]);
        return Array.from(result.values());
    }

    public compressByRounds(dataPoints: IDataPoint[], rounds: number = this.rounds): IDataPoint[] {
        let result = dataPoints;
        for (let round: number = 0; round < rounds; round++) {
            result = this.compress(result);
        }
        return result;
    }

    public compressByLimit(dataPoints: IDataPoint[], limit: number): IDataPoint[] {
        if (limit < dataPoints.length * CompressionService.MINIMUM_LIMIT_THRESHOLD) {
            throw new Error(`Limit cannot be set lower than ${dataPoints.length * CompressionService.MINIMUM_LIMIT_THRESHOLD}`);
        }
        let result = dataPoints;
        do {
            result = this.compress(result);
        } while (result.length > limit);
        return result;
    }

    public compressByCompressionRatio(dataPoints: IDataPoint[], compressionRatio: number): IDataPoint[] {
        if (compressionRatio < CompressionService.MINIMUM_COMPRESSION_RATIO) {
            throw new Error(`Compression percentage cannot be set lower than ${CompressionService.MINIMUM_COMPRESSION_RATIO}`);
        }
        if (compressionRatio > CompressionService.MAXIMUM_COMPRESSION_RATIO) {
            throw new Error(`Compression percentage cannot be set higher than ${CompressionService.MAXIMUM_COMPRESSION_RATIO}`);
        }
        let result = dataPoints;
        while (CompressionService.getCompressionRatio(dataPoints.length, result.length) < compressionRatio) {
            result = this.compress(result);
        }
        return result;
    }

    public static getCompressionRatio(originalSize: number, currentSize: number): number {
        return originalSize / currentSize;
    }
}
