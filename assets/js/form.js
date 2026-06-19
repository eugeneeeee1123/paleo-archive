// Theme Tint Applier
    (function() {
        const theme = localStorage.getItem('ingen_theme') || 'green';
        if (theme === 'amber') {
            document.body.classList.add('theme-amber');
        } else if (theme === 'red') {
            document.body.classList.add('theme-red');
        }

        // Set Operator Label
        const user = localStorage.getItem('ingen_username') || 'GUEST';
        const clearance = localStorage.getItem('ingen_clearance') || 'LEVEL 1';
        document.getElementById('operatorLabel').textContent = `OPERATOR / 操作员: ${user.toUpperCase()} | CLR / 权限: ${clearance.toUpperCase()}`;
    })();

    // ── LIVE PREVIEW CONTROLLER ────────────────
    const pCard = document.getElementById('previewCard');
    const pCardImg = document.getElementById('pCardImg');
    const pCardFallback = document.getElementById('pCardFallback');
    const pCardIcon = document.getElementById('pCardIcon');
    const pCardDna = document.getElementById('pCardDna');
    const pCardCode = document.getElementById('pCardCode');
    const pCardName = document.getElementById('pCardName');
    const pCardCn = document.getElementById('pCardCn');
    const pCardEra = document.getElementById('pCardEra');
    const pCardRarity = document.getElementById('pCardRarity');
    const pCardInnerData = document.getElementById('pCardInnerData');

    // Star Aggression and Containment calculations
    function getContainment(cls, rarityVal, agg) {
        if (cls === 'hybrid') return 'class';
        if (agg <= 2 && (cls === 'herbivore' || cls === 'cenozoic')) return 'open';
        if (rarityVal >= 4 || agg >= 4) return 'bunker';
        if (agg >= 3) return 'fence';
        return 'open';
    }

    const badgeLabels = { open:'SIM: OPEN RANGE / 模拟开放区', fence:'SIM: MONITORED / 模拟监控', bunker:'SIM: REINFORCED / 模拟加固', class:'FICTIONAL FILE / 虚构档案' };

    function updatePreview() {
        const code = document.getElementById('code').value.toUpperCase();
        const name = document.getElementById('name').value.toUpperCase();
        const cn = document.getElementById('cnName').value;
        const cls = document.getElementById('classSelect').value;
        const rarity = parseInt(document.getElementById('raritySelect').value);
        const era = document.getElementById('era').value;
        const img = document.getElementById('imgUrl').value;
        const agg = parseInt(document.getElementById('aggLevel').value);

        // Update basic values
        pCard.setAttribute('data-class', cls);
        pCardIcon.textContent = cls.toUpperCase();
        pCardCode.textContent = code || 'REF-XXX';
        pCardName.textContent = name || 'SPECIES_NAME';
        pCardCn.textContent = cn || '中文名';
        pCardEra.textContent = era || 'PERIOD_ERA';

        const priorities = { '1': 'ARCHIVE P1', '2': 'ARCHIVE P2', '3': 'ARCHIVE P3', '4': 'ARCHIVE P4', '5': 'ARCHIVE P5' };
        pCardRarity.textContent = priorities[rarity] || 'ARCHIVE P1';

        // Update image or fallback
        if (img && img.trim() !== '') {
            pCardImg.src = img;
            pCardImg.alt = `${name || 'Custom specimen'} reconstruction`;
            pCardImg.style.display = 'block';
            pCardFallback.style.display = 'none';
        } else {
            pCardImg.style.display = 'none';
            pCardFallback.style.display = 'flex';
        }

        // Update DNA sequence text mock
        const bases = 'ATCG'; let seq = '';
        for (let i = 0; i < 24; i++) seq += (i > 0 && i % 4 === 0 ? ' ' : '') + bases[Math.floor(Math.random() * 4)];
        pCardDna.textContent = seq;

        // Update containment and badge
        const ct = getContainment(cls, rarity, agg);
        pCard.setAttribute('data-containment', ct);

        // Remove old badge if exists, and insert new
        let badge = pCardInnerData.querySelector('.containment-badge');
        if (badge) badge.remove();
        badge = document.createElement('div');
        badge.className = 'containment-badge ct-' + ct;
        badge.textContent = badgeLabels[ct];
        pCardInnerData.appendChild(badge);
    }

    // Bind real-time input fields
    const inputs = ['code', 'name', 'cnName', 'classSelect', 'raritySelect', 'era', 'imgUrl', 'aggLevel'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener('input', updatePreview);
        el.addEventListener('change', updatePreview);
    });

    // Run preview once on load
    updatePreview();

    // ── FORM VALIDATION & SAVE ────────────────
    const form = document.getElementById('synthesisForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const requiredFields = [
            { id: 'code', errId: 'codeErr' },
            { id: 'name', errId: 'nameErr' },
            { id: 'cnName', errId: 'cnNameErr' },
            { id: 'era', errId: 'eraErr' },
            { id: 'length', errId: 'lengthErr' },
            { id: 'weight', errId: 'weightErr' },
            { id: 'description', errId: 'descErr' },
            { id: 'fact', errId: 'factErr' }
        ];

        requiredFields.forEach(f => {
            const el = document.getElementById(f.id);
            const err = document.getElementById(f.errId);
            el.classList.remove('input-error');
            err.style.display = 'none';

            if (el.value.trim() === '') {
                el.classList.add('input-error');
                err.style.display = 'block';
                isValid = false;
            }
        });

        // Numeric stats validation
        const atkEl = document.getElementById('atk');
        const atkErr = document.getElementById('atkErr');
        atkEl.classList.remove('input-error');
        atkErr.style.display = 'none';
        if (atkEl.value.trim() === '' || isNaN(atkEl.value) || parseFloat(atkEl.value) <= 0) {
            atkEl.classList.add('input-error');
            atkErr.style.display = 'block';
            isValid = false;
        }

        const hpEl = document.getElementById('hp');
        const hpErr = document.getElementById('hpErr');
        hpEl.classList.remove('input-error');
        hpErr.style.display = 'none';
        if (hpEl.value.trim() === '' || isNaN(hpEl.value) || parseFloat(hpEl.value) <= 0) {
            hpEl.classList.add('input-error');
            hpErr.style.display = 'block';
            isValid = false;
        }

        if (isValid) {
            // Compile asset payload
            const newAsset = {
                code: document.getElementById('code').value.toUpperCase(),
                name: document.getElementById('name').value.toUpperCase().trim(),
                cn: document.getElementById('cnName').value.trim(),
                class: document.getElementById('classSelect').value,
                rarity: document.getElementById('raritySelect').value,
                era: document.getElementById('era').value.trim(),
                len: document.getElementById('length').value.trim(),
                wgt: document.getElementById('weight').value.trim(),
                atk: document.getElementById('atk').value.trim(),
                hp: document.getElementById('hp').value.trim(),
                agg: parseInt(document.getElementById('aggLevel').value),
                img: document.getElementById('imgUrl').value.trim(),
                desc: document.getElementById('description').value.trim(),
                fact: document.getElementById('fact').value.trim()
            };

            // Read existing custom assets, append, and save
            const customAssets = JSON.parse(localStorage.getItem('ingen_custom_assets') || '[]');
            customAssets.push(newAsset);
            localStorage.setItem('ingen_custom_assets', JSON.stringify(customAssets));

            // Display success modal
            document.getElementById('successOverlay').classList.add('active');
        }
    });
