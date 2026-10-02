<h1 align="center">日和 · 每日卦帖</h1>

<p align="center">
  用生日、所在城市和 MBTI，写一张属于今天的卦帖。<br>
  看一段今日签意，选两件值得做的小事，再给一日三餐找点灵感。<br>
  支持中文、English、日本語；同样的资料在同一天，得到同一张签。
</p>

<p align="center">
  不必照单全收：挑一条喜欢的，慢慢把今天过好。签意仅供娱乐与自我关照。
</p>

<p align="center">
  <a href="https://kyouaena.github.io/daily-oracle/"><img src="https://img.shields.io/badge/online-open-526649?style=flat-square" alt="在线体验"></a>
  <img src="https://img.shields.io/badge/languages-ZH%20%7C%20EN%20%7C%20JA-687e61?style=flat-square" alt="中文、英文、日语">
  <img src="https://img.shields.io/badge/MBTI-16%20types-8b795f?style=flat-square" alt="16 种 MBTI">
  <img src="https://img.shields.io/badge/privacy-local%20only-66776b?style=flat-square" alt="资料仅在本机计算">
  <a href="https://github.com/Kyouaena/daily-oracle/stargazers"><img src="https://img.shields.io/github/stars/Kyouaena/daily-oracle?style=flat-square&amp;color=a78b5b" alt="GitHub Stars"></a>
</p>

<h3 align="center">
  <a href="https://kyouaena.github.io/daily-oracle/">打开每日卦帖</a> ·
  <a href="#今日卦帖里有什么">看看卦帖内容</a> ·
  <a href="#规则与边界">了解生成规则</a>
</h3>

<p align="center">米白与淡绿，留白与细线。给平常的日子，一点轻盈的仪式感。</p>

