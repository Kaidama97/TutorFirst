jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
// jest.setup.js

// Mock console.log to suppress log messages
console.log = jest.fn();


// jest.setup.js
import { NativeModules } from 'react-native';

// Mock SettingsManager
NativeModules.SettingsManager = NativeModules.SettingsManager || {
  settings: {},
  setValues: jest.fn(),
  getConstants: jest.fn(() => ({})),
};

// Mock other NativeModules if necessary
NativeModules.PlatformConstants = NativeModules.PlatformConstants || {
  forceTouchAvailable: false,
};

NativeModules.DeviceInfo = NativeModules.DeviceInfo || {
  getConstants: jest.fn(() => ({})),
};

NativeModules.SourceCode = NativeModules.SourceCode || {
  getConstants: jest.fn(() => ({
    scriptURL: '',
  })),
};

// Add other NativeModules as needed
