(function () {
  const page = document.documentElement.dataset.page;
  const UNKNOWN_HYBRID_IMAGE = 'assets/images/generated/unknown-hybrid.webp';

  if (page === 'gallery' || page === 'field-guide' || page === 'timescale') {
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
  }

  function setupRedCodeModal() {
    const alertModal = document.getElementById('redCodeModal') || document.querySelector('.pl-modal-backdrop');
    if (!alertModal) return;

    function openRedAlert(e) {
      if (e) e.preventDefault();
      alertModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeRedAlert(e) {
      if (e) e.preventDefault();
      alertModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.js-open-alert, #openRedAlertBtn').forEach(btn => {
      btn.addEventListener('click', openRedAlert);
    });
    document.querySelectorAll('.js-close-alert, #closeRedAlertModal, #closeRedAlertBtn, .pl-modal-close').forEach(btn => {
      btn.addEventListener('click', closeRedAlert);
    });

    alertModal.addEventListener('click', function(e) {
      if (e.target === alertModal) closeRedAlert();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && alertModal.classList.contains('active')) closeRedAlert();
    });

    const alertTabs = alertModal.querySelectorAll('.pl-alert-tab');
    const cards = alertModal.querySelectorAll('.pl-threat-card');
    alertTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        alertTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        const filter = (this.getAttribute('data-status') || 'all').toLowerCase();
        cards.forEach(card => {
          const cardStatus = (card.getAttribute('data-status') || '').toLowerCase();
          card.style.display = (filter === 'all' || cardStatus === filter) ? 'block' : 'none';
        });
      });
    });

    window.openRedAlert = openRedAlert;
    window.closeRedAlert = closeRedAlert;
  }

  function init_index() {
// Theme Tint changer
    function changeThemeTint(tint) {
        const body = document.body;
        const container = document.getElementById('portalContainer');
        const overlay = document.getElementById('accessOverlay');
        
        body.classList.remove('theme-amber', 'theme-red');
        if (container) container.className = 'portal-container';
        if (overlay) overlay.className = 'access-overlay';
        
        if (tint === 'amber') {
            body.classList.add('theme-amber');
            if (container) container.classList.add('theme-amber');
            if (overlay) overlay.classList.add('theme-amber');
        } else if (tint === 'red') {
            body.classList.add('theme-red');
            if (container) container.classList.add('theme-red');
            if (overlay) overlay.classList.add('theme-red');
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
                    window.location.href = 'field-guide.html';
                }, 600);
            }
        }

        setTimeout(addLine, 200);
    }

    // ── PALEOLOGIST RED CODE ALERT & NAVIGATION ──
    setupRedCodeModal();

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    if (menuToggle && mainNav) {
      menuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('mobile-open');
      });
    }

