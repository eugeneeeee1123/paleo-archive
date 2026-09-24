# PALEO ARCHIVE — 第二轮审计（对照 suggestion.md）

> 范围：对比上一轮 suggestion.md 落地情况 + 本轮新发现的问题
> 结论先说：hybrid 生成器（species-data.js / renderHelix / renderCompositeSplice）、escapeHtml、
> Paleo.html 删除、index focus-visible、地图 viewBox 这几项**确实修好了**。
> 但上一轮点名的"根本问题"（`!important` 覆盖战）不但没解决，这一轮**恶化了**，
> 而且新增了几个由"只增量、不清理"这个模式直接导致的新 bug。

---

## 零、上一轮修复情况核对

| suggestion.md 条目 | 状态 | 备注 |
|---|---|---|
| #1 删除 Paleo.html / init_paleo() | ✅ 已删除 HTML+JS | 但 **CSS 没删干净**，见 P0-2 |
| #2 物种数据抽成 species-data.js | ✅ 已完成 | `SPECIES` 数组，len/wgt 已拆分数值+单位 |
| #4 loadCustomAssets 转义 | ✅ 已加 escapeHtml() | |
| #5 specimen 深链接接上 | ✅ timescale → gallery 已用 `?specimen=` | |
| 2.1 hybrid/carnivore 撞色 | ✅ hybrid 改成 #e84393 | 但见 P1-2，同一个变量现在有 3 份定义 |
| 2.2 卡片视觉元素叠加 | ✅ DNA/badge 移到 hover | |
| 2.3 modal 地图偏小 | ✅ viewBox 500×270 → 800×400 | |
| 2.4 form 移动端预览掉底部 | ✅ 功能上修好了 | 但**修法本身是新债**，见 P0-3 |
| 2.5【根本问题】`!important` 覆盖战 | ❌ **恶化** | 见 P0-1 |
| 2.6 过小字号 | 🟡 部分改善 | 极端值（0.48rem）没了，但 0.52–0.58rem 一批还在 |
| 2.7 index 缺 focus-visible | ✅ 已补 | |
| 3.x hybrid 生成器整套 | ✅ 基本落地 | species-data / lerp插值 / DNA螺旋 / composite splice 都在 |

---

## 一、P0 — 阻断级问题

### P0-1：`!important` 覆盖战没解决，反而更重了

上一轮统计（4920 行）：`!important` 651 次。**本轮统计（5007 行）：686 次。**

重复定义次数变化（同一个类在文件里被单独写规则块的次数，含伪类/状态）：

| 选择器 | 上一轮 | 本轮 | 变化 |
|---|---|---|---|
| `.workspace-grid` | 4 | 16 | ↑ |
| `.preview-sticky` | 8 | 14 | ↑ |
| `.timeline-container` | 14 | 18 | ↑ |
| `.timeline-list` | 11 | 16 | ↑ |
| `.timeline-node` | 10 | **55** | ↑↑↑ |
| `.synthesis-card` | 未统计 | 8 | — |

上一轮给的合并方案（把这几个类的规则收成一份 + CSS 变量承载可调参数）一条都没落地。现在的模式是：`html[data-page="X"] .foo{...}` 这种写法在全文件出现 **1193 次**，平均每 4 行就有一次页面级重复限定——本质上是"每个页面各写一份，而不是共享基础样式 + 页面差异化 override"，这是重复越滚越大的根源。

**解决方案（不变，重新提一次）**：挑 `.timeline-node` 开刀（本轮最严重），把它在 timescale 页的规则从 55 处收成 1 份基础 + 状态修饰：

```css
/* 合并后骨架 */
html[data-page="timescale"] .timeline-node{
  --node-size: 14px;
  --node-color: var(--ingen-green);
  width: var(--node-size);
  height: var(--node-size);
  background: var(--node-color);
  border-radius: 50%;
}
html[data-page="timescale"] .timeline-node.active{ --node-color: var(--cls-hybrid); }
html[data-page="timescale"] .timeline-node:hover{ --node-size: 18px; }
```
其余 52 处按同样思路归并，不再新增 `!important`。

---

### P0-2：Paleo.html 删了，但 CSS 死代码留了 ~400 行

`html[data-page="paleo"]` 这个 scope 在 `assets/css/site.css` 里还有 **55 条规则**（约第 3595–3990 行），对应的 HTML 页面已经不存在，没有任何页面会触发 `data-page="paleo"`。

更麻烦的是：这块死代码里藏着**第三份配色变量定义**（第 3616–3622 行）：

```css
html[data-page="paleo"]{
  ...
  --cls-hybrid: #e84393;
  --cls-carnivore: #c86b4d;   /* ← 跟 gallery/form 页的 #e74c3c 不一样 */
  --cls-herbivore: #9f9a68;
  ...
}
```

