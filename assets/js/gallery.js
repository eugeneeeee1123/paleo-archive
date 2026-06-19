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
