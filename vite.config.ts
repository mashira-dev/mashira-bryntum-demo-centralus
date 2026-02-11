import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins      : [react()],
    optimizeDeps : {
        include : ['@bryntum/gantt', '@bryntum/gantt-react']
    },
    base : '',
    css  : {
        preprocessorOptions : {
            scss : {
                silenceDeprecations : [
                    'import',
                    'global-builtin',
                    'color-functions',
                    'legacy-js-api'
                ]
            }
        }
    },
    build : {
        // Suppress warning for chunk size
        chunkSizeWarningLimit : 10000,

        // Turn warnings into errors. For build testing purposes
        // https://rollupjs.org/configuration-options/#onlog
        rollupOptions : {
            onLog(level, log, handler) {
                if (level === 'warn') {
                    handler('error', log);
                }
                else {
                    handler(level, log);
                }
            }
        }
    }
});
