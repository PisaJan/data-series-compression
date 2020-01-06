import { IDataPoint } from '../data/point';

import { Compare } from './../compare/compare.model';

export class CompressionService {
    private static readonly MAXIMUM_ROUNDS: number = 100;
    private static readonly MINIMUM_LIMIT_THRESHOLD: number = 0.2;
    private static readonly MINIMUM_COMPRESSION_RATIO: number = 1;
    private static readonly MAXIMUM_COMPRESSION_RATIO: number = 10;

    private currentResult: Set<IDataPoint> = new Set();

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
            this.currentResult.delete(first);
            this.currentResult.delete(third);
            return [second];
        } else {
            /*
                second value ≠ third value
                shape _/ or shape ¯\ can be interpolated by connecting first and third point -> 33% compression
             */
            this.currentResult.delete(second);
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
            this.currentResult.delete(second);
            return [first, third];
        } else if (Compare.isLessThan(second, third)) {
            /*
                second value < third value
                shape / can be interpolated by connecting first and third point -> 33% compression
            */
            this.currentResult.delete(second);
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
            this.currentResult.delete(second);
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
            this.currentResult.delete(second);
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
        this.currentResult = new Set([...dataPoints]);
        for (let i: number = 0; i < dataPoints.length - 2; i += 1) {
            this.compressThreeDataPoints(dataPoints[i], dataPoints[i + 1], dataPoints[i + 2]);
        }
        return Array.from(this.currentResult.values());
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
        let i: number = 0;
        do {
            result = this.compress(result);
            i++;
        } while (result.length > limit && i < CompressionService.MAXIMUM_ROUNDS);
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
        let i: number = 0;
        while (CompressionService.getCompressionRatio(dataPoints.length, result.length) < compressionRatio && i < CompressionService.MAXIMUM_ROUNDS) {
            result = this.compress(result);
            i++;
        }
        return result;
    }

    public static getCompressionRatio(originalSize: number, currentSize: number): number {
        return originalSize / currentSize;
    }
}
