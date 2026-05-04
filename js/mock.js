window.MedicalMock = {
  statusTabs: [
    { key: "waiting", label: "待诊", count: 8 },
    { key: "active", label: "接诊中", count: 2 },
    { key: "done", label: "已完成", count: 16 }
  ],
  patients: [
    {
      id: "p001",
      status: "waiting",
      name: "张三",
      sex: "男",
      age: 65,
      visitNo: "0000123456",
      medicalCard: "110********1234",
      phone: "138****5678",
      time: "09:30",
      tag: "高血压",
      allergy: "青霉素过敏",
      height: "175cm",
      weight: "78kg",
      bmi: "25.5（超重）",
      department: "心血管内科",
      doctor: "张医生",
      visitDate: "2024-05-20 09:30",
      waitEstimate: "约15分钟",
      summary: {
        overview: "高血压病史10年，血压控制不稳定，伴血脂异常，存在动脉粥样硬化风险。",
        features: ["高血压病史10年", "血压控制不稳定", "LDL-C偏高", "动脉粥样硬化风险", "超重（BMI 25.5）"],
        important: [
          { label: "过敏史", value: "青霉素过敏", level: "danger" },
          { label: "目前病情", value: "血压波动（138-168/82-102mmHg）" },
          { label: "心血管风险", value: "中高危（ASCVD 10年风险 25.8%）↑", level: "danger" },
          { label: "生活方式", value: "不吸烟，偶饮酒，低盐饮食，规律散步" }
        ],
        medications: [
          { label: "降压药", count: 3 },
          { label: "调脂药", count: 1 },
          { label: "其他", count: 1 }
        ],
        suggestions: ["优化降压方案，目标 <130/80 mmHg", "强化调脂治疗，LDL-C 目标 <1.8 mmol/L", "建议控制体重，增加有氧运动"]
      }
    },
    {
      id: "p002",
      status: "waiting",
      name: "李四",
      sex: "女",
      age: 58,
      visitNo: "0000123457",
      medicalCard: "210********4418",
      phone: "139****2210",
      time: "09:45",
      tag: "糖尿病",
      allergy: "无",
      height: "162cm",
      weight: "63kg",
      bmi: "24.0",
      department: "内分泌科",
      doctor: "张医生",
      visitDate: "2024-05-20 09:45",
      waitEstimate: "约25分钟",
      summary: {
        overview: "2型糖尿病6年，近期空腹血糖偏高，需评估用药依从性及饮食控制。",
        features: ["2型糖尿病", "空腹血糖偏高", "餐后血糖波动", "需复查糖化血红蛋白"],
        important: [
          { label: "过敏史", value: "无" },
          { label: "目前病情", value: "空腹血糖 7.8-9.2 mmol/L", level: "warning" },
          { label: "生活方式", value: "晚餐主食偏多，运动不足" }
        ],
        medications: [
          { label: "降糖药", count: 2 },
          { label: "调脂药", count: 1 }
        ],
        suggestions: ["复查 HbA1c", "评估二甲双胍剂量", "加强餐后血糖监测"]
      }
    },
    {
      id: "p003",
      status: "waiting",
      name: "王五",
      sex: "男",
      age: 72,
      visitNo: "0000123458",
      medicalCard: "370********9921",
      phone: "136****1988",
      time: "10:00",
      tag: "冠心病",
      allergy: "磺胺类药物过敏",
      height: "170cm",
      weight: "72kg",
      bmi: "24.9",
      department: "心血管内科",
      doctor: "张医生",
      visitDate: "2024-05-20 10:00",
      waitEstimate: "约35分钟",
      summary: {
        overview: "冠心病支架术后，近期活动后胸闷，需结合心电图和心肌酶评估。",
        features: ["冠心病", "PCI术后", "活动后胸闷", "高龄"],
        important: [
          { label: "过敏史", value: "磺胺类药物过敏", level: "danger" },
          { label: "目前病情", value: "活动后胸闷 3 天", level: "warning" },
          { label: "心血管风险", value: "高危", level: "danger" }
        ],
        medications: [
          { label: "抗血小板", count: 1 },
          { label: "调脂药", count: 1 },
          { label: "降压药", count: 2 }
        ],
        suggestions: ["优先排查心肌缺血", "完善心电图及肌钙蛋白", "复核抗血小板治疗"]
      }
    },
    { id: "p004", status: "waiting", name: "赵六", sex: "女", age: 60, visitNo: "0000123459", medicalCard: "510********8120", phone: "137****6612", time: "10:15", tag: "高血压", allergy: "无", height: "160cm", weight: "61kg", bmi: "23.8", department: "心血管内科", doctor: "张医生", visitDate: "2024-05-20 10:15", waitEstimate: "约45分钟" },
    { id: "p005", status: "waiting", name: "孙七", sex: "男", age: 55, visitNo: "0000123460", medicalCard: "120********0098", phone: "135****3345", time: "10:30", tag: "高血压", allergy: "无", height: "172cm", weight: "76kg", bmi: "25.7（超重）", department: "心血管内科", doctor: "张医生", visitDate: "2024-05-20 10:30", waitEstimate: "约55分钟" },
    { id: "p006", status: "waiting", name: "周八", sex: "女", age: 68, visitNo: "0000123461", medicalCard: "330********1290", phone: "132****9988", time: "10:45", tag: "糖尿病", allergy: "头孢过敏", height: "158cm", weight: "66kg", bmi: "26.4（超重）", department: "内分泌科", doctor: "张医生", visitDate: "2024-05-20 10:45", waitEstimate: "约65分钟" },
    { id: "p007", status: "waiting", name: "吴九", sex: "男", age: 50, visitNo: "0000123462", medicalCard: "650********6721", phone: "131****8832", time: "11:00", tag: "高血压", allergy: "无", height: "178cm", weight: "80kg", bmi: "25.2（超重）", department: "心血管内科", doctor: "张医生", visitDate: "2024-05-20 11:00", waitEstimate: "约80分钟" },
    { id: "p008", status: "waiting", name: "郑十", sex: "女", age: 63, visitNo: "0000123463", medicalCard: "410********1200", phone: "130****7721", time: "11:15", tag: "高血压", allergy: "无", height: "164cm", weight: "62kg", bmi: "23.1", department: "心血管内科", doctor: "张医生", visitDate: "2024-05-20 11:15", waitEstimate: "约95分钟" },
    {
      id: "p009",
      status: "active",
      name: "张三",
      sex: "男",
      age: 65,
      visitNo: "0000123456",
      medicalCard: "110********1234",
      phone: "138****5678",
      time: "09:30",
      tag: "高血压",
      allergy: "青霉素过敏",
      height: "175cm",
      weight: "78kg",
      bmi: "25.5（超重）",
      department: "心血管内科",
      doctor: "张医生",
      visitDate: "2024-05-20 09:30",
      consultStartedAt: "09:31:00",
      summary: null
    },
    { id: "p010", status: "active", name: "李四", sex: "女", age: 58, visitNo: "0000123457", medicalCard: "210********4418", phone: "139****2210", time: "09:45", tag: "糖尿病", allergy: "无", height: "162cm", weight: "63kg", bmi: "24.0", department: "内分泌科", doctor: "张医生", visitDate: "2024-05-20 09:45", consultStartedAt: "09:48:00" },
    {
      id: "p013",
      status: "done",
      name: "张三",
      sex: "男",
      age: 65,
      visitNo: "0000123456",
      medicalCard: "110********1234",
      phone: "138****5678",
      time: "09:30",
      tag: "高血压",
      allergy: "青霉素过敏",
      height: "175cm",
      weight: "78kg",
      bmi: "25.5（超重）",
      department: "心血管内科",
      doctor: "张医生",
      visitDate: "2024-05-20 09:30",
      completedAt: "2024-05-20 09:42",
      summary: {
        overview: "本次因头晕伴心慌1周就诊，晨起血压偏高，既往高血压10年合并血脂异常，颈动脉斑块提示动脉粥样硬化风险需持续管理。",
        features: ["头晕伴心慌1周", "晨起血压160/95mmHg", "高血压病史10年", "LDL-C仍未达高危目标", "青霉素过敏"],
        important: [
          { label: "过敏史", value: "青霉素过敏", level: "danger" },
          { label: "本次结论", value: "血压控制不稳定，需复核家庭血压和服药依从性" },
          { label: "心血管风险", value: "中高危，关注颈动脉斑块与LDL-C达标", level: "danger" },
          { label: "处置去向", value: "调整生活方式，继续监测，复诊评估用药方案" }
        ],
        medications: [
          { label: "降压药", count: 2 },
          { label: "调脂药", count: 1 },
          { label: "抗血小板", count: 1 }
        ],
        suggestions: ["记录晨起和睡前血压，2周后带记录复诊", "评估降压药服药时间与依从性", "LDL-C目标建议 <1.8 mmol/L，必要时强化调脂"]
      }
    },
    { id: "p011", status: "done", name: "钱一", sex: "男", age: 49, visitNo: "0000123464", time: "08:15", tag: "复诊", allergy: "无", department: "心血管内科", doctor: "张医生", visitDate: "2024-05-20 08:15" },
    { id: "p012", status: "done", name: "陈二", sex: "女", age: 62, visitNo: "0000123465", time: "08:30", tag: "高血脂", allergy: "无", department: "心血管内科", doctor: "张医生", visitDate: "2024-05-20 08:30" }
  ],
  hypertensionHistory: [
    ["首次诊断", "2014-05-12"],
    ["最高血压", "168/102 mmHg"],
    ["目前血压", "138/82 mmHg（家庭自测）"],
    ["相关症状", "间断头晕、头痛，无胸闷胸痛"],
    ["并发症", "无心脑血管事件史"],
    ["家族史", "父亲高血压"],
    ["生活方式", "不吸烟，偶饮酒，低盐饮食，规律散步"]
  ],
  imaging: [
    { date: "2024-03-18", name: "颅脑CT平扫", status: "正常", desc: "脑实质未见异常，脑室系统未见扩大。" },
    { date: "2023-06-25", name: "胸部CT平扫", status: "正常", desc: "双肺未见明显异常，纵隔未见肿大淋巴结。" },
    { date: "2022-08-10", name: "颈动脉CTA", status: "轻度狭窄", desc: "双侧颈动脉粥样硬化，右侧颈内动脉起始段约30%狭窄。" },
    { date: "2021-04-12", name: "心脏冠脉CTA", status: "未见明显狭窄", desc: "冠状动脉走行正常，未见明显狭窄及斑块。" }
  ],
  ultrasound: [
    { date: "2024-02-20", name: "心脏超声", status: "正常", desc: "各房室大小正常，瓣膜结构及启闭活动未见异常，EF：62%。" },
    { date: "2023-05-11", name: "颈动脉超声", status: "斑块形成", desc: "双侧颈动脉内膜不均增厚，右侧斑块形成，最大厚度约2.1mm。" },
    { date: "2022-07-08", name: "腹部超声", status: "正常", desc: "肝胆胰脾未见明显异常，双肾形态大小正常。" },
    { date: "2021-03-15", name: "甲状腺超声", status: "正常", desc: "甲状腺回声均匀，未见明显结节。" }
  ],
  lipids: {
    dates: ["2022-05", "2022-07", "2022-09", "2022-11", "2023-01", "2023-03", "2023-05", "2023-07", "2023-09", "2023-11", "2024-01", "2024-03", "2024-05"],
    tc: [4.6, 4.4, 5.1, 4.3, 4.2, 4.0, 4.5, 3.9, 4.3, 4.2, 4.35, 4.12, 4.35],
    tg: [1.72, 1.82, 1.9, 1.62, 1.48, 1.42, 1.65, 1.68, 1.61, 1.52, 1.35, 1.38, 1.25],
    ldl: [3.02, 3.0, 3.22, 2.68, 2.64, 2.72, 2.86, 2.78, 2.98, 2.71, 2.92, 2.45, 2.48],
    hdl: [0.94, 0.91, 1.02, 0.89, 0.82, 0.78, 0.88, 0.92, 0.86, 0.74, 0.69, 0.76, 1.18]
  },
  lis: [
    { item: "总胆固醇（TC）", result: "4.35", trend: "down", unit: "mmol/L", ref: "< 5.18", date: "2024-05-18" },
    { item: "甘油三酯（TG）", result: "1.25", trend: "down", unit: "mmol/L", ref: "< 1.70", date: "2024-05-18" },
    { item: "高密度脂蛋白（HDL-C）", result: "1.18", trend: "up", unit: "mmol/L", ref: "≥ 1.04", date: "2024-05-18" },
    { item: "低密度脂蛋白（LDL-C）", result: "2.48", trend: "down", unit: "mmol/L", ref: "< 3.37", date: "2024-05-18" },
    { item: "载脂蛋白A1（APOA1）", result: "1.42", trend: "", unit: "g/L", ref: "1.20~1.60", date: "2024-05-18" },
    { item: "载脂蛋白B（APOB）", result: "0.88", trend: "", unit: "g/L", ref: "0.60~1.10", date: "2024-05-18" },
    { item: "血糖（空腹）", result: "5.62", trend: "", unit: "mmol/L", ref: "3.90~6.10", date: "2024-05-18" },
    { item: "肌酐（CREA）", result: "78.0", trend: "", unit: "μmol/L", ref: "44~97", date: "2024-05-18" }
  ],
  medications: [
    { name: "苯磺酸氨氯地平片", spec: "5mg", usage: "每日1次 每次1片", purpose: "降压" },
    { name: "厄贝沙坦片", spec: "150mg", usage: "每日1次 每次1片", purpose: "降压" },
    { name: "阿托伐他汀钙片", spec: "20mg", usage: "每晚1次 每次1片", purpose: "调脂" },
    { name: "阿司匹林肠溶片", spec: "100mg", usage: "每日1次 每次1片", purpose: "抗血小板" },
    { name: "辅酶Q10软胶囊", spec: "10mg", usage: "每日2次 每次1粒", purpose: "辅助治疗" }
  ],
  consultDialog: [
    { role: "doctor", time: "09:31:12", text: "张先生，您好！请问您今天哪里不舒服？" },
    { role: "patient", time: "09:31:18", text: "医生，我最近头有点晕，尤其是早上起床的时候，有时候还会心慌。" },
    { role: "doctor", time: "09:31:27", text: "这种情况大概有多久了？有没有测量过血压？血压是多少？" },
    { role: "patient", time: "09:31:42", text: "大概有一周了吧，我昨天量了一下，早上是160/95，晚上吃完药后是145/88。" },
    { role: "patient", time: "09:32:03", text: "另外，我这两天有点乏力，爬楼梯会喘得厉害。" },
    { role: "doctor", time: "09:32:15", text: "好的，那您最近有没有胸痛、胸闷，或者下肢水肿？" },
    { role: "patient", time: "09:32:25", text: "没有胸痛，就是有时候胸闷，下肢没怎么肿。" },
    { role: "patient", time: "09:32:35", text: "对了，医生，我上次检查说血脂有点高，这次复查的结果出来了吗？" }
  ],
  aiAssistantHistory: [
    { role: "assistant", text: "您好，我是AI助手小诊，有什么可以帮您了解的吗？", time: "09:31" },
    { role: "user", text: "这位患者的血压控制情况如何？", time: "09:31" },
    { role: "assistant", text: "根据病历和家庭自测记录，患者血压波动较大，最高168/102 mmHg，目前138/82 mmHg，建议优化降压方案，目标 <130/80 mmHg。", time: "09:31" },
    { role: "user", text: "他最近的血脂情况怎么样？", time: "09:32" },
    { role: "assistant", text: "最新检验显示LDL-C 2.48 mmol/L，较前升高。动脉粥样硬化风险中高，建议强化调脂治疗。", time: "09:32" }
  ],
  aiResponses: {
    summary: "患者为65岁男性，高血压病史10年，近期血压控制不稳定，伴头晕、心慌和轻度活动后气促。既往检查提示颈动脉斑块形成，LDL-C仍高于高危患者建议目标，需综合评估降压和调脂方案。",
    labs: "血脂方面：TC 4.35 mmol/L，TG 1.25 mmol/L，LDL-C 2.48 mmol/L，HDL-C 1.18 mmol/L。对存在动脉粥样硬化风险的患者，LDL-C仍需进一步控制，可结合依从性和不良反应评估是否强化他汀或联合用药。",
    medication: "用药建议仅供医生参考：复核氨氯地平、厄贝沙坦服药时间和依从性；若家庭血压持续高于目标，可考虑调整降压联合方案。调脂方面关注LDL-C目标达成，必要时评估加用依折麦布等方案。",
    record: "主诉：头晕伴心慌1周。现病史：患者近1周晨起头晕明显，偶有心慌，家庭自测血压最高160/95mmHg，服药后145/88mmHg，伴乏力及活动后气促，否认明显胸痛及下肢水肿。"
  }
};
