const baseURL = 'http://localhost:8086'; // Spring Boot 서버의 URL

document.getElementById("startSession").addEventListener("click", startSession);

async function startSession() {
    try {
        const sessionId = await createSession();
        const token = await createToken(sessionId);
        initializeOpenVidu(sessionId, token);
    } catch (error) {
        console.error("Error starting session:", error);
    }
}

async function createSession() {
    try {
        const response = await fetch(`${baseURL}/api/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to create session');
        }
        return await response.text();
    } catch (error) {
        console.error("createSession error:", error);
        throw error;
    }
}

async function createToken(sessionId) {
    try {
        const response = await fetch(`${baseURL}/api/sessions/${sessionId}/connections`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to create token');
        }
        return await response.text();
    } catch (error) {
        console.error("createToken error:", error);
        throw error;
    }
}

function initializeOpenVidu(sessionId, token) {
    if (typeof OpenVidu === 'undefined') {
        console.error('OpenVidu is not defined');
        return;
    }

    const OV = new OpenVidu();
    const session = OV.initSession();

    session.on('streamCreated', (event) => {
        session.subscribe(event.stream, 'video-container');
    });

    session.connect(token)
        .then(() => {
            const publisher = OV.initPublisher('video-container');
            session.publish(publisher);
        })
        .catch(error => {
            console.error('Error connecting to the session:', error);
        });
}
