module.exports = {
    extension: [
        '.ts'
    ],
    include: [
        'src/**/*.ts'
    ],
    exclude: [
        'src/**/*.spec.ts',
        'src/**/index.ts',
        'src/**/*.enum.ts',
        'src/**/*.interface.ts',
        'src/**/*.type.ts',
        'src/**/*.module.ts'
    ],
    reporter: [
        'text',
        'html',
        'json-summary'
    ],
    all: true,
    'temp-dir': './node_modules/.cache/nyc_output',
    'report-dir': './test/coverage',
    require: [
        'ts-node/register',
        'source-map-support/register'
    ]
};