| 入口 | 内容 |
| --- | --- |
| 在线体验 | **[日和 · 每日卦帖](https://kyouaena.github.io/daily-oracle/)** · 手机与电脑均可使用 |
| 使用与说明 | [本地运行](#本地运行) · [功能](#功能) · [规则与边界](#规则与边界) · [隐私](#隐私) |
| 语言 | 中文 · [English](#english) · [日本語](#日本語)；网页右上角可即时切换 |
| 源码下载 | [下载 ZIP](https://github.com/Kyouaena/daily-oracle/archive/refs/heads/main.zip) · [浏览文件](https://github.com/Kyouaena/daily-oracle) |
| 交流 | [反馈问题或提出建议](https://github.com/Kyouaena/daily-oracle/issues) |

## 今日卦帖里有什么

| 一张签 | 给今天的一点灵感 |
| --- | --- |
| 一句话签意 | 今日主题、关键词与一段简短的提醒 |
| 三种状态 | 专注、人际与生活的轻量提示 |
| 宜做的小事 | 两条具体行动，写明大致需要几分钟 |
| 缓一缓 | 今天可以少一点的催促、纠结或忙乱 |
| 今日食笺 | 早餐、午餐、晚餐各一份灵感，可选择蛋奶素 |
| 幸运小物 | 一种幸运色、一个幸运数字，添一点仪式感 |

> **心有余白，好事自来。**<br>
> 不必把每一刻填满。留一点空隙，让小小的惊喜有处落脚。
>
> 这是示例签文。你的每日卦帖在网页中根据输入生成。

## 本地运行

```sh
npm start
# 打开 http://127.0.0.1:4173
npm test
```

无第三方运行依赖；需要 Python 3 启动本机 HTTP 服务，Node.js 18+ 运行测试。也可用任意静态服务器。不要直接双击 HTML 文件打开，浏览器可能阻止本地 ES 模块。

## 功能

- 中文 / English / 日本語即时切换：表单、签文、行动建议、食笺、提示与说明均有翻译；复制及打印跟随当前语言。
- 语言偏好单独保存在本机 `rihe-language-v1`；切换语言不重抽签、不清空表单，清除个人资料后仍保留界面语言。

- 16 种 MBTI、常见城市时区匹配、可手动选择世界时区。
- 按所选时区的日期生成，同一资料同一天稳定；页面可见时跨日自动更新。
- 默认不保存资料，主动勾选后仅存储于本机，可随时清除。
- 素食（蛋奶素、不含肉鱼）或不限饮食的三餐灵感。
- 复制文字卦帖；浏览器打印或另存 PDF，不含生日。
- 适配桌面及手机，支持键盘操作、减少动态效果偏好。

## 规则与边界

`oracle.js` 使用版本号、当地日期、公历生日、规范化城市文本、完整 MBTI 类型组成种子，通过确定性哈希为不同内容分类选取原创文案。MBTI 的 I/E 与 N/S 维度另用于挑选轻行动。饮食偏好过滤候选菜名，不改变运势。城市不读取天气、不请求地理定位；未匹配的城市请手动确认时区。不同城市写法可能产生不同结果。

这是娱乐性内容生成器，不是科学预测，也不是传统六爻 / 八字排盘。有限文案会在不同日期复用。菜名用于选择灵感，不推断体质、不做营养治疗，使用者须自行核对食材、过敏及忌口。

表达结构参考用户提供的「life-decision-guide」skill：一句话结论 → 具体行动及时间投入 → 少做什么 → 说明边界。只借鉴组织形式，签文与食笺均为原创；不引用《高性价比人生指南》的健康结论，不将娱乐结果标成证据等级。

## 隐私

生日、城市、MBTI 只在浏览器中参与计算，不发送给应用服务器。没有分析脚本、广告、外部字体或第三方 API。网站托管商仍可能记录常规 HTTP 访问日志。勾选记忆后，资料存于 `localStorage` 的 `rihe-profile-v1`，请勿在公共设备勾选。复制的卦帖包含城市和 MBTI，但不含生日。

## 在线使用

打开 **[日和 · 每日卦帖](https://kyouaena.github.io/daily-oracle/)**，填写生日、城市和 MBTI，点击「开启今日卦帖」。右上角可切换中文、英文或日语。无需安装、登录或提供 API Key。

页面由 GitHub Pages 托管，使用 `main` 分支根目录发布。

## 文件

- `index.html`：页面结构与示例卦帖
- `style.css`：响应式样式与打印布局
- `app.js`：表单、存储、渲染、复制及跨日更新
- `i18n.js`：中英日翻译、语言列表与城市建议
- `i18n.test.js`：翻译覆盖、结果稳定性、城市匹配与多语言复制测试
- `oracle.js`：可独立测试的生成规则与文案
- `oracle.test.js`：日期、确定性、输入校验、饮食偏好和复制隐私测试

## English

**Rihe · Daily Oracle** is a quiet daily ritual based on your birthday, city, MBTI and local date. Get a short reading, small practical actions and meal inspiration. Choose English in the top-right language menu. Your reading stays the same when you switch languages.

**[Open the daily oracle](https://kyouaena.github.io/daily-oracle/)** · No account or API key required. Personal details are processed in your browser and saved locally only if you choose to remember them. For entertainment and reflection, not scientific prediction or medical advice.

## 日本語

**日和 · 今日のおみくじ**は、生年月日・都市・MBTI・現地の日付から、今日のことば、小さな行動、三食のヒントを届けるページです。右上の言語メニューで日本語に切り替えられます。言語を変えても、その日の結果は変わりません。

**[今日のおみくじを開く](https://kyouaena.github.io/daily-oracle/)** · 登録や API キーは不要です。入力内容はブラウザー内で処理し、希望した場合のみ端末に保存します。楽しみと振り返りのためのもので、科学的な予測や医療上の助言ではありません。

## 致谢

README 的组织与排版参考 [《高性价比人生指南》](https://github.com/eternity4719/HowToLiveBetter)：先把用途讲清楚，再给出入口、目录和具体说明。签文与食笺为本项目原创。

## Star 走势

如果这张小小的卦帖让你喜欢，欢迎点一颗 Star。

下图展示 **Kyouaena/daily-oracle** 的真实收藏历史，由 [Star History](https://www.star-history.com/) 提供。项目刚公开时，数据可能较少或尚未形成曲线；第三方图表也可能有更新延迟。

<a href="https://www.star-history.com/#Kyouaena/daily-oracle&amp;Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Kyouaena/daily-oracle&amp;type=Date&amp;theme=dark">
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=Kyouaena/daily-oracle&amp;type=Date">
    <img alt="Kyouaena/daily-oracle Star History Chart" src="https://api.star-history.com/svg?repos=Kyouaena/daily-oracle&amp;type=Date" width="100%">
  </picture>
</a>
