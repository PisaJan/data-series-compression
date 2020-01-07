import { IDataPoint } from '../data/point';

import { Compression } from './compression.model';

export class CompressionService {
    private static readonly MAXIMUM_ROUNDS: number = 100;
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

    private compress(dataPoints: IDataPoint[]): IDataPoint[] {
        return new Compression(this.deviation, dataPoints).getResult();
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
