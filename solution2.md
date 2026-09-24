PALEO ARCHIVE
第二轮代码审计报告 — 对照 suggestion.md 落地情况
范围：核对上一轮 suggestion.md 中每一条建议的落地情况,并给出本轮新发现问题的完整证据链、成因分析与可执行修复方案。所有行号均对应 assets/css/site.css（共5007行）与 assets/js/site.js（共1904行）当前版本。
结论摘要
好消息：hybrid 生成器整套（species-data.js / renderHelix / renderCompositeSplice）、escapeHtml 转义、Paleo.html 死代码删除、index 页 focus-visible、modal 地图放大，这五项上一轮点名的问题确实修好了，而且实现质量不错。
坏消息：上一轮报告点名的“根本问题”——用 !important 层层覆盖来代替真正修改旧规则——不但没有解决，本轮统计数据显示它明显恶化了，并且这个模式本身在这一轮又制造了至少两个新的、随时可能失效的隐藏 bug（详见 P0-1、P0-3）。
零、上一轮 suggestion.md 逐条核对
条目	状态	备注
#1 删除 Paleo.html / init_paleo()	已完成	HTML 和 JS 删干净了，但 CSS 里对应的 scope 没删，见 P0-2
#2 物种数据抽成 species-data.js	已完成	SPECIES 数组，len/wgt 已拆分为数值+单位两个字段
#4 loadCustomAssets 增加转义	已完成	已接入 escapeHtml()
#5 specimen 深链接串联	已完成	timescale 页可通过 ?specimen= 跳转到 gallery 对应卡片
2.1 hybrid/carnivore 撞色	已完成，但有隐患	hybrid 改成了 #e84393，但同一变量组现在在三处独立定义，见 P1-2
2.2 卡片视觉元素堆叠	已完成	DNA 序列 / containment badge 已移到 :hover 状态显示
2.3 modal 世界地图偏小	已完成	viewBox 从 0 0 500 270 改成 0 0 800 400
2.4 form 移动端预览掉到最下面	功能修好，但实现方式是新债	旧规则原封不动留着，靠新规则写在文件更后面去压过去，见 P0-3
2.5【根本问题】!important 覆盖战	恶化	见 P0-1，是本报告篇幅最长的一节
2.6 部分文字字号过小	部分改善	极端值（0.48rem级别）没有了，0.52–0.58rem这一档还有约12处，见 P2-1
2.7 index 页缺 focus-visible	已完成	primary-btn / ghost-btn 均已补上
3.x 混种生成器整套功能	基本落地	species-data 插值、DNA 螺旋动画、composite 图像拼接均已实现
一、P0 — 阻断级问题（建议优先处理）
P0-1　!important 覆盖战：上一轮的“根本问题”不但没解决，本轮明显更重了
这是整份报告篇幅最长的一节，因为它是所有其他问题（P0-3 的隐藏race condition、P1-2 的变量三处复制）共同的根源，值得讲透。
问题是什么
正常的 CSS 项目里，同一个类只应该有“一份基础规则 + 少数几处用更高优先级/媒体查询做的差异化覆盖”。而这个项目里，很多类是“每次要改效果，就在文件末尾新写一条同选择器的规则，用 !important 去压过所有之前写的”，旧的那条从来不删。结果就是同一个类在文件里散落好几处、甚至十几处，互相之间到底谁生效，只能靠“谁在文件里写得更靠后”这条隐性规则去猜。
证据一：整体数据在恶化
指标	上一轮（suggestion.md）	本轮	变化
site.css 总行数	4920 行	5007 行	+87 行
!important 出现次数	651 次	686 次	+35 次
.timeline-node 相关规则块（含伪类/状态）	10 处	55 处	×5.5
.workspace-grid 相关规则块	4 处	16 处	×4
.preview-sticky 相关规则块	8 处	14 处	×1.75
.timeline-container 相关规则块	14 处	18 处	+4
.timeline-list 相关规则块	11 处	16 处	+5
上一轮报告给出的合并方案（把这几类规则收成一份基础规则 + CSS 变量承载可调参数）一条都没有被采用。
证据二（重点）：.workspace-grid 的真实惨状——5 份互相打架的“基础定义”+ 9 份跨两种断点的“移动端覆盖”
这是本轮审计里最有代表性的一个例子，值得完整摊开看。form.html 里 .workspace-grid 这一个类，在文件里一共出现在 16 个位置。先看非媒体查询下的“基础定义”，一共有 5 份，取值全都不一样：
行号	grid-template-columns 取值	备注
第 2296 行	1fr 320px	最早的一份，固定像素宽度
第 2544 行	minmax(0, 1.2fr) 360px	改成了弹性比例
第 3129 行	minmax(0, 1fr) minmax(300px, 0.38fr)  !important	加上了 !important，比例又变了
第 4180 行	minmax(0, 0.95fr) minmax(360px, 0.54fr)  !important	比例再变一次
第 4701 行	minmax(0, 1fr) minmax(300px, var(--form-preview-width))  !important	改用变量，目前实际生效的是这一份
也就是说，过去几轮修改里，每次“调一下预览栏宽度”，做法都不是去改已有的那条规则，而是在文件更后面新写一条、加 !important 压过去。现在真正生效的是第 4701 行这份，前面 4 份全部是死代码——不会报错、不会警告，只是安安静静地占着 87 行左右的位置，谁都不知道能不能删。
移动端断点更混乱：同一个 .workspace-grid 在 @media (max-width: 900px) 和 @media (max-width: 980px) 两种不同的断点下各被单独覆盖了好几次：
断点	行号	取值
900px	第 2305 行	grid-template-columns: 1fr; gap: 30px; padding: 15px;
900px	第 2597 行	grid-template-columns: 1fr; padding: 0 12px 32px 12px;
900px	第 4791 行	grid-template-columns: 1fr !important;（实际生效的一份）
980px	第 3167 行	grid-template-columns: 1fr !important;
980px	第 3961 行	grid-template-columns: 1fr !important;
980px	第 4325 行	grid-template-columns: 1fr !important;
目前恰好因为这几份在“单列布局”这一点上取值一致，所以视觉上没有出 bug。但断点本身就是两套不统一的数字（900 vs 980），一旦以后有人只改 900px 那组、忘了 980px 那组（或者反过来），屏幕宽度落在 900–980px 这个区间的手机/平板上就会出现和其他宽度不一致的布局，而且没有任何报错提示——这跟 P0-3 里 preview-sticky 的问题是同一种“定时炸弹”。
证据三：.timeline-node 是本轮膨胀最严重的类，从 10 处变成 55 处
timescale.html 页面的时间轴节点样式 .timeline-node，精确统计（只算恰好等于这个选择器、不含伪类状态的“基础规则”）在文件里被单独定义了 10 次（第 1913、2124、2211、3027、3272、4006、4086、4109、4395、4609 行），如果把 :hover / .active / ::before 等状态变体也算进去，一共有 55 处规则块引用了这个类名。这跟上面 .workspace-grid 的情况是完全一样的病灶，只是这次是这一版新加的时间轴交互效果导致的膨胀。
为什么会这样：这个项目目前的 CSS 组织方式本身有问题
统计一下就能看出模式：全文件里 html[data-page="..."] 这种页面级选择器前缀一共出现了 1193 次，平均每 4 行代码就有一次。也就是说这个项目几乎没有“公共基础样式”的概念，每个页面的每个组件都是从零单独写一份、互相之间不复用。这样一来，同一个组件（比如预览栏、时间轴节点）只要在某个页面被调过参数，就一定会在文件里新增一段，而不是修改已有的那一段——因为“公共版本”根本不存在，没有一个唯一可改的地方。
修复方案
以 .timeline-node 为例（本轮最严重），把分散的 10 份基础规则 + 45 份状态变体，收成 1 份基础规则 + 用 CSS 变量表达可变部分：
/* 合并后骨架，放在 timescale 相关样式区的开头唯一一处 */
html[data-page="timescale"] .timeline-node{
  --node-size: 14px;
  --node-color: var(--ingen-green);
  width: var(--node-size);
  height: var(--node-size);
  background: var(--node-color);
  border-radius: 50%;
  transition: width .2s, height .2s, background .2s;
}
html[data-page="timescale"] .timeline-node.active{
  --node-color: var(--cls-hybrid);
}
html[data-page="timescale"] .timeline-node:hover{
  --node-size: 18px;
}
同样的思路应用到 .workspace-grid：把第 4701 行那份“最终生效”的规则当成唯一基础定义保留，删除 2296 / 2544 / 3129 / 4180 这四份死代码；移动端断点统一成一种（建议保留 900px，因为它跟项目里其他组件的断点一致），删除 980px 那三份重复覆盖。
落地建议：这项工作量比其他几条都大，涉及大量删除和回归测试，建议单独排一次“CSS 专项重构”，改完用浏览器在 375px / 768px / 900px / 980px / 1024px 几个宽度各截一次图，跟改之前的效果比对，确认没有视觉回归再合并。
P0-2　Paleo.html 已删除，但 CSS 里残留约 400 行死代码，其中还混进了第三份撞色变量
问题是什么
上一轮把 Paleo.html 页面本体和 site.js 里的 init_paleo() 函数都删干净了（这点确认无误），但 assets/css/site.css 里对应的 html[data-page="paleo"] 这个 scope 完全没有清理，现在没有任何一个 HTML 页面会触发 data-page="paleo" 这个属性值，这部分 CSS 规则处于彻底无法被访问、但依然占着文件体积的状态。
具体范围
经过精确匹配，html[data-page="paleo"] 这个前缀在文件里一共出现 55 次，集中在第 3595 行到第 3990 行之间，约 395 行。
为什么这是个真实风险，不只是“占地方”
这段死代码第 3616–3622 行里，藏着这套项目的第三份配色变量定义：
/* 第 3595 行起，html[data-page="paleo"] 这个 scope 内 */
html[data-page="paleo"]{
  --cls-hybrid: #e84393;
  --cls-carnivore: #c86b4d;   /* 注意：gallery / form 页用的是 #e74c3c */
  --cls-herbivore: #9f9a68;
  ...
}
现在因为没有页面用得到它，这份不一致的颜色不会被任何人看到，是无害的。但这个项目过去几轮的开发模式，一直是“复制一份现有页面/样式块当模板去改”（史阅、GTA LEGACY、HOOPS ARCHIVE 等站点都是这个路数），如果以后有人复制这一段 CSS 作为新页面的起点，颜色不一致的坑就会在不报任何错的情况下悄悄复现。
修复方案
直接删除第 3595 行到第 3990 行区间里所有 html[data-page="paleo"] 相关规则。唯一需要小心的例外是第 3984–3985 行，这两行的选择器列表里混了 gallery 和 paleo：
/* 第 3983–3986 行：这条规则要保留，只删掉其中 paleo 那一行选择器 */
html[data-page="gallery"] .grid,
html[data-page="paleo"] .grid{      /* ← 只删这一行 */
  grid-template-columns: 1fr !important;
}
删除后建议全局搜索一次 data-page="paleo"，确认 0 命中，再跑一次 P0-1 提到的几个断点截图回归，确认 gallery 页没受影响。
P0-3　form 移动端预览栏 bug 表面上修好了，但修复方式本身留了一颗定时炸弹
功能现状
手机宽度下打开 form.html，预览卡片现在会正确吸顶显示在顶部（一个 order:-1 + position:sticky 的摘要栏），跟上一轮 suggestion.md 2.4 建议的方案基本一致，视觉效果没问题。
但实现方式是什么
上一轮那条导致预览栏“掉到页面最下面”的旧规则，第 2304–2307 行，一个字都没有被动过：
/* 第 2304–2307 行：这是造成 bug 的旧规则，本轮完全没有改动 */
@media (max-width: 900px){
    html[data-page="form"] .workspace-grid{ grid-template-columns: 1fr; gap: 30px; padding: 15px; }
    html[data-page="form"] .preview-sticky{ position: static !important; }
}
这次“修复”的做法，是在文件末尾（第 4790–4801 行）另外新写了一条规则，把 position 从 static 强行改回 sticky：
/* 第 4790–4801 行：这是本轮新加的“修复”，靠写在文件更后面来压过上面那条 */
@media (max-width: 900px){
  html[data-page="form"] .workspace-grid{
    grid-template-columns: 1fr !important;
  }
  html[data-page="form"] .preview-sticky{
    order: -1;
    position: sticky !important;
    top: 8px !important;
    z-index: 80;
  }
}
为什么说这是定时炸弹
这两条规则的选择器完全相同（html[data-page="form"] .preview-sticky），优先级完全相同，都带 !important。在 CSS 里，当两条规则优先级和 specificity 完全一样时，胜出的规则由“谁在源代码文件里写得更靠后”决定——现在恰好是第 4790 行那条写得更靠后，所以它生效，页面显示正常。
问题在于，这个“谁生效”的结果完全依赖源代码里两条规则的相对顺序，而不是依赖任何显式的、可读的逻辑关系。以下几种完全合理、日常会发生的操作，都会在不报任何错误、不产生任何警告的情况下，让预览栏一夜之间“退回”成 bug 状态：
●	用 CSS 压缩/打包工具（比如按选择器合并规则）处理这个文件一次
●	以后有人整理 CSS，把同一选择器的规则挪到一起（这是很自然的重构冲动），不小心把顺序挪反了
●	复制这个 @media (max-width: 900px) 块去做别的页面时，把两段粘贴顺序弄反了
这正是 suggestion.md 2.5 点名的那个模式的完整体现：旧规则从未被删除或修改，靠“新规则写在更后面”去覆盖。上一轮报告说这个模式迟早会出问题，这一轮它已经在同一个属性上真实地埋了一次。
修复方案
删除第 2304–2307 行整个旧的 @media (max-width: 900px) 块（.workspace-grid 那条也要看一下——它同样在第 4791 行被重复定义，处理方式和 P0-1 里 .workspace-grid 的清理一起做），只保留第 4790 行这一份。删除之后，预览栏的吸顶行为会变成“只有一处定义、显式生效”，不再依赖文件内的书写顺序。
/* 删除这一整块（第 2304–2307 行） */
@media (max-width: 900px){
    html[data-page="form"] .workspace-grid{ grid-template-columns: 1fr; gap: 30px; padding: 15px; }
    html[data-page="form"] .preview-sticky{ position: static !important; }
}
/* 只保留第 4790 行起的那一份，其余关于 .preview-sticky 的重复定义
   （第 2426 / 2551 / 2601 / 2847 / 3137 / 3171 / 3790 / 3966 / 4200 / 4214 / 4276 行，
   共 14 处中的其余 13 处）建议一并核对，合并成 1 份基础规则 + 状态修饰。 */
