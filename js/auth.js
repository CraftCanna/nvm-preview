/**
 * Simple Client-Side Password Protection
 * Note: This is NOT secure - it only deters casual visitors.
 * The password is visible in source code.
 */

(function() {
    const SITE_PASSWORD = 'Mohamed1234';
    const AUTH_KEY = 'nvm_preview_auth';
    const AUTH_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

    // Check if already authenticated
    function isAuthenticated() {
        const auth = localStorage.getItem(AUTH_KEY);
        if (!auth) return false;

        try {
            const data = JSON.parse(auth);
            if (data.expires > Date.now()) {
                return true;
            }
            localStorage.removeItem(AUTH_KEY);
        } catch (e) {
            localStorage.removeItem(AUTH_KEY);
        }
        return false;
    }

    // Set authentication
    function setAuthenticated() {
        localStorage.setItem(AUTH_KEY, JSON.stringify({
            authenticated: true,
            expires: Date.now() + AUTH_EXPIRY
        }));
    }

    // Create login overlay
    function showLoginOverlay() {
        // Hide the page content
        document.documentElement.style.visibility = 'hidden';

        const overlay = document.createElement('div');
        overlay.id = 'auth-overlay';
        overlay.innerHTML = `
            <style>
                #auth-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #1a3a4a 0%, #2c5364 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 999999;
                    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
                    visibility: visible !important;
                }
                #auth-box {
                    background: white;
                    padding: 3rem;
                    border-radius: 12px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    text-align: center;
                    max-width: 400px;
                    width: 90%;
                }
                #auth-box h1 {
                    font-family: 'Cormorant Garamond', Georgia, serif;
                    color: #1a3a4a;
                    font-size: 1.8rem;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                }
                #auth-box .subtitle {
                    color: #c9a962;
                    font-size: 0.9rem;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    margin-bottom: 1.5rem;
                }
                #auth-box p {
                    color: #666;
                    margin-bottom: 1.5rem;
                    font-size: 0.95rem;
                    line-height: 1.6;
                }
                #auth-input {
                    width: 100%;
                    padding: 1rem;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 1rem;
                    margin-bottom: 1rem;
                    box-sizing: border-box;
                    text-align: center;
                    letter-spacing: 2px;
                }
                #auth-input:focus {
                    outline: none;
                    border-color: #c9a962;
                }
                #auth-submit {
                    width: 100%;
                    padding: 1rem;
                    background: linear-gradient(135deg, #c9a962, #a88b4a);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                #auth-submit:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(201, 169, 98, 0.4);
                }
                #auth-error {
                    color: #e74c3c;
                    font-size: 0.9rem;
                    margin-top: 1rem;
                    display: none;
                }
                #auth-box .note {
                    color: #999;
                    font-size: 0.8rem;
                    margin-top: 1.5rem;
                }
            </style>
            <div id="auth-box">
                <h1>The New Victorian Mansion</h1>
                <div class="subtitle">Preview Access</div>
                <p>This is a private preview of the website redesign. Please enter the access code to continue.</p>
                <form id="auth-form">
                    <input type="password" id="auth-input" placeholder="Enter access code" autocomplete="off">
                    <button type="submit" id="auth-submit">Enter Site</button>
                </form>
                <div id="auth-error">Incorrect access code. Please try again.</div>
                <p class="note">Contact the site administrator if you need access.</p>
            </div>
        `;

        document.body.appendChild(overlay);

        // Focus input
        setTimeout(() => {
            document.getElementById('auth-input').focus();
        }, 100);

        // Handle form submission
        document.getElementById('auth-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const input = document.getElementById('auth-input').value;

            if (input === SITE_PASSWORD) {
                setAuthenticated();
                overlay.remove();
                document.documentElement.style.visibility = 'visible';
            } else {
                document.getElementById('auth-error').style.display = 'block';
                document.getElementById('auth-input').value = '';
                document.getElementById('auth-input').focus();
            }
        });
    }

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (!isAuthenticated()) {
                showLoginOverlay();
            }
        });
    } else {
        if (!isAuthenticated()) {
            showLoginOverlay();
        }
    }
})();
