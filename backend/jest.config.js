const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: [
        '**/__tests__/**/*.ts',
        '**/*.test.ts',
    ],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: [
        'text',
        'lcov',
        'html',
    ],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/src/config/',
    ],
    verbose: true,
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};
export default config;
//# sourceMappingURL=jest.config.js.map