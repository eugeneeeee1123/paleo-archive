# PALEO ARCHIVE — 问题清单与优化方案

> 范围：index / gallery / timescale / form / Paleo(遗留) 五个页面 + site.js + site.css
> 代码均为**框架/骨架**，不是可以直接粘贴运行的完整实现，落地时还要接你现有的变量名和 DOM 结构。

---

## 一、代码结构问题（Syntax & Logic）

| # | 问题 | 影响 | 解决方案 |
|---|------|------|----------|
| 1 | `Paleo.html` + `site.js` 里的 `init_paleo()`（~350行）是 `gallery.html`/`init_gallery()`（~740行）的旧分支，没被任何页面链接，也不同步（没有化石坐标、没有 thumbs 懒加载、读不到 `loadCustomAssets`） | 维护时物种数据要改两处；文件多出 1000+ 行死代码 | 删除 `Paleo.html`，删除 `init_paleo()` 及其在 `initialize()`/`Object.assign` 里的注册。gallery.html 是更完整的版本，直接留它 |
| 2 | 物种数据（len/wgt/atk/hp/era...）硬编码在 gallery.html 每张卡片的 `data-*` 属性上，没有独立数据源 | form.html 拿不到"霸王龙有多重"这类信息，混种生成器做不起来；以后想加新页面复用物种数据也做不了 | 抽成 `assets/js/species-data.js`，一份 JS 对象/数组，gallery / timescale / form 都从这里读，渲染时再拼 HTML |
| 3 | `len`/`wgt` 是字符串（`"12.3m"`），不是数值 | 排序功能做不了"按体长/体重排"；混种数值插值也没法直接算 | 数值和单位拆开存：`len: 12.3, lenUnit: 'm'`，展示层再拼接 |
| 4 | `loadCustomAssets()` 用 `innerHTML` 直接拼你表单填的文本（name/fact/desc），没转义 | 字段里如果有双引号会把 HTML 属性拼断，卡片布局跑掉（自用风险低，但确实是个 bug） | 改用 `textContent` 赋值，或写一个简单的 `escapeHtml()` 包一层再拼 |
| 5 | gallery.html 已经写好了 `?specimen=xxx` 的深链接读取逻辑（第806行），但全站没有任何地方生成这种链接，是完全没用上的死代码 | 白写了一个功能 | 顺手接上：timescale.html 的物种关键词、或未来对比模式，可以直接 `gallery.html?specimen=Spinosaurus` 跳转并自动弹出详情框 |

---

## 二、设计与可访问性问题（Design & Accessibility）

**不止 responsive，实际截图+查 CSS 之后一共发现这些：**

### 2.1 配色：HYBRID 和 CARNIVORE 撞色
```
--cls-hybrid:     #d63031   /* 红 */
--cls-carnivore:  #e74c3c   /* 也是红 */
```
图鉴靠颜色分类别时这两个基本分不清。建议把 `--cls-hybrid` 换成更跳的品红/紫红，比如 `#e84393` 或 `#a83279`，跟"基因异常"标签的调性也更配。

### 2.2 卡片视觉元素叠得太多
每张卡片图片区同时有：class-icon 标签 + DNA 序列滚动文字 + containment badge，三层文字/标签叠在一张缩略图上，小卡片上容易糊在一起。建议只保留 1 个常驻标签（class-icon），DNA 序列和 containment badge 移到 hover 或 card-data 区域里。

### 2.3 详情弹窗（modal）里的 SVG 世界地图偏小
`viewBox="0 0 500 270"`，7大洲+多个标记点在这个尺寸里已经比较挤，移动端弹窗更小，标记点基本靠猜。建议给地图单独更多高度，或移动端直接换成"文字地点 + 小图标"的轻量展示，地图只在桌面端保留。

