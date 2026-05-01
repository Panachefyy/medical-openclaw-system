# 临床问诊助手 - 医生工作台

一个原生 HTML/CSS/JavaScript 实现的单页医生工作台原型，包含三栏布局、患者列表、等待就诊视图、接诊中视图、AI 智能助手、血脂趋势图和模拟数据。

## 文件结构

- `index.html`：页面入口。
- `styles.css`：完整页面样式。
- `js/mock.js`：患者、检查、检验、用药、AI 示例回复等模拟数据。
- `js/api.js`：AI API 客户端封装，预留 OpenClaw 对接。
- `js/app.js`：页面渲染、状态切换、图表、AI 对话交互。

## 本地运行

可直接打开 `index.html`，也可以启动静态服务：

```bash
python3 -m http.server 4174 --bind 127.0.0.1
```

访问：

```text
http://127.0.0.1:4174/
```

## 接入 OpenClaw

当前 `js/api.js` 会读取 `window.OPENCLAW_CONFIG` 或 `localStorage.OPENCLAW_CONFIG`。未配置 `endpoint` 时使用 mock 流式回复。

在 `index.html` 引入 `js/api.js` 前增加配置即可：

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
