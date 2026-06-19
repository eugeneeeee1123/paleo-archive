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