### 2.4 表单页（form.html）移动端体验被削弱
900px 以下预览卡会从右侧栏掉到整个表单**最下面**——手机上要填完十几个字段才第一次看到预览，"实时预览"的意义就没了。建议移动端把预览卡改成顶部吸顶的一条精简摘要栏（名字 + 体长体重 + 缩略图），而不是等表单填完才出现。

### 2.5【根本问题】CSS 里存在大量重复定义 + `!important` 覆盖战
实际统计（4920 行的 `site.css`）：

- 全文件 `!important` 出现 **651 次**
- `html[data-page="form"] .workspace-grid` 被重新定义 **4 处**，一次比一次加更多 `!important`
- `.preview-sticky` 被重写 **8 次**，form 页内的 `.card` **6 次**
- `html[data-page="timescale"] .timeline-container` 被重写 **14 次**，`.timeline-list` **11 次**，`.timeline-node` **10 次**

这是典型的"每次只敢加新规则、不敢动旧规则"积累出来的结果——很可能是因为按照 agents.md「禁止重构、只能增量修改」的原则，之前每次调整布局时都不敢改已有的规则，只能在文件末尾追加一条优先级更高的规则去盖过去。**现在这些页面最终长什么样，取决于文件里最后一条规则，而不是最初的设计**，这也是 hybrid 页和 timescale 页"感觉哪里不对"但又说不清哪里的根本原因。

解决方案：hybrid 页这次不再增量打补丁，把 `.workspace-grid` / `.preview-sticky` / `.synthesis-card` / 表单内 `.card` 这几个类的规则**合并成一份**，可调的地方用 CSS 变量承载：

```css
/* 合并前：4 处定义 + 若干 !important，见上面统计 */

/* 合并后：只保留一份，用变量装可调参数 */
html[data-page="form"] .workspace-grid{
  --form-preview-width: 360px;
  --form-col-gap: 26px;
  display: grid;
  grid-template-columns: minmax(0,1fr) minmax(300px, var(--form-preview-width));
  gap: var(--form-col-gap);
  width: min(1440px, calc(100vw - 32px));
  margin: 0 auto;
}
@media (max-width: 900px){
  html[data-page="form"] .workspace-grid{ grid-template-columns: 1fr; }
  html[data-page="form"] .preview-sticky{ position: static; }
}
```
其余页面（尤其 timescale 的 `.timeline-container` 系列）建议之后单独再来一轮同样的清理。

### 2.6 大量过小字号
`site.css` 里 `font-size: 0.48rem`（≈7.7px）、`0.5rem`（8px）、`0.55rem`（≈8.8px）出现在十几处，配合等宽字体本身字重就密，小屏上很吃力。建议这些点位统一提到至少 `0.7rem`（≈11px）。

### 2.7 index 页缺 focus-visible 样式，和其他页不一致
gallery / timescale / form 三个页面都给按钮和链接写了 `:focus-visible` 高亮，唯独 index.html 的导航按钮（ENTER ARCHIVE / VIEW TIMELINE / INITIATE SESSION）只给了输入框 focus 样式，键盘 tab 到按钮时可能没有可见反馈。建议补上和其他页一致的规则。

---

## 三、Hybrid 生成器重做方案

目标：选 Parent A（霸王龙）+ Parent B（棘龙）→ 自动算出混种的体长/体重/攻击/血量，滑块可调比例，图片有兜底方案，视觉上加一个 DNA 双螺旋动画作为核心视觉。

### 3.1 整体流程
```
选 Parent A / Parent B（下拉框，数据来自 species-data.js）
        │
        ├─► 基因显性滑块 t = 0~1  ──► lerp 插值算出 len/wgt/atk/hp
        │
        └─► resolveHybridImage(A, B, t)
                 │
                 ├─ 方案A：预置图库命中 → 直接显示
                 ├─ 方案B：没命中 → 前端 canvas 实时拼接（兜底，必定有图）
                 └─ 方案C：可选按钮"生成真实AI图" → 调后端 → 覆盖显示

        DNA 螺旋动画：常驻在预览卡里，两条链的颜色 = Parent A / Parent B 的分类色
```

