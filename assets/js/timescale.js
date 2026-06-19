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
            id: 'quaternary',
            name: 'Quaternary Period / 第四纪',
            era: 'Cenozoic Era / 新生代',
            span: '2.58 million years ago - Present / 258万年前至今',
            o2: '21% (Modern Level / 现代水平)',
            co2: '280-420 ppm (Variable / 波动)',
            temp: '14°C (Ice Ages / 冰期阶段)',
            sea: '0m (Fluctuating -120m in glaciation / 冰期时下降达120米)',
            tectonic: 'Continents in modern positions. Extensive polar and montane ice caps form during glaciations. / 大陆处于现代位置。冰期期间形成了广泛的极地和山地冰盖。',
            extinction: 'Ongoing Holocene extinction event (primarily human-driven extinction of megafauna). / 正在进行中的全新世灭绝事件（主要是人类活动导致的大型动物灭绝）。',
            bio: 'Evolution and rapid global expansion of Homo sapiens. Extinction of mammoth, Smilodon, and other Pleistocene giants. / 智人演化并迅速在全球扩张。猛犸象、刃齿虎和其他更新世巨型动物灭绝。',
            archetypes: 'Mammoths, Smilodons, Dire Wolves, Early Humans / 猛犸象、刃齿虎、恐狼、早期人类',
            search: 'Quaternary'
        },
        {
            id: 'neogene',
            name: 'Neogene Period / 新近纪',
            era: 'Cenozoic Era / 新生代',
            span: '23.03 - 2.58 million years ago / 2303万 - 258万年前',
            o2: '21.5% (Near modern / 接近现代)',
            co2: '350 ppm (Low / 较低)',
            temp: '16°C (Cooling / 逐渐变冷)',
            sea: '+10m to +30m',
            tectonic: 'Isthmus of Panama forms, linking North and South America, triggering global oceanic circulation changes. / 巴拿马地峡形成，连接北美和南美，触发全球洋流循环改变。',
            extinction: 'None major; minor marine turnover due to temperature drops. / 无重大灭绝事件；温度下降导致海洋生物发生轻微更替。',
            bio: 'Vast grasslands expand globally, driving the evolution of specialized grazing herbivores. Megalodon dominates marine ecosystems. / 广阔的草场在全球范围扩张，推动了特化食草哺乳动物的演化。巨齿鲨主宰海洋生态系统。',
            archetypes: 'Megalodon, Megalania, early horses and grazing mammals / 巨齿鲨、古巨蜥、早期马类和食草哺乳动物',
            search: 'Neogene'
        },
        {
            id: 'paleogene',
            name: 'Paleogene Period / 古近纪',
            era: 'Cenozoic Era / 新生代',
            span: '66.0 - 23.03 million years ago / 6600万 - 2303万年前',
            o2: '26% (Elevated / 较高)',
            co2: '500 ppm (Warm early phase / 早期温暖阶段)',
            temp: '18°C (Paleocene warm climate / 古新世温暖气候)',
            sea: '+50m to +150m',
            tectonic: 'India collides with Asia, initiating the Himalayan uplift. Australia completely detaches from Antarctica. / 印度板块与亚洲板块相撞，开启喜马拉雅山脉隆起。澳大利亚完全从南极洲分离。',
            extinction: 'Minor floral and mammal turnover events. / 较轻微的植物和哺乳动物更替事件。',
            bio: 'Mammals diversify rapidly, filling ecological niches left by dinosaurs. Giant flightless terror birds emerge. Titanoboa grows to massive size. / 哺乳动物迅速发生多样化演化，填补了恐龙留下的生态位。巨大的无翼骇鸟出现。泰坦蟒体型增长至庞大尺寸。',
            archetypes: 'Titanoboa, Gastornis (Terror Bird), Andrewsarchus, Basilosaurus / 泰坦蟒、冠恐鸟（骇鸟）、安氏中兽、龙王鲸',
            search: 'Paleogene'
        },
        {
            id: 'cretaceous',
            name: 'Cretaceous Period / 白垩纪',
            era: 'Mesozoic Era / 中生代',
            span: '145.0 - 66.0 million years ago / 1.45亿 - 6600万年前',
            o2: '30% (High / 高)',
            co2: '900 ppm (3x modern / 现代水平的3倍)',
            temp: '18°C (Hot greenhouse / 炎热温室气候)',
            sea: '+100m to +250m',
            tectonic: 'Supercontinent Pangaea splits into Gondwana and Laurasia. Massive flood basalt eruptions in India (Deccan Traps). / 盘古超大陆分裂为冈瓦纳和劳亚大陆。印度板块发生大规模暗色岩溢流玄武岩喷发（德干暗色岩）。',
            extinction: 'K-Pg Extinction: 75% of species lost, including all non-avian dinosaurs, pterosaurs, and marine reptiles. / 白垩纪-古近纪灭绝事件：75%的物种灭绝，包括所有非鸟类恐龙、翼龙和海生爬行动物。',
            bio: 'Tyrannosaurs, Ceratopsians, and Hadrosaurs reach peak diversity. Giant pterosaurs dominate the skies. Flowering plants appear. / 霸王龙类、角龙类和鸭嘴龙类达到多样性巅峰。巨型翼龙统治天空。被子植物（有花植物）出现。',
            archetypes: 'T-Rex, Triceratops, Velociraptor, Spinosaurus, Mosasaurus, Quetzalcoatlus / 霸王龙、三角龙、迅猛龙、棘龙、沧龙、风神翼龙',
            search: 'Cretaceous'
        },
        {
            id: 'jurassic',
            name: 'Jurassic Period / 侏罗纪',
            era: 'Mesozoic Era / 中生代',
            span: '201.3 - 145.0 million years ago / 2.01亿 - 1.45亿年前',
            o2: '26% (Elevated / 较高)',
            co2: '1200 ppm (4x modern / 现代水平的4倍)',
            temp: '16.5°C (Warm/Humid / 温暖潮湿)',
            sea: '+50m to +100m',
            tectonic: 'Pangaea splits into Gondwana and Laurasia. Gulf of Mexico opens as Atlantic widening starts. / 盘古超大陆开始分裂。墨西哥湾开启，大西洋逐步拓宽。',
            extinction: 'Minor extinction at Jurassic-Cretaceous boundary. / 侏罗纪-白垩纪边界处发生轻微物种更替事件。',
            bio: 'Sauropods reach giant proportions. Large theropods rule land ecosystems. Pliosaurs dominate seas. First feathered birds appear. / 蜥脚类恐龙体型达到巨型尺寸。大型兽脚类恐龙统治陆地。上龙统治海洋。最早的羽毛鸟类（始祖鸟）出现。',
            archetypes: 'Allosaurus, Stegosaurus, Brachiosaurus, Archaeopteryx, Pliosaurus / 异特龙、剑龙、腕龙、始祖鸟、上龙',
            search: 'Jurassic'
        },
        {
            id: 'triassic',
            name: 'Triassic Period / 三叠纪',
            era: 'Mesozoic Era / 中生代',
            span: '252.2 - 201.3 million years ago / 2.52亿 - 2.01亿年前',
            o2: '16% (Very Low / 极低)',
            co2: '1500 ppm (5x modern / 现代水平的5倍)',
            temp: '22°C (Arid greenhouse / 干旱温室气候)',
            sea: '0m to +50m',
            tectonic: 'All landmasses assembled into the supercontinent Pangaea. Panthalassa Ocean covers the rest of the globe. / 所有陆地聚集形成盘古超大陆。泛大洋覆盖了地球的大部分。',
            extinction: 'Triassic-Jurassic Extinction: 76% of species lost, allowing dinosaurs to establish land dominance. / 三叠纪-侏罗纪灭绝事件：76%物种灭绝，使恐龙得以确立在陆地上的霸主地位。',
            bio: 'First dinosaurs, pterosaurs, and mammals evolve. Pseudosuchians (crocodile-line) compete for land dominance. / 最早的恐龙、翼龙和哺乳动物演化出现。伪鳄类（鳄类分支）争夺陆地统治权。',
            archetypes: 'Herrerasaurus, Coelophysis, Plateosaurus, Postosuchus, Mastodonsaurus / 埃雷拉龙、腔骨龙、板龙、波斯特鳄、乳突龙',
            search: 'Triassic'
        },
        {
            id: 'permian',
            name: 'Permian Period / 二叠纪',
            era: 'Paleozoic Era / 古生代',
            span: '298.9 - 252.2 million years ago / 2.98亿 - 2.52亿年前',
            o2: '23% (Stable / 稳定)',
            co2: '900 ppm (3x modern / 现代水平的3倍)',
            temp: '16°C (Arid continental / 干旱大陆气候)',
            sea: '-50m to 0m (Low / 较低)',
            tectonic: 'Suturing of continents to form Pangaea is completed, creating harsh arid continental interiors. / 盘古超大陆碰撞拼合完成，形成严酷干燥的内陆腹地。',
            extinction: 'Permian-Triassic Extinction (The Great Dying): 96% of marine and 70% of land species lost (largest extinction in Earth history). / 二叠纪-三叠纪大灭绝（大死亡）：96%海洋物种和70%陆地物种消失（地球历史上最大规模的灭绝事件）。',
            bio: 'Synapsids (sail-backed Dimetrodon) dominate land. Conifers become dominant plants. Helicoprion rules Permian oceans. / 合弓纲（帆脊的异齿龙）统治陆地。松柏类植物成为优势植物。旋齿鲨称霸海洋。',
            archetypes: 'Dimetrodon, Inostrancevia, Helicoprion / 异齿龙、狼蜥兽、旋齿鲨',
            search: 'Permian'
        },
        {
            id: 'carboniferous',
            name: 'Carboniferous Period / 石炭纪',
            era: 'Paleozoic Era / 古生代',
            span: '358.9 - 298.9 million years ago / 3.58亿 - 2.98亿年前',
            o2: '32% (Oxygen Peak / 氧气含量峰值)',
            co2: '800 ppm (Moderate / 适中)',
            temp: '14°C (Cool/Mild / 凉爽温和)',
            sea: '+10m (High early, drops later / 早期高，晚期下降)',
            tectonic: 'Collision of Laurussia and Gondwana forms Hercynian mountains. Vast equatorial deltaic swamps cover continents. / 劳亚古陆与冈瓦纳古陆碰撞形成海西山脉。赤道附近的巨大三角洲沼泽覆盖了大陆。',
            extinction: 'Carboniferous rainforest collapse due to global cooling and aridification. / 由于全球变冷和干旱化导致石炭纪雨林崩溃。',
            bio: 'Gigantic swamp forests of lycophytes. Giant arthropods (Arthropleura) and huge insects rule land due to high oxygen. Reptiles evolve. / 巨大的石松类沼泽森林繁茂。高氧环境下，巨型节肢动物（节胸）和巨型昆虫统治陆地。爬行动物开始演化。',
            archetypes: 'Crassigyrinus, Arthropleura, giant amphibians / 粗吉螈、节胸、巨型两栖动物',
            search: 'Carboniferous'
        },
        {
            id: 'devonian',
            name: 'Devonian Period / 泥盆纪',
            era: 'Paleozoic Era / 古生代',
            span: '419.2 - 358.9 million years ago / 4.19亿 - 3.58亿年前',
            o2: '15% (Low / 较低)',
            co2: '2200 ppm (7x modern / 现代水平的7倍)',
            temp: '20°C (Warm / 温暖)',
            sea: '+100m to +150m (High / 较高)',
            tectonic: 'Laurussia and Gondwana slide closer together. Acadian mountains uplift in North America. / 劳亚古陆与冈瓦纳古陆靠拢。北美阿卡迪亚山脉隆起。',
            extinction: 'Late Devonian Extinction: 75% of species lost, decimation of ancient tropical coral reef networks. / 泥盆纪晚期大灭绝：75%的物种消失，古代热带珊瑚礁网络遭到严重破坏。',
            bio: 'Age of Fish. Heavily armored placoderms (Dunkleosteus) rule oceans. Early land plants form first forests. Lobe-finned fish transition to land. / 鱼类时代。身覆重甲的盾皮鱼（邓氏鱼）称霸海洋。最早的陆生植物形成森林。肉鳍鱼类向陆地过渡。',
            archetypes: 'Dunkleosteus, Bothriolepis, Tiktaalik, Acanthostega / 邓氏鱼、沟鳞鱼、提塔利克鱼、棘螈',
            search: 'Devonian'
        },
        {
            id: 'silurian',
            name: 'Silurian Period / 志留纪',
            era: 'Paleozoic Era / 古生代',
            span: '443.8 - 419.2 million years ago / 4.43亿 - 4.19亿年前',
            o2: '14% (Low / 较低)',
            co2: '4500 ppm (15x modern / 现代水平的15倍)',
            temp: '17°C (Warm / 温暖)',
            sea: '+50m to +100m',
            tectonic: 'Collision of Laurentia and Baltica begins. Major global sea level rise stabilizes marine habitats. / 劳伦大陆与波罗的大陆相撞开始。全球海平面大幅上升稳定了海洋生境。',
            extinction: 'Lau event (minor marine extinction). / 劳氏事件（较轻微的海洋灭绝事件）。',
            bio: 'First vascular land plants establish along coasts. Coral reefs expand. Giant sea scorpions (Pterygotus) become apex ocean predators. / 最早的维管束陆生植物在海岸线建立。珊瑚礁扩张。巨型海蝎（翼肢鲎）成为海洋顶级掠食者。',
            archetypes: 'Pterygotus, early jawed fish / 翼肢鲎、早期有颌鱼类',
            search: 'Silurian'
        },
        {
            id: 'ordovician',
            name: 'Ordovician Period / 奥陶纪',
            era: 'Paleozoic Era / 古生代',
            span: '485.4 - 443.8 million years ago / 4.85亿 - 4.43亿年前',
            o2: '13.5% (Low / 较低)',
            co2: '5600 ppm (18x modern / 现代水平的18倍)',
            temp: '16°C (Glaciated late phase / 晚期冰川化阶段)',
            sea: '+150m to +220m',
            tectonic: 'Gondwana moves toward South Pole, causing widespread glaciation and rapid cooling at end of period. / 冈瓦纳大陆移向南极，导致奥陶纪末期大范围冰川化和快速变冷。',
            extinction: 'Ordovician-Silurian Extinction: 85% of species lost due to global glaciation and sea level drops. / 奥陶纪-志留纪大灭绝：由于全球冰川化和海平面大幅下降，导致85%的物种灭绝。',
            bio: 'Marine life explodes. Cephalopods (Orthoceras) grow to giant sizes. Non-vascular land plants emerge. / 海洋生命大爆发。头足类（直角石）长至巨型尺寸。非维管陆生植物出现。',
            archetypes: 'Orthoceras, Trilobites / 直角石、三叶虫',
            search: 'Ordovician'
        },
        {
            id: 'cambrian',
            name: 'Cambrian Period / 寒武纪',
            era: 'Paleozoic Era / 古生代',
            span: '541.0 - 485.4 million years ago / 5.41亿 - 4.85亿年前',
            o2: '12.5% (Low / 较低)',
            co2: '6000 ppm (20x modern / 现代水平的20倍)',
            temp: '21°C (Warm greenhouse / 温暖温室气候)',
            sea: '+30m to +90m',
            tectonic: 'Supercontinent Pannotia disintegrates. Shallow seas flood continental shields. / 潘诺西亚超大陆分裂。浅海淹没了大陆地盾。',
            extinction: 'Minor Cambrian-Ordovician extinction events. / 轻微的寒武纪-奥陶纪灭绝事件。',
            bio: 'The Cambrian Explosion: rapid diversification of marine phyla. Hard shells and eyes appear. Anomalocaris rules as first apex predator. / 寒武纪大爆发：海洋无脊椎动物爆发式多样化。硬壳和眼睛出现。奇虾作为首个顶级掠食者称霸。',
            archetypes: 'Anomalocaris, Trilobites, Pikaia / 奇虾、三叶虫、皮卡虫',
            search: 'Cambrian'
        },
        {
            id: 'proterozoic',
            name: 'Proterozoic Eon / 元古宙',
            era: 'Precambrian Supereon / 前寒武纪',
            span: '2500 - 541 million years ago / 25亿 - 5.41亿年前',
            o2: '1% to 15% (Rising / 逐渐上升)',
            co2: '10x to 100x modern / 现代水平的10-100倍',
            temp: '12°C (Snowball Earth glaciations / 雪球地球大冰期)',
            sea: 'Highly Variable / 剧烈变动',
            tectonic: 'Supercontinents Columbia and Rodinia assemble and break apart. / 哥伦比亚超大陆与罗迪尼亚超大陆汇聚与分裂。',
            extinction: 'Great Oxidation Event: anaerobic organisms decimated due to oxygen toxicity. / 大氧化事件：厌氧生物由于氧气毒性被大规模消灭。',
            bio: 'Rise of cyanobacteria. Eukaryotic cells and multicellular Ediacaran organisms evolve. / 蓝细菌兴起。真核细胞与多细胞埃迪卡拉生物演化。',
            archetypes: 'Stromatolites, Dickinsonia / 叠层石、狄更逊水母',
            search: 'Proterozoic',
            noQuery: true
        },
        {
            id: 'archean',
            name: 'Archean Eon / 太古宙',
            era: 'Precambrian Supereon / 前寒武纪',
            span: '4000 - 2500 million years ago / 40亿 - 25亿年前',
            o2: '<0.1% (Anoxic / 缺氧)',
            co2: '100x to 500x modern / 现代水平的100-500倍',
            temp: '32°C (Hot, high greenhouse / 炎热、高浓度温室效应)',
            sea: 'Shallow global ocean, minimal land / 浅层全球海洋，陆地面积微小',
            tectonic: 'Volcanic island arcs collide; early continental nuclei begin to freeze. / 火山岛弧碰撞；早期大陆核（克拉通）开始固结。',
            extinction: 'None. / 无。',
            bio: 'Origin of life: first single-celled anaerobic archaea and bacteria appear near deep-sea thermal vents. / 生命起源：最早的单细胞厌氧古菌和细菌出现在深海热泉喷口。',
            archetypes: 'Microscopic unicellular fossils, early Stromatolites / 微观单细胞化石、早期叠层石',
            search: 'Archean',
            noQuery: true
        },
        {
            id: 'hadean',
            name: 'Hadean Eon / 冥古宙',
            era: 'Precambrian Supereon / 前寒武纪',
            span: '4600 - 4000 million years ago / 46亿 - 40亿年前',
            o2: '0% (None / 无)',
            co2: 'Vast carbon dioxide atmosphere / 高浓度二氧化碳大气层',
            temp: '150°C (Surface cooling / 地表逐渐冷却阶段)',
            sea: 'Magma ocean early, hot water condensation later / 早期为岩浆洋，后期热水冷凝成海',
            tectonic: 'Earth forms from solar nebula. Massive collision forms the Moon. Planetary crust solidifies. / 地球自太阳星云形成。大碰撞形成月球。行星地壳固化。',
            extinction: 'None. / 无。',
            bio: 'Prebiotic chemistry; organic compounds gather. No active cellular life. / 前生命化学演化；有机化合物汇聚。尚无活性细胞生命。',
            archetypes: 'Volcanic vents, asteroid bombardment / 火山喷口、小行星轰击',
            search: 'Hadean',
            noQuery: true
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
            node.innerHTML = `
                <div class="node-era">${data.era}</div>
                <div class="node-name">${data.name}</div>
                <div class="node-span">${data.span}</div>
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
            btn.textContent = `🔍 QUERY ARCHIVES FOR ${data.name.toUpperCase()} ASSETS / 查询数据库中的 ${data.name.toUpperCase()} 资产`;
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