二、P1 — 应该修，不算紧急
P1-1　site.js 里的 habitatData 硬编码坐标表有 5 个重复 key，其中 1 个数据已经不一致
问题是什么
gallery.html 渲染物种卡片时，物种基础数据（体长、体重、分类等）已经在上一轮里正确地集中到了 assets/js/species-data.js 的 SPECIES 数组。但物种的“化石产地”信息，仍然是 site.js 里第 351 行左右一个单独维护的 habitatData 对象字面量，按物种英文名字符串做 key，一共 132 个条目，跟 species-data.js 完全是两套独立数据源，靠名字字符串对应，没有任何机制保证两边同步。
具体证据
这 132 个 key 里，有 5 个是重复定义的：Bumpy、Mosasaurus、Allosaurus、Brachiosaurus、Argentinosaurus。JavaScript 对象字面量里如果同一个 key 出现两次，后面的会静默覆盖前面的，不会有任何报错或警告。逐一核对内容后：
●	Bumpy / Mosasaurus / Brachiosaurus / Argentinosaurus 这 4 个的两份定义内容完全相同，属于无意义的重复粘贴，纯粹是文件体积浪费，不影响显示结果
●	Allosaurus 的两份定义内容不一致，是唯一一个真正造成数据丢失的案例
// 第 357 行左右：第一份定义（信息更全）
'Allosaurus': { r: 'north_america', l: 'Morrison Formation, Colorado/Wyoming, USA' },
 
