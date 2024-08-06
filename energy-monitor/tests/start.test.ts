/* eslint-disable no-console */
import { EnergyMonitorBackendApp } from '../src/energy-monitor-backend-app';

jest.mock('../src/EnergyMonitorBackendApp');

const mockProcessExit = (code: number) => {
  const exit = process.exit as unknown as jest.Mock<void, [number?]>;
  exit.mockImplementationOnce(() => {
    throw new Error(`process.exit: ${code}`);
  });
  return exit;
};
describe('start.ts', () => {
  let originalProcessExit: typeof process.exit;
  let originalConsoleLog: typeof console.log;
  let originalProcessOn: typeof process.on;
  beforeAll(() => {
    originalProcessExit = process.exit;
    originalConsoleLog = console.log;
    originalProcessOn = process.on;
    process.exit = jest.fn() as unknown as typeof process.exit;
    console.log = jest.fn();
    process.on = jest.fn((event, handler) => {
      if (event === 'uncaughtException') {
        (handler as NodeJS.UncaughtExceptionListener)(new Error('Mocked uncaughtException'), 'uncaughtException');
      }
      return process;
    }) as unknown as typeof process.on;
  });
  afterAll(() => {
    process.exit = originalProcessExit;
    console.log = originalConsoleLog;
    process.on = originalProcessOn;
  });
  it('should start the EnergyMonitorBackendApp', () => {
    require('../src/start');
    expect(EnergyMonitorBackendApp.prototype.start).toHaveBeenCalled();
  });
  it('should handle errors during app start', () => {
    const exitMock = mockProcessExit(1);
    (EnergyMonitorBackendApp.prototype.start as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Test error');
    });
    require('../src/start');
    expect(console.log).toHaveBeenCalledWith(new Error('Test error'));
    expect(exitMock).toHaveBeenCalledWith(1);
  });
  it('should handle uncaught exceptions', () => {
    const exitMock = mockProcessExit(1);
    require('../src/start');
    expect(console.log).toHaveBeenCalledWith('uncaughtException', new Error('Mocked uncaughtException'));
    expect(exitMock).toHaveBeenCalledWith(1);
  });
});
