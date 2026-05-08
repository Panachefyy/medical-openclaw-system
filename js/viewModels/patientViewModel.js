(function () {
  const DEFAULT_ADVICE = [
    "补充完整病史、检查和检验资料",
    "结合主诉、生命体征和影像结果判断优先处理问题",
    "根据患者过敏史和既往用药调整后续诊疗计划"
  ];

  function tagClass(text) {
    if (/过敏|异常|风险|冠心病|偏高/.test(text || "")) return "danger";
    if (/狭窄|超重|糖尿病|警/.test(text || "")) return "warning";
    return "success";
  }

  function fallbackSummary(patient) {
    return {
      overview: `${patient.name}，${patient.age}岁，${patient.tag || "待评估"}患者，本次就诊资料已汇总，建议结合病史、检查检验和用药情况继续评估。`,
      features: [patient.tag || "待评估", patient.department || "门诊", patient.allergy && patient.allergy !== "无" ? patient.allergy : "无明确过敏史"],
      important: [
        { label: "过敏史", value: patient.allergy || "无", level: patient.allergy && patient.allergy !== "无" ? "danger" : "" },
        { label: "本次就诊", value: patient.visitDate || "--" }
      ],
      medications: [{ label: "当前用药", count: 0 }],
      suggestions: ["补充完整病史和检查资料", "结合临床实际评估诊疗方案"]
    };
  }

  function historyView(ctx, patient, mock) {
    const rows = ctx.history?.rows || ctx.hypertensionHistory || mock.hypertensionHistory || [];
    return {
      title: ctx.history?.title || "病史",
      meta: ctx.history?.meta || patient.tag || "综合评估",
      rows
    };
  }

  function adviceView(ctx, patient) {
    return ctx.clinicalAdvice?.length ? ctx.clinicalAdvice : patient.summary?.suggestions || DEFAULT_ADVICE;
  }

  function medicationsView(ctx, mock) {
    return Array.isArray(ctx.medications) ? ctx.medications : mock.medications || [];
  }

  function medicationGroups(rows) {
    const groups = new Map();
    (rows || []).forEach((med) => {
      const text = `${med.name || ""} ${med.purpose || ""}`;
      let label = "其他";
      if (/吸入|平喘|支气管|哮喘|CPAP|气道/.test(text)) label = "呼吸治疗";
      else if (/化痰|祛痰|氨溴索|乙酰半胱氨酸/.test(text)) label = "祛痰药";
      else if (/退热|对乙酰氨基酚/.test(text)) label = "退热药";
      else if (/抗感染|抗生素/.test(text)) label = "抗感染";
      else if (/体重|生活方式|减重/.test(text)) label = "非药物干预";
      groups.set(label, (groups.get(label) || 0) + 1);
    });
    return [...groups.entries()].map(([label, count]) => ({ label, count }));
  }

  function buildAiSummaryView({ patient, context, skillSummary, mock }) {
    const medications = medicationsView(context, mock);
    return {
      summary: skillSummary || patient.summary || fallbackSummary(patient),
      medications,
      medicationGroups: medicationGroups(medications)
    };
  }

  function buildWaitingView({ patient, context, mock }) {
    return {
      history: historyView(context, patient, mock),
      advice: adviceView(context, patient),
      medications: medicationsView(context, mock),
      imaging: context.imaging || [],
      ultrasound: context.ultrasound || [],
      labs: context.lis || []
    };
  }

  window.PatientViewModel = {
    tagClass,
    medicationGroups,
    buildAiSummaryView,
    buildWaitingView
  };
})();
