// API Configuration
const API_BASE_URL = 'http://192.168.100.60:3000';

// Helper function to get stored token
function getToken() {
    return localStorage.getItem('token');
}

// Helper function to get stored user
function getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Helper function to check if user is logged in
function isLoggedIn() {
    return !!getToken();
}

// Helper function to logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
}

// Helper function to make authenticated API calls
async function apiCall(endpoint, method = 'GET', body = null) {
    const token = getToken();
    
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(API_BASE_URL + endpoint, options);
        const data = await response.json();
        
        // If token is invalid, logout
        if (response.status === 401) {
            logout();
            return null;
        }
        
        return data;
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

// Helper function to format dates
function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Helper function to format currency
function formatCurrency(amount) {
    return '₱' + parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Helper function to get status badge class
function getStatusClass(status) {
    switch(status) {
        case 'active': return 'status-active';
        case 'completed': return 'status-completed';
        case 'cancelled': return 'status-cancelled';
        default: return 'status-default';
    }
}

// Helper function to get phase badge class
function getPhaseClass(phase) {
    switch(phase) {
        case 'submission': return 'phase-submission';
        case 'acceptance': return 'phase-acceptance';
        case 'handoff': return 'phase-handoff';
        case 'inspection': return 'phase-inspection';
        case 'approval': return 'phase-approval';
        case 'working': return 'phase-working';
        case 'pickup': return 'phase-pickup';
        case 'completed': return 'phase-completed';
        default: return 'phase-default';
    }
}

// Helper function to format phase name
function formatPhase(phase) {
    return phase.charAt(0).toUpperCase() + phase.slice(1);
}