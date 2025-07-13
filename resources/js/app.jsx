import React from 'react';
import ReactDOM from 'react-dom/client';
import '../css/app.css';
export default function App() {
    return (
        <div className="text-4xl text-blue-600 font-bold text-center mt-10">
            Hello avec Tailwind CSS 🎨
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
