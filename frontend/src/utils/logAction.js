export const logAction = async (action) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            // console.error('Authorization token not found in localStorage.');
            return;
        }

        const response = await fetch('http://localhost:5000/history/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ action }),
        });

        if (response.status === 401) {
            // console.warn('Token expired or unauthorized. Redirecting to login.');
            localStorage.removeItem('token');
            window.location.href = '/login';
        } else if (!response.ok) {
            console.error(
                `Failed to log action. Status: ${response.status}, Message: ${response.statusText}`
            );
        } else {
            // console.log('Action logged successfully:', action);
        }
    } catch (error) {
        console.error('Error logging action:', error);
    }
};
