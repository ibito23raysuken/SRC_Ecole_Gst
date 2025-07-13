import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react'; // Import ajouté
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'], // Doit être .jsx
            refresh: true,
        }),
        react(),tailwindcss(), // Plugin ajouté
    ],
});
