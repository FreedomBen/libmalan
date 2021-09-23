module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['src'],
  setupFilesAfterEnv: ['<rootDir>/test/test_setup.ts']
};
