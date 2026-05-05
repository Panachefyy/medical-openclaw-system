(function () {
  const defaults = {
    apiBaseUrl: window.location.protocol === "file:" ? "" : window.location.origin,
    patientEndpoints: {
      todayVisits: "/api/visits/today",
      visitContext: "/api/visits/{visitId}/context"
    },
    openclaw: {
      skillEndpoint: "/api/openclaw/skill",
      chatEndpoint: "/api/openclaw/chat",
      timeoutMs: 45000,
      stream: true,
      headers: {}
    }
  };

  function readStorageConfig() {
    try {
      return JSON.parse(localStorage.getItem("MEDICAL_APP_CONFIG") || "{}");
    } catch (error) {
      return {};
    }
  }

  function deepMerge(base, extra) {
    const output = { ...base };
    Object.keys(extra || {}).forEach((key) => {
      if (extra[key] && typeof extra[key] === "object" && !Array.isArray(extra[key])) {
        output[key] = deepMerge(output[key] || {}, extra[key]);
      } else if (extra[key] !== undefined) {
        output[key] = extra[key];
      }
    });
    return output;
  }

  function getConfig() {
    return deepMerge(deepMerge(defaults, window.MEDICAL_APP_CONFIG || {}), readStorageConfig());
  }

  function resolveUrl(path) {
    if (/^https?:\/\//i.test(path)) return path;
    const config = getConfig();
    if (!config.apiBaseUrl) return path;
    return `${config.apiBaseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  }

  window.AppConfig = {
    getConfig,
    resolveUrl
  };
})();
