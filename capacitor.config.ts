import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.oneup.app',
  appName: 'one-up-client',
  webDir: 'dist/one-up-client',
  server: {
    androidScheme: 'https'
  }
};

export default config;