现在没人用它所以无害，但它是颗雷：以后谁复制这段 CSS 当新页面模板（这个项目目前的开发模式看，概率不低），颜色就会跟其他页面对不上，而且不会报任何错，只会"看起来哪里不对"。

**解决方案**：直接删除第 3595–3990 行区间的 `html[data-page="paleo"]` 相关规则。**注意**第 3984–3985 行是个例外：

```css
html[data-page="gallery"] .grid,
html[data-page="paleo"] .grid{
  grid-template-columns: 1fr !important;
}
```
这条选择器列表里混了 gallery，删的时候只去掉 `html[data-page="paleo"] .grid,` 这一行，保留 gallery 那份，别把整条规则删掉。

---

### P0-3：form 移动端预览修好了，但修法留了颗定时炸弹

功能上确认没问题（手机端现在会显示吸顶摘要栏，符合上一轮 2.4 的建议）。但实现方式是：

```css
/* 第 2304 行：旧规则，2.4 提出时就存在，从没被动过 */
@media (max-width: 900px){
    html[data-page="form"] .preview-sticky{ position: static !important; }
}

/* 第 4790 行：新加的规则，写在文件更后面，覆盖了上面那条 */
@media (max-width: 900px){
  html[data-page="form"] .preview-sticky{
    order: -1;
    position: sticky !important;
    top: 8px !important;
    z-index: 80;
  }
}
```

两条规则选择器优先级完全一样，都带 `!important`，现在生效的是第 4790 行那条——**纯粹因为它在文件里更靠后**。这正是 suggestion.md 2.5 点名的模式本体：旧规则一个字没删，靠新规则"写得更后面"去盖过去。CSS 只要重新排序、压缩、合并文件，这个功能就会在没有任何报错的情况下原地失效。

**解决方案**：删掉第 2304–2307 行那整个旧的 `@media (max-width: 900px)` 块（`.workspace-grid` 那条也一并检查是否被后面的规则覆盖，是的话一起删），只留第 4790 行这份。

---

## 二、P1 — 应该修，不算紧急

### P1-1：`habitatData`（site.js）里有 5 个重复 key，其中 1 个内容不一致

第 351–424 行左右的 `habitatData` 硬编码对象，132 个 key 里有 5 个重复定义：`Bumpy` / `Mosasaurus` / `Allosaurus` / `Brachiosaurus` / `Argentinosaurus`。JS 对象字面量后面的 key 会静默覆盖前面的，大部分是原样复制粘贴（无影响），但：

```js
// 第 357 行
'Allosaurus':{r:'north_america', l:'Morrison Formation, Colorado/Wyoming, USA'},
// ...
// 第 376 行（后写的这条生效，前一条数据白写）
'Allosaurus':{r:'north_america', l:'Morrison Formation, Colorado, USA'},
```

本质原因：物种数据已经中心化到 `species-data.js` 了，但坐标信息还是按 `name` 字符串单独在 `site.js` 里维护一份平行数据，两边字段随时可能不同步。

**解决方案**：把 `habitatData` 的字段（`r` region / `l` label）并入 `species-data.js` 的 `SPECIES` 数组，作为每个物种对象的 `region`/`site` 字段，删除 `site.js` 里这份独立的 132 行硬编码表，顺手去重。

### P1-2：配色变量三处复制，不是共享

`--cls-carnivore` 等一组变量在 gallery（772行）/ form（2240行）/ paleo（3617行，见 P0-2）三处各自定义一份，其中 paleo 那份数值已经飘了。这是变量层面的同一个病灶（P0-1 描述的重复模式），只是这次长在 `:root` 级变量上而不是布局规则上。

**解决方案**：把这组 `--cls-*` 变量提到全局 `:root{}` 或者一个不带 `data-page` 限定的公共选择器里定义一次，各页面直接读，不再逐页复制。

---

## 三、P2 — 顺手改

### P2-1：字号仍偏小

极端值（0.48rem）没有了，但 0.52–0.58rem 这一档还有约 12 处（第 910/931/999/1011/1397/1482/1533/1597/1744/3467/4116/4496 行附近）。按原计划提到至少 0.7rem。

---

## 四、落地优先级

1. **P0-2 清理 paleo 死代码**（含第三份配色变量）—— 最快能做，零功能风险
2. **P0-3 删掉 form 页旧的 preview-sticky/workspace-grid 规则**（第 2304 行块）—— 排除定时炸弹
3. **P1-1 habitatData 并入 species-data.js**，去掉 site.js 里的平行数据源
4. **P1-2 配色变量收到 :root**
5. **P0-1 `.timeline-node` 55 处规则归并** —— 工作量最大，但收益也最大，建议单独一次专项做
6. **P2-1 字号统一到 0.7rem**
