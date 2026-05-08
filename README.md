# 临床问诊助手 - 医生工作台

一个原生 HTML/CSS/JavaScript 实现的单页医生工作台原型，包含三栏布局、患者列表、等待就诊视图、接诊中视图、AI 智能助手、血脂趋势图和模拟数据。

## 文件结构

- `index.html`：页面入口。
- `styles.css`：完整页面样式。
- `js/data/mock.js`：患者、检查、检验、用药、AI 示例回复等模拟数据。
- `js/core/config.js`：前端运行配置，包含业务 API 和 OpenClaw 代理接口地址。
- `js/core/http.js`：统一请求封装，处理 JSON、超时和错误。
- `js/state/store.js`：共享状态容器，保存患者上下文和 skill 结果。
- `js/services/patientService.js`：读取今日患者列表和患者完整上下文，未配置后端时自动使用 mock。
- `js/services/openclawService.js`：调用 OpenClaw skill/chat 代理接口，支持 SSE 流式输出。
- `js/services/openclawClient.js`：兼容旧版 OpenClaw HTTP endpoint 的客户端封装。
- `js/ai/contextBuilder.js`：把患者病历、检查、检验、用药和对话整理成 OpenClaw 输入上下文。
- `js/ai/skillResultMapper.js`：把 OpenClaw skill 结果映射为页面可展示的结构。
- `js/viewModels/patientViewModel.js`：把患者上下文加工成页面展示模型。
- `js/presentation/app.js`：页面渲染、状态切换、图表、AI 对话交互。

## 本地运行

可直接打开 `index.html`，也可以启动静态服务：

```bash
python3 -m http.server 4174 --bind 127.0.0.1
```

访问：

```text
http://127.0.0.1:4174/
```

如果要连接真实 OpenClaw Gateway，请使用内置 Node 代理服务：

```bash
npm start
```

访问：

```text
http://127.0.0.1:3000/
```

开发时如果希望保存文件后浏览器自动刷新，可以使用内置热加载服务：

```bash
python3 dev-server.py --port 4174
```

访问：

```text
http://127.0.0.1:4174/
```

热加载模式会临时禁用 service worker，避免 PWA 缓存影响开发预览。

## Chrome 安装版（PWA）

项目支持通过 Chrome 安装为本地应用。先启动本地静态服务：

```bash
python3 -m http.server 4174 --bind 127.0.0.1
```

然后用 Chrome 访问：

```text
http://127.0.0.1:4174/
```

在地址栏右侧点击“安装”图标，或进入 Chrome 菜单：

```text
保存和分享 -> 安装页面为应用
```

安装后会以独立窗口运行，并使用 `manifest.webmanifest` 和 `sw.js` 缓存本地静态资源。

## 接入业务后端和 OpenClaw

推荐让浏览器只访问你的业务后端，由后端读取 HIS/LIS/PACS 数据并代理 OpenClaw，避免在前端暴露密钥和敏感数据。

代理服务会读取：

```text
~/.openclaw/openclaw.json -> gateway.auth.token
```

也可以用环境变量覆盖：

```bash
OPENCLAW_WS_URL=ws://127.0.0.1:18789 \
OPENCLAW_GATEWAY_TOKEN=你的gateway_token \
PORT=3000 \
npm start
```

前端默认在非 `file://` 场景下调用同源 API：

```text
/api/visits/today
/api/visits/{visitId}/context
/api/openclaw/skill
/api/openclaw/chat
```

这些路径由 `server/` 内置代理实现，再由代理通过 WebSocket JSON-RPC 调用 OpenClaw Gateway。

在 `index.html` 引入 `js/core/config.js` 前增加配置：

```html
<script>
  window.MEDICAL_APP_CONFIG = {
    apiBaseUrl: "https://your-backend-host",
    patientEndpoints: {
      todayVisits: "/api/visits/today",
      visitContext: "/api/visits/{visitId}/context"
    },
    openclaw: {
      skillEndpoint: "/api/openclaw/skill",
      chatEndpoint: "/api/openclaw/chat",
      stream: true,
      headers: {
        Authorization: "Bearer YOUR_SESSION_TOKEN"
      }
    }
  };
</script>
```

未配置 `apiBaseUrl` 时，页面会自动使用 `js/data/mock.js` 的本地模拟数据和模拟 skill 流式结果。

