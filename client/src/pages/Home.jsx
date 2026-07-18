import { useEffect, useState } from "react";
import api from '../api/axios';

export default function Home() {
    const [status, setStatus] = useState('Checking...');

    useEffect(() => {
        api.get('/health').then((res) => setStatus(res.data.message)).catch(() => setStatus('Backend not reachable'));
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans flex flex-col items-center justify-center">
            <h1 className="mb-4 text-4xl font-bold text-green-700">
                KrishiSetu
            </h1>
            <p className="rounded-lg bg-white px-6 py-3 text-lg text-gray-700 shadow-md">
                Backend status: <span className="font-semibold">{status}</span>
            </p>
        </div>
    );
}