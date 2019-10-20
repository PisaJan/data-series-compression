import test, { ExecutionContext } from 'ava';

import { CompressionService } from './compression.service';

test('Instantiate', (t: ExecutionContext): void => {
    t.notThrows((): CompressionService => new CompressionService(), 'Cannot instantiate class CompressionService');
});