### 3.2 数据层骨架 `assets/js/species-data.js`
```js
export const SPECIES = {
  trex: {
    name: 'Tyrannosaurus Rex', cn: '霸王龙', class: 'carnivore',
    len: 12.3, wgt: 8400, atk: 1800, hp: 4500,
    thumb: 'assets/images/thumbs/trex.webp',
    full:  'assets/images/originals/trex.jpg'
  },
  spinosaurus: {
    name: 'Spinosaurus', cn: '棘龙', class: 'carnivore',
    len: 15.0, wgt: 7500, atk: 1600, hp: 4200,
    thumb: 'assets/images/thumbs/spinosaurus.webp',
    full:  'assets/images/originals/spinosaurus.jpg'
  },
  // ... 把 gallery.html 里现有 data-* 属性批量迁移进来
};
```

### 3.3 数值插值骨架
```js
function lerp(a, b, t) { return a + (b - a) * t; }

function blendStats(speciesA, speciesB, t) {
  return {
    len: +(lerp(speciesA.len, speciesB.len, t)).toFixed(1),
    wgt: Math.round(lerp(speciesA.wgt, speciesB.wgt, t)),
    atk: Math.round(lerp(speciesA.atk, speciesB.atk, t)),
    hp:  Math.round(lerp(speciesA.hp,  speciesB.hp,  t)),
  };
}

// 可选：加一点随机浮动模拟"基因不稳定"，跟现有 DNA 序列滚动特效呼应
function withJitter(stats, pct = 0.05) {
  const jit = v => Math.round(v * (1 + (Math.random() * 2 - 1) * pct));
  return { ...stats, atk: jit(stats.atk), hp: jit(stats.hp) };
}
```

### 3.4 DNA 双螺旋动画骨架
纯 CSS + 少量 JS 生成，不需要 canvas/3D 库，颜色跟着 Parent A/B 的分类色走，视觉上直接体现"基因来源"：

```html
<div class="dna-helix" id="dnaHelix"></div>
```

```css
.dna-helix{
  position: relative;
  width: 120px;
  height: 340px;
  margin: 0 auto;
  perspective: 600px;
}
.dna-rung{
  position: absolute;
  left: 50%;
  width: 90px;
  height: 2px;
  margin-left: -45px;
  transform-style: preserve-3d;
  animation: dnaSpin 3s linear infinite;
}
.dna-rung::before, .dna-rung::after{
  content:''; position:absolute; top:-3px; width:8px; height:8px; border-radius:50%;
}
.dna-rung::before{ left:0;  background: var(--strand-a, var(--ingen-green)); }
.dna-rung::after { right:0; background: var(--strand-b, var(--ingen-green)); }

@keyframes dnaSpin{
  from{ transform: rotateY(0deg); }
  to{ transform: rotateY(360deg); }
}
@media (prefers-reduced-motion: reduce){
  .dna-rung{ animation: none; }
}
```

```js
function renderHelix(container, colorA, colorB, rungCount = 24) {
  container.style.setProperty('--strand-a', colorA);
  container.style.setProperty('--strand-b', colorB);
  container.innerHTML = '';
  for (let i = 0; i < rungCount; i++) {
    const rung = document.createElement('div');
    rung.className = 'dna-rung';
    const depth = i / rungCount;
    rung.style.top = (depth * 100) + '%';
    rung.style.animationDelay = (depth * 3) + 's'; // 错开相位，做出螺旋扭转的视觉
    container.appendChild(rung);
  }
}

// 选完两个物种后调用：
// renderHelix(document.getElementById('dnaHelix'),
//   `var(--cls-${speciesA.class})`, `var(--cls-${speciesB.class})`);
```
`prefers-reduced-motion` 已经照顾到；每根"横档"独立跑同一个旋转动画、只是相位不同，纯 CSS 就能出扭转效果，性能上比 canvas 粒子系统轻很多。

### 3.5 图片来源——方案 A / B / C 都写进去