### 患者数据接口

今日就诊列表：

```text
GET /api/visits/today?status=waiting
```

返回：

```json
{
  "patients": [],
  "statusTabs": [
    { "key": "waiting", "label": "待诊", "count": 8 },
    { "key": "active", "label": "接诊中", "count": 2 },
    { "key": "done", "label": "已完成", "count": 15 }
  ]
}
```

患者完整上下文：

```text
GET /api/visits/{visitId}/context?patientId=p001
```

返回字段建议包含：

```json
{
  "hypertensionHistory": [],
  "imaging": [],
  "ultrasound": [],
  "lipids": {},
  "labs": [],
  "medications": [],
  "dialog": [],
  "diagnoses": [],
  "vitals": {},
  "records": []
}
```

### OpenClaw Gateway 接入

真实 OpenClaw 不提供 `/api/openclaw/skill` 和 `/api/openclaw/chat` REST 接口。当前项目的 Node 代理负责把前端接口转换为 OpenClaw Gateway WebSocket 调用：

```text
sessions.resolve
sessions.messages.subscribe
chat.send
```

OpenClaw Gateway：

```text
ws://127.0.0.1:18789
```

健康检查：

```text
GET http://127.0.0.1:18789/health
GET http://127.0.0.1:18789/healthz
```

前端仍调用代理接口：

```text
POST /api/openclaw/skill
POST /api/openclaw/chat
```

代理请求体：

```json
{
  "skill": "patient_summary",
  "action": "summary",
  "patientContext": {},
  "messages": [],
  "stream": true
}
```

已支持的 skill：

```text
快速总结病情 -> Medical Document Processor + medical
解读检查结果 -> medical-terms + medical-qa
用药建议参考 -> medical-advice
生成病历文书 -> Medical Document Processor + medical-note-assistant
实时信息抽取 -> medical-entity-extractor
鉴别诊断建议 -> medsyniq-lite + medical-research-toolkit
普通智能问答 -> medical-qa
```

非流式返回：

```json
{
  "displayText": "患者高血压病史10年，近期血压控制不稳定...",
  "result": {
    "summary": "高血压病史10年...",
    "keyFindings": ["LDL-C偏高"],
    "recommendations": ["评估降压方案"]
  },
  "confidence": 0.86,
  "warnings": ["AI结果需结合医生临床判断"]
}
```

SSE 流式返回：

```text
event: token
data: {"content":"患者高血压"}

event: skill_result
data: {"result":{"summary":"...","keyFindings":["..."]},"confidence":0.86}

event: done
data: {}
```

Skill 的自然语言结果会进入右侧 AI 对话，结构化结果会同步展示到中间的 `OpenClaw Skill结果` 面板，并反写到 AI总结、实时提取信息、AI分析结果等模块。

注意：OpenClaw Gateway 原始流是 WebSocket JSON-RPC notification，不是 SSE。`server/routes/api.js` 会把：

```text
chat.event state=delta
chat.event state=final
```

转换为前端使用的：

```text
event: token
event: skill_result
event: done
```

如果 OpenClaw final 内容中包含 ```json fenced block，代理会解析 JSON 并作为结构化结果返回；否则会把最终文本包装成基础结构化结果。

## 兼容旧版 OpenClaw 配置

当前 `js/services/openclawClient.js` 会读取 `window.OPENCLAW_CONFIG` 或 `localStorage.OPENCLAW_CONFIG`。未配置 `endpoint` 时使用 mock 流式回复。

在 `index.html` 引入 `js/services/openclawClient.js` 前增加配置即可：

```html
<script>
  window.OPENCLAW_CONFIG = {
    endpoint: "https://your-openclaw-host/v1/chat/completions",
    stream: true,
    headers: {
      Authorization: "Bearer YOUR_TOKEN"
    }
  };
</script>
```

前端发送的数据结构包含：

- `messages`：对话历史。
- `patientContext`：当前患者、病史、检查、检验、用药等上下文。
- `action`：`summary`、`labs`、`medication`、`record` 或 `chat`。
- `stream`：是否启用流式输出。

流式接口支持 SSE 的 `data: ...` 行，也支持普通文本 chunk。后端返回 JSON 时可使用 `content`、`text` 或 `message` 字段。
