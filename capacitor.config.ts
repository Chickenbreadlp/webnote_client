import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.chickenbread.webnote',
  appName: 'Webnote',
  webDir: '.output/public',
  android: {
    allowMixedContent: true,
    adjustMarginsForEdgeToEdge: 'auto'
  }
};

export default config;
