// ==UserScript==
// @name         Anti Open-in-App Blocker (iOS + FB + Pinterest)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Removes "Open in App" popups including Facebook & Pinterest
// @author       You
// @match        *://*.youtube.com/*
// @match        *://*.reddit.com/*
// @match        *://*.tiktok.com/*
// @match        *://*.instagram.com/*
// @match        *://*.facebook.com/*
// @match        *://*.m.facebook.com/*
// @match        *://*.pinterest.com/*
// @match        *://*.pin.it/*
// @match        *://*.twitter.com/*
// @match        *://*.x.com/*
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function removeOverlays() {

        // 🔹 Generic overlay removal
        const selectors = [
            '[class*="modal"]',
            '[class*="overlay"]',
            '[class*="popup"]',
            '[id*="modal"]',
            '[id*="overlay"]',
            '[id*="popup"]',
            '[class*="banner"]',
            '[role="dialog"]'
        ];

        document.querySelectorAll(selectors.join(',')).forEach(el => {
            if (
                el.innerText &&
                /open.*app|use.*app|get.*app|install|log in|sign up|continue/i.test(el.innerText)
            ) {
                el.remove();
            }
        });

        // 🔹 Facebook-specific cleanup
        if (location.hostname.includes("facebook.com")) {
            document.querySelectorAll('[data-testid], [aria-label]').forEach(el => {
                if (
                    el.innerText &&
                    /log in|sign up|open.*app|continue/i.test(el.innerText)
                ) {
                    el.remove();
                }
            });
        }

        // 🔹 Pinterest-specific cleanup
        if (location.hostname.includes("pinterest.com") || location.hostname.includes("pin.it")) {

            // Remove login/app modals
            document.querySelectorAll('div').forEach(el => {
                if (
                    el.innerText &&
                    /log in|sign up|continue|open.*app|see more/i.test(el.innerText)
                ) {
                    el.remove();
                }
            });

            // Force scrolling (Pinterest LOVES to block it)
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';

            // Remove blur effects
            document.querySelectorAll('*').forEach(el => {
                const style = window.getComputedStyle(el);
                if (style.filter && style.filter.includes('blur')) {
                    el.style.filter = 'none';
                }
            });
        }

        // 🔹 Remove fullscreen blockers (all sites)
        document.querySelectorAll('div').forEach(el => {
            const style = window.getComputedStyle(el);
            if (
                style.position === 'fixed' &&
                (style.height === '100vh' || style.height === '100%') &&
                parseInt(style.zIndex) > 1000
            ) {
                el.remove();
            }
        });

        // 🔹 Restore scrolling globally
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
    }

    // Run repeatedly (important for dynamic sites)
    setInterval(removeOverlays, 1000);

    // Run on load
    window.addEventListener('load', removeOverlays);

})();