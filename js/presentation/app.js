(function () {
  const mock = window.MedicalMock;
  const viewModel = window.PatientViewModel;
  const state = {
    status: "waiting",
    selectedPatientId: "p001",
    search: "",
    activeMainTab: "dialog",
    patients: [...mock.patients],
    statusTabs: [...mock.statusTabs],
    patientContext: window.PatientService.mockContext(mock.patients[0]),
    skillResults: {},
    dataLoading: false,
    contextLoading: false,
    dataError: "",
    contextError: "",
    assistantMessages: [...mock.aiAssistantHistory],
    isAiLoading: false,
    aiError: "",
    aiPanelCollapsed: false
  };
  let lipidChart = null;
  let layoutRefreshTimer = null;

  const els = {
    statusTabs: document.getElementById("statusTabs"),
    patientList: document.getElementById("patientList"),
    mainPanel: document.getElementById("mainPanel"),
    aiPanel: document.getElementById("aiPanel"),
    workspace: document.querySelector(".workspace"),
    search: document.getElementById("globalSearch"),
    refresh: document.getElementById("refreshList")
  };

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function nowTime() {
    return new Date().toTimeString().slice(0, 5);
  }

  function selectedPatient() {
    return state.patients.find((patient) => patient.id === state.selectedPatientId) || state.patients[0] || mock.patients[0];
  }

  function clinicalContext() {
    return state.patientContext || window.PatientService.mockContext(selectedPatient());
  }

  function patientContext() {
    return window.PatientContextBuilder.build(clinicalContext());
  }

  function filteredPatients() {
    return window.PatientStats.filterPatients(state.patients, { status: state.status, search: state.search });
  }

  function tagClass(text) {
    return viewModel.tagClass(text);
  }

  function currentStatusTabs() {
    return window.PatientStats.countStatusTabs(mock.statusTabs, state.patients);
  }

  function renderMedicationTable(rows) {
    if (!rows?.length) {
      return '<div class="empty-state">暂无长期用药记录</div>';
    }
    return renderTable(rows, [
      { key: "name", label: "药品名称" },
      { key: "spec", label: "规格" },
      { key: "usage", label: "用法用量" },
      { key: "purpose", label: "用途" }
    ]);
  }

  function renderStatusTabs() {
    const tabs = state.statusTabs?.length ? state.statusTabs : currentStatusTabs();
    els.statusTabs.innerHTML = tabs
      .map(
        (tab) => `
          <button class="${state.status === tab.key ? "active" : ""}" type="button" data-status="${tab.key}">
            ${tab.label}<span>(${tab.count})</span>
          </button>
        `
      )
      .join("");
  }

  function renderPatientList() {
    const patients = filteredPatients();
    if (state.dataLoading) {
      els.patientList.innerHTML = '<div class="empty-state">正在读取今日就诊患者...</div>';
      return;
    }
    if (state.dataError) {
      els.patientList.innerHTML = `<div class="empty-state error">${state.dataError}</div>`;
      return;
    }
    if (!patients.length) {
      els.patientList.innerHTML = '<div class="empty-state">暂无匹配患者</div>';
      return;
    }
    els.patientList.innerHTML = patients
      .map(
        (patient) => `
          <button class="patient-item ${patient.id === state.selectedPatientId ? "selected" : ""}" type="button" data-patient-id="${patient.id}">
            <div>
              <strong>${patient.name}</strong>
              <span>${patient.sex}</span>
              <span>${patient.age}岁</span>
            </div>
            <em class="${tagClass(patient.tag)}">${patient.tag}</em>
            <p>就诊号：${patient.visitNo}</p>
            <time>${patient.time}</time>
          </button>
        `
      )
      .join("");
  }

  function renderPatientHeader(patient, compact = false) {
    const statusTitle = patient.status === "done" ? "已完成" : patient.status === "active" ? "接诊中" : "等待就诊";
    const statusDetail =
      patient.status === "done"
        ? `完成时间 ${patient.completedAt || patient.visitDate || "--"}`
        : patient.status === "active"
          ? `开始时间 ${patient.consultStartedAt || "--"}`
          : `预计等待 ${patient.waitEstimate || "约15分钟"}`;
    return `
      <section class="patient-header panel ${compact ? "compact" : ""}">
        <div class="avatar-large"></div>
        <div class="patient-identity">
          <div class="identity-line">
            <h2>${patient.name}</h2>
            <span>${patient.sex}</span>
            <span>${patient.age}岁</span>
            <em class="risk-tag">${patient.tag}</em>
          </div>
          <div class="info-grid">
            <span><b>医保卡号</b>${patient.medicalCard || "--"}</span>
            <span><b>就诊号</b>${patient.visitNo}</span>
            <span><b>手机号</b>${patient.phone || "--"}</span>
            <span><b>过敏史</b><i class="${patient.allergy && patient.allergy !== "无" ? "danger-text" : ""}">${patient.allergy || "无"}</i></span>
            <span><b>身高</b>${patient.height || "--"}</span>
            <span><b>体重</b>${patient.weight || "--"}</span>
            <span><b>BMI</b>${patient.bmi || "--"}</span>
          </div>
        </div>
        ${
          compact
            ? `<div class="consult-timer"><span></span>问诊中 <strong id="timerText">00:06:35</strong><div class="voice-wave">${"<i></i>".repeat(32)}</div></div>`
            : `<div class="visit-card">
                <h3>本次就诊</h3>
                <p><span>就诊科室</span>${patient.department}</p>
                <p><span>就诊时间</span>${patient.visitDate}</p>
                <p><span>就诊医生</span>${patient.doctor}</p>
              </div>
              <div class="status-card">
                <span>就诊状态</span>
                <strong>${statusTitle}</strong>
                <p>${statusDetail}</p>
              </div>`
        }
        ${compact ? "" : '<button class="link-button" type="button">查看完整病历 ›</button>'}
      </section>
    `;
  }

  function infoList(rows) {
    return rows.map(([label, value]) => `<p><span>${label}</span><strong>${value}</strong></p>`).join("");
  }

  function examList(items) {
    return items
      .map(
        (item) => `
          <li>
            <time>${item.date}</time>
            <strong>${item.name}</strong>
            <em class="${tagClass(item.status)}">${item.status}</em>
            <span>${item.desc}</span>
          </li>
        `
      )
      .join("");
  }

  function renderAiSummary(patient) {
    const skillSummary = state.skillResults.patient_summary?.summaryCard;
    const ctx = clinicalContext();
    const aiSummary = viewModel.buildAiSummaryView({ patient, context: ctx, skillSummary, mock });
    const meds = aiSummary.medications;
    const groups = aiSummary.medicationGroups;
    const summary = aiSummary.summary;
    return `
      <section class="ai-summary panel">
        <div class="section-heading">
          <h3><span class="mini-icon">AI</span> AI智能总结</h3>
          <small>更新于 2024-05-18 16:30 ｜ 基于病历、检查和用药数据生成</small>
          <button class="icon-only" data-ai-action="summary" type="button">↻</button>
        </div>
        <h4>病情概述</h4>
        <p class="summary-text">${summary.overview}</p>
        <div class="summary-grid">
          <div class="summary-block">
            <h4>关键特征</h4>
            <div class="tag-cloud">
              ${summary.features.map((feature) => `<span class="${tagClass(feature)}">${feature}</span>`).join("")}
            </div>
          </div>
          <div class="summary-block">
            <h4>重要信息</h4>
            ${summary.important
              .map((item) => `<p><span>${item.label}</span><strong class="${item.level === "danger" ? "danger-text" : ""}">${item.value}</strong></p>`)
              .join("")}
          </div>
          <div class="summary-block meds">
            <h4>用药情况</h4>
            <div class="med-count"><strong>${meds.length}</strong><span>种在用药物</span></div>
            <div class="med-name-list">
              ${meds.length ? meds.slice(0, 4).map((med) => `<em>${med.name}</em>`).join("") : "<em>暂无长期用药记录</em>"}
            </div>
            <div class="med-group-list">
              ${groups.map((item) => `<span>${item.label}<b>${item.count}</b>种</span>`).join("")}
            </div>
          </div>
          <div class="summary-block">
            <h4>治疗建议 <small>AI参考</small></h4>
            <ul>${summary.suggestions.map((item) => `<li>${item}</li>`).join("")}</ul>
          </div>
        </div>
      </section>
    `;
  }

  function renderSkillResultPanel() {
    const results = Object.values(state.skillResults);
    if (!results.length) {
      return `
        <section class="panel skill-panel">
          <div class="section-heading">
            <h3>智能体处理结果</h3>
            <small>尚未触发AI技能，点击右侧快捷能力开始分析</small>
          </div>
          <div class="skill-empty">可展示病情总结、检查解读、用药建议、病历文书和实时问诊抽取结果。</div>
        </section>
      `;
    }

    return `
      <section class="panel skill-panel">
        <div class="section-heading">
          <h3>智能体处理结果</h3>
          <small>结构化结果已同步到页面模块</small>
        </div>
        <div class="skill-grid">
          ${results
            .map(
              (result) => `
                <article>
                  <div><strong>${skillTitle(result.skill)}</strong>${result.confidence ? `<span>置信度 ${(result.confidence * 100).toFixed(0)}%</span>` : ""}</div>
                  ${result.skillName ? `<small>${result.skillName}</small>` : ""}
                  <p>${result.displayText || result.recordDraft || "已返回结构化结果"}</p>
                  ${renderSkillHighlights(result)}
                  ${result.warnings?.length ? `<em>${result.warnings.join("；")}</em>` : ""}
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function renderSkillHighlights(result) {
    if (result.extraction) {
      const items = [
        result.extraction.chiefComplaint && `主诉：${result.extraction.chiefComplaint}`,
        result.extraction.symptoms?.length ? `症状：${result.extraction.symptoms.slice(0, 4).join("、")}` : "",
        result.extraction.diagnoses?.length ? `诊断：${result.extraction.diagnoses.slice(0, 3).join("、")}` : "",
        result.extraction.actionItems?.length ? `建议：${result.extraction.actionItems.slice(0, 3).join("、")}` : ""
      ].filter(Boolean);
      return items.length ? `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>` : "";
    }
    if (result.labInterpretation) {
      const abnormal = result.labInterpretation.abnormalItems || [];
      const recs = result.labInterpretation.recommendations || [];
      return `
        ${abnormal.length ? `<ul>${abnormal.slice(0, 3).map((item) => `<li>${item.item || item} ${item.value || ""}${item.unit || ""} ${item.interpretation || ""}</li>`).join("")}</ul>` : ""}
        ${recs.length ? `<p class="skill-recs">建议：${recs.slice(0, 3).join("；")}</p>` : ""}
      `;
    }
    if (result.medicationAdvice?.recommendations?.length) {
      return `<ul>${result.medicationAdvice.recommendations.slice(0, 4).map((item) => `<li>${item}</li>`).join("")}</ul>`;
    }
    return "";
  }

  function renderContextNotice() {
    if (state.contextLoading) {
      return '<div class="data-notice">正在读取患者病历、检查、检验和用药数据...</div>';
    }
    if (state.contextError) {
      return `<div class="data-notice error">${state.contextError}</div>`;
    }
    return "";
  }

  function skillTitle(skill) {
    const titles = {
      patient_summary: "病情总结",
      lab_interpretation: "检查解读",
      medication_advice: "用药建议",
      medical_record_generation: "病历文书",
      consultation_extraction: "问诊抽取",
      diagnosis_suggestion: "诊断建议",
      general_consultation_chat: "智能问答"
    };
    return titles[skill] || skill;
  }

  function renderTable(rows, columns) {
    return `
      <table>
        <thead><tr>${columns.map((col) => `<th>${col.label}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows
            .map(
              (row) => `
                <tr>
                  ${columns
                    .map((col) => {
                      const value = row[col.key] || "";
                      if (col.key === "trend") {
                        const arrow = value === "up" ? "↑" : value === "down" ? "↓" : "";
                        return `<td class="${value === "up" ? "danger-text" : value === "down" ? "success-text" : ""}">${arrow}</td>`;
                      }
                      return `<td>${value}</td>`;
                    })
                    .join("")}
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  function renderHistoryCard(history) {
    return `
      <article class="panel history-card">
        <div class="section-heading"><h3>${history.title} <small>${history.meta}</small></h3></div>
        <div class="history-list">${infoList(history.rows || [])}</div>
        <button class="text-link" type="button">展开更多⌄</button>
      </article>
    `;
  }

  function renderExamCard(title, meta, items) {
    return `
      <article class="panel exam-card">
        <div class="section-heading"><h3>${title} <small>${meta}</small></h3><button type="button">查看更多 ›</button></div>
        <ul class="exam-list">${examList(items || [])}</ul>
      </article>
    `;
  }

  function renderLabCard(rows) {
    return `
      <article class="panel table-card">
        <div class="section-heading"><h3>LIS检验信息 <small>最近</small></h3><button type="button">查看更多 ›</button></div>
        ${renderTable(rows || [], [
          { key: "item", label: "检验项目" },
          { key: "result", label: "结果" },
          { key: "trend", label: "" },
          { key: "unit", label: "单位" },
          { key: "ref", label: "参考范围" },
          { key: "date", label: "检验日期" }
        ])}
      </article>
    `;
  }

  function renderMedicationCard(rows) {
    return `
      <article class="panel table-card">
        <div class="section-heading"><h3>当前用药 <small>患者自述/处方记录</small></h3><span>更新于 2024-05-18</span></div>
        ${renderMedicationTable(rows || [])}
      </article>
    `;
  }

  function renderAiAdviceCard(advice) {
    return `
      <section class="panel ai-advice">
        <h3>问诊助手AI建议 <small>基于病史及检查结果</small></h3>
        <ol>${(advice || []).map((item) => `<li>${item}</li>`).join("")}</ol>
        <small>*AI建议仅供参考，请结合临床实际情况判断</small>
      </section>
    `;
  }

  function renderWaiting(patient) {
    const ctx = clinicalContext();
    const waiting = viewModel.buildWaitingView({ patient, context: ctx, mock });
    els.mainPanel.innerHTML = `
      ${renderPatientHeader(patient)}
      ${renderContextNotice()}
      ${renderAiSummary(patient)}
      ${renderSkillResultPanel()}
        <section class="dashboard-grid">
        ${renderHistoryCard(waiting.history)}
        ${renderExamCard("影像检查结论", "本院", waiting.imaging)}
        ${renderExamCard("超声检查结论", "本院", waiting.ultrasound)}
        <article class="panel chart-card">
          <div class="section-heading"><h3>血脂检查趋势 <small>近2年</small></h3><span>单位：mmol/L</span></div>
          <div id="lipidChart" class="chart"></div>
        </article>
        ${renderLabCard(waiting.labs)}
        ${renderMedicationCard(waiting.medications)}
      </section>
      ${renderAiAdviceCard(waiting.advice)}
      <footer class="action-bar">
        ${
          patient.status === "done"
            ? `<button type="button">查看病历</button>
               <button type="button">打印病历</button>
               <button type="button">发送患者</button>
               <button type="button">加入随访</button>
               <button class="primary" type="button">预约复诊</button>`
            : `<button type="button">快速开方</button>
               <button type="button">问诊模板</button>
               <button type="button">查看病历</button>
               <button class="primary" type="button" id="startConsult">开始问诊</button>`
        }
      </footer>
    `;
    requestAnimationFrame(renderLipidChart);
  }

  function renderConsultation(patient) {
    const ctx = clinicalContext();
    const extraction = state.skillResults.consultation_extraction?.extraction;
    els.mainPanel.innerHTML = `
      ${renderPatientHeader(patient, true)}
      ${renderContextNotice()}
      <nav class="main-tabs" id="mainTabs">
        ${[
          ["dialog", "问诊交流"],
          ["records", "病历资料"],
          ["labs", "检查检验"],
          ["meds", "用药记录"],
          ["follow", "随访记录"]
        ]
          .map(([key, label]) => `<button class="${state.activeMainTab === key ? "active" : ""}" data-main-tab="${key}" type="button">${label}</button>`)
          .join("")}
      </nav>
      <section class="consult-layout">
        <article class="panel dialog-panel">
          <div class="section-heading live-heading">
            <h3>医患对话 <small><span class="live-dot"></span>语音识别实时进行中...</small></h3>
            <label class="switch">显示时间戳<input type="checkbox" checked /><span></span></label>
          </div>
          <div class="dialog-list">
            ${ctx.consultDialog
              .map(
                (msg) => `
                  <div class="dialog-row ${msg.role}">
                    <div class="mini-avatar">${msg.role === "doctor" ? "医" : "患"}</div>
                    <div>
                      <small>${msg.role === "doctor" ? "医生" : "患者"} ${msg.time}</small>
                      <p>${msg.text}</p>
                    </div>
                  </div>
                `
              )
              .join("")}
          </div>
          <div class="voice-input">
            <input type="text" placeholder="输入文字或按住说话（语音也将被识别）..." />
            <button class="recording-btn" type="button">🎙</button>
            <button type="button">➤</button>
          </div>
          <div class="quick-row">
            <button type="button">快捷指令</button>
            <button type="button">病历模板</button>
            <button type="button">常用语</button>
          </div>
        </article>
        <article class="consult-side">
          <section class="panel extracted-card live-panel">
            <div class="section-heading live-heading"><h3>实时提取信息 <small><span class="live-dot"></span>AI分析中...</small></h3></div>
            <div class="extract-block"><h4>主诉</h4><p>${extraction?.chiefComplaint || "头晕 1周，晨起明显，伴心慌"}</p></div>
            <div class="extract-block"><h4>现病史</h4><p>${extraction?.presentIllness || "头晕 1周，晨起明显；心慌偶发；乏力，活动后气促"}</p></div>
            <div class="extract-block"><h4>生命体征（患者自述）</h4><p>${extraction?.vitals?.bloodPressure || "血压：160/95 mmHg（晨起）；145/88 mmHg（服药后）"}</p></div>
            <div class="extract-block"><h4>否认症状</h4><p>${(extraction?.negativeSymptoms || ["否认胸痛", "否认下肢水肿"]).join("；")}</p></div>
            <div class="extract-block"><h4>患者关注点</h4><p>${(extraction?.patientConcerns || ["血脂检查结果"]).join("；")}</p></div>
          </section>
          <section class="panel compact-list">
            <div class="section-heading"><h3>本次检查/检验信息</h3><button type="button">⌄</button></div>
            <p><b>影像检查（今日）</b><span>胸部CT平扫 2024-05-18 已完成 待出结果</span><span>心脏超声 2024-05-18 已完成 待出结果</span></p>
            <p><b>检验检查（今日）</b><span>血常规、肝功能、肾功能、血脂四项 已完成</span></p>
            <button class="wide-button" type="button">查看全部检查检验</button>
          </section>
          <section class="panel compact-list">
            <div class="section-heading"><h3>本次用药情况</h3></div>
            <p><b>目前用药（未变更）</b>${ctx.medications.slice(0, 3).map((med) => `<span>${med.name} ${med.spec} ${med.usage}</span>`).join("")}</p>
          </section>
        </article>
      </section>
      ${renderSkillResultPanel()}
      <footer class="action-bar">
        <button type="button">病历书写</button>
        <button type="button">检查开单</button>
        <button type="button">处方开具</button>
        <button type="button">打印病历</button>
        <button type="button">发送患者</button>
        <button class="primary" type="button" id="finishConsult">保存并结束问诊</button>
      </footer>
    `;
  }

  function renderAssistant(patient) {
    const diagnosis = state.skillResults.diagnosis_suggestion?.diagnosis;
    const extraction = state.skillResults.consultation_extraction?.extraction;
    const hasRuntime = patient.status === "active";
    els.workspace.classList.toggle("ai-collapsed", state.aiPanelCollapsed);
    els.workspace.classList.toggle("ai-runtime-visible", hasRuntime);
    els.aiPanel.className = `ai-panel ${hasRuntime ? "has-runtime" : ""} ${state.aiPanelCollapsed ? "is-collapsed" : ""}`;
    els.aiPanel.innerHTML = `
      <button class="ai-panel-handle" type="button" data-ai-panel-toggle aria-label="展开AI智能助手" title="展开AI智能助手">
        <span>问AI</span>
        <i>‹</i>
      </button>
      <section class="panel ai-assistant">
        <div class="assistant-head">
          <h2>AI智能助手</h2>
          <button type="button" data-ai-panel-toggle aria-label="收起AI智能助手" title="收起AI智能助手">×</button>
        </div>
        <div class="robot-avatar"></div>
        <div class="assistant-presets">
          <button type="button" data-ai-action="summary">快速总结病情</button>
          <button type="button" data-ai-action="labs">解读检查结果</button>
          <button type="button" data-ai-action="medication">用药建议参考</button>
          <button type="button" data-ai-action="record">生成病历文书</button>
          ${patient.status === "active" ? '<button type="button" data-ai-action="extraction">实时信息抽取</button><button type="button" data-ai-action="diagnosis">鉴别诊断建议</button>' : ""}
        </div>
        <div class="assistant-tabs"><button class="active" type="button">对话</button><button type="button">病情脉络</button></div>
        <div class="assistant-messages" id="assistantMessages">
          ${state.assistantMessages
            .map(
              (message) => `
                <div class="assistant-message ${message.role}">
                  <p>${message.text}</p>
                  <time>${message.time || nowTime()}${message.role === "user" ? " 已读" : ""}</time>
                </div>
              `
            )
            .join("")}
          ${state.isAiLoading ? '<div class="assistant-message assistant typing"><p><span></span><span></span><span></span></p></div>' : ""}
        </div>
        ${state.aiError ? `<div class="error-box">${state.aiError}</div>` : ""}
        <form class="assistant-input" id="assistantForm">
          <input name="prompt" autocomplete="off" placeholder="输入您的问题..." ${state.isAiLoading ? "disabled" : ""} />
          <button class="primary" type="submit" ${state.isAiLoading ? "disabled" : ""}>➤</button>
        </form>
        <p class="ai-disclaimer">内容由AI生成，仅供参考</p>
      </section>
      ${
        patient.status === "active"
          ? `<section class="panel ai-runtime live-panel">
              <h3><span class="live-dot"></span>分析进度</h3>
              <p><span class="dot done"></span>语音识别</p>
              <p><span class="dot done"></span>信息提取</p>
              <p><span class="dot active"></span>病情分析</p>
              <p><span class="dot"></span>生成建议</p>
              <h3>AI分析结果</h3>
              <h4>病情初步判断</h4>
              <p>${diagnosis?.assessment || "考虑血压控制不稳定，合并血脂异常，存在心血管风险，需排查继发性高血压及靶器官损害。"}</p>
              <h4>鉴别诊断建议</h4>
              <ol>${(diagnosis?.differential || ["原发性高血压（血压控制不佳）", "继发性高血压（需排查）", "心律失常（需心电图进一步评估）"]).map((item) => `<li>${item}</li>`).join("")}</ol>
              <h4>下一步建议</h4>
              <ul>${(diagnosis?.nextSteps || ["等待检查结果，重点关注心脏超声、胸部CT及血脂结果", "建议完善心电图检查", "评估降压方案是否需要调整"]).map((item) => `<li>${item}</li>`).join("")}</ul>
              <h3>对话总结</h3>
              <p>${extraction ? `${extraction.chiefComplaint}；${extraction.presentIllness}` : "患者主诉头晕伴心慌1周，晨起血压高，乏力气促，无胸痛及下肢水肿，关注血脂检查结果。"}</p>
            </section>`
          : ""
      }
    `;
    const messageBox = $("#assistantMessages");
    if (messageBox) messageBox.scrollTop = messageBox.scrollHeight;
  }

  function renderMain() {
    const patient = selectedPatient();
    if (patient.status === "active") {
      renderConsultation(patient);
    } else {
      renderWaiting(patient);
    }
  }

  function renderAll() {
    const patients = filteredPatients();
    if (!patients.some((patient) => patient.id === state.selectedPatientId)) {
      state.selectedPatientId = patients[0]?.id || state.patients.find((patient) => patient.status === state.status)?.id || mock.patients[0].id;
    }
    renderStatusTabs();
    renderPatientList();
    renderMain();
    renderAssistant(selectedPatient());
  }

  function refreshMainLayout() {
    if (layoutRefreshTimer) window.clearTimeout(layoutRefreshTimer);
    els.mainPanel.classList.add("layout-refreshing");
    layoutRefreshTimer = window.setTimeout(() => {
      els.mainPanel.classList.remove("layout-refreshing");
    }, 260);

    requestAnimationFrame(() => {
      if (lipidChart) lipidChart.resize();
      if (!window.echarts) {
        const container = document.getElementById("lipidChart");
        if (container?.querySelector("canvas")) fallbackChart(container);
      }
    });
  }

  function refreshMainLayoutAfterTransition() {
    [80, 260, 420].forEach((delay) => {
      window.setTimeout(refreshMainLayout, delay);
    });
  }

  function fallbackChart(container) {
    const lipids = clinicalContext().lipids;
    const canvas = document.createElement("canvas");
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight || 260;
    container.innerHTML = "";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const series = [
      { values: lipids.tc, color: "#2f6bff" },
      { values: lipids.tg, color: "#18a058" },
      { values: lipids.ldl, color: "#7757f6" },
      { values: lipids.hdl, color: "#f28c28" }
    ];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#e7edf7";
    for (let y = 35; y < canvas.height - 20; y += 40) {
      ctx.beginPath();
      ctx.moveTo(36, y);
      ctx.lineTo(canvas.width - 16, y);
      ctx.stroke();
    }
    series.forEach((line) => {
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      line.values.forEach((value, index) => {
        const x = 42 + (index * (canvas.width - 74)) / (line.values.length - 1);
        const y = canvas.height - 28 - (value / 6) * (canvas.height - 56);
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    });
  }

  function renderLipidChart() {
    const container = document.getElementById("lipidChart");
    if (!container) return;
    const lipids = clinicalContext().lipids;
    if (!window.echarts) {
      lipidChart = null;
      fallbackChart(container);
      return;
    }
    if (lipidChart) lipidChart.dispose();
    lipidChart = echarts.init(container);
    lipidChart.setOption({
      color: ["#2f6bff", "#18a058", "#7757f6", "#f28c28"],
      tooltip: { trigger: "axis", backgroundColor: "#ffffff", borderColor: "#d8e3f4", textStyle: { color: "#1f2a44" } },
      legend: { bottom: 10, itemWidth: 10, itemHeight: 6, textStyle: { color: "#5d6b82", fontSize: 11 } },
      grid: { left: 36, right: 20, top: 24, bottom: 110 },
      xAxis: { type: "category", boundaryGap: false, data: lipids.dates, axisLine: { lineStyle: { color: "#d9e2ef" } }, axisLabel: { color: "#6b7890", fontSize: 11 } },
      yAxis: { type: "value", min: 0, max: 6, splitLine: { lineStyle: { color: "#ecf1f8" } }, axisLabel: { color: "#6b7890", fontSize: 11 } },
      series: [
        { name: "TC（总胆固醇）", type: "line", smooth: true, symbolSize: 5, data: lipids.tc },
        { name: "TG（甘油三酯）", type: "line", smooth: true, symbolSize: 5, data: lipids.tg },
        { name: "LDL-C（低密度脂蛋白）", type: "line", smooth: true, symbolSize: 5, data: lipids.ldl },
        { name: "HDL-C（高密度脂蛋白）", type: "line", smooth: true, symbolSize: 5, data: lipids.hdl }
      ]
    });
  }

  async function sendAiPrompt(prompt, action = "chat") {
    const patient = selectedPatient();
    const skill = window.SkillResultMapper.actionToSkill[action] || window.SkillResultMapper.actionToSkill.chat;
    state.aiError = "";
    state.assistantMessages.push({ role: "user", text: prompt, time: nowTime() });
    state.isAiLoading = true;
    renderAssistant(patient);

    const assistantMessage = { role: "assistant", text: "", time: nowTime() };
    state.assistantMessages.push(assistantMessage);

    try {
      await window.OpenClawSkillService.runSkill({
        skill,
        action,
        patientContext: patientContext(),
        messages: state.assistantMessages.map((message) => ({
          role: message.role,
          content: message.text
        })),
        onToken: (token) => {
          assistantMessage.text += token;
          state.isAiLoading = false;
          renderAssistant(patient);
        },
        onSkillResult: (payload) => {
          const mapped = window.SkillResultMapper.normalize(skill, payload);
          state.skillResults = { ...state.skillResults, [skill]: mapped };
          renderAll();
        }
      });
    } catch (error) {
      state.aiError = error.message || "AI服务暂时不可用，请稍后重试。";
      state.assistantMessages = state.assistantMessages.filter((message) => message !== assistantMessage);
    } finally {
      state.isAiLoading = false;
      renderAssistant(patient);
    }
  }

  async function loadPatientContext(patient) {
    state.contextLoading = true;
    state.contextError = "";
    renderMain();
    try {
      state.patientContext = await window.PatientService.fetchVisitContext(patient);
    } catch (error) {
      state.contextError = error.message || "患者上下文读取失败，已使用本地模拟数据。";
      state.patientContext = window.PatientService.mockContext(patient);
    } finally {
      state.contextLoading = false;
      renderAll();
    }
  }

  async function selectPatient(patientId) {
    state.selectedPatientId = patientId;
    const patient = selectedPatient();
    state.status = patient.status;
    state.skillResults = {};
    await loadPatientContext(patient);
  }

  async function loadTodayPatients() {
    state.dataLoading = true;
    state.dataError = "";
    renderStatusTabs();
    renderPatientList();
    try {
      const result = await window.PatientService.fetchTodayVisits();
      state.patients = result.patients;
      state.statusTabs = result.statusTabs;
      if (!state.patients.some((patient) => patient.id === state.selectedPatientId)) {
        state.selectedPatientId = state.patients.find((patient) => patient.status === state.status)?.id || state.patients[0]?.id || state.selectedPatientId;
      }
      await loadPatientContext(selectedPatient());
    } catch (error) {
      state.dataError = error.message || "今日就诊列表读取失败，已使用本地模拟数据。";
      state.patients = mock.patients;
      state.statusTabs = mock.statusTabs;
      state.patientContext = window.PatientService.mockContext(selectedPatient());
    } finally {
      state.dataLoading = false;
      renderAll();
    }
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const aiPanelToggle = event.target.closest("[data-ai-panel-toggle]");
      if (aiPanelToggle) {
        state.aiPanelCollapsed = !state.aiPanelCollapsed;
        renderAssistant(selectedPatient());
        refreshMainLayoutAfterTransition();
        return;
      }

      const statusButton = event.target.closest("[data-status]");
      if (statusButton) {
        state.status = statusButton.dataset.status;
        const first = state.patients.find((patient) => patient.status === state.status);
        if (first) state.selectedPatientId = first.id;
        loadPatientContext(selectedPatient());
        return;
      }

      const patientButton = event.target.closest("[data-patient-id]");
      if (patientButton) {
        selectPatient(patientButton.dataset.patientId);
        return;
      }

      const aiAction = event.target.closest("[data-ai-action]");
      if (aiAction) {
        const action = aiAction.dataset.aiAction;
        const prompts = {
          summary: "请结合患者上下文快速总结病情。",
          labs: "请解读这位患者最近的检查检验结果。",
          medication: "请给出这位患者的用药建议参考。",
          record: "请生成本次问诊病历文书草稿。",
          extraction: "请从当前医患对话中实时提取主诉、现病史、生命体征、否认症状和患者关注点。",
          diagnosis: "请结合患者上下文给出初步判断、鉴别诊断和下一步建议。"
        };
        sendAiPrompt(prompts[action], action);
        return;
      }

      const startConsult = event.target.closest("#startConsult");
      if (startConsult) {
        const active = state.patients.find((patient) => patient.status === "active" && patient.visitNo === selectedPatient().visitNo) || state.patients.find((patient) => patient.status === "active");
        if (!active) return;
        state.status = "active";
        state.selectedPatientId = active.id;
        loadPatientContext(active);
        return;
      }

      const finishConsult = event.target.closest("#finishConsult");
      if (finishConsult) {
        const current = selectedPatient();
        const done = state.patients.find((patient) => patient.status === "done" && patient.visitNo === current.visitNo) || state.patients.find((patient) => patient.status === "done");
        if (!done) return;
        state.status = "done";
        state.selectedPatientId = done.id;
        loadPatientContext(done);
      }
    });

    document.addEventListener("submit", (event) => {
      if (event.target.id !== "assistantForm") return;
      event.preventDefault();
      const input = event.target.elements.prompt;
      const prompt = input.value.trim();
      if (!prompt || state.isAiLoading) return;
      input.value = "";
      sendAiPrompt(prompt);
    });

    els.search.addEventListener("input", (event) => {
      state.search = event.target.value;
      renderAll();
    });

    els.refresh.addEventListener("click", () => {
      els.refresh.classList.add("spinning");
      loadTodayPatients().finally(() => window.setTimeout(() => els.refresh.classList.remove("spinning"), 600));
    });
  }

  bindEvents();
  window.addEventListener("resize", refreshMainLayoutAfterTransition, { passive: true });
  renderAll();
  loadTodayPatients();
})();
