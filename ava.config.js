
export default {
    files: [
        'src/**/*.spec.ts',
        'test/**/*.spec.ts'
    ],
    compileEnhancements: false,
    cache: true,
    failFast: false,
    failWithoutAssertions: true,
    verbose: true,
    timeout: '120s',
    extensions: [
        'ts'
    ],
    require: [
        'ts-node/register'
    ]
};
