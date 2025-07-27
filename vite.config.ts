import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react'; // Import ajouté
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/main.jsx'], // Doit être .jsx
            refresh: true,
        }),
        react(),tailwindcss(), // Plugin ajouté
    ],
    // Configuration du serveur
    server: {
        proxy: {
        '/api': {
            target: 'http://localhost:8000/api',
            changeOrigin: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }
        }
    }
});
