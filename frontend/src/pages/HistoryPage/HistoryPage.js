import React, { useState, useEffect } from 'react';
import './HistoryPage.css';

function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/history/get', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setHistory(data);
                } else {
                    console.error('Failed to fetch history.');
                }
            } catch (error) {
                console.error('Error fetching history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="history-page">
            <h2>User History</h2>
            {loading ? (
                <p>Loading...</p>
            ) : history.length > 0 ? (
                <ul>
                    {history.map((entry, index) => (
                        <li key={index}>
                            <span className="timestamp">{new Date(entry.timestamp).toLocaleString()}</span>
                            <span className="action">: {entry.action}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No history available.</p>
            )}
        </div>
    );
}

export default HistoryPage;
