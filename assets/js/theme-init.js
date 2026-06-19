(function() {
            const theme = localStorage.getItem('ingen_theme') || 'green';
            const root = document.documentElement;
            if (theme === 'amber') {
                root.style.setProperty('--ingen-green', '#ffb300');
                root.style.setProperty('--ingen-green-dim', '#805900');
                root.style.setProperty('--ingen-green-glow', 'rgba(255,179,0,0.15)');
                root.style.setProperty('--ingen-text', '#ffe082');
                root.style.setProperty('--ingen-text-dim', '#806000');
            } else if (theme === 'red') {
                root.style.setProperty('--ingen-green', '#ff3333');
                root.style.setProperty('--ingen-green-dim', '#800000');
                root.style.setProperty('--ingen-green-glow', 'rgba(255,51,51,0.15)');
                root.style.setProperty('--ingen-text', '#ff9999');
                root.style.setProperty('--ingen-text-dim', '#801a1a');
            }
        })();
