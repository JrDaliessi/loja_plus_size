module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    'src/features/catalog/**/*.ts',
    '!src/features/catalog/tests/**',
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', decorators: true },
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
          },
          target: 'es2022',
        },
        module: { type: 'es6' },
      },
    ],
  },
};