Object.assign(window, { changeThemeTint, openRedAlert, closeRedAlert });
}

  function init_gallery() {
    const speciesData = Array.isArray(window.PALEO_SPECIES) ? window.PALEO_SPECIES : [];
// ── BOOT ──────────────────────────────
    const bootLines = [
      'PALEO ARCHIVE SYSTEMS v4.2 .......... OK / 正在启动古生物档案系统 ... 成功',
      'LOADING FIELD INDEX PROTOCOLS ....... OK / 正在加载标本索引协议 ... 成功',
      'VERIFYING TERMINAL CLEARANCE ........ GRANTED / 正在验证终端许可权限 ... 已获授权',
      'INITIALIZING ASSET DATABASE ......... OK / 正在初始化资产数据库 ... 成功',
      'FOSSIL ERA INDEXING ................. DONE / 正在编制地质年代索引 ... 完成',
      'FIELD STATUS NETWORK ................ ONLINE / 标本状态监控网络 ... 在线',
      '> WELCOME — LEVEL 4 CLEARANCE ACTIVE / 欢迎 — 4级系统许可已激活',
      '> SYSTEM READY / 终端准备就绪',
    ];
    let bIdx = 0;
    const bTextEl = document.getElementById('boot-text');
    const bOverlay = document.getElementById('boot-overlay');

    const hasBooted = sessionStorage.getItem('ingen_booted');
    if (hasBooted && bOverlay) {
      bOverlay.style.display = 'none';
    }

    function addBootLine() {
      if (hasBooted) return;
      if (bIdx < bootLines.length) {
        const s = document.createElement('span');
        s.className = 'boot-line'; s.textContent = bootLines[bIdx];
        bTextEl.insertBefore(s, document.getElementById('boot-cursor'));
        bIdx++;
        setTimeout(addBootLine, bIdx < 6 ? 260 : 380);
      } else {
        sessionStorage.setItem('ingen_booted', 'true');
        setTimeout(() => {
          bOverlay.classList.add('fade-out');
          setTimeout(() => bOverlay.style.display='none', 900);
        }, 500);
      }
    }
    if (!hasBooted) {
      setTimeout(addBootLine, 300);
    }

    // ── CLOCK ─────────────────────────────
    function updateClock() {
      const el = document.getElementById('sysClock');
      if (el) el.textContent = new Date().toTimeString().slice(0,8);
    }
    setInterval(updateClock, 1000); updateClock();

    // ── CONTAINMENT LOGIC ──────────────────
    const CT = {
      labels: { open:'SIMULATION: OPEN HABITAT / 模拟：开放栖息地', fence:'SIMULATION: MONITORED RANGE / 模拟：监控区域', bunker:'SIMULATION: REINFORCED PADDOCK / 模拟：加固园区', class:'FICTIONAL OR CUSTOM RECORD / 虚构或自定义记录' },
      badgeLabels: { open:'SIM: OPEN RANGE / 模拟开放区', fence:'SIM: MONITORED / 模拟监控', bunker:'SIM: REINFORCED / 模拟加固', class:'FICTIONAL FILE / 虚构档案' },
    };
    function getContainment(cls, rarity, agg) {
      if (cls==='hybrid') return 'class';
      if (agg<=2 && (cls==='herbivore'||cls==='cenozoic')) return 'open';
      if (rarity>=4 || agg>=4) return 'bunker';
      if (agg>=3) return 'fence';
      return 'open';
    }
    function getPaddock(cls, name) {
      if (cls==='hybrid') return 'indominus';
      if (cls==='aquatic') return 'mosasaur';
      if (cls==='pterosaur') return 'aviary';
      if (cls==='herbivore') return 'gyrosphere';
      if (cls==='cenozoic') return 'cenozoic';
      if (cls==='amphibian') return 'sector5';
      const small = ['Velociraptor','Blue','Deinonychus','Troodon','Coelophysis','Compsognathus'];
      return small.includes(name) ? 'raptor' : 'trex';
    }
    function formatSpeciesLength(species) {
      if (species.len === null || species.len === undefined || species.len === '') return 'N/A';
      return `${species.len}${species.lenUnit || ''}`;
    }
    function formatSpeciesWeight(species) {
      if (species.wgt === null || species.wgt === undefined || species.wgt === '') return 'N/A';
      return `${Number(species.wgt).toLocaleString()}${species.wgtUnit || ''}`;
    }
    function shortEraLabel(era) {
      const value = String(era || '');
      if (value.includes('Cretaceous')) return value.includes('Late') ? 'Late Cret' : value.includes('Early') ? 'Early Cret' : 'Mid Cret';
      if (value.includes('Jurassic')) return value.includes('Late') ? 'Late Jur' : value.includes('Early') ? 'Early Jur' : 'Jurassic';
      if (value.includes('Pleistocene')) return 'Pleisto.';
      if (value.includes('Paleocene')) return 'Paleoc.';
      if (value.includes('Oligocene')) return 'Oligoc.';
      return value || 'Unknown';
    }
    function createSpeciesCard(species) {
      const card = document.createElement('div');
      card.className = 'card';
      card.setAttribute('data-class', species.class);
      card.setAttribute('data-rarity', species.rarity);
      card.setAttribute('data-name', species.name);
      card.setAttribute('data-cn', species.cn);

      const vis = document.createElement('div');
      vis.className = 'card-vis';

      const img = document.createElement('img');
      img.src = species.thumb;
      img.setAttribute('data-full-src', species.full);
      img.className = 'card-img';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = `${species.name} reconstruction`;

      const icon = document.createElement('span');
      icon.className = 'class-icon';
      icon.textContent = species.class.toUpperCase();

      const r = parseInt(species.rarity) || 3;
      const statusKey = r >= 5 ? 'cr' : r === 4 ? 'en' : r === 3 ? 'vu' : 'lc';
      card.setAttribute('data-iucn', statusKey);
      card.setAttribute('data-diet', (species.diet || '').toLowerCase());

      vis.append(img, icon);

      const cardData = document.createElement('div');
      cardData.className = 'card-data';

      const mainData = document.createElement('div');
      const code = document.createElement('div');
      code.className = 'spec-code';
      code.textContent = species.code;

      const name = document.createElement('h3');
      name.className = 'spec-name';
      name.textContent = species.name.toUpperCase();

      const cn = document.createElement('div');
      cn.className = 'spec-cn';
      cn.textContent = species.cn;

      mainData.append(code, name, cn);

      const stats = document.createElement('div');
      stats.className = 'spec-stats';
      const eraStat = document.createElement('div');
      const eraText = document.createElement('b');
      eraText.textContent = shortEraLabel(species.era);
      eraStat.appendChild(eraText);

      const rarityStat = document.createElement('div');
      const rarityText = document.createElement('b');
      rarityText.textContent = `ARCHIVE P${species.rarity}`;
      rarityStat.appendChild(rarityText);
      stats.append(eraStat, rarityStat);

      const actionLink = document.createElement('div');
      actionLink.className = 'pl-card-action';
      actionLink.innerHTML = 'View Profile &nbsp;›';

      cardData.append(mainData, stats, actionLink);

      const hidden = document.createElement('div');
      hidden.className = 'hidden-data';
      hidden.setAttribute('data-atk', species.atk);
      hidden.setAttribute('data-hp', species.hp);
      hidden.setAttribute('data-era', species.era);
      hidden.setAttribute('data-len', formatSpeciesLength(species));
      hidden.setAttribute('data-wgt', formatSpeciesWeight(species));
      hidden.setAttribute('data-agg', species.agg);
      hidden.setAttribute('data-fact', species.fact);
      hidden.setAttribute('data-desc', species.desc);

      card.append(vis, cardData, hidden);
      return card;
    }
    function renderSpeciesGallery() {
      document.querySelectorAll('.grid[data-species-class]').forEach(grid => {
        grid.textContent = '';
      });
      speciesData.forEach(species => {
        const grid = document.querySelector(`#sec-${species.class} .grid`);
        if (grid) grid.appendChild(createSpeciesCard(species));
      });
    }

    // ── SPECIMEN RECORD LOOKUP ─────────────
    function findSpeciesRecord(name) {
      const normalizedName = String(name || '').toLowerCase();
      return speciesData.find(species => species.name.toLowerCase() === normalizedName) || null;
    }

    function getSpecimenRecord(name, card) {
      const region = card ? card.getAttribute('data-region') : '';
      const site = card ? card.getAttribute('data-site') : '';
      if (card && card.getAttribute('data-custom-record') === 'true' && region && site) {
        return { region, site };
      }

      const species = findSpeciesRecord(name);
      if (species && species.region && species.site) return species;

      return region && site ? { region, site } : null;
    }

    const fossilSiteLookup = [
      { test:/isla nublar/i, lat:9.8, lon:-84.7 },
      { test:/cedar mountain/i, lat:38.7, lon:-110.4 },
      { test:/hell creek/i, lat:46.7, lon:-104.5 },
      { test:/lance formation/i, lat:43.2, lon:-106.5 },
      { test:/morrison formation/i, lat:39.0, lon:-108.0 },
      { test:/djadochta/i, lat:43.5, lon:103.5 },
      { test:/la colonia/i, lat:-43.0, lon:-68.0 },
      { test:/kem kem/i, lat:30.5, lon:-4.5 },
      { test:/candeleros|huincul|neuqu[eé]n/i, lat:-39.1, lon:-69.0 },
      { test:/nemegt/i, lat:43.5, lon:101.0 },
      { test:/horseshoe canyon/i, lat:51.0, lon:-112.0 },
      { test:/elrhaz/i, lat:17.5, lon:9.5 },
      { test:/maevarano/i, lat:-16.3, lon:46.5 },
      { test:/yixian|liaoning/i, lat:41.3, lon:120.8 },
      { test:/hanson formation/i, lat:-84.4, lon:164.7 },
      { test:/wealden|surrey/i, lat:51.0, lon:-0.4 },
      { test:/ischigualasto/i, lat:-30.0, lon:-68.0 },
      { test:/ghost ranch/i, lat:36.3, lon:-106.5 },
      { test:/solnhofen/i, lat:48.9, lon:11.0 },
      { test:/red beds|texas\/oklahoma/i, lat:34.0, lon:-99.0 },
      { test:/two medicine/i, lat:48.0, lon:-112.8 },
      { test:/lameta formation/i, lat:21.1, lon:79.0 },
      { test:/shaximiao|sichuan/i, lat:29.5, lon:104.0 },
      { test:/javelina/i, lat:29.2, lon:-103.2 },
      { test:/niobrara|kansas/i, lat:39.1, lon:-99.2 },
      { test:/santana formation|cear[aá]/i, lat:-7.2, lon:-39.6 },
      { test:/dorset/i, lat:50.7, lon:-2.5 },
      { test:/transylvania/i, lat:46.0, lon:24.0 },
      { test:/solim[oõ]es|amazon basin/i, lat:-7.5, lon:-70.0 },
      { test:/santa maria formation|rio grande do sul/i, lat:-29.7, lon:-53.5 },
      { test:/bauru group|s[aã]o paulo/i, lat:-21.5, lon:-49.0 },
      { test:/ellesmere island/i, lat:79.0, lon:-80.0 },
      { test:/greenland/i, lat:72.0, lon:-40.0 },
      { test:/latvia/i, lat:57.0, lon:25.0 },
      { test:/dockum formation/i, lat:34.0, lon:-102.0 },
      { test:/maastricht formation|limburg/i, lat:50.85, lon:5.69 },
      { test:/pisco formation|ica, peru/i, lat:-14.3, lon:-75.7 },
      { test:/wadi al-hitan|fayum/i, lat:29.3, lon:30.1 },
      { test:/oxford clay/i, lat:52.2, lon:-0.7 },
      { test:/cleveland shale|ohio/i, lat:41.5, lon:-81.7 },
      { test:/burgess shale/i, lat:51.43, lon:-116.47 },
      { test:/cerrej[oó]n/i, lat:10.8, lon:-72.7 },
      { test:/la brea tar pits/i, lat:34.06, lon:-118.36 },
      { test:/white river formation/i, lat:43.8, lon:-102.3 },
      { test:/irdin manha/i, lat:43.8, lon:112.3 },
      { test:/mauritius/i, lat:-20.2, lon:57.5 },
      { test:/luning formation/i, lat:38.5, lon:-118.4 },
      { test:/pierre shale/i, lat:44.5, lon:-100.2 },
      { test:/ceratopsian.*alberta|campanian, alberta/i, lat:50.8, lon:-112.5 },
      { test:/siberia/i, lat:61.0, lon:90.0 },
      { test:/australia/i, lat:-25.0, lon:134.0 },
      { test:/kazakhstan/i, lat:44.0, lon:68.0 },
      { test:/patagonia|santa cruz formation/i, lat:-47.0, lon:-70.0 },
      { test:/argentina|uruguay/i, lat:-34.0, lon:-64.0 },
      { test:/mongolia|gobi desert/i, lat:45.0, lon:104.0 },
      { test:/china/i, lat:35.0, lon:104.0 },
      { test:/england|france|germany|switzerland|italy|portugal|poland/i, lat:50.0, lon:10.0 },
      { test:/north america/i, lat:40.0, lon:-100.0 },
      { test:/south america/i, lat:-20.0, lon:-60.0 },
      { test:/africa/i, lat:4.0, lon:22.0 },
      { test:/eurasia|europe \/ asia/i, lat:48.0, lon:60.0 },
      { test:/global ocean|global permian oceans|ordovician oceans|silurian oceans/i, lat:0.0, lon:-30.0 },
      { test:/global|all continents/i, lat:0.0, lon:0.0 }
    ];

    const fossilRegionFallback = {
      north_america:{lat:40,lon:-100},
      south_america:{lat:-20,lon:-60},
      europe:{lat:50,lon:10},
      africa:{lat:4,lon:22},
      asia:{lat:42,lon:95},
      australia:{lat:-25,lon:134},
      antarctica:{lat:-78,lon:20},
      greenland:{lat:72,lon:-40},
      isla_nublar:{lat:9.8,lon:-84.7},
      global_ocean:{lat:0,lon:-30},
      global:{lat:0,lon:0}
    };

    function resolveFossilSite(data) {
      const location = data.site || '';
      const matchedSite = fossilSiteLookup.find(site => site.test.test(location));
      if (matchedSite) return matchedSite;
      return fossilRegionFallback[data.region] || fossilRegionFallback.global;
    }

    function projectFossilSite(lat, lon) {
      return {
        x: ((lon + 180) / 360) * 800,
        y: ((90 - lat) / 180) * 400
      };
    }

    function formatFossilCoordinates(lat, lon) {
      const latLabel = `${Math.abs(lat).toFixed(1)}°${lat >= 0 ? 'N' : 'S'}`;
      const lonLabel = `${Math.abs(lon).toFixed(1)}°${lon >= 0 ? 'E' : 'W'}`;
      return `${latLabel}  /  ${lonLabel}`;
    }

    function formatFossilSiteLabel(location) {
      const primaryName = location.split(',')[0].split('—')[0].trim();
      return primaryName.toUpperCase().slice(0, 28);
    }

    function highlightMap(name, classified, card) {
      document.querySelectorAll('.map-region').forEach(r=>r.classList.remove('active','classified-zone'));
      const d = getSpecimenRecord(name, card);
      const cap = document.getElementById('mapCaption');
      const lt = document.getElementById('mapLocText');
      const coordsText = document.getElementById('mapCoordsText');
      const sectionLabel = document.getElementById('mapSectionLabel');
      const siteKicker = document.getElementById('mapSiteKicker');
      const mapSvg = document.getElementById('modalMap');
      const marker = document.getElementById('fossilMarker');
      const markerLeader = document.getElementById('mapMarkerLeader');
      const markerLabel = document.getElementById('mapMarkerLabel');
      const markerText = document.getElementById('mapMarkerText');
      if (!d || !d.region || !d.site) {
        lt.textContent='DATA UNAVAILABLE / 暂无地点数据';
        coordsText.textContent='—';
        marker.className.baseVal='fossil-marker';
        markerLeader.className.baseVal='map-marker-leader';
        markerLabel.className.baseVal='map-marker-label';
        cap.className='map-site-card';
        return;
      }
      const reg = d.region;
      const regEl = document.getElementById('reg-'+reg);
      const isOrigin = classified || reg === 'isla_nublar';
      const isRange = reg === 'global' || reg === 'global_ocean' || /^global/i.test(d.site);
      sectionLabel.textContent = isOrigin
        ? 'RECORD ORIGIN / 记录起源地'
        : isRange
          ? 'KNOWN DISTRIBUTION / 已知分布范围'
          : 'PRIMARY FOSSIL LOCALITY / 主要化石出土地点';
      siteKicker.textContent = isOrigin
        ? 'ORIGIN RECORD / 起源记录'
        : isRange
          ? 'DISTRIBUTION RANGE / 分布范围'
          : 'FOSSIL SITE / 化石地点';
      mapSvg.setAttribute('aria-label', isOrigin
        ? 'World map showing the fictional or custom record origin'
        : isRange
          ? 'World map showing the known distribution range'
          : 'World map showing the selected fossil locality');
      if (isRange) {
        document.querySelectorAll('.map-region:not(#reg-isla_nublar)').forEach(region => region.classList.add('active'));
        marker.className.baseVal='fossil-marker';
        markerLeader.className.baseVal='map-marker-leader';
        markerLabel.className.baseVal='map-marker-label';
        cap.className='map-site-card';
        lt.textContent=d.site;
        coordsText.textContent='MULTIPLE REGIONS / 多区域分布';
        return;
      }
      const site = resolveFossilSite(d);
      const point = projectFossilSite(site.lat, site.lon);
      const isClassified = isOrigin;
      if (isOrigin) {
        if (regEl) regEl.classList.add('classified-zone');
        cap.className='map-site-card cls-cap';
      } else {
        if (regEl) regEl.classList.add('active');
        cap.className='map-site-card';
      }
      marker.setAttribute('transform',`translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})`);
      marker.className.baseVal = `fossil-marker active${isClassified ? ' classified' : ''}`;
      const placeLabelLeft = point.x > 590;
      const labelX = placeLabelLeft ? point.x - 190 : point.x + 16;
      const labelY = Math.max(8, Math.min(368, point.y - 30));
      markerLeader.setAttribute('x1',point.x.toFixed(1));
      markerLeader.setAttribute('y1',point.y.toFixed(1));
      markerLeader.setAttribute('x2',(placeLabelLeft ? labelX + 174 : labelX).toFixed(1));
      markerLeader.setAttribute('y2',(labelY + 11).toFixed(1));
      markerLeader.className.baseVal='map-marker-leader active';
      markerLabel.setAttribute('transform',`translate(${labelX.toFixed(1)} ${labelY.toFixed(1)})`);
      markerLabel.className.baseVal=`map-marker-label active${isClassified ? ' classified' : ''}`;
      markerText.textContent=isOrigin ? 'ORIGIN SITE' : formatFossilSiteLabel(d.site);
      lt.textContent = d.site;
      coordsText.textContent = formatFossilCoordinates(site.lat, site.lon);
    }

    // ── OPERATOR DISPLAY ──────────────────
    (function() {
      const user = localStorage.getItem('ingen_username') || 'GUEST';
      const clearance = localStorage.getItem('ingen_clearance') || 'LEVEL 1';
      const displayEl = document.getElementById('userClearanceDisplay');
      if (displayEl) {
        displayEl.textContent = `OPERATOR / 操作员: ${user.toUpperCase()} | CLR / 权限: ${clearance.toUpperCase()}`;
      }
    })();

    renderSpeciesGallery();

    // ── LOAD CUSTOM ASSETS ────────────────
    function escapeHtml(value) {
      return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char]));
    }

    (function loadCustomAssets() {
      const customAssets = JSON.parse(localStorage.getItem('ingen_custom_assets') || '[]');
      customAssets.forEach((asset, index) => {
        const grid = document.querySelector(`#sec-${asset.class} .grid`);
        if (!grid) return;

        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-class', asset.class);
        card.setAttribute('data-rarity', asset.rarity);
        card.setAttribute('data-name', asset.name);
        card.setAttribute('data-cn', asset.cn);
        card.setAttribute('data-custom-record', 'true');
        card.setAttribute('data-custom-index', String(index));
        card.setAttribute('data-status', asset.status || 'success');
        card.setAttribute('data-region', 'isla_nublar');
        card.setAttribute('data-site', 'ISLA NUBLAR — Sector 4/Lab Custom Gen');

        const rarityMap = {
          '1': 'ARCHIVE P1',
          '2': 'ARCHIVE P2',
          '3': 'ARCHIVE P3',
          '4': 'ARCHIVE P4',
          '5': 'ARCHIVE P5'
        };
        const rarityText = rarityMap[asset.rarity] || asset.rarity || 'Common';
        const classUpper = asset.class.toUpperCase();
        const status = asset.status === 'failure' ? 'failure' : 'success';
        const statusLabel = status === 'failure' ? 'SYNTHESIS FAILURE' : 'SYNTHESIS SUCCESS';
        const isAlertUnknown = parseInt(asset.agg, 10) >= 4;
        card.classList.toggle('synthesis-alert', isAlertUnknown);
        const safe = {
          img: escapeHtml(asset.img || UNKNOWN_HYBRID_IMAGE),
          name: escapeHtml(asset.name || ''),
          code: escapeHtml(asset.code || ''),
          cn: escapeHtml(asset.cn || ''),
          era: escapeHtml(asset.era || ''),
          atk: escapeHtml(asset.atk || ''),
          hp: escapeHtml(asset.hp || ''),
          len: escapeHtml(asset.len || ''),
          wgt: escapeHtml(asset.wgt || ''),
          agg: escapeHtml(asset.agg || ''),
          fact: escapeHtml(asset.fact || ''),
          desc: escapeHtml(asset.desc || ''),
          classUpper: escapeHtml(classUpper),
          rarityText: escapeHtml(rarityText),
          status: escapeHtml(status),
          statusLabel: escapeHtml(statusLabel),
          alertLabel: escapeHtml(isAlertUnknown ? 'ALERT: UNKNOWN' : 'UNKNOWN')
        };

        card.innerHTML = `
          <div class="card-vis">
            <img src="${safe.img}" data-full-src="${safe.img}" class="card-img" loading="lazy" decoding="async" alt="${safe.name} unknown specimen reconstruction">
            <div class="img-fallback" style="display:none; width:100%; height:100%; flex-direction:column; align-items:center; justify-content:center; background:linear-gradient(135deg, #050708, #101518); border-bottom:2px solid var(--ingen-green-dim); position:relative;">
              <svg viewBox="0 0 100 100" style="width:50px; height:50px; fill:none; stroke:var(--ingen-green); stroke-width:1.5; opacity:0.65; animation: classFlicker 3s infinite;">
                <path d="M30,70 Q50,30 70,70 M30,30 Q50,70 70,30 M50,15 L50,85" stroke-dasharray="2 2" />
              </svg>
              <span style="font-size:0.7rem; color:var(--ingen-green); letter-spacing:1px; margin-top:8px; opacity:0.6;">UNKNOWN: NO_VISUAL</span>
            </div>
            <span class="class-icon">${safe.classUpper}</span>
            <span class="unknown-alert-badge">${safe.alertLabel}</span>
          </div>
          <div class="card-data">
            <div>
              <div class="spec-code">${safe.code}</div>
              <h3 class="spec-name">${safe.name}</h3>
              <div class="spec-cn">${safe.cn}</div>
            </div>
            <div class="spec-stats">
              <div><b>${safe.era}</b></div>
              <div><b>${safe.rarityText}</b></div>
            </div>
            <div class="synthesis-status status-${safe.status}">${safe.statusLabel}</div>
            <button type="button" class="delete-custom-btn" aria-label="Delete custom archive">DELETE FILE</button>
          </div>
          <div class="hidden-data" 
               data-atk="${safe.atk}" 
               data-hp="${safe.hp}" 
               data-era="${safe.era}" 
               data-len="${safe.len}" 
               data-wgt="${safe.wgt}" 
               data-agg="${safe.agg}" 
               data-fact="${safe.fact}" 
               data-desc="${safe.desc}"
               data-status="${safe.status}"></div>
        `;
        grid.insertBefore(card, grid.firstChild);
        const deleteBtn = card.querySelector('.delete-custom-btn');
        if (deleteBtn) {
          deleteBtn.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            if (!confirm('Delete this custom archive file?')) return;
            const savedAssets = JSON.parse(localStorage.getItem('ingen_custom_assets') || '[]');
            savedAssets.splice(index, 1);
            localStorage.setItem('ingen_custom_assets', JSON.stringify(savedAssets));
            window.location.reload();
          });
        }

      });
    })();

    (function syncSpeciesData() {
      if (!Array.isArray(window.PALEO_SPECIES)) return;
      const speciesByName = new Map(window.PALEO_SPECIES.map(species => [species.name.toLowerCase(), species]));
      document.querySelectorAll('.card').forEach(card => {
        if (card.getAttribute('data-custom-record') === 'true') return;
        const species = speciesByName.get((card.getAttribute('data-name') || '').toLowerCase());
        if (!species) return;

        card.setAttribute('data-class', species.class);
        card.setAttribute('data-rarity', species.rarity);
        card.setAttribute('data-cn', species.cn);
        const img = card.querySelector('.card-img');
        if (img) {
          img.src = species.thumb;
          img.setAttribute('data-full-src', species.full);
        }
        const hiddenData = card.querySelector('.hidden-data');
        if (hiddenData) {
          hiddenData.setAttribute('data-atk', species.atk);
          hiddenData.setAttribute('data-hp', species.hp);
          hiddenData.setAttribute('data-era', species.era);
          hiddenData.setAttribute('data-len', `${species.len}${species.lenUnit}`);
          hiddenData.setAttribute('data-wgt', `${Number(species.wgt).toLocaleString()}${species.wgtUnit}`);
          hiddenData.setAttribute('data-agg', species.agg);
          hiddenData.setAttribute('data-fact', species.fact);
          hiddenData.setAttribute('data-desc', species.desc);
        }
      });
    })();
    // ── IMAGE ERROR FALLBACK REGISTRATION ──
    document.querySelectorAll('.card').forEach(card => {
      const img = card.querySelector('.card-img');
      if (img) {
        img.addEventListener('error', function() {
          this.style.display = 'none';
          let fallback = this.nextElementSibling;
          if (!fallback || !fallback.classList.contains('img-fallback')) {
            fallback = document.createElement('div');
            fallback.className = 'img-fallback';
            fallback.style.cssText = "display:flex; width:100%; height:100%; flex-direction:column; align-items:center; justify-content:center; background:linear-gradient(135deg, #050708, #101518); border-bottom:2px solid var(--ingen-green-dim); position:relative;";
            fallback.innerHTML = `
              <svg viewBox="0 0 100 100" style="width:50px; height:50px; fill:none; stroke:var(--ingen-green); stroke-width:1.5; opacity:0.65; animation: classFlicker 3s infinite;">
                <path d="M30,70 Q50,30 70,70 M30,30 Q50,70 70,30 M50,15 L50,85" stroke-dasharray="2 2" />
              </svg>
              <span style="font-size:0.7rem; color:var(--ingen-green); letter-spacing:1px; margin-top:8px; opacity:0.6;">UNKNOWN: NO_VISUAL</span>
            `;
            this.parentNode.insertBefore(fallback, this.nextSibling);
          } else {
            fallback.style.display = 'flex';
          }
        });
        if (!img.getAttribute('src') || img.getAttribute('src') === '') {
          img.dispatchEvent(new Event('error'));
        }
      }
    });

    // ── APPLY CONTAINMENT TO CARDS ──────────
    document.querySelectorAll('.card').forEach(card => {
      const cls = card.getAttribute('data-class');
      const rarity = parseInt(card.getAttribute('data-rarity'));
      const hd = card.querySelector('.hidden-data');
      const agg = hd ? parseInt(hd.getAttribute('data-agg')) : 3;
      const ct = getContainment(cls, rarity, agg);
      card.setAttribute('data-containment', ct);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Open ${card.getAttribute('data-name')} specimen dossier`);
      const statValues = card.querySelectorAll('.spec-stats b');
      if (statValues[0] && hd) statValues[0].textContent = hd.getAttribute('data-era');
      if (statValues[1]) statValues[1].textContent = `ARCHIVE P${rarity}`;
      const commonDisplayNames = new Set(['Blue','Bumpy','Mammoth','Ammonite','Trilobite','Coelacanth','Terror Bird','Woolly Rhino','Dire Wolf','Dire Bear']);
      const specName = card.querySelector('.spec-name');
      if (specName && cls !== 'hybrid' && !commonDisplayNames.has(card.getAttribute('data-name'))) {
        specName.classList.add('taxonomic-name');
      }
      // Add DNA overlay
      const vis = card.querySelector('.card-vis');
      if (vis && !vis.querySelector('.dna-overlay')) {
        const dna = document.createElement('div');
        dna.className = 'dna-overlay';
        const bases='ATCG'; let seq='';
        for(let i=0;i<36;i++) seq+=(i>0&&i%4===0?' ':'')+bases[Math.floor(Math.random()*4)];
        dna.textContent = seq;
        vis.appendChild(dna);
      }
      // Add badge
      const cd = card.querySelector('.card-data > div');
      if (cd && !cd.querySelector('.containment-badge')) {
        const b = document.createElement('div');
        b.className='containment-badge ct-'+ct;
        b.textContent = CT.badgeLabels[ct];
        cd.appendChild(b);
      }
    });

    // ── MODAL ────────────────────────────────
    let currentPaddock = null, currentCT = null, lastFocusedCard = null;
    function buildFieldSummary(name, cls, hd, location) {
      const existing = hd.getAttribute('data-desc') || '';
      if (existing.length >= 72) return existing;
      const era = hd.getAttribute('data-era') || 'an unspecified geological interval';
      const length = hd.getAttribute('data-len') || 'unrecorded length';
      const weight = hd.getAttribute('data-wgt') || 'unrecorded mass';
      if (cls === 'hybrid' || location.includes('ISLA NUBLAR')) {
        return `${name} is catalogued as a fictional or custom archive record. Its simulation profile lists ${length} in length and ${weight} in mass, with origin data linked to ${location}.`;
      }
      return `${name} is archived from the ${era}. Current reconstruction data lists ${length} in body length or wingspan and an estimated mass of ${weight}; the primary record locality is ${location}.`;
    }
    function openModal(card) {
      const hd = card.querySelector('.hidden-data');
      const name = card.getAttribute('data-name');
      const cls = card.getAttribute('data-class');
      const rarity = parseInt(card.getAttribute('data-rarity'));
      const agg = parseInt(hd.getAttribute('data-agg'));
      const ct = getContainment(cls, rarity, agg);
      currentCT = ct; currentPaddock = getPaddock(cls, name);
      const classCnMap = {
        'hybrid': 'HYBRIDS / 混种生物',
        'carnivore': 'CARNIVORES / 肉食恐龙',
        'herbivore': 'HERBIVORES / 草食恐龙',
        'pterosaur': 'PTEROSAURS / 翼龙类',
        'amphibian': 'EARLY TETRAPODS & CROC-LINE ARCHOSAURS / 早期四足类与鳄形类',
        'aquatic': 'AQUATIC LIFE / 水生与海生古生物',
        'cenozoic': 'CENOZOIC FAUNA / 新生代动物'
      };
      const cardImage = card.querySelector('.card-img');
      lastFocusedCard = card;
      const modalImg = document.getElementById('mImg');
      const fullSrc = cardImage.getAttribute('data-full-src') || cardImage.src;
      modalImg.src = cardImage.src;
      modalImg.alt = `${name} specimen reconstruction`;
      if (fullSrc && fullSrc !== cardImage.src) {
        const hiRes = new Image();
        hiRes.onload = () => {
          if (modalImg && lastFocusedCard === card) {
            modalImg.src = fullSrc;
          }
        };
        hiRes.src = fullSrc;
      }
      document.getElementById('mName').innerText = name;
      document.getElementById('mCn').innerText = card.getAttribute('data-cn');
      document.getElementById('mPlateName').innerText = name;
      document.getElementById('mClass').innerText = classCnMap[cls] || cls.toUpperCase();
      document.getElementById('mCode').innerText = card.querySelector('.spec-code').innerText;
      document.getElementById('mAtk').innerText = hd.getAttribute('data-atk');
      document.getElementById('mHp').innerText = hd.getAttribute('data-hp');
      document.getElementById('mEra').innerText = hd.getAttribute('data-era');
      document.getElementById('mPlateEra').innerText = hd.getAttribute('data-era');
      document.getElementById('mLen').innerText = hd.getAttribute('data-len');
      document.getElementById('mWgt').innerText = hd.getAttribute('data-wgt');
      const specimenRecord = getSpecimenRecord(name, card);
      const recordLocation = specimenRecord ? specimenRecord.site : 'DATA UNAVAILABLE';
      document.getElementById('mDesc').innerText = buildFieldSummary(name, cls, hd, recordLocation);
      document.getElementById('mFact').innerText = hd.getAttribute('data-fact');
      document.getElementById('mPlateLocation').innerText = recordLocation;
      const synthStatus = hd.getAttribute('data-status') || card.getAttribute('data-status') || 'verified';
      const synthStatusEl = document.getElementById('mSynthStatus');
      if (synthStatusEl) {
        synthStatusEl.innerText = synthStatus === 'failure' ? 'SYNTHESIS FAILURE' : synthStatus === 'success' ? 'SYNTHESIS SUCCESS' : 'VERIFIED RECORD';
      }
      let stars=''; for(let i=0;i<5;i++) stars+=(i<agg)?'★':'☆';
      document.getElementById('mAgg').innerText=stars;
      // Protocol
      const proto=document.getElementById('mProtocol');
      if(proto){proto.className='mi-protocol proto-'+ct;document.getElementById('mProtoLabel').innerText=CT.labels[ct];}
      // Border
      const clrMap={hybrid:'#e84393',carnivore:'#e74c3c',herbivore:'#27ae60',pterosaur:'#f1c40f',amphibian:'#00d2d3',aquatic:'#0984e3',cenozoic:'#a29bfe'};
      document.querySelector('.modal-window').style.borderColor=clrMap[cls]||'#444';
      const btn=document.querySelector('.deploy-btn');
      if(btn&&ct==='class'){btn.style.borderColor='#d63031';btn.style.color='#ff7675';btn.textContent='SIMULATION RESTRICTED / 模拟受限';}
      else if(btn){btn.style.borderColor='';btn.style.color='';btn.textContent='RUN PADDOCK SIMULATION / 运行园区模拟';}
      // Map
      highlightMap(name, ct==='class', card);
      document.getElementById('modal').classList.add('active');
      document.getElementById('modal').setAttribute('aria-hidden','false');
      document.body.style.overflow='hidden';
      setTimeout(() => document.querySelector('.close-btn').focus(), 0);
    }
    function closeModal(){
      document.getElementById('modal').classList.remove('active');
      document.getElementById('modal').setAttribute('aria-hidden','true');
      document.body.style.overflow='';
      if (lastFocusedCard) lastFocusedCard.focus();
    }
    function deployAsset(){
      const paddockNames={trex:'T-REX KINGDOM / 霸王龙王国',raptor:'RAPTOR PEN B / 迅猛龙收容区B',mosasaur:'MOSASAUR LAGOON / 沧龙潟湖',aviary:'JW AVIARY / 翼龙馆',gyrosphere:'GYROSPHERE VALLEY / 陀螺谷',sector5:'SECTOR 5 CROC BAY / 5区鳄湾',cenozoic:'CENOZOIC SECTOR 7 / 新生代7区',indominus:'INDOMINUS ENCLOSURE / 暴虐霸王龙收容区'};
      if(currentCT==='class'){
        const b=document.getElementById('ingen-breach');
        document.getElementById('breachSub').textContent='ASSET TOO DANGEROUS — DEPLOYMENT DENIED / 资产极度危险 — 拒绝部署';
        document.getElementById('breachPad').textContent='PADDOCK / 对应园区: '+paddockNames[currentPaddock];
        closeModal(); b.classList.add('active');
        const pe=document.getElementById('pad-'+currentPaddock),se=document.getElementById('ps-'+currentPaddock);
        if(pe){pe.classList.add('breach');if(se)se.textContent='● BREACH / 突破收容';}
        setTimeout(()=>{b.classList.remove('active');setTimeout(()=>{if(pe)pe.classList.remove('breach');if(se)se.textContent='● SECURE / 安全';},2000);},3500);
      } else {
        const now=new Date().toTimeString().slice(0,5);
        const pe=document.getElementById('pad-'+currentPaddock),te=document.getElementById('pt-'+currentPaddock);
        if(te){te.textContent='ASSET INBOUND... / 资产运送中...';setTimeout(()=>{te.textContent='LAST CHK / 末检: '+now;},2500);}
        closeModal();
      }
    }
    document.querySelectorAll('.card').forEach(c=>{
      c.addEventListener('click',()=>openModal(c));
      c.addEventListener('keydown',event=>{
        if(event.key==='Enter'||event.key===' '){
          event.preventDefault();
          openModal(c);
        }
      });
    });
    document.getElementById('modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
    const requestedSpecimen = new URLSearchParams(window.location.search).get('specimen');
    if (requestedSpecimen) {
      setTimeout(() => {
        const requestedCard = Array.from(document.querySelectorAll('.card')).find(card =>
          card.getAttribute('data-name').toLowerCase() === requestedSpecimen.toLowerCase()
        );
        if (requestedCard) openModal(requestedCard);
      }, 100);
    }
    // Periodic paddock check-in flicker
    const pads=['trex','raptor','mosasaur','aviary','gyrosphere','sector5','cenozoic'];
    setInterval(()=>{
      if(Math.random()<0.18){
        const id=pads[Math.floor(Math.random()*pads.length)];
        const te=document.getElementById('pt-'+id);
        const pe=document.getElementById('pad-'+id);
        if(te&&!pe.classList.contains('breach'))te.textContent='LAST CHK: '+new Date().toTimeString().slice(0,5);
      }
    },10000);

        // ── LEGACY FILTER/SEARCH/SORT (kept for compatibility) ──
        const pageStep = window.matchMedia('(max-width: 760px)').matches ? 18 : 36;
        let visibleLimit = pageStep;
        function applyVisibilityWindow() {
            const matchingCards = Array.from(document.querySelectorAll('.card:not(.hidden)'));
            matchingCards.forEach((card, index) => card.classList.toggle('page-hidden', index >= visibleLimit));
            document.querySelectorAll('.section-wrapper').forEach(sec => {
                const visible = sec.querySelectorAll('.card:not(.hidden):not(.page-hidden)').length > 0;
                sec.classList.toggle('hidden-section', !visible);
            });
            const shown = Math.min(visibleLimit, matchingCards.length);
            const rcEl = document.getElementById('resultsCount');
            if (rcEl) rcEl.textContent = `${shown} / ${matchingCards.length} RECORDS / 已显示 ${shown} / ${matchingCards.length} 条`;
            const rhEl = document.getElementById('resultsHint');
            if (rhEl) rhEl.textContent = matchingCards.length
              ? 'SCIENTIFIC RECORDS + MARKED SIMULATION DATA / 科学档案与明确标注的模拟数据'
              : 'NO MATCHING RECORDS / 没有匹配记录';
            const lmEl = document.getElementById('loadMoreWrap');
            if (lmEl) lmEl.hidden = shown >= matchingCards.length;
        }
        function filterSelection(c) {
            visibleLimit = pageStep;
            document.querySelectorAll('.filter-btn').forEach(btn => { btn.classList.remove('active'); if(btn.getAttribute('data-val')===c) btn.classList.add('active'); });
            document.querySelectorAll('.card').forEach(card => {
                const cls=card.getAttribute('data-class');
                card.classList.toggle('hidden', c!=='all'&&cls!==c);
            });
            applyVisibilityWindow();
        }
        function runSearch(val) {
            visibleLimit = pageStep;
            const valLower = val.toLowerCase().trim();
            document.querySelectorAll('.card').forEach(card=>{
                const name = card.getAttribute('data-name').toLowerCase();
                const cn = card.getAttribute('data-cn')||'';
                const cls = card.getAttribute('data-class')||'';
                const hd = card.querySelector('.hidden-data');
                const era = hd ? (hd.getAttribute('data-era')||'').toLowerCase() : '';
                
                if (name.includes(valLower) || cn.toLowerCase().includes(valLower) || cls.includes(valLower) || era.includes(valLower)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
            applyVisibilityWindow();
        }

        const sInput = document.getElementById('searchInput');
        if (sInput) {
            sInput.addEventListener('keyup', function(){
                runSearch(this.value);
            });
        }

        (function() {
            const urlParams = new URLSearchParams(window.location.search);
            const searchVal = urlParams.get('search');
            if (searchVal) {
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.value = searchVal;
                    setTimeout(() => runSearch(searchVal), 50);
                } else if (!document.getElementById('sec-hybrid')) {
                    window.location.href = `field-guide.html?search=${encodeURIComponent(searchVal)}`;
                }
            }
            const specVal = urlParams.get('specimen');
            if (specVal && !document.getElementById('sec-hybrid') && window.location.pathname.endsWith('gallery.html')) {
                window.location.href = `field-guide.html?specimen=${encodeURIComponent(specVal)}`;
            }
        })();
        function sortCards(){
            const sortEl = document.getElementById('sortSelect');
            if (!sortEl) return;
            const type = sortEl.value;
            document.querySelectorAll('.grid').forEach(grid=>{
                const cards=Array.from(grid.children);
                cards.sort((a,b)=>{
                    if(type==='rarity')return b.getAttribute('data-rarity')-a.getAttribute('data-rarity');
                    if(type==='name')return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
                    if(type==='era'){
                      const eraOrder = ['Precambrian','Cambrian','Ordovician','Silurian','Devonian','Carboniferous','Permian','Triassic','Jurassic','Cretaceous','Paleocene','Eocene','Oligocene','Miocene','Pliocene','Pleistocene','Holocene'];
                      const eraIndex = card => {
                        const value = card.querySelector('.hidden-data')?.getAttribute('data-era') || '';
                        const index = eraOrder.findIndex(era => value.includes(era));
                        return index === -1 ? eraOrder.length : index;
                      };
                      return eraIndex(a)-eraIndex(b);
                    }
                    return 0;
                });
                cards.forEach(card=>grid.appendChild(card));
            });
            applyVisibilityWindow();
        }
        const lmBtn = document.getElementById('loadMoreBtn');
        if (lmBtn) {
            lmBtn.addEventListener('click', () => {
                visibleLimit += pageStep;
                applyVisibilityWindow();
            });
        }
        applyVisibilityWindow();

        // ── PALEOLOGIST ADVANCED FILTERS ──
        const eraSelect = document.getElementById('eraFilterSelect');
        const dietSelect = document.getElementById('dietFilterSelect');
        const classSelect = document.getElementById('classFilterSelect');
        const statusSelect = document.getElementById('statusFilterSelect');

        function applyAdvancedFilters() {
            const eraVal = eraSelect ? eraSelect.value.toLowerCase() : 'all';
            const dietVal = dietSelect ? dietSelect.value.toLowerCase() : 'all';
            const classVal = classSelect ? classSelect.value.toLowerCase() : 'all';
            const statusVal = statusSelect ? statusSelect.value.toLowerCase() : 'all';

            document.querySelectorAll('.card').forEach(card => {
                const cClass = card.getAttribute('data-class') || '';
                const cEra = (card.querySelector('.hidden-data')?.getAttribute('data-era') || '').toLowerCase();
                const cDiet = (card.getAttribute('data-diet') || '').toLowerCase();
                const cIucn = (card.getAttribute('data-iucn') || '').toLowerCase();

                let match = true;
                if (eraVal !== 'all' && !cEra.includes(eraVal)) match = false;
                if (dietVal !== 'all' && !cDiet.includes(dietVal)) match = false;
                if (classVal !== 'all' && cClass !== classVal) match = false;
                if (statusVal !== 'all' && cIucn !== statusVal) match = false;

                if (match) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
            applyVisibilityWindow();
        }

        [eraSelect, dietSelect, classSelect, statusSelect].forEach(sel => {
            if (sel) sel.addEventListener('change', applyAdvancedFilters);
        });

        // Gallery Showcase Category Tabs
        document.querySelectorAll('.pl-gallery-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.pl-gallery-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const cat = this.getAttribute('data-cat');
                document.querySelectorAll('.pl-showcase-item').forEach(item => {
                    if (cat === 'all' || item.getAttribute('data-cat') === cat) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        // Red Code Alert Modal handlers in gallery
        setupRedCodeModal();

Object.assign(window, { closeModal, deployAsset, filterSelection, sortCards });
}

  function init_timescale() {
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

    // Timescale Data
    const timescaleData = [
        {
            id: 'cambrian',
            name: 'Cambrian Period / 寒武纪',
            era: 'Paleozoic Era / 古生代',
            span: '541.0 - 485.4 million years ago / 5.41亿 - 4.85亿年前',
            image: 'assets/images/timeline/hanwuji.jpg',
            imageAlt: 'Cambrian ocean reconstruction artwork',
            o2: '12.5% (Low / 较低)',
            co2: '6000 ppm (20x modern / 现代水平的20倍)',
            temp: '21°C (Warm greenhouse / 温暖温室气候)',
            sea: '+30m to +90m',
            tectonic: 'Supercontinent Pannotia disintegrates. Shallow seas flood continental shields. / 潘诺西亚超大陆分裂。浅海淹没大陆地盾。',
            extinction: 'Minor Cambrian-Ordovician extinction events. / 轻微的寒武纪-奥陶纪灭绝事件。',
            bio: 'The Cambrian Explosion rapidly diversifies marine animal body plans. Hard shells, eyes, and active predation appear. / 寒武纪大爆发让海洋动物体型结构快速多样化。硬壳、眼睛和主动捕食出现。',
            archetypes: 'Anomalocaris, Trilobites, Pikaia / 奇虾、三叶虫、皮卡虫',
            events: ['Cambrian Explosion begins / 寒武纪大爆发开始', 'First complex eyes spread / 复杂眼睛扩散', 'Anomalocaris becomes an apex predator / 奇虾成为顶级捕食者'],
            search: 'Cambrian'
        },
        {
            id: 'ordovician',
            name: 'Ordovician Period / 奥陶纪',
            era: 'Paleozoic Era / 古生代',
            span: '485.4 - 443.8 million years ago / 4.85亿 - 4.43亿年前',
            image: 'assets/images/timeline/aotaoji.jpg',
            imageAlt: 'Ordovician sea reconstruction artwork',
            o2: '13.5% (Low / 较低)',
            co2: '5600 ppm (18x modern / 现代水平的18倍)',
            temp: '16°C (Late glaciation / 晚期冰川化)',
            sea: '+150m to +220m',
            tectonic: 'Gondwana moves toward the South Pole, setting up late-period cooling and glaciation. / 冈瓦纳大陆移向南极，为晚期降温与冰川化创造条件。',
            extinction: 'Ordovician-Silurian Extinction: about 85% of species lost after glaciation and sea level collapse. / 奥陶纪-志留纪大灭绝：冰川化与海平面骤降导致约85%物种消失。',
            bio: 'Marine ecosystems expand with giant cephalopods, trilobites, brachiopods, and early reef systems. / 海洋生态扩张，巨型头足类、三叶虫、腕足动物和早期礁系统繁盛。',
            archetypes: 'Orthoceras, Trilobites, Brachiopods / 直角石、三叶虫、腕足动物',
            events: ['Great Ordovician biodiversification / 奥陶纪生物大辐射', 'First simple land plants emerge / 简单陆生植物出现', 'End-period glaciation begins / 末期冰川化开始'],
            search: 'Ordovician'
        },
        {
            id: 'silurian',
            name: 'Silurian Period / 志留纪',
            era: 'Paleozoic Era / 古生代',
            span: '443.8 - 419.2 million years ago / 4.43亿 - 4.19亿年前',
            image: 'assets/images/timeline/zhiliuji.jpg',
            imageAlt: 'Silurian coastal ecosystem artwork',
            o2: '14% (Low / 较低)',
            co2: '4500 ppm (15x modern / 现代水平的15倍)',
            temp: '17°C (Warm / 温暖)',
            sea: '+50m to +100m',
            tectonic: 'Laurentia and Baltica collide while seas stabilize after the Ordovician crisis. / 劳伦大陆与波罗的大陆碰撞，海洋环境在奥陶纪危机后趋于稳定。',
            extinction: 'Lau event: a smaller marine extinction pulse. / 劳氏事件：一次较小规模的海洋灭绝脉冲。',
            bio: 'Vascular plants establish on land. Coral reefs expand, and giant sea scorpions become major predators. / 维管束植物登陆。珊瑚礁扩张，巨型海蝎成为重要捕食者。',
            archetypes: 'Pterygotus, early jawed fish, Cooksonia / 翼肢鲎、早期有颌鱼类、库克逊蕨',
            events: ['First vascular plants root on shorelines / 最早维管植物扎根海岸', 'Jawed fish diversify / 有颌鱼类多样化', 'Reefs recover and expand / 礁系统恢复并扩张'],
            search: 'Silurian'
        },
        {
            id: 'devonian',
            name: 'Devonian Period / 泥盆纪',
            era: 'Paleozoic Era / 古生代',
            span: '419.2 - 358.9 million years ago / 4.19亿 - 3.58亿年前',
            image: 'assets/images/timeline/nipenji.jpg',
            imageAlt: 'Devonian fish age reconstruction artwork',
            o2: '15% (Low / 较低)',
            co2: '2200 ppm (7x modern / 现代水平的7倍)',
            temp: '20°C (Warm / 温暖)',
            sea: '+100m to +150m',
            tectonic: 'Laurussia and Gondwana move closer as mountain belts rise in North America and Europe. / 劳亚古陆与冈瓦纳古陆靠拢，北美与欧洲山脉带隆起。',
            extinction: 'Late Devonian Extinction: tropical reef networks are severely damaged. / 泥盆纪晚期大灭绝：热带礁网络遭到严重破坏。',
            bio: 'The Age of Fish. Armored placoderms dominate oceans, while lobe-finned fish begin the transition toward land. / 鱼类时代。盾皮鱼统治海洋，肉鳍鱼开始迈向陆地。',
            archetypes: 'Dunkleosteus, Tiktaalik, Acanthostega / 邓氏鱼、提塔利克鱼、棘螈',
            events: ['First forests develop / 最早森林形成', 'Tetrapod ancestors move into shallows / 四足动物祖先进入浅水', 'Armored fish dominate seas / 甲胄鱼类统治海洋'],
            search: 'Devonian'
        },
        {
            id: 'carboniferous',
            name: 'Carboniferous Period / 石炭纪',
            era: 'Paleozoic Era / 古生代',
            span: '358.9 - 298.9 million years ago / 3.58亿 - 2.98亿年前',
            image: 'assets/images/timeline/shitanji.jpg',
            imageAlt: 'Carboniferous swamp forest artwork',
            o2: '32% (Oxygen peak / 氧气峰值)',
            co2: '800 ppm (Moderate / 适中)',
            temp: '14°C (Cool and mild / 凉爽温和)',
            sea: '+10m (Variable / 波动)',
            tectonic: 'Equatorial coal swamps spread as continents collide and mountain belts rise. / 大陆碰撞与山脉隆起期间，赤道煤沼广泛扩张。',
            extinction: 'Carboniferous rainforest collapse fragments humid habitats. / 石炭纪雨林崩溃使潮湿生境破碎化。',
            bio: 'High oxygen supports giant arthropods and large amphibians. Early reptiles evolve in the swamp margins. / 高氧环境支持巨型节肢动物和大型两栖动物。早期爬行动物在沼泽边缘演化。',
            archetypes: 'Arthropleura, Meganeura, giant amphibians / 节胸、巨脉蜻蜓、巨型两栖动物',
            events: ['Coal forests cover lowlands / 煤炭森林覆盖低地', 'Giant insects take flight / 巨型昆虫飞行', 'Amniotic eggs reshape land life / 羊膜卵改变陆地生命'],
            search: 'Carboniferous'
        },
        {
            id: 'permian',
            name: 'Permian Period / 二叠纪',
            era: 'Paleozoic Era / 古生代',
            span: '298.9 - 252.2 million years ago / 2.98亿 - 2.52亿年前',
            image: 'assets/images/timeline/erdieji.jpg',
            imageAlt: 'Permian continental ecosystem artwork',
            o2: '23% (Stable / 稳定)',
            co2: '900 ppm (3x modern / 现代水平的3倍)',
            temp: '16°C (Arid continental / 干旱大陆气候)',
            sea: '-50m to 0m (Low / 较低)',
            tectonic: 'Pangaea completes assembly, creating vast dry continental interiors. / 盘古超大陆拼合完成，形成辽阔干燥的大陆内陆。',
            extinction: 'Permian-Triassic Extinction: the largest known mass extinction in Earth history. / 二叠纪-三叠纪大灭绝：地球历史上已知最大规模的生物灭绝。',
            bio: 'Synapsids dominate many land ecosystems while conifers and seed plants spread through dry climates. / 合弓类统治许多陆地生态，松柏类和种子植物在干旱气候中扩张。',
            archetypes: 'Dimetrodon, Inostrancevia, Helicoprion / 异齿龙、狼蜥兽、旋齿鲨',
            events: ['Pangaea becomes a supercontinent / 盘古超大陆形成', 'Synapsids dominate land / 合弓类统治陆地', 'The Great Dying closes the era / 大死亡终结古生代'],
            search: 'Permian'
        },
        {
            id: 'triassic',
            name: 'Triassic Period / 三叠纪',
            era: 'Mesozoic Era / 中生代',
            span: '252.2 - 201.3 million years ago / 2.52亿 - 2.01亿年前',
            image: 'assets/images/timeline/sandieji.jpg',
            imageAlt: 'Triassic arid Pangaea ecosystem artwork',
            o2: '16% (Very low / 极低)',
            co2: '1500 ppm (5x modern / 现代水平的5倍)',
            temp: '22°C (Arid greenhouse / 干旱温室气候)',
            sea: '0m to +50m',
            tectonic: 'Pangaea remains assembled, with large desert interiors and seasonal coastal zones. / 盘古超大陆保持拼合，内陆沙漠广阔，沿海季节性环境明显。',
            extinction: 'Triassic-Jurassic Extinction removes many competitors and opens space for dinosaurs. / 三叠纪-侏罗纪灭绝事件清除许多竞争者，为恐龙扩张打开空间。',
            bio: 'First dinosaurs, pterosaurs, and mammals evolve among crocodile-line archosaurs and large amphibians. / 最早的恐龙、翼龙和哺乳动物在鳄类主龙与大型两栖动物之间演化。',
            archetypes: 'Herrerasaurus, Coelophysis, Plateosaurus, Postosuchus / 埃雷拉龙、腔骨龙、板龙、波斯特鳄',
            events: ['Dinosaurs appear / 恐龙出现', 'Pterosaurs enter the skies / 翼龙进入天空', 'First mammals emerge / 最早哺乳动物出现'],
            search: 'Triassic'
        },
        {
            id: 'jurassic',
            name: 'Jurassic Period / 侏罗纪',
            era: 'Mesozoic Era / 中生代',
            span: '201.3 - 145.0 million years ago / 2.01亿 - 1.45亿年前',
            image: 'assets/images/timeline/zhuluoji.jpg',
            imageAlt: 'Jurassic dinosaur landscape artwork',
            o2: '26% (Elevated / 较高)',
            co2: '1200 ppm (4x modern / 现代水平的4倍)',
            temp: '16.5°C (Warm and humid / 温暖潮湿)',
            sea: '+50m to +100m',
            tectonic: 'Pangaea splits into northern and southern landmasses as the Atlantic begins opening. / 盘古超大陆分裂为南北大陆，大西洋开始打开。',
            extinction: 'Minor turnover at the Jurassic-Cretaceous boundary. / 侏罗纪-白垩纪边界出现轻微生物更替。',
            bio: 'Sauropods reach giant proportions, large theropods rule land, and early birds appear. / 蜥脚类达到巨型体型，大型兽脚类统治陆地，早期鸟类出现。',
            archetypes: 'Allosaurus, Stegosaurus, Brachiosaurus, Archaeopteryx / 异特龙、剑龙、腕龙、始祖鸟',
            events: ['Sauropods become giants / 蜥脚类巨型化', 'First birds appear / 最早鸟类出现', 'Ocean reptiles dominate seas / 海生爬行动物统治海洋'],
            search: 'Jurassic'
        },
        {
            id: 'cretaceous',
            name: 'Cretaceous Period / 白垩纪',
            era: 'Mesozoic Era / 中生代',
            span: '145.0 - 66.0 million years ago / 1.45亿 - 6600万年前',
            image: 'assets/images/timeline/baieji.jpg',
            imageAlt: 'Cretaceous dinosaur ecosystem artwork',
            o2: '30% (High / 高)',
            co2: '900 ppm (3x modern / 现代水平的3倍)',
            temp: '18°C (Hot greenhouse / 炎热温室气候)',
            sea: '+100m to +250m',
            tectonic: 'Continents separate into recognizable forms while high seas flood large continental interiors. / 大陆逐渐分离成可辨认形态，高海平面淹没大片大陆内陆。',
            extinction: 'K-Pg Extinction: about 75% of species are lost, including non-avian dinosaurs. / 白垩纪-古近纪灭绝事件：约75%物种消失，包括非鸟类恐龙。',
            bio: 'Tyrannosaurs, ceratopsians, hadrosaurs, giant pterosaurs, and flowering plants reach peak prominence. / 霸王龙类、角龙类、鸭嘴龙类、巨型翼龙和被子植物达到显著繁盛。',
            archetypes: 'T-Rex, Triceratops, Velociraptor, Mosasaurus / 霸王龙、三角龙、迅猛龙、沧龙',
            events: ['Flowering plants spread / 被子植物扩张', 'Giant pterosaurs soar / 巨型翼龙翱翔', 'Asteroid impact ends the period / 小行星撞击终结该时期'],
            search: 'Cretaceous'
        },
        {
            id: 'paleogene',
            name: 'Paleogene Period / 古近纪',
            era: 'Cenozoic Era / 新生代',
            span: '66.0 - 23.03 million years ago / 6600万 - 2303万年前',
            image: 'assets/images/timeline/gujinji.jpg',
            imageAlt: 'Paleogene recovery ecosystem artwork',
            o2: '23% to 26% (Elevated / 较高)',
            co2: '500 ppm (Warm early phase / 早期温暖阶段)',
            temp: '18°C (Warm recovery / 温暖恢复期)',
            sea: '+50m to +150m',
            tectonic: 'India collides with Asia, initiating Himalayan uplift, while Australia separates from Antarctica. / 印度板块与亚洲碰撞，喜马拉雅山脉开始隆起，澳大利亚与南极洲分离。',
            extinction: 'Post-impact recovery after the K-Pg extinction, followed by smaller turnover events. / 白垩纪-古近纪灭绝后的生态恢复，随后出现较小规模的生物更替。',
            bio: 'Mammals diversify into empty niches, forests expand, and large birds and early whales emerge. / 哺乳动物填补空缺生态位，森林扩张，大型鸟类和早期鲸类出现。',
            archetypes: 'Titanoboa, Gastornis, Andrewsarchus, Basilosaurus / 泰坦蟒、冠恐鸟、安氏中兽、龙王鲸',
            events: ['Mammals radiate after dinosaurs / 哺乳动物在恐龙之后辐射演化', 'Warm forests spread widely / 温暖森林广泛扩张', 'Early whales enter marine ecosystems / 早期鲸类进入海洋生态'],
            search: 'Paleogene'
        },
        {
            id: 'neogene',
            name: 'Neogene Period / 新近纪',
            era: 'Cenozoic Era / 新生代',
            span: '23.03 - 2.58 million years ago / 2303万 - 258万年前',
            image: 'assets/images/timeline/xinjinji.jpg',
            imageAlt: 'Neogene grassland and mammal ecosystem artwork',
            o2: '21.5% (Near modern / 接近现代)',
            co2: '350 ppm (Low / 较低)',
            temp: '16°C (Cooling trend / 逐渐变冷)',
            sea: '+10m to +30m',
            tectonic: 'The Isthmus of Panama forms, linking the Americas and changing global ocean circulation. / 巴拿马地峡形成，连接南北美洲并改变全球洋流循环。',
            extinction: 'No single global mass extinction, but cooling climates drive regional turnovers. / 无单一全球大灭绝，但气候变冷推动区域性生物更替。',
            bio: 'Grasslands expand, grazing mammals diversify, apes evolve, and Megalodon dominates many marine food webs. / 草原扩张，食草哺乳动物多样化，猿类演化，巨齿鲨统治许多海洋食物网。',
            archetypes: 'Megalodon, Paraceratherium, early horses, apes / 巨齿鲨、巨犀、早期马类、猿类',
            events: ['Grasslands reshape continents / 草原重塑大陆生态', 'Grazing mammals diversify / 食草哺乳动物多样化', 'Panama land bridge alters oceans / 巴拿马陆桥改变海洋'],
            search: 'Neogene'
        },
        {
            id: 'quaternary',
            name: 'Quaternary Period / 第四纪',
            era: 'Cenozoic Era / 新生代',
            span: '2.58 million - 11,700 years ago / 258万 - 1.17万年前',
            image: 'assets/images/timeline/bingheshidai.jpg',
            imageAlt: 'Quaternary ice age megafauna landscape artwork',
            o2: '21% (Modern level / 现代水平)',
            co2: '180-280 ppm (Glacial cycle / 冰期循环)',
            temp: '10°C to 14°C (Glacial swings / 冰期波动)',
            sea: '0m to -120m (Low during glaciation / 冰期下降)',
            tectonic: 'Continents sit near modern positions while ice sheets repeatedly expand and retreat. / 大陆接近现代位置，冰盖反复扩张与退缩。',
            extinction: 'Late Pleistocene megafaunal extinctions affect mammoths, saber-toothed cats, and many giant mammals. / 更新世晚期大型动物灭绝影响猛犸象、剑齿虎和许多巨型哺乳动物。',
            bio: 'Human populations expand globally as mammoths, Smilodons, woolly rhinos, and other megafauna occupy cold steppe ecosystems. / 人类族群全球扩张，猛犸象、剑齿虎、披毛犀等大型动物占据寒冷草原生态。',
            archetypes: 'Mammoths, Smilodons, Woolly Rhinos, Early Humans / 猛犸象、剑齿虎、披毛犀、早期人类',
            events: ['Ice sheets reach continental scale / 冰盖达到大陆尺度', 'Humans spread across continents / 人类扩散至各大陆', 'Megafauna decline near the end / 大型动物在末期衰退'],
            search: 'Quaternary'
        }
    ];

    const periodNodeColors = {
        cambrian: '#6c9a91',
        ordovician: '#80a774',
        silurian: '#b0a36c',
        devonian: '#b9874f',
        carboniferous: '#7f9867',
        permian: '#a96b42',
        triassic: '#b84b3e',
        jurassic: '#c0a16d',
        cretaceous: '#a93a2c',
        paleocene: '#c8915b',
        paleogene: '#c8915b',
        neogene: '#b9874f',
        quaternary: '#97a6a8'
    };

    let currentSelectedSearch = 'Cretaceous';
    let isPrecambrian = false;
    const timescaleSpecies = Array.isArray(window.PALEO_SPECIES) ? window.PALEO_SPECIES : [];
    const archetypeAliases = {
        'T-Rex': 'Tyrannosaurus Rex',
        'Mammoths': 'Mammoth',
        'Smilodons': 'Smilodon',
        'Woolly Rhinos': 'Woolly Rhino',
        'Trilobites': 'Trilobite',
        'giant amphibians': 'Mastodonsaurus'
    };

    function findArchetypeSpecimen(label) {
        const clean = label.trim();
        const targetName = archetypeAliases[clean] || clean;
        return timescaleSpecies.find(species => species.name.toLowerCase() === targetName.toLowerCase());
    }

    function renderArchetypeLinks(textValue) {
        const archetypesEl = document.getElementById('detArchetypes');
        archetypesEl.textContent = '';
        textValue.split(/(,\s*|\s\/\s)/).forEach(part => {
            const specimen = findArchetypeSpecimen(part);
            if (!specimen) {
                archetypesEl.appendChild(document.createTextNode(part));
                return;
            }
            const link = document.createElement('a');
            link.href = `field-guide.html?specimen=${encodeURIComponent(specimen.name)}`;
            link.textContent = part;
            link.className = 'archetype-link';
            archetypesEl.appendChild(link);
        });
    }

    // Populate timeline list
    function initTimeline() {
        const listEl = document.getElementById('timelineList');
        timescaleData.forEach((data, index) => {
            const node = document.createElement('div');
            node.className = `timeline-node ${index === 0 ? 'active' : ''}`;
            node.dataset.period = data.id;
            node.dataset.index = String(index + 1).padStart(2, '0');
            node.style.setProperty('--node-left-color', periodNodeColors[data.id] || 'rgba(184, 170, 134, 0.44)');
            node.innerHTML = `
                <div class="node-thumb">
                    <img src="${data.thumb || (data.image ? data.image.replace('assets/images/timeline/', 'assets/images/timeline/thumbs/').replace('.jpg', '.webp') : '')}" alt="" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async">
                </div>
                <div class="node-copy">
                    <div class="node-era">${data.era}</div>
                    <div class="node-name">${data.name}</div>
                    <div class="node-span">${data.span}</div>
                </div>
            `;
            
            node.addEventListener('click', () => {
                document.querySelectorAll('.timeline-node').forEach(n => n.classList.remove('active'));
                node.classList.add('active');
                displayDetails(data);
            });
            
            listEl.appendChild(node);
        });
        
        // Show first node details initially
        displayDetails(timescaleData[0]);
    }

    // Display details of selected period
    function displayDetails(data) {
        document.getElementById('detEra').textContent = data.era.toUpperCase();
        document.getElementById('detTitle').textContent = data.name.toUpperCase();
        document.getElementById('detSpan').textContent = data.span;
        document.getElementById('detO2').textContent = data.o2;
        document.getElementById('detCO2').textContent = data.co2;
        document.getElementById('detTemp').textContent = data.temp;
        document.getElementById('detSeaLevel').textContent = data.sea;
        document.getElementById('detTectonic').textContent = data.tectonic;
        document.getElementById('detBio').textContent = data.bio;
        renderArchetypeLinks(data.archetypes);

        const image = document.getElementById('detImage');
        const imagePending = document.getElementById('detImagePending');
        const visualFrame = document.getElementById('eraVisualFrame');
        if (data.image) {
            image.src = data.image;
            image.alt = data.imageAlt || data.name;
            image.style.display = 'block';
            imagePending.style.display = 'none';
            visualFrame.classList.remove('is-pending');
        } else {
            image.removeAttribute('src');
            image.alt = data.imageAlt || 'Image pending';
            image.style.display = 'none';
            imagePending.style.display = 'grid';
            visualFrame.classList.add('is-pending');
        }

        const eventsEl = document.getElementById('detEvents');
        if (eventsEl) {
            eventsEl.textContent = '';
            (data.events || []).forEach((eventText, index) => {
                const eventNode = document.createElement('div');
                eventNode.className = 'major-event-item';
                const numSpan = document.createElement('span');
                numSpan.textContent = String(index + 1).padStart(2, '0');
                const textP = document.createElement('p');
                textP.textContent = eventText;
                eventNode.appendChild(numSpan);
                eventNode.appendChild(textP);
                eventsEl.appendChild(eventNode);
            });
        }

        // Extinction Event warning handler
        const extTitle = document.getElementById('detExtinctionTitle');
        const extBox = document.getElementById('detExtinction');
        if (data.extinction && !data.extinction.startsWith('None')) {
            extTitle.style.display = 'block';
            extBox.style.display = 'block';
            extBox.textContent = data.extinction;
        } else {
            extTitle.style.display = 'none';
            extBox.style.display = 'none';
        }
        
        const btn = document.getElementById('queryBtn');
        if (data.noQuery) {
            btn.style.display = 'none';
            isPrecambrian = true;
        } else {
            btn.style.display = 'block';
            btn.textContent = `QUERY ${data.name.toUpperCase()} ARCHIVES / 查询 ${data.name.toUpperCase()} 档案`;
            currentSelectedSearch = data.search;
            isPrecambrian = false;
        }
    }

    function queryArchive() {
        if (!isPrecambrian) {
            window.location.href = `field-guide.html?search=${currentSelectedSearch}`;
        }
    }

    // Initialize timescale nodes
    initTimeline();

    // Timeline scope strip interaction
    document.querySelectorAll('.timeline-scope-strip span').forEach(span => {
        span.addEventListener('click', function() {
            document.querySelectorAll('.timeline-scope-strip span').forEach(s => s.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Red Code Alert Modal handlers in timescale
    setupRedCodeModal();

    // Mobile menu toggle
    const menuToggle = document.getElementById('plMenuToggle') || document.getElementById('menuToggle');
    const mainNav = document.getElementById('plNav') || document.getElementById('mainNav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('mobile-open');
        });
    }

Object.assign(window, { queryArchive });
}

  function init_form() {
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
    const imgFileInput = document.getElementById('imgFile');
    const parentASelect = document.getElementById('parentASelect');
    const parentBSelect = document.getElementById('parentBSelect');
    const blendRatio = document.getElementById('blendRatio');
    const blendReadout = document.getElementById('blendReadout');
    const hybridCanvas = document.getElementById('hybridCanvas');
    const dnaHelix = document.getElementById('dnaHelix');
    const mobilePreviewImg = document.getElementById('mobilePreviewImg');
    const mobilePreviewName = document.getElementById('mobilePreviewName');
    const mobilePreviewStats = document.getElementById('mobilePreviewStats');
    const speciesData = Array.isArray(window.PALEO_SPECIES) ? window.PALEO_SPECIES : [];
    let uploadedImageData = '';

    // Star Aggression and Containment calculations
    function getContainment(cls, rarityVal, agg) {
        if (cls === 'hybrid') return 'class';
        if (agg <= 2 && (cls === 'herbivore' || cls === 'cenozoic')) return 'open';
        if (rarityVal >= 4 || agg >= 4) return 'bunker';
        if (agg >= 3) return 'fence';
        return 'open';
    }

    const badgeLabels = { open:'SIM: OPEN RANGE / 模拟开放区', fence:'SIM: MONITORED / 模拟监控', bunker:'SIM: REINFORCED / 模拟加固', class:'FICTIONAL FILE / 虚构档案' };

    const classColors = {
        hybrid: '#e84393',
        carnivore: '#e74c3c',
        herbivore: '#27ae60',
        pterosaur: '#f1c40f',
        amphibian: '#00d2d3',
        aquatic: '#0984e3',
        cenozoic: '#a29bfe'
    };

    function formatWeight(value) {
        return `${Math.round(value).toLocaleString()}kg`;
    }

    function getSelectedSpecies(selectEl) {
        return speciesData.find(species => species.key === selectEl?.value);
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function blendStats(speciesA, speciesB, t) {
        return {
            len: Number(lerp(speciesA.len || 0, speciesB.len || 0, t).toFixed(1)),
            wgt: Math.round(lerp(speciesA.wgt || 0, speciesB.wgt || 0, t)),
            atk: Math.round(lerp(speciesA.atk || 0, speciesB.atk || 0, t)),
            hp: Math.round(lerp(speciesA.hp || 0, speciesB.hp || 0, t))
        };
    }

    function renderHelix(container, colorA, colorB, rungCount = 24) {
        if (!container) return;
        container.style.setProperty('--strand-a', colorA);
        container.style.setProperty('--strand-b', colorB);
        container.textContent = '';
        for (let i = 0; i < rungCount; i++) {
            const rung = document.createElement('div');
            rung.className = 'dna-rung';
            const depth = i / rungCount;
            rung.style.top = `${depth * 100}%`;
            rung.style.animationDelay = `${depth * 3}s`;
            container.appendChild(rung);
        }
    }

    function renderCompositeSplice(canvas, imgAUrl, imgBUrl, blendRatioValue) {
        if (!canvas || !imgAUrl || !imgBUrl) return;
        const ctx = canvas.getContext('2d');
        const imgA = new Image();
        const imgB = new Image();
        let loaded = 0;

        function draw() {
            const width = canvas.width;
            const height = canvas.height;
            const splitX = Math.max(1, Math.min(width - 1, Math.round(width * blendRatioValue)));
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#050708';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(imgA, 0, 0, splitX, height, 0, 0, splitX, height);
            ctx.drawImage(imgB, splitX, 0, width - splitX, height, splitX, 0, width - splitX, height);
            ctx.fillStyle = 'rgba(0, 255, 150, 0.035)';
            for (let y = 0; y < height; y += 5) ctx.fillRect(0, y, width, 1);
            ctx.fillStyle = 'rgba(232, 67, 147, 0.16)';
            ctx.fillRect(splitX - 2, 0, 4, height);
        }

        imgA.onload = () => { if (++loaded === 2) draw(); };
        imgB.onload = () => { if (++loaded === 2) draw(); };
        imgA.onerror = imgB.onerror = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#050708';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };
        imgA.src = imgAUrl;
        imgB.src = imgBUrl;
    }

    function getHybridImagePath(keyA, keyB) {
        const [first, second] = [keyA, keyB].sort();
        return `assets/images/hybrids/${first}_${second}.jpg`;
    }

    function imageExists(url) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    let hybridVisualRequest = 0;
    async function resolveHybridImage(speciesA, speciesB, blendRatioValue, canvasEl) {
        if (!speciesA || !speciesB || !canvasEl) return;
        const requestId = ++hybridVisualRequest;
        const presetPath = getHybridImagePath(speciesA.key, speciesB.key);

        if (await imageExists(presetPath)) {
            if (requestId !== hybridVisualRequest) return;
            pCardImg.src = presetPath;
            pCardImg.alt = `${speciesA.name} and ${speciesB.name} hybrid reconstruction`;
            pCardImg.style.display = 'block';
            canvasEl.hidden = true;
            if (mobilePreviewImg) mobilePreviewImg.src = presetPath;
            return;
        }

        if (requestId !== hybridVisualRequest) return;
        renderCompositeSplice(canvasEl, speciesA.thumb, speciesB.thumb, blendRatioValue);
        canvasEl.hidden = false;
        pCardImg.style.display = 'none';
        if (mobilePreviewImg) {
            mobilePreviewImg.src = UNKNOWN_HYBRID_IMAGE;
        }
    }

    function populateParentSelectors() {
        if (!parentASelect || !parentBSelect || !speciesData.length) return;
        const selectable = speciesData.filter(species => species.class !== 'hybrid' && species.len !== null && species.wgt !== null);
        selectable.forEach(species => {
            const label = `${species.name} / ${species.cn}`;
            parentASelect.add(new Option(label, species.key));
            parentBSelect.add(new Option(label, species.key));
        });
        parentASelect.value = selectable.find(species => species.key === 'tyrannosaurus_rex')?.key || selectable[0]?.key || '';
        parentBSelect.value = selectable.find(species => species.key === 'spinosaurus')?.key || selectable[1]?.key || parentASelect.value;
    }

    function applyHybridBlend() {
        const speciesA = getSelectedSpecies(parentASelect);
        const speciesB = getSelectedSpecies(parentBSelect);
        if (!speciesA || !speciesB) return;

        const t = Number(blendRatio?.value || 50) / 100;
        const stats = blendStats(speciesA, speciesB, t);
        const nameBlend = `${speciesA.name.split(' ')[0]}-${speciesB.name.split(' ')[0]} Hybrid`;
        const cnBlend = `${speciesA.cn}${speciesB.cn}混种`;

        document.getElementById('classSelect').value = 'hybrid';
        document.getElementById('name').value = nameBlend.toUpperCase();
        document.getElementById('cnName').value = cnBlend;
        document.getElementById('era').value = 'Fictional Hybrid Research Model';
        document.getElementById('length').value = `${stats.len}m`;
        document.getElementById('weight').value = formatWeight(stats.wgt);
        document.getElementById('atk').value = stats.atk;
        document.getElementById('hp').value = stats.hp;
        document.getElementById('aggLevel').value = String(Math.max(speciesA.agg || 3, speciesB.agg || 3));
        document.getElementById('description').value = `Hybrid simulation blending ${speciesA.name} mass and field traits with ${speciesB.name} morphology under controlled archive review.`;
        document.getElementById('fact').value = `Genome dominance: ${Math.round(t * 100)}% ${speciesB.name}. This remains a fictional research model.`;
        document.getElementById('imgUrl').value = '';
        uploadedImageData = '';
        if (imgFileInput) imgFileInput.value = '';
        if (blendReadout) blendReadout.textContent = `${Math.round(t * 100)}% Parent B / 亲本 B 显性`;

        // Update Parent 1 and 2 cards in workbench
        const parentAImg = document.getElementById('parentAImg');
        const parentBImg = document.getElementById('parentBImg');
        if (parentAImg && speciesA) {
            parentAImg.src = speciesA.thumb || speciesA.full;
            parentAImg.alt = speciesA.name;
        }
        if (parentBImg && speciesB) {
            parentBImg.src = speciesB.thumb || speciesB.full;
            parentBImg.alt = speciesB.name;
        }
        const pALen = document.getElementById('pALen');
        const pAWgt = document.getElementById('pAWgt');
        const pAAtk = document.getElementById('pAAtk');
        const pAHp = document.getElementById('pAHp');
        if (speciesA) {
            if (pALen) pALen.style.width = `${Math.min(100, Math.max(15, ((speciesA.len || 5) / 25) * 100))}%`;
            if (pAWgt) pAWgt.style.width = `${Math.min(100, Math.max(15, ((speciesA.wgt || 1000) / 20000) * 100))}%`;
            if (pAAtk) pAAtk.style.width = `${Math.min(100, Math.max(15, ((speciesA.atk || 1000) / 3000) * 100))}%`;
            if (pAHp) pAHp.style.width = `${Math.min(100, Math.max(15, ((speciesA.hp || 2000) / 8000) * 100))}%`;
        }
        const pBLen = document.getElementById('pBLen');
        const pBWgt = document.getElementById('pBWgt');
        const pBAtk = document.getElementById('pBAtk');
        const pBHp = document.getElementById('pBHp');
        if (speciesB) {
            if (pBLen) pBLen.style.width = `${Math.min(100, Math.max(15, ((speciesB.len || 5) / 25) * 100))}%`;
            if (pBWgt) pBWgt.style.width = `${Math.min(100, Math.max(15, ((speciesB.wgt || 1000) / 20000) * 100))}%`;
            if (pBAtk) pBAtk.style.width = `${Math.min(100, Math.max(15, ((speciesB.atk || 1000) / 3000) * 100))}%`;
            if (pBHp) pBHp.style.width = `${Math.min(100, Math.max(15, ((speciesB.hp || 2000) / 8000) * 100))}%`;
        }

        updatePreview();
    }

    function updatePreview() {
        const code = document.getElementById('code').value.toUpperCase();
        const name = document.getElementById('name').value.toUpperCase();
        const cn = document.getElementById('cnName').value;
        const cls = document.getElementById('classSelect').value;
        const rarity = parseInt(document.getElementById('raritySelect').value);
        const era = document.getElementById('era').value;
        const synthesisStatus = document.getElementById('synthesisStatus')?.value || 'success';
        const agg = parseInt(document.getElementById('aggLevel').value);
        const len = document.getElementById('length').value;
        const wgt = document.getElementById('weight').value;
        const speciesA = getSelectedSpecies(parentASelect);
        const speciesB = getSelectedSpecies(parentBSelect);
        const isAlertUnknown = agg >= 4;

        // Update basic values
        pCard.setAttribute('data-class', cls);
        pCardIcon.textContent = cls.toUpperCase();
        pCardCode.textContent = code || 'REF-XXX';
        pCardName.textContent = name || 'SPECIES_NAME';
        pCardCn.textContent = cn || '中文名';
        pCardEra.textContent = era || 'PERIOD_ERA';

        const priorities = { '1': 'ARCHIVE P1', '2': 'ARCHIVE P2', '3': 'ARCHIVE P3', '4': 'ARCHIVE P4', '5': 'ARCHIVE P5' };
        pCardRarity.textContent = priorities[rarity] || 'ARCHIVE P1';

        const blendT = Number(blendRatio?.value || 50) / 100;
        const shouldResolveHybridVisual = cls === 'hybrid' && speciesA && speciesB;
        if (!shouldResolveHybridVisual) hybridVisualRequest++;
        if (hybridCanvas) hybridCanvas.hidden = true;
        pCardImg.src = UNKNOWN_HYBRID_IMAGE;
        pCardImg.alt = isAlertUnknown ? 'Alert unknown hybrid specimen visual locked' : 'Unknown hybrid specimen visual locked';
        pCardImg.style.display = 'block';
        pCardFallback.style.display = 'none';
        pCardFallback.classList.toggle('alert-unknown', isAlertUnknown);
        pCard.classList.toggle('synthesis-alert', isAlertUnknown);
        pCard.classList.toggle('synthesis-success', synthesisStatus === 'success');
        pCard.classList.toggle('synthesis-failure', synthesisStatus === 'failure');
        const unknownStatus = pCardFallback.querySelector('.unknown-status') || pCardFallback.querySelector('span');
        if (unknownStatus) {
            unknownStatus.textContent = isAlertUnknown
                ? 'ALERT: UNKNOWN / 警报：未知影像'
                : 'UNKNOWN: NO_VISUAL / 未知图像信号';
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

        if (speciesA && speciesB) {
            renderHelix(dnaHelix, classColors[speciesA.class] || classColors.hybrid, classColors[speciesB.class] || classColors.hybrid);
            if (shouldResolveHybridVisual) {
                resolveHybridImage(speciesA, speciesB, blendT, hybridCanvas);
            }
        }
        if (mobilePreviewName) mobilePreviewName.textContent = name || 'SPECIES_NAME';
        if (mobilePreviewStats) {
            const resultState = synthesisStatus === 'failure' ? 'FAILURE' : 'SUCCESS';
            const visualState = isAlertUnknown ? `ALERT: UNKNOWN / ${resultState}` : `UNKNOWN / ${resultState}`;
            mobilePreviewStats.textContent = `${visualState} / ${len || '0m'} / ${wgt || '0kg'}`;
        }
        if (mobilePreviewImg) {
            mobilePreviewImg.src = UNKNOWN_HYBRID_IMAGE;
            mobilePreviewImg.alt = isAlertUnknown ? 'Alert unknown hybrid specimen visual locked' : 'Unknown hybrid specimen visual locked';
            mobilePreviewImg.style.display = 'block';
        }
    }

    // Bind real-time input fields
    const inputs = ['code', 'name', 'cnName', 'classSelect', 'raritySelect', 'synthesisStatus', 'era', 'length', 'weight', 'atk', 'hp', 'imgUrl', 'aggLevel'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener('input', updatePreview);
        el.addEventListener('change', updatePreview);
    });

    const imgUrlInput = document.getElementById('imgUrl');
    if (imgUrlInput) {
        imgUrlInput.addEventListener('input', function() {
            uploadedImageData = '';
            if (imgFileInput) imgFileInput.value = '';
            updatePreview();
        });
    }

    if (imgFileInput) {
        imgFileInput.addEventListener('change', function() {
            const file = imgFileInput.files && imgFileInput.files[0];
            if (!file) {
                uploadedImageData = '';
                updatePreview();
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                uploadedImageData = event.target.result;
                updatePreview();
            };
            reader.readAsDataURL(file);
        });
    }

    // Run preview once on load
    populateParentSelectors();
    if (parentASelect) parentASelect.addEventListener('change', applyHybridBlend);
    if (parentBSelect) parentBSelect.addEventListener('change', applyHybridBlend);
    if (blendRatio) blendRatio.addEventListener('input', applyHybridBlend);
    if (speciesData.length) applyHybridBlend();
    else updatePreview();

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
                status: document.getElementById('synthesisStatus').value,
                img: uploadedImageData || document.getElementById('imgUrl').value.trim() || UNKNOWN_HYBRID_IMAGE,
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

    // Ratio presets
    document.querySelectorAll('.pl-ratio-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.pl-ratio-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const ratio = this.getAttribute('data-ratio');
            if (blendRatio) {
                blendRatio.value = ratio;
                applyHybridBlend();
            }
        });
    });

    // Reset button
    const resetBtn = document.getElementById('resetLabBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            form.reset();
            uploadedImageData = '';
            if (parentASelect && parentBSelect) {
                parentASelect.selectedIndex = 0;
                parentBSelect.selectedIndex = Math.min(1, parentBSelect.options.length - 1);
                if (blendRatio) blendRatio.value = 50;
                document.querySelectorAll('.pl-ratio-btn').forEach(b => {
                    b.classList.toggle('active', b.getAttribute('data-ratio') === '50');
                });
                applyHybridBlend();
            }
        });
    }

    // Red Code Alert Modal handlers in form
    setupRedCodeModal();

    // Mobile menu toggle
    const menuToggle = document.getElementById('plMenuToggle') || document.getElementById('menuToggle');
    const mainNav = document.getElementById('plNav') || document.getElementById('mainNav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('mobile-open');
        });
    }

}

  const initializers = { index: init_index, gallery: init_gallery, 'field-guide': init_gallery, timescale: init_timescale, form: init_form };
  const initialize = () => { if (initializers[page]) initializers[page](); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
