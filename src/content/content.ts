import type { Message } from '../types.ts';

const BANNER_LIFETIME_MS = 12_000;

const createBanner = () => {
    const host = document.createElement('div');
    host.style.position = 'fixed';
    host.style.top = '12px';
    host.style.right = '12px';
    host.style.zIndex = '2147483647';
    host.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

    const shadow = host.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
        .banner {
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 0, 0, 0.1);
            padding: 12px 16px;
            border-radius: 12px;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
            cursor: pointer;
            transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
            color: #1f1f1f;
            font-size: 14px;
            font-weight: 500;
            max-width: 320px;
            animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            padding-right: 8px; /* Reduce padding on right to accommodate close button */
        }

        @media (prefers-color-scheme: dark) {
            .banner {
                background: rgba(32, 33, 36, 0.9);
                border-color: rgba(255, 255, 255, 0.1);
                color: #e8eaed;
                box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
            }
        }

        .banner:hover {
            transform: scale(1.02);
        }

        .banner:active {
            transform: scale(0.98);
        }

        .icon {
            width: 24px;
            height: 24px;
            flex-shrink: 0;
        }

        .close-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            margin-left: auto;
            color: inherit;
            opacity: 0.6;
            transition: background-color 0.2s, opacity 0.2s;
            padding: 4px;
            box-sizing: border-box;
        }

        .close-btn:hover {
            background-color: rgba(0, 0, 0, 0.08);
            opacity: 1;
        }

        @media (prefers-color-scheme: dark) {
            .close-btn:hover {
                background-color: rgba(255, 255, 255, 0.12);
            }
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeOut {
            to {
                opacity: 0;
                transform: translateY(-10px);
            }
        }
        
        .closing {
            animation: fadeOut 0.3s ease forwards;
        }
    `;

    const banner = document.createElement('div');
    banner.className = 'banner';

    // Google G icon
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');

    const paths = [
        { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z", fill: "#4285F4" },
        { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z", fill: "#34A853" },
        { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21.81-.63z", fill: "#FBBC05" },
        { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z", fill: "#EA4335" }
    ];

    paths.forEach(p => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', p.d);
        path.setAttribute('fill', p.fill);
        svg.appendChild(path);
    });

    const text = document.createElement('span');
    text.textContent = 'Check Google Password Manager';

    banner.appendChild(svg);
    banner.appendChild(text);
    
    const closeBtnDiv = document.createElement('div');
    closeBtnDiv.className = 'close-btn';
    closeBtnDiv.setAttribute('role', 'button');
    closeBtnDiv.setAttribute('aria-label', 'Close');

    const closeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    closeSvg.setAttribute('viewBox', '0 0 24 24');
    closeSvg.setAttribute('fill', 'none');
    closeSvg.setAttribute('stroke', 'currentColor');
    closeSvg.setAttribute('stroke-width', '2.5');
    closeSvg.setAttribute('stroke-linecap', 'round');
    closeSvg.setAttribute('stroke-linejoin', 'round');
    closeSvg.style.width = '100%';
    closeSvg.style.height = '100%';

    const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line1.setAttribute('x1', '18');
    line1.setAttribute('y1', '6');
    line1.setAttribute('x2', '6');
    line1.setAttribute('y2', '18');
    closeSvg.appendChild(line1);

    const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line2.setAttribute('x1', '6');
    line2.setAttribute('y1', '6');
    line2.setAttribute('x2', '18');
    line2.setAttribute('y2', '18');
    closeSvg.appendChild(line2);

    closeBtnDiv.appendChild(closeSvg);
    banner.appendChild(closeBtnDiv);

    const close = () => {
        banner.classList.add('closing');
        setTimeout(() => host.remove(), 300);
    };

    const closeBtn = banner.querySelector('.close-btn');
    closeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        close();
    });

    banner.addEventListener('click', () => {
        const msg: Message = { action: 'open_gpm_for_domain', domain: window.location.hostname };
        chrome.runtime.sendMessage(msg);
        close();
    });

    shadow.appendChild(style);
    shadow.appendChild(banner);
    document.body.appendChild(host);

    setTimeout(close, BANNER_LIFETIME_MS);
};

const monitorForSensitiveInputs = () => {
    const checkForInputs = () => {
        const inputs = document.querySelectorAll('input[type="password"], input[type="email"]');
        if (inputs.length > 0) {
            createBanner();
            return true;
        }
        return false;
    };

    if (checkForInputs()) return;

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                if (checkForInputs()) {
                    observer.disconnect();
                    break;
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Stop observing after 10 seconds to save resources if nothing found
    setTimeout(() => observer.disconnect(), 10000);
};

const EXCLUDED_HOSTS = ['passwords.google.com', 'accounts.google.com'];

if (!window.__gpmHelperInjected && !EXCLUDED_HOSTS.some(host => window.location.hostname.includes(host))) {
    window.__gpmHelperInjected = true;
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', monitorForSensitiveInputs);
    } else {
        monitorForSensitiveInputs();
    }
}
