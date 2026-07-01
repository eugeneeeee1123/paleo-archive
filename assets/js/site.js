(function () {
  const page = document.documentElement.dataset.page;

  if (page === 'gallery' || page === 'timescale') {
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

  function init_index() {
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

Object.assign(window, { changeThemeTint });
}

  function init_gallery() {
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

    // ── HABITAT DATA ───────────────────────
    const habitatData = {
      'Indominus Rex':{r:'isla_nublar',l:'ISLA NUBLAR — CLASSIFIED'},
      'Indoraptor':{r:'isla_nublar',l:'ISLA NUBLAR — CLASSIFIED'},
      'Scorpios Rex':{r:'isla_nublar',l:'ISLA NUBLAR — CLASSIFIED'},
      'Diabolus Rex':{r:'isla_nublar',l:'ISLA NUBLAR — CLASSIFIED'},
      'Velocipterus':{r:'isla_nublar',l:'ISLA NUBLAR — CLASSIFIED'},
      'Blue':{r:'isla_nublar',l:'ISLA NUBLAR — Raptor Pen B'},
      'Bumpy':{r:'isla_nublar',l:'ISLA NUBLAR — Camp Cretaceous'},
      'Mosasaurus':{r:'europe',l:'Maastricht Formation, Limburg, Netherlands'},
      'Tyrannosaurus Rex':{r:'north_america',l:'Hell Creek Formation, Montana/Wyoming, USA'},
      'Triceratops':{r:'north_america',l:'Lance Formation, Wyoming/Montana, USA'},
      'Allosaurus':{r:'north_america',l:'Morrison Formation, Colorado/Wyoming, USA'},
      'Brachiosaurus':{r:'north_america',l:'Morrison Formation, Colorado, USA'},
      'Velociraptor':{r:'asia',l:'Djadochta Formation, Mongolia'},
      'Carnotaurus':{r:'south_america',l:'La Colonia Formation, Patagonia, Argentina'},
      'Spinosaurus':{r:'africa',l:'Kem Kem Formation, Morocco/Egypt'},
      'Giganotosaurus':{r:'south_america',l:'Candeleros Formation, Neuquén, Argentina'},
      'Carcharodontosaurus':{r:'africa',l:'Kem Kem Formation, North Africa'},
      'Tarbosaurus':{r:'asia',l:'Nemegt Formation, Gobi Desert, Mongolia'},
      'Mapusaurus':{r:'south_america',l:'Huincul Formation, Neuquén, Argentina'},
      'Argentinosaurus':{r:'south_america',l:'Huincul Formation, Neuquén, Argentina'},
      'Albertosaurus':{r:'north_america',l:'Horseshoe Canyon, Alberta, Canada'},
      'Suchomimus':{r:'africa',l:'Elrhaz Formation, Niger'},
      'Utahraptor':{r:'north_america',l:'Cedar Mountain Formation, Utah, USA'},
      'Deinonychus':{r:'north_america',l:'Cloverly Formation, Montana, USA'},
      'Majungasaurus':{r:'africa',l:'Maevarano Formation, Madagascar'},
      'Yutyrannus':{r:'asia',l:'Yixian Formation, Liaoning, China'},
      'Inostrancevia':{r:'europe',l:'Late Permian, Russia'},
      'Cryolophosaurus':{r:'antarctica',l:'Hanson Formation, Antarctica'},
      'Baryonyx':{r:'europe',l:'Wealden Group, Surrey, England'},
      'Allosaurus':{r:'north_america',l:'Morrison Formation, Colorado, USA'},
      'Herrerasaurus':{r:'south_america',l:'Ischigualasto Formation, Argentina'},
      'Coelophysis':{r:'north_america',l:'Ghost Ranch, New Mexico, USA'},
      'Compsognathus':{r:'europe',l:'Solnhofen Limestone, Bavaria, Germany'},
      'Ceratosaurus':{r:'north_america',l:'Morrison Formation, Colorado, USA'},
      'Dimetrodon':{r:'north_america',l:'Red Beds, Texas/Oklahoma, USA'},
      'Troodon':{r:'north_america',l:'Two Medicine Formation, Montana, USA'},
      'Bumpy':{r:'isla_nublar',l:'ISLA NUBLAR — Camp Cretaceous'},
      'Therizinosaurus':{r:'asia',l:'Nemegt Formation, Mongolia'},
      'Brachiosaurus':{r:'north_america',l:'Morrison Formation, Colorado, USA'},
      'Ankylosaurus':{r:'north_america',l:'Hell Creek Formation, Montana, USA'},
      'Stegosaurus':{r:'north_america',l:'Morrison Formation, Colorado, USA'},
      'Brontosaurus':{r:'north_america',l:'Morrison Formation, Wyoming, USA'},
      'Supersaurus':{r:'north_america',l:'Morrison Formation, Utah/Colorado, USA'},
      'Seismosaurus':{r:'north_america',l:'Morrison Formation, New Mexico, USA'},
      'Argentinosaurus':{r:'south_america',l:'Huincul Formation, Neuquén, Argentina'},
      'Mamenchisaurus':{r:'asia',l:'Shaximiao Formation, Sichuan, China'},
      'Diplodocus':{r:'north_america',l:'Morrison Formation, Wyoming/Colorado, USA'},
      'Pachycephalosaurus':{r:'north_america',l:'Lance/Hell Creek Formation, USA/Canada'},
      'Parasaurolophus':{r:'north_america',l:'Campanian, Alberta / New Mexico, USA'},
      'Iguanodon':{r:'europe',l:'Wealden Group, Belgium / England'},
      'Titanosaurus':{r:'asia',l:'Lameta Formation, India'},
      'Maiasaura':{r:'north_america',l:'Two Medicine Formation, Montana, USA'},
      'Camarasaurus':{r:'north_america',l:'Morrison Formation, USA'},
      'Plateosaurus':{r:'europe',l:'Triassic, Germany / Switzerland'},
      'Psittacosaurus':{r:'asia',l:'Yixian Formation, China / Mongolia'},
      'Dodo':{r:'africa',l:'Mauritius Island, Indian Ocean (Extinct 1662)'},
      'Quetzalcoatlus':{r:'north_america',l:'Javelina Formation, Texas, USA'},
      'Pteranodon':{r:'north_america',l:'Niobrara Formation, Kansas, USA'},
      'Tapejara':{r:'south_america',l:'Santana Formation, Ceará, Brazil'},
      'Dimorphodon':{r:'europe',l:'Lower Jurassic, Dorset, England'},
      'Hatzegopteryx':{r:'europe',l:'Maastrichtian, Transylvania, Romania'},
      'Sarcosuchus':{r:'africa',l:'Elrhaz Formation, Niger'},
      'Purussaurus':{r:'south_america',l:'Solimões Formation, Amazon Basin'},
      'Mastodonsaurus':{r:'europe',l:'Triassic, Germany / Russia'},
      'Deinosuchus':{r:'north_america',l:'Aguja Formation, Texas / Montana, USA'},
      'Prestosuchus':{r:'south_america',l:'Santa Maria Formation, Rio Grande do Sul, Brazil'},
      'Baurusuchus':{r:'south_america',l:'Bauru Group, São Paulo, Brazil'},
      'Kaprosuchus':{r:'africa',l:'Kem Kem Formation, Saharan Africa'},
      'Metoposaurus':{r:'europe',l:'Triassic, Portugal / Poland'},
      'Rutiodon':{r:'north_america',l:'Triassic, Eastern North America'},
      'Diplocaulus':{r:'north_america',l:'Permian, Texas, USA'},
      'Crassigyrinus':{r:'europe',l:'Carboniferous, Scotland'},
      'Ichthyostega':{r:'greenland',l:'Devonian, Greenland'},
      'Tiktaalik':{r:'north_america',l:'Ellesmere Island, Nunavut, Canada'},
      'Acanthostega':{r:'greenland',l:'Late Devonian, Greenland'},
      'Panderichthys':{r:'europe',l:'Devonian, Latvia'},
      'Postosuchus':{r:'north_america',l:'Dockum Formation, Texas, USA'},
      'Mosasaurus':{r:'europe',l:'Maastricht Formation, Limburg, Netherlands'},
      'Megalodon':{r:'global_ocean',l:'Global Ocean — Miocene / Pliocene'},
      'Tylosaurus':{r:'north_america',l:'Western Interior Seaway, Kansas, USA'},
      'Shonisaurus':{r:'north_america',l:'Luning Formation, Nevada, USA'},
      'Pliosaurus':{r:'europe',l:'Late Jurassic, Norway / England'},
      'Archelon':{r:'north_america',l:'Pierre Shale, South Dakota, USA'},
      'Anomalocaris':{r:'north_america',l:'Burgess Shale, British Columbia, Canada'},
      'Livyatan':{r:'south_america',l:'Pisco Formation, Ica, Peru'},
      'Shastasaurus':{r:'global_ocean',l:'Late Triassic Pacific (Canada / China)'},
      'Dunkleosteus':{r:'north_america',l:'Cleveland Shale, Ohio, USA'},
      'Liopleurodon':{r:'europe',l:'Callovian, France / England'},
      'Basilosaurus':{r:'africa',l:'Wadi Al-Hitan, Fayum, Egypt'},
      'Stethacanthus':{r:'europe',l:'Late Devonian, Scotland / North America'},
      'Ophthalmosaurus':{r:'europe',l:'Oxford Clay, England'},
      'Metriorhynchus':{r:'europe',l:'Callovian, France / England'},
      'Orthoceras':{r:'global_ocean',l:'Global Ordovician oceans'},
      'Leedsichthys':{r:'europe',l:'Oxford Clay, England'},
      'Xiphactinus':{r:'north_america',l:'Niobrara Formation, Kansas, USA'},
      'Helicoprion':{r:'global_ocean',l:'Global Permian oceans'},
      'Tusoteuthis':{r:'north_america',l:'Niobrara Formation, Kansas, USA'},
      'Opabinia':{r:'north_america',l:'Burgess Shale, British Columbia, Canada'},
      'Cladoselache':{r:'north_america',l:'Cleveland Shale, Ohio, USA'},
      'Nothosaurus':{r:'europe',l:'Triassic, Europe / China'},
      'Pterygotus':{r:'global_ocean',l:'Silurian oceans, globally distributed'},
      'Elasmosaurus':{r:'north_america',l:'Pierre Shale, Kansas, USA'},
      'Mixosaurus':{r:'europe',l:'Triassic, Switzerland / Italy'},
      'Ichthyosaurus':{r:'europe',l:'Lower Jurassic, Dorset, England'},
      'Bothriolepis':{r:'global',l:'Global — Late Devonian (All Continents)'},
      'Coelacanth':{r:'africa',l:'Indian Ocean, Comoros Islands — Still Alive Today'},
      'Ammonite':{r:'global_ocean',l:'Global Ocean — Devonian to Cretaceous'},
      'Trilobite':{r:'global_ocean',l:'Global — Cambrian to Permian (All Continents)'},
      'Pikaia':{r:'north_america',l:'Burgess Shale, British Columbia, Canada'},
      'Deinotherium':{r:'africa',l:'Miocene Africa / Southern Eurasia'},
      'Megacerops':{r:'north_america',l:'White River Formation, South Dakota, USA'},
      'Panthera Atrox':{r:'north_america',l:'Pleistocene North America'},
      'Doedicurus':{r:'south_america',l:'Pleistocene, Argentina / Uruguay'},
      'Mammoth':{r:'global',l:'Global — Eurasia / North America (Pleistocene)'},
      'Smilodon':{r:'north_america',l:'La Brea Tar Pits, California / South America'},
      'Amphicyon':{r:'europe',l:'Miocene, Europe / Asia / North America'},
      'Gastornis':{r:'europe',l:'Paleocene–Eocene, France / Germany'},
      'Chalicotherium':{r:'asia',l:'Miocene, Eurasia'},
      'Titanoboa':{r:'south_america',l:'Cerrejón Formation, Colombia'},
      'Terror Bird':{r:'south_america',l:'Santa Cruz Formation, Patagonia, Argentina'},
      'Woolly Rhino':{r:'asia',l:'Pleistocene, Siberia / Europe'},
      'Megatherium':{r:'south_america',l:'Pleistocene, Argentina / South America'},
      'Paraceratherium':{r:'asia',l:'Oligocene, Kazakhstan / Pakistan / China'},
      'Diprotodon':{r:'australia',l:'Pleistocene, Australia'},
      'Glyptodon':{r:'south_america',l:'Pleistocene, South America'},
      'Dire Wolf':{r:'north_america',l:'La Brea Tar Pits, California, USA'},
      'Dire Bear':{r:'north_america',l:'Pleistocene, North America'},
      'Thylacoleo':{r:'australia',l:'Pleistocene, Australia'},
      'Andrewsarchus':{r:'asia',l:'Irdin Manha Formation, Mongolia'},
      'Hyaenodon':{r:'asia',l:'Eocene–Miocene, Europe / Asia / Africa'},
      'Megalania':{r:'australia',l:'Pleistocene, Australia'},
      'Argentavis':{r:'south_america',l:'Huayquerian Formation, Argentina'},
      'Procoptodon':{r:'australia',l:'Pleistocene, Australia'},
      'Borophagus':{r:'north_america',l:'Miocene, North America'},
    };

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
      const location = data.l || '';
      const matchedSite = fossilSiteLookup.find(site => site.test.test(location));
      if (matchedSite) return matchedSite;
      return fossilRegionFallback[data.r] || fossilRegionFallback.global;
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

    function highlightMap(name, classified) {
      document.querySelectorAll('.map-region').forEach(r=>r.classList.remove('active','classified-zone'));
      const d = habitatData[name];
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
      if (!d) {
        lt.textContent='DATA UNAVAILABLE / 暂无地点数据';
        coordsText.textContent='—';
        marker.className.baseVal='fossil-marker';
        markerLeader.className.baseVal='map-marker-leader';
        markerLabel.className.baseVal='map-marker-label';
        cap.className='map-site-card';
        return;
      }
      const reg = d.r;
      const regEl = document.getElementById('reg-'+reg);
      const isOrigin = classified || reg === 'isla_nublar';
      const isRange = reg === 'global' || reg === 'global_ocean' || /^global/i.test(d.l);
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
        lt.textContent=d.l;
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
      markerText.textContent=isOrigin ? 'ORIGIN SITE' : formatFossilSiteLabel(d.l);
      lt.textContent = d.l;
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

    // ── LOAD CUSTOM ASSETS ────────────────
    (function loadCustomAssets() {
      const customAssets = JSON.parse(localStorage.getItem('ingen_custom_assets') || '[]');
      customAssets.forEach(asset => {
        const grid = document.querySelector(`#sec-${asset.class} .grid`);
        if (!grid) return;

        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-class', asset.class);
        card.setAttribute('data-rarity', asset.rarity);
        card.setAttribute('data-name', asset.name);
        card.setAttribute('data-cn', asset.cn);

        const rarityMap = {
          '1': 'ARCHIVE P1',
          '2': 'ARCHIVE P2',
          '3': 'ARCHIVE P3',
          '4': 'ARCHIVE P4',
          '5': 'ARCHIVE P5'
        };
        const rarityText = rarityMap[asset.rarity] || asset.rarity || 'Common';
        const classUpper = asset.class.toUpperCase();

        card.innerHTML = `
          <div class="card-vis">
            <img src="${asset.img || ''}" data-full-src="${asset.img || ''}" class="card-img" loading="lazy" decoding="async" alt="${asset.name} custom reconstruction" style="${asset.img ? '' : 'display:none;'}">
            <div class="img-fallback" style="${asset.img ? 'display:none;' : 'display:flex;'} width:100%; height:100%; flex-direction:column; align-items:center; justify-content:center; background:linear-gradient(135deg, #050708, #101518); border-bottom:2px solid var(--ingen-green-dim); position:relative;">
              <svg viewBox="0 0 100 100" style="width:50px; height:50px; fill:none; stroke:var(--ingen-green); stroke-width:1.5; opacity:0.65; animation: classFlicker 3s infinite;">
                <path d="M30,70 Q50,30 70,70 M30,30 Q50,70 70,30 M50,15 L50,85" stroke-dasharray="2 2" />
              </svg>
              <span style="font-size:0.5rem; color:var(--ingen-green); letter-spacing:1px; margin-top:8px; opacity:0.6;">WIRE_SYS_ERROR: NO_VISUAL</span>
            </div>
            <span class="class-icon">${classUpper}</span>
          </div>
          <div class="card-data">
            <div>
              <div class="spec-code">${asset.code}</div>
              <h3 class="spec-name">${asset.name}</h3>
              <div class="spec-cn">${asset.cn}</div>
            </div>
            <div class="spec-stats">
              <div><b>${asset.era}</b></div>
              <div><b>${rarityText}</b></div>
            </div>
          </div>
          <div class="hidden-data" 
               data-atk="${asset.atk}" 
               data-hp="${asset.hp}" 
               data-era="${asset.era}" 
               data-len="${asset.len}" 
               data-wgt="${asset.wgt}" 
               data-agg="${asset.agg}" 
               data-fact="${asset.fact}" 
               data-desc="${asset.desc}"></div>
        `;
        grid.insertBefore(card, grid.firstChild);

        habitatData[asset.name] = { r: 'isla_nublar', l: 'ISLA NUBLAR — Sector 4/Lab Custom Gen' };
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
              <span style="font-size:0.5rem; color:var(--ingen-green); letter-spacing:1px; margin-top:8px; opacity:0.6;">WIRE_SYS_ERROR: NO_VISUAL</span>
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
      document.getElementById('mImg').src = cardImage.getAttribute('data-full-src') || cardImage.src;
      document.getElementById('mImg').alt = `${name} specimen reconstruction`;
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
      const recordLocation = habitatData[name] ? habitatData[name].l : 'DATA UNAVAILABLE';
      document.getElementById('mDesc').innerText = buildFieldSummary(name, cls, hd, recordLocation);
      document.getElementById('mFact').innerText = hd.getAttribute('data-fact');
      document.getElementById('mPlateLocation').innerText = recordLocation;
      let stars=''; for(let i=0;i<5;i++) stars+=(i<agg)?'★':'☆';
      document.getElementById('mAgg').innerText=stars;
      // Protocol
      const proto=document.getElementById('mProtocol');
      if(proto){proto.className='mi-protocol proto-'+ct;document.getElementById('mProtoLabel').innerText=CT.labels[ct];}
      // Border
      const clrMap={hybrid:'#d63031',carnivore:'#e74c3c',herbivore:'#27ae60',pterosaur:'#f1c40f',amphibian:'#00d2d3',aquatic:'#0984e3',cenozoic:'#a29bfe'};
      document.querySelector('.modal-window').style.borderColor=clrMap[cls]||'#444';
      const btn=document.querySelector('.deploy-btn');
      if(btn&&ct==='class'){btn.style.borderColor='#d63031';btn.style.color='#ff7675';btn.textContent='SIMULATION RESTRICTED / 模拟受限';}
      else if(btn){btn.style.borderColor='';btn.style.color='';btn.textContent='RUN PADDOCK SIMULATION / 运行园区模拟';}
      // Map
      highlightMap(name, ct==='class');
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
            document.getElementById('resultsCount').textContent = `${shown} / ${matchingCards.length} RECORDS / 已显示 ${shown} / ${matchingCards.length} 条`;
            document.getElementById('resultsHint').textContent = matchingCards.length
              ? 'SCIENTIFIC RECORDS + MARKED SIMULATION DATA / 科学档案与明确标注的模拟数据'
              : 'NO MATCHING RECORDS / 没有匹配记录';
            document.getElementById('loadMoreWrap').hidden = shown >= matchingCards.length;
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

        document.getElementById('searchInput').addEventListener('keyup', function(){
            runSearch(this.value);
        });

        (function() {
            const urlParams = new URLSearchParams(window.location.search);
            const searchVal = urlParams.get('search');
            if (searchVal) {
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.value = searchVal;
                    setTimeout(() => runSearch(searchVal), 50);
                }
            }
        })();
        function sortCards(){
            const type=document.getElementById('sortSelect').value;
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
        document.getElementById('loadMoreBtn').addEventListener('click', () => {
            visibleLimit += pageStep;
            applyVisibilityWindow();
        });
        applyVisibilityWindow();

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

    let currentSelectedSearch = 'Cretaceous';
    let isPrecambrian = false;

    // Populate timeline list
    function initTimeline() {
        const listEl = document.getElementById('timelineList');
        timescaleData.forEach((data, index) => {
            const node = document.createElement('div');
            node.className = `timeline-node ${index === 0 ? 'active' : ''}`;
            node.dataset.period = data.id;
            node.dataset.index = String(index + 1).padStart(2, '0');
            node.innerHTML = `
                <div class="node-thumb">
                    <img src="${data.image || ''}" alt="" loading="lazy" decoding="async">
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
        document.getElementById('detArchetypes').textContent = data.archetypes;

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
        eventsEl.innerHTML = '';
        (data.events || []).forEach((eventText, index) => {
            const eventNode = document.createElement('div');
            eventNode.className = 'major-event-item';
            eventNode.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span><p>${eventText}</p>`;
            eventsEl.appendChild(eventNode);
        });

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
            window.location.href = `gallery.html?search=${currentSelectedSearch}`;
        }
    }

    // Initialize timescale nodes
    initTimeline();

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

    function updatePreview() {
        const code = document.getElementById('code').value.toUpperCase();
        const name = document.getElementById('name').value.toUpperCase();
        const cn = document.getElementById('cnName').value;
        const cls = document.getElementById('classSelect').value;
        const rarity = parseInt(document.getElementById('raritySelect').value);
        const era = document.getElementById('era').value;
        const img = uploadedImageData || document.getElementById('imgUrl').value;
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
                img: uploadedImageData || document.getElementById('imgUrl').value.trim(),
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

}

  function init_paleo() {
// ── BOOT ──────────────────────────────
    const bootLines = [
      'INGEN PROPRIETARY SYSTEMS v4.2 ...... OK',
      'LOADING SECURITY PROTOCOLS .......... OK',
      'VERIFYING TERMINAL CLEARANCE ........ GRANTED',
      'INITIALIZING ASSET DATABASE ......... OK',
      'DNA SEQUENCE INDEXING ............... DONE',
      'PADDOCK STATUS NETWORK .............. ONLINE',
      '> WELCOME — LEVEL 4 CLEARANCE ACTIVE',
      '> SYSTEM READY',
    ];
    let bIdx = 0;
    const bTextEl = document.getElementById('boot-text');
    const bOverlay = document.getElementById('boot-overlay');
    function addBootLine() {
      if (bIdx < bootLines.length) {
        const s = document.createElement('span');
        s.className = 'boot-line'; s.textContent = bootLines[bIdx];
        bTextEl.insertBefore(s, document.getElementById('boot-cursor'));
        bIdx++;
        setTimeout(addBootLine, bIdx < 6 ? 260 : 380);
      } else {
        setTimeout(() => {
          bOverlay.classList.add('fade-out');
          setTimeout(() => bOverlay.style.display='none', 900);
        }, 500);
      }
    }
    setTimeout(addBootLine, 300);

    // ── CLOCK ─────────────────────────────
    function updateClock() {
      const el = document.getElementById('sysClock');
      if (el) el.textContent = new Date().toTimeString().slice(0,8);
    }
    setInterval(updateClock, 1000); updateClock();

    // ── CONTAINMENT LOGIC ──────────────────
    const CT = {
      labels: { open:'🟢 OPEN PADDOCK', fence:'⚡ ELECTRIC FENCE', bunker:'🔶 REINFORCED BUNKER', class:'🔴 CLASSIFIED — DO NOT DEPLOY' },
      badgeLabels: { open:'OPEN PADDOCK', fence:'ELECTRIC FENCE', bunker:'REINFORCED BUNKER', class:'CLASSIFIED' },
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

    // ── HABITAT DATA ───────────────────────
    const habitatData = {
      'Indominus Rex':{r:'isla_nublar',l:'ISLA NUBLAR — CLASSIFIED'},
      'Indoraptor':{r:'isla_nublar',l:'ISLA NUBLAR — CLASSIFIED'},
      'Scorpios Rex':{r:'isla_nublar',l:'ISLA NUBLAR — CLASSIFIED'},
      'Diabolus Rex':{r:'isla_nublar',l:'ISLA NUBLAR — CLASSIFIED'},
      'Velocipterus':{r:'isla_nublar',l:'ISLA NUBLAR — CLASSIFIED'},
      'Blue':{r:'isla_nublar',l:'ISLA NUBLAR — Raptor Pen B'},
      'Bumpy':{r:'isla_nublar',l:'ISLA NUBLAR — Camp Cretaceous'},
      'Mosasaurus':{r:'isla_nublar',l:'ISLA NUBLAR — JW Mosasaur Lagoon'},
      'Tyrannosaurus Rex':{r:'north_america',l:'Hell Creek Formation, Montana/Wyoming, USA'},
      'Triceratops':{r:'north_america',l:'Lance Formation, Wyoming/Montana, USA'},
      'Allosaurus':{r:'north_america',l:'Morrison Formation, Colorado/Wyoming, USA'},
      'Brachiosaurus':{r:'north_america',l:'Morrison Formation, Colorado, USA'},
      'Velociraptor':{r:'asia',l:'Djadochta Formation, Mongolia'},
      'Carnotaurus':{r:'south_america',l:'La Colonia Formation, Patagonia, Argentina'},
      'Spinosaurus':{r:'africa',l:'Kem Kem Formation, Morocco/Egypt'},
      'Giganotosaurus':{r:'south_america',l:'Candeleros Formation, Neuquén, Argentina'},
      'Carcharodontosaurus':{r:'africa',l:'Kem Kem Formation, North Africa'},
      'Tarbosaurus':{r:'asia',l:'Nemegt Formation, Gobi Desert, Mongolia'},
      'Mapusaurus':{r:'south_america',l:'Huincul Formation, Neuquén, Argentina'},
      'Argentinosaurus':{r:'south_america',l:'Huincul Formation, Neuquén, Argentina'},
      'Albertosaurus':{r:'north_america',l:'Horseshoe Canyon, Alberta, Canada'},
      'Suchomimus':{r:'africa',l:'Elrhaz Formation, Niger'},
      'Utahraptor':{r:'north_america',l:'Cedar Mountain Formation, Utah, USA'},
      'Deinonychus':{r:'north_america',l:'Cloverly Formation, Montana, USA'},
      'Majungasaurus':{r:'africa',l:'Maevarano Formation, Madagascar'},
      'Yutyrannus':{r:'asia',l:'Yixian Formation, Liaoning, China'},
      'Inostrancevia':{r:'europe',l:'Late Permian, Russia'},
      'Cryolophosaurus':{r:'antarctica',l:'Hanson Formation, Antarctica'},
      'Baryonyx':{r:'europe',l:'Wealden Group, Surrey, England'},
      'Allosaurus':{r:'north_america',l:'Morrison Formation, Colorado, USA'},
      'Herrerasaurus':{r:'south_america',l:'Ischigualasto Formation, Argentina'},
      'Coelophysis':{r:'north_america',l:'Ghost Ranch, New Mexico, USA'},
      'Compsognathus':{r:'europe',l:'Solnhofen Limestone, Bavaria, Germany'},
      'Ceratosaurus':{r:'north_america',l:'Morrison Formation, Colorado, USA'},
      'Dimetrodon':{r:'north_america',l:'Red Beds, Texas/Oklahoma, USA'},
      'Troodon':{r:'north_america',l:'Two Medicine Formation, Montana, USA'},
      'Bumpy':{r:'isla_nublar',l:'ISLA NUBLAR — Camp Cretaceous'},
      'Therizinosaurus':{r:'asia',l:'Nemegt Formation, Mongolia'},
      'Brachiosaurus':{r:'north_america',l:'Morrison Formation, Colorado, USA'},
      'Ankylosaurus':{r:'north_america',l:'Hell Creek Formation, Montana, USA'},
      'Stegosaurus':{r:'north_america',l:'Morrison Formation, Colorado, USA'},
      'Brontosaurus':{r:'north_america',l:'Morrison Formation, Wyoming, USA'},
      'Supersaurus':{r:'north_america',l:'Morrison Formation, Utah/Colorado, USA'},
      'Seismosaurus':{r:'north_america',l:'Morrison Formation, New Mexico, USA'},
      'Argentinosaurus':{r:'south_america',l:'Huincul Formation, Neuquén, Argentina'},
      'Mamenchisaurus':{r:'asia',l:'Shaximiao Formation, Sichuan, China'},
      'Diplodocus':{r:'north_america',l:'Morrison Formation, Wyoming/Colorado, USA'},
      'Pachycephalosaurus':{r:'north_america',l:'Lance/Hell Creek Formation, USA/Canada'},
      'Parasaurolophus':{r:'north_america',l:'Campanian, Alberta / New Mexico, USA'},
      'Iguanodon':{r:'europe',l:'Wealden Group, Belgium / England'},
      'Titanosaurus':{r:'asia',l:'Lameta Formation, India'},
      'Maiasaura':{r:'north_america',l:'Two Medicine Formation, Montana, USA'},
      'Camarasaurus':{r:'north_america',l:'Morrison Formation, USA'},
      'Plateosaurus':{r:'europe',l:'Triassic, Germany / Switzerland'},
      'Psittacosaurus':{r:'asia',l:'Yixian Formation, China / Mongolia'},
      'Dodo':{r:'africa',l:'Mauritius Island, Indian Ocean (Extinct 1662)'},
      'Quetzalcoatlus':{r:'north_america',l:'Javelina Formation, Texas, USA'},
      'Pteranodon':{r:'north_america',l:'Niobrara Formation, Kansas, USA'},
      'Tapejara':{r:'south_america',l:'Santana Formation, Ceará, Brazil'},
      'Dimorphodon':{r:'europe',l:'Lower Jurassic, Dorset, England'},
      'Hatzegopteryx':{r:'europe',l:'Maastrichtian, Transylvania, Romania'},
      'Sarcosuchus':{r:'africa',l:'Elrhaz Formation, Niger'},
      'Purussaurus':{r:'south_america',l:'Solimões Formation, Amazon Basin'},
      'Mastodonsaurus':{r:'europe',l:'Triassic, Germany / Russia'},
      'Deinosuchus':{r:'north_america',l:'Aguja Formation, Texas / Montana, USA'},
      'Prestosuchus':{r:'south_america',l:'Santa Maria Formation, Rio Grande do Sul, Brazil'},
      'Baurusuchus':{r:'south_america',l:'Bauru Group, São Paulo, Brazil'},
      'Kaprosuchus':{r:'africa',l:'Kem Kem Formation, Saharan Africa'},
      'Metoposaurus':{r:'europe',l:'Triassic, Portugal / Poland'},
      'Rutiodon':{r:'north_america',l:'Triassic, Eastern North America'},
      'Diplocaulus':{r:'north_america',l:'Permian, Texas, USA'},
      'Crassigyrinus':{r:'europe',l:'Carboniferous, Scotland'},
      'Ichthyostega':{r:'greenland',l:'Devonian, Greenland'},
      'Tiktaalik':{r:'north_america',l:'Ellesmere Island, Nunavut, Canada'},
      'Acanthostega':{r:'greenland',l:'Late Devonian, Greenland'},
      'Panderichthys':{r:'europe',l:'Devonian, Latvia'},
      'Postosuchus':{r:'north_america',l:'Dockum Formation, Texas, USA'},
      'Mosasaurus':{r:'isla_nublar',l:'ISLA NUBLAR — JW Mosasaur Lagoon (also global Late Cret.)'},
      'Megalodon':{r:'global_ocean',l:'Global Ocean — Miocene / Pliocene'},
      'Tylosaurus':{r:'north_america',l:'Western Interior Seaway, Kansas, USA'},
      'Shonisaurus':{r:'north_america',l:'Luning Formation, Nevada, USA'},
      'Pliosaurus':{r:'europe',l:'Late Jurassic, Norway / England'},
      'Archelon':{r:'north_america',l:'Pierre Shale, South Dakota, USA'},
      'Anomalocaris':{r:'north_america',l:'Burgess Shale, British Columbia, Canada'},
      'Livyatan':{r:'south_america',l:'Pisco Formation, Ica, Peru'},
      'Shastasaurus':{r:'global_ocean',l:'Late Triassic Pacific (Canada / China)'},
      'Dunkleosteus':{r:'north_america',l:'Cleveland Shale, Ohio, USA'},
      'Liopleurodon':{r:'europe',l:'Callovian, France / England'},
      'Basilosaurus':{r:'africa',l:'Wadi Al-Hitan, Fayum, Egypt'},
      'Stethacanthus':{r:'europe',l:'Late Devonian, Scotland / North America'},
      'Ophthalmosaurus':{r:'europe',l:'Oxford Clay, England'},
      'Metriorhynchus':{r:'europe',l:'Callovian, France / England'},
      'Orthoceras':{r:'global_ocean',l:'Global Ordovician oceans'},
      'Leedsichthys':{r:'europe',l:'Oxford Clay, England'},
      'Xiphactinus':{r:'north_america',l:'Niobrara Formation, Kansas, USA'},
      'Helicoprion':{r:'global_ocean',l:'Global Permian oceans'},
      'Tusoteuthis':{r:'north_america',l:'Niobrara Formation, Kansas, USA'},
      'Opabinia':{r:'north_america',l:'Burgess Shale, British Columbia, Canada'},
      'Cladoselache':{r:'north_america',l:'Cleveland Shale, Ohio, USA'},
      'Nothosaurus':{r:'europe',l:'Triassic, Europe / China'},
      'Pterygotus':{r:'global_ocean',l:'Silurian oceans, globally distributed'},
      'Elasmosaurus':{r:'north_america',l:'Pierre Shale, Kansas, USA'},
      'Mixosaurus':{r:'europe',l:'Triassic, Switzerland / Italy'},
      'Ichthyosaurus':{r:'europe',l:'Lower Jurassic, Dorset, England'},
      'Bothriolepis':{r:'global',l:'Global — Late Devonian (All Continents)'},
      'Coelacanth':{r:'africa',l:'Indian Ocean, Comoros Islands — Still Alive Today'},
      'Ammonite':{r:'global_ocean',l:'Global Ocean — Devonian to Cretaceous'},
      'Trilobite':{r:'global_ocean',l:'Global — Cambrian to Permian (All Continents)'},
      'Pikaia':{r:'north_america',l:'Burgess Shale, British Columbia, Canada'},
      'Deinotherium':{r:'africa',l:'Miocene Africa / Southern Eurasia'},
      'Megacerops':{r:'north_america',l:'White River Formation, South Dakota, USA'},
      'Panthera Atrox':{r:'north_america',l:'Pleistocene North America'},
      'Doedicurus':{r:'south_america',l:'Pleistocene, Argentina / Uruguay'},
      'Mammoth':{r:'global',l:'Global — Eurasia / North America (Pleistocene)'},
      'Smilodon':{r:'north_america',l:'La Brea Tar Pits, California / South America'},
      'Amphicyon':{r:'europe',l:'Miocene, Europe / Asia / North America'},
      'Gastornis':{r:'europe',l:'Paleocene–Eocene, France / Germany'},
      'Chalicotherium':{r:'asia',l:'Miocene, Eurasia'},
      'Titanoboa':{r:'south_america',l:'Cerrejón Formation, Colombia'},
      'Terror Bird':{r:'south_america',l:'Santa Cruz Formation, Patagonia, Argentina'},
      'Woolly Rhino':{r:'asia',l:'Pleistocene, Siberia / Europe'},
      'Megatherium':{r:'south_america',l:'Pleistocene, Argentina / South America'},
      'Paraceratherium':{r:'asia',l:'Oligocene, Kazakhstan / Pakistan / China'},
      'Diprotodon':{r:'australia',l:'Pleistocene, Australia'},
      'Glyptodon':{r:'south_america',l:'Pleistocene, South America'},
      'Dire Wolf':{r:'north_america',l:'La Brea Tar Pits, California, USA'},
      'Dire Bear':{r:'north_america',l:'Pleistocene, North America'},
      'Thylacoleo':{r:'australia',l:'Pleistocene, Australia'},
      'Andrewsarchus':{r:'asia',l:'Irdin Manha Formation, Mongolia'},
      'Hyaenodon':{r:'asia',l:'Eocene–Miocene, Europe / Asia / Africa'},
      'Megalania':{r:'australia',l:'Pleistocene, Australia'},
      'Argentavis':{r:'south_america',l:'Huayquerian Formation, Argentina'},
      'Procoptodon':{r:'australia',l:'Pleistocene, Australia'},
      'Borophagus':{r:'north_america',l:'Miocene, North America'},
    };

    function highlightMap(name, classified) {
      document.querySelectorAll('.map-region').forEach(r=>r.classList.remove('active','classified-zone'));
      document.querySelectorAll('.map-dot').forEach(d=>d.classList.remove('active'));
      const d = habitatData[name];
      const cap = document.getElementById('mapCaption');
      const lt = document.getElementById('mapLocText');
      if (!d) { lt.textContent='DATA UNAVAILABLE'; cap.className='map-caption'; return; }
      const reg = d.r;
      const regEl = document.getElementById('reg-'+reg);
      const dotEl = document.getElementById('dot-'+reg);
      if (classified||reg==='isla_nublar') {
        if (regEl) regEl.classList.add('classified-zone');
        if (dotEl) { dotEl.classList.add('active','classified'); }
        cap.className='map-caption cls-cap';
      } else {
        if (regEl) regEl.classList.add('active');
        if (dotEl) dotEl.classList.add('active');
        cap.className='map-caption';
      }
      lt.textContent = d.l;
    }

    // ── APPLY CONTAINMENT TO CARDS ──────────
    document.querySelectorAll('.card').forEach(card => {
      const cls = card.getAttribute('data-class');
      const rarity = parseInt(card.getAttribute('data-rarity'));
      const hd = card.querySelector('.hidden-data');
      const agg = hd ? parseInt(hd.getAttribute('data-agg')) : 3;
      const ct = getContainment(cls, rarity, agg);
      card.setAttribute('data-containment', ct);
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
    let currentPaddock = null, currentCT = null;
    function openModal(card) {
      const hd = card.querySelector('.hidden-data');
      const name = card.getAttribute('data-name');
      const cls = card.getAttribute('data-class');
      const rarity = parseInt(card.getAttribute('data-rarity'));
      const agg = parseInt(hd.getAttribute('data-agg'));
      const ct = getContainment(cls, rarity, agg);
      currentCT = ct; currentPaddock = getPaddock(cls, name);
      document.getElementById('mImg').src = card.querySelector('.card-img').src;
      document.getElementById('mName').innerText = name;
      document.getElementById('mCn').innerText = card.getAttribute('data-cn');
      document.getElementById('mClass').innerText = cls.toUpperCase();
      document.getElementById('mCode').innerText = card.querySelector('.spec-code').innerText;
      document.getElementById('mAtk').innerText = hd.getAttribute('data-atk');
      document.getElementById('mHp').innerText = hd.getAttribute('data-hp');
      document.getElementById('mEra').innerText = hd.getAttribute('data-era');
      document.getElementById('mLen').innerText = hd.getAttribute('data-len');
      document.getElementById('mWgt').innerText = hd.getAttribute('data-wgt');
      document.getElementById('mDesc').innerText = hd.getAttribute('data-desc');
      document.getElementById('mFact').innerText = '"'+hd.getAttribute('data-fact')+'"';
      let stars=''; for(let i=0;i<5;i++) stars+=(i<agg)?'★':'☆';
      document.getElementById('mAgg').innerText=stars;
      // Protocol
      const proto=document.getElementById('mProtocol');
      if(proto){proto.className='mi-protocol proto-'+ct;document.getElementById('mProtoLabel').innerText=CT.labels[ct];}
      // Border
      const clrMap={hybrid:'#d63031',carnivore:'#e74c3c',herbivore:'#27ae60',pterosaur:'#f1c40f',amphibian:'#00d2d3',aquatic:'#0984e3',cenozoic:'#a29bfe'};
      document.querySelector('.modal-window').style.borderColor=clrMap[cls]||'#444';
      const btn=document.querySelector('.deploy-btn');
      if(btn&&ct==='class'){btn.style.borderColor='#d63031';btn.style.color='#d63031';btn.textContent='⛔ DEPLOYMENT RESTRICTED';}
      else if(btn){btn.style.borderColor='';btn.style.color='';btn.textContent='▶ DEPLOY ASSET TO PADDOCK';}
      // Map
      highlightMap(name, ct==='class'||ct==='class');
      document.getElementById('modal').classList.add('active');
    }
    function closeModal(){document.getElementById('modal').classList.remove('active');}
    function deployAsset(){
      const paddockNames={trex:'T-REX KINGDOM',raptor:'RAPTOR PEN B',mosasaur:'MOSASAUR LAGOON',aviary:'JW AVIARY',gyrosphere:'GYROSPHERE VALLEY',sector5:'SECTOR 5 CROC BAY',cenozoic:'CENOZOIC SECTOR 7',indominus:'INDOMINUS ENCLOSURE'};
      if(currentCT==='class'){
        const b=document.getElementById('ingen-breach');
        document.getElementById('breachSub').textContent='ASSET TOO DANGEROUS — DEPLOYMENT DENIED';
        document.getElementById('breachPad').textContent='PADDOCK: '+paddockNames[currentPaddock];
        closeModal(); b.classList.add('active');
        const pe=document.getElementById('pad-'+currentPaddock),se=document.getElementById('ps-'+currentPaddock);
        if(pe){pe.classList.add('breach');if(se)se.textContent='● BREACH';}
        setTimeout(()=>{b.classList.remove('active');setTimeout(()=>{if(pe)pe.classList.remove('breach');if(se)se.textContent='● SECURE';},2000);},3500);
      } else {
        const now=new Date().toTimeString().slice(0,5);
        const pe=document.getElementById('pad-'+currentPaddock),te=document.getElementById('pt-'+currentPaddock);
        if(te){te.textContent='ASSET INBOUND...';setTimeout(()=>{te.textContent='LAST CHK: '+now;},2500);}
        closeModal();
      }
    }
    document.querySelectorAll('.card').forEach(c=>c.addEventListener('click',()=>openModal(c)));
    document.getElementById('modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
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
        function filterSelection(c) {
            document.querySelectorAll('.filter-btn').forEach(btn => { btn.classList.remove('active'); if(btn.getAttribute('data-val')===c) btn.classList.add('active'); });
            const sections = document.querySelectorAll('.section-wrapper');
            sections.forEach(sec => { const cards=sec.querySelectorAll('.card'); let visible=false; cards.forEach(card => { const cls=card.getAttribute('data-class'); if(c==='all'||cls===c){card.classList.remove('hidden');visible=true;}else{card.classList.add('hidden');}}); sec.classList.toggle('hidden-section',!visible); });
        }
        document.getElementById('searchInput').addEventListener('keyup',function(){
            const val=this.value.toLowerCase();
            document.querySelectorAll('.card').forEach(card=>{
                const name=card.getAttribute('data-name').toLowerCase();
                const cn=card.getAttribute('data-cn')||'';
                if(name.includes(val)||cn.toLowerCase().includes(val))card.classList.remove('hidden');
                else card.classList.add('hidden');
            });
        });
        function sortCards(){
            const type=document.getElementById('sortSelect').value;
            document.querySelectorAll('.grid').forEach(grid=>{
                const cards=Array.from(grid.children);
                cards.sort((a,b)=>{
                    if(type==='rarity')return b.getAttribute('data-rarity')-a.getAttribute('data-rarity');
                    if(type==='name')return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
                    return 0;
                });
                cards.forEach(card=>grid.appendChild(card));
            });
        }

Object.assign(window, { closeModal, deployAsset, filterSelection, sortCards });
}

  const initializers = { index: init_index, gallery: init_gallery, timescale: init_timescale, form: init_form, paleo: init_paleo };
  const initialize = () => { if (initializers[page]) initializers[page](); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