**方案 A：预置素材库 + 命名约定（最实际，线下用 AI 画好丢进去就生效）**
```js
function getHybridImagePath(keyA, keyB) {
  const [k1, k2] = [keyA, keyB].sort(); // 排序保证 trex+spino 和 spino+trex 是同一个文件
  return `assets/images/hybrids/${k1}_${k2}.jpg`;
}

function imageExists(url) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}
```

**方案 B：前端实时合成（兜底方案，永远有图，不需要后端）**
```js
function renderCompositeSplice(canvas, imgAUrl, imgBUrl, blendRatio) {
  const ctx = canvas.getContext('2d');
  const imgA = new Image(), imgB = new Image();
  let loaded = 0;
  function draw() {
    const splitX = canvas.width * blendRatio;
    ctx.drawImage(imgA, 0, 0, splitX, canvas.height, 0, 0, splitX, canvas.height);
    ctx.drawImage(imgB, splitX, 0, canvas.width - splitX, canvas.height, splitX, 0, canvas.width - splitX, canvas.height);
    applyGlitchOverlay(ctx, canvas.width, canvas.height); // 复用现有 DNA/扫描线视觉语言
  }
  imgA.onload = () => { if (++loaded === 2) draw(); };
  imgB.onload = () => { if (++loaded === 2) draw(); };
  imgA.src = imgAUrl; imgB.src = imgBUrl;
}

function applyGlitchOverlay(ctx, w, h) {
  // 骨架：叠加半透明扫描线 / 随机色差条，具体效果再调
  ctx.fillStyle = 'rgba(0,255,150,0.03)';
  for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 1);
}
```

**方案 C：真 AI 生图（需要后端，先留好接口，不急着做）**
```js
// 前端：只收集参数，不能把 API key 放进前端代码
async function requestAIHybridImage(speciesA, speciesB, traits) {
  const res = await fetch('/api/generate-hybrid', { // 需部署到 Vercel / Cloudflare Worker
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ speciesA, speciesB, traits })
  });
  const data = await res.json();
  return data.imageUrl;
}
```
```js
// /api/generate-hybrid.js（serverless，伪代码骨架）
export default async function handler(req, res) {
  const { speciesA, speciesB, traits } = req.body;
  const prompt = buildPrompt(speciesA, speciesB, traits);
  const result = await callImageGenAPI(prompt, process.env.IMAGE_API_KEY); // key 存服务器环境变量，不进前端
  res.json({ imageUrl: result.url });
}
```

**总控制器：三个方案怎么串起来**
```js
async function resolveHybridImage(speciesA, speciesB, blendRatio, canvasEl) {
  const presetPath = getHybridImagePath(speciesA.key, speciesB.key);
  if (await imageExists(presetPath)) {
    return { type: 'preset', src: presetPath };            // 方案A：线下画好的图，优先用
  }
  renderCompositeSplice(canvasEl, speciesA.thumb, speciesB.thumb, blendRatio);
  return { type: 'composite', canvas: canvasEl };            // 方案B：自动兜底，永远有图
  // 方案C 不放进自动流程，做成一个独立的"生成真实AI图"按钮，用户手动触发
}
```

---

## 四、落地优先级建议

1. **物种数据抽成 `species-data.js`**（第一部分#2）—— 后面所有 hybrid 功能都靠这个
2. **hybrid 页 CSS 清理**（第二部分#2.5）—— 先把地基铲平，不然新功能继续叠 `!important`
3. **Parent A/B 选择器 + 数值滑块**（第三部分 3.2/3.3）
4. **DNA 螺旋动画**（第三部分 3.4）
5. **图片方案 A + B**（第三部分 3.5，C 留到后面有后端再说）
6. 删除 `Paleo.html`（第一部分#1）—— 不影响任何功能，随时可以顺手做
7. 配色/字号/focus 这几个小设计问题（第二部分 2.1/2.6/2.7）—— 顺手改，不着急
