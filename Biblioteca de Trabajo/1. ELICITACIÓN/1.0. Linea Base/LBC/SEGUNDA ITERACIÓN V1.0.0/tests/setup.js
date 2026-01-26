/**
 * Setup global para pruebas Jest
 * Configura mocks y variables globales necesarias
 */

// Mock de IndexedDB para entorno de pruebas (sin jest.fn ya que no está disponible en setup)
global.indexedDB = {
  open: () => {},
  deleteDatabase: () => {},
};

// Mock de Notification API
global.Notification = class Notification {
  constructor(title, options) {
    this.title = title;
    this.options = options;
  }

  static permission = 'granted';
  static requestPermission = () => Promise.resolve('granted');

  close() {}
};

// Mock de Audio Context
global.AudioContext = class AudioContext {
  constructor() {
    this.destination = {};
    this.currentTime = 0;
  }

  createOscillator() {
    return {
      connect: () => {},
      start: () => {},
      stop: () => {},
      frequency: { value: 0 },
    };
  }

  createGain() {
    return {
      connect: () => {},
      gain: { value: 0 },
    };
  }

  close() {}
};

// Mock de navigator.vibrate
if (global.navigator) {
  global.navigator.vibrate = () => {};
}
