import { VitePWAOptions } from 'vite-plugin-pwa';
import { vitePwaManifest } from './vitePwaManifest';

export const vitePWAconfig: Partial<VitePWAOptions> = {
	manifest: vitePwaManifest,
	strategies: 'injectManifest',
	srcDir: 'src',
	filename: 'sw.ts',
};
