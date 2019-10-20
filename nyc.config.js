
module.exports = {
    extension: [
        '.ts'
    ],
    include: [
        'src/**/*.ts'
    ],
    exclude: [
        'src/**/*.spec.ts'
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
