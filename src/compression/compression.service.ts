export class CompressionService {
    public compress(items: [number, number][]): [number, number][] {
        const failure: number = 0.005;
        const result: [number, number][] = [];
        for (let i: number = 0; i < items.length - 2; i += 3) {
            const item1: number = items[i][1];
            const item2: number = items[i + 1][1];
            const item3: number = items[i + 2][1];
            if (Math.abs(item1 - item2) <= item1 * failure) {
                // item1 = item2
                if (Math.abs(item2 - item3) <= item2 * failure) {
                    // item2 = item3
                    result.push(items[i + 1]);
                } else {
                    // item2 <> item3
                    result.push(items[i]);
                    result.push(items[i + 2]);
                }
            } else if (item1 < item2) {
                // item1 < item2
                if (Math.abs(item2 - item3) <= item2 * failure) {
                    // item2 = item3
                    result.push(items[i]);
                    result.push(items[i + 2]);
                } else if (item2 < item3) {
                    // item2 < item3
                    result.push(items[i]);
                    result.push(items[i + 2]);
                } else {
                    // item2 > item3
                    result.push(items[i]);
                    result.push(items[i + 1]);
                    result.push(items[i + 2]);
                }
            } else {
                // item1 > item2
                if (Math.abs(item2 - item3) <= item2 * failure) {
                    // item2 = item3
                    result.push(items[i]);
                    result.push(items[i + 2]);
                } else if (item2 < item3) {
                    // item2 < item3
                    result.push(items[i]);
                    result.push(items[i + 1]);
                    result.push(items[i + 2]);
                } else {
                    // item2 > item3
                    result.push(items[i]);
                    result.push(items[i + 2]);
                }
            }
        }
        return result;
    }
}
