// ==UserScript==
// @name         Faster Video Buffering for iOS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Tries to increase the video buffering rate on iOS devices
// @author       You
// @match        *://*/*  // Match all URLs
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to enhance video buffering
    function enhanceVideoBuffering(videoElement) {
        // Preload the video aggressively
        videoElement.preload = 'auto'; // Set to 'auto' to preload as much as possible
        
        // Try to increase the buffer size by manipulating the video source
        // NOTE: This could be ignored by iOS, but it's worth trying.
        videoElement.buffering = true;
        
        // Optionally increase playback rate (this may distort video but speeds up buffering)
        videoElement.playbackRate = 1.5; // Increase to 1.5x to buffer faster

        // Attempt to pre-buffer the video by starting playback
        if (videoElement.paused) {
            videoElement.play().catch(err => console.log('Video play failed:', err));
        }

        // Add event listener to monitor buffering state
        videoElement.addEventListener('waiting', function() {
            console.log('Video is buffering...');
        });

        // Continuously check and try to force buffer
        setInterval(() => {
            if (videoElement.buffered.length) {
                let bufferedTime = videoElement.buffered.end(0) - videoElement.currentTime;
                if (bufferedTime < 5) { // If buffered less than 5 seconds, try to buffer more
                    console.log('Buffering aggressively...');
                    videoElement.play();
                }
            }
        }, 1000);
    }

    // Function to monitor and modify video elements on the page
    function monitorVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (!video.dataset.bufferedScriptApplied) {
                enhanceVideoBuffering(video);
                video.dataset.bufferedScriptApplied = true; // Avoid applying twice
            }
        });
    }

    // Run monitorVideos every 2 seconds to catch dynamically loaded videos
    setInterval(monitorVideos, 2000);

    // Also call on page load
    window.addEventListener('load', monitorVideos);
})();