// 第 376 行左右：第二份定义（后写的这份生效，前一份被静默覆盖）
'Allosaurus': { r: 'north_america', l: 'Morrison Formation, Colorado, USA' },
// —— 最终页面上显示的产地信息丢失了 "Wyoming" 这个州，且没有任何提示
为什么会发生
跟 P1-2 是同一类根因：species-data.js 完成中心化之后，habitatData 这份“坐标/产地”数据没有被一起并进去，变成了一个孤立的平行数据源。一个 132 行的手写对象，出现一两个复制粘贴时手滑留下的重复 key，概率上是必然会发生的，而且因为 JS 不会对此报错，这类问题基本不可能靠人工审查发现，只能靠数据结构本身消除重复的可能性。
修复方案
把 habitatData 里的 r（region）和 l（label）字段，作为新增字段合并进 species-data.js 的 SPECIES 数组里每个物种对象，然后彻底删除 site.js 里这份独立的 132 行 habitatData 表，改成从 SPECIES 里按需读取。
// species-data.js：在原有物种对象上直接加两个字段，不再需要按名字二次查表
{
  name: 'Allosaurus',
  len: 8.5, lenUnit: 'm',
  wgt: 2300, wgtUnit: 'kg',
  region: 'north_america',
  site: 'Morrison Formation, Colorado/Wyoming, USA',
  // ...其余已有字段
}
合并时因为两个数据源用的是完全一样的“物种英文名”做匹配键，可以先写一个一次性小脚本自动核对 132 个 habitatData key 能不能在 SPECIES 里全部找到对应项，再决定内容以哪一份为准（建议保留信息更完整的那一份，比如 Allosaurus 用 Colorado/Wyoming 那版），避免手工合并时再引入新的不一致。
P1-2　配色变量组在三处被复制，而不是共享
问题是什么
--cls-carnivore / --cls-herbivore / --cls-hybrid 等一组分类配色变量，本该只在一个地方定义一次、被所有页面共享读取。但目前它在 gallery 页（第 772 行）、form 页（第 2240 行）、以及已经废弃的 paleo scope（第 3617 行，见 P0-2）里各自完整定义了一份。
/* 第 772 行，html[data-page="gallery"] scope 内 */
--cls-carnivore: #e74c3c; --cls-herbivore: #27ae60; --cls-pterosaur: #f1c40f;
 
