// Theme Tint changer
    function changeThemeTint(tint) {
        const body = document.body;
        const container = document.getElementById('portalContainer');
        const overlay = document.getElementById('accessOverlay');
        
        body.className = '';
        container.className = 'portal-container';
        overlay.className = 'access-overlay';
        
        if (tint === 'amber') {
            body.classList.add('theme-amber');
            container.classList.add('theme-amber');
            overlay.classList.add('theme-amber');
        } else if (tint === 'red') {
            body.classList.add('theme-red');
            container.classList.add('theme-red');
            overlay.classList.add('theme-red');
        }
    }

    // Form Handling
    const form = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const accessKeyInput = document.getElementById('accessKey');
    const clearanceSelect = document.getElementById('clearance');
    const themeSelect = document.getElementById('themeSelect');

    const usernameError = document.getElementById('usernameError');
    const keyError = document.getElementById('keyError');

    function resetIndexIntroState() {
        const overlay = document.getElementById('accessOverlay');
        const consoleEl = document.getElementById('bootConsole');
        const cursor = document.getElementById('bootCursor');
        
        if (overlay) {
            overlay.classList.remove('active', 'theme-amber', 'theme-red');
        }
        if (consoleEl && cursor) {
            consoleEl.querySelectorAll('.boot-row').forEach(row => row.remove());
            if (!consoleEl.contains(cursor)) {
                consoleEl.appendChild(cursor);
            }
        }
    }

    window.addEventListener('pageshow', function(event) {
        const navEntry = performance.getEntriesByType('navigation')[0];
        const referrerFile = document.referrer.split('/').pop().split('?')[0].split('#')[0].toLowerCase();
        const returnedFromOtherHtml = referrerFile.endsWith('.html') && referrerFile !== 'index.html';
        const returnedFromHistory = event.persisted || (navEntry && navEntry.type === 'back_forward');
        const skipIntro = sessionStorage.getItem('skip_index_intro') === 'true';
        
        if (returnedFromOtherHtml || returnedFromHistory || skipIntro) {
            resetIndexIntroState();
            sessionStorage.removeItem('skip_index_intro');
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Reset errors
        usernameInput.classList.remove('input-error');
        usernameError.style.display = 'none';
        accessKeyInput.classList.remove('input-error');
        keyError.style.display = 'none';

        // Username validation
        const usernameVal = usernameInput.value.trim();
        if (usernameVal.length < 3) {
            usernameInput.classList.add('input-error');
            usernameError.style.display = 'block';
            isValid = false;
        }

        // Access Key validation: must start with INGEN- followed by at least 4 alphanumeric chars
        const keyVal = accessKeyInput.value.trim();
        const keyPattern = /^INGEN-[A-Za-z0-9]{4,}$/;
        if (!keyPattern.test(keyVal)) {
            accessKeyInput.classList.add('input-error');
            keyError.style.display = 'block';
            isValid = false;
        }

        if (isValid) {
            // Save state to localStorage
            localStorage.setItem('ingen_username', usernameVal);
            localStorage.setItem('ingen_clearance', clearanceSelect.value);
            localStorage.setItem('ingen_theme', themeSelect.value);

            // Display loading boot screen
            document.getElementById('accessOverlay').classList.add('active');
            
            // Re-tint overlay to match selection
            changeThemeTint(themeSelect.value);

            // Run boot display
            runBootLines();
        }
    });

    // Boot lines animations
    const bootSequence = [
        'ESTABLISHING SECURE CONNECTION ... DONE / 正在建立安全连接 ... 完成',
        'NEGOTIATING RSA KEY HANDSHAKE ... OK / 正在进行RSA密钥握手 ... 成功',
        'CHECKING ACCOUNT STATUS ......... ACTIVE / 正在检查账户状态 ... 激活',
        'UPLOADING CLEARANCE TO NODE ..... LEVEL DETECTED: / 正在上传许可凭证 ... 检测到级别: ', // will append clearance level
        'COMPILING ARCHIVE DIRECTORY ..... OK / 正在编译归档目录 ... 完成',
        'REDIRECTING TO PALEO_ARCHIVE .... NOW / 正在重定向到古生物图鉴 ... 即刻'
    ];

    function runBootLines() {
        const consoleEl = document.getElementById('bootConsole');
        const cursor = document.getElementById('bootCursor');
        const clearanceVal = clearanceSelect.value.toUpperCase();
        
        let seqIndex = 0;

        function addLine() {
            if (seqIndex < bootSequence.length) {
                let lineText = bootSequence[seqIndex];
                if (seqIndex === 3) {
                    lineText += clearanceVal;
                }
                
                const span = document.createElement('span');
                span.className = 'boot-row';
                span.textContent = lineText;
                consoleEl.insertBefore(span, cursor);
                
                seqIndex++;
                setTimeout(addLine, 350);
            } else {
                setTimeout(() => {
                    window.location.href = 'gallery.html';
                }, 600);
            }
        }

        setTimeout(addLine, 200);
    }