/* 第 2240 行，html[data-page="form"] scope 内 —— 跟上面数值相同，纯复制 */
--cls-carnivore: #e74c3c; --cls-herbivore: #27ae60; --cls-pterosaur: #f1c40f;
 
/* 第 3617 行，html[data-page="paleo"] scope 内（死代码）—— 数值已经飘了 */
--cls-carnivore: #c86b4d;
gallery 和 form 这两份目前数值相同，还没有造成可见问题，但它们是两份独立的定义，不是共享的同一份——以后只要有人改其中一处忘了改另一处（就像 P0-2 里 paleo 那份已经发生的那样），两个页面上同一个物种分类的颜色就会不一致，而且不会有任何报错。
修复方案
把这组变量提到不带 data-page 限定的全局 :root 选择器里定义一次，各页面直接继承，不再逐页复制：
/* 建议加在 site.css 文件最开头，全局唯一一处 */
:root{
  --cls-carnivore: #e74c3c;
  --cls-herbivore: #27ae60;
  --cls-pterosaur: #f1c40f;
  --cls-hybrid: #e84393;
}
/* 删除 gallery(772行)、form(2240行) 两处的重复定义；
   paleo(3617行) 那份随 P0-2 的死代码清理一并删除 */
三、P2 — 顺手改，不影响功能
P2-1　部分文字字号仍然偏小
上一轮点名的极端值（0.48rem 级别）这一轮已经不存在了，说明确实动手改过一轮。但 0.52–0.58rem 这一档还有约 12 处未处理，集中在第 910、931、999、1011、1397、1482、1533、1597、1744、3467、4116、4496 行附近，多数是卡片上的标签类小字（比如 clearance-id、containment 相关的标注文字）。这个字号在手机小屏上阅读吃力，建议按原计划统一提到不低于 0.7rem。
四、落地优先级建议
●	① P0-2　清理 paleo 死代码（含第三份撞色变量）—— 纯删除，零功能风险，最快能做完
●	② P0-3　删除 form 页旧的 preview-sticky / workspace-grid 过期规则 —— 排除已确认存在的隐藏 race condition
●	③ P1-1　habitatData 并入 species-data.js，消灭平行数据源和 5 个重复 key
●	④ P1-2　配色变量收到 :root，消灭三处复制
●	⑤ P0-1　.workspace-grid（16处→1份）与 .timeline-node（55处→1份）规则归并 —— 工作量最大，建议单独排一次专项，配合多断点截图回归测试
●	⑥ P2-1　字号统一到 0.7rem 以上

① ~ ④ 都是相对独立、可以分别验证的小改动，建议先做完这四项；⑤ 涉及大范围删除和视觉回归，建议单独留出时间、每改完一处就用浏览器在 375 / 768 / 900 / 980 / 1024px 几个宽度截图比对，确认没有布局回归后再继续下一处。
