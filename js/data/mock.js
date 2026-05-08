const CARDIO_DEPARTMENT = "心血管内科";

function cardioSummary({ overview, features, important, medications, suggestions }) {
  return { overview, features, important, medications, suggestions };
}

window.MedicalMock = {
  appMeta: {
    departmentKey: "cardiology",
    departmentName: CARDIO_DEPARTMENT
  },
  statusTabs: [
    { key: "waiting", label: "待诊", count: 8 },
    { key: "active", label: "接诊中", count: 2 },
    { key: "done", label: "已完成", count: 3 }
  ],
  patients: [
    {
      id: "cv001",
      status: "waiting",
      name: "张建国",
      sex: "男",
      age: 65,
      visitNo: "CV2024052001",
      medicalCard: "CV********2001",
      phone: "138****5678",
      time: "09:30",
      tag: "高血压",
      allergy: "青霉素过敏",
      height: "175cm",
      weight: "78kg",
      bmi: "25.5（超重）",
      department: CARDIO_DEPARTMENT,
      doctor: "张医生",
      visitDate: "2024-05-20 09:30",
      waitEstimate: "约15分钟",
      summary: cardioSummary({
        overview: "高血压病史10年，近期晨起血压升高并伴头晕、心慌，合并血脂异常及颈动脉斑块，需评估降压和调脂方案。",
        features: ["高血压病史10年", "晨峰血压升高", "LDL-C未达高危目标", "颈动脉斑块", "青霉素过敏"],
        important: [
          { label: "过敏史", value: "青霉素过敏", level: "danger" },
          { label: "当前症状", value: "晨起头晕、偶发心慌，家庭血压最高160/95mmHg", level: "warning" },
          { label: "心血管风险", value: "中高危，需关注LDL-C达标和靶器官损害", level: "danger" }
        ],
        medications: [{ label: "降压药", count: 2 }, { label: "调脂药", count: 1 }, { label: "抗血小板", count: 1 }],
        suggestions: ["复核家庭血压记录与服药时间", "完善心电图、肾功能和尿微量白蛋白", "评估LDL-C目标及他汀强化方案"]
      })
    },
    {
      id: "cv002",
      status: "waiting",
      name: "刘秀兰",
      sex: "女",
      age: 72,
      visitNo: "CV2024052002",
      medicalCard: "CV********2002",
      phone: "139****2210",
      time: "09:45",
      tag: "冠心病",
      allergy: "无",
      height: "158cm",
      weight: "61kg",
      bmi: "24.4",
      department: CARDIO_DEPARTMENT,
      doctor: "张医生",
      visitDate: "2024-05-20 09:45",
      waitEstimate: "约25分钟",
      summary: cardioSummary({
        overview: "冠心病PCI术后3年，近期活动后胸闷增多，需排查心肌缺血并复核抗血小板和调脂治疗依从性。",
        features: ["冠心病", "PCI术后", "活动后胸闷", "高龄", "需排查心肌缺血"],
        important: [
          { label: "过敏史", value: "无" },
          { label: "当前症状", value: "快走或爬楼后胸闷，休息后缓解", level: "warning" },
          { label: "本次重点", value: "完善心电图、肌钙蛋白和必要时运动负荷评估" }
        ],
        medications: [{ label: "抗血小板", count: 1 }, { label: "调脂药", count: 1 }, { label: "抗心绞痛", count: 1 }],
        suggestions: ["优先排查急性冠脉综合征风险", "复核阿司匹林及他汀依从性", "根据症状频率评估抗心绞痛治疗"]
      })
    },
    {
      id: "cv003",
      status: "waiting",
      name: "王德明",
      sex: "男",
      age: 68,
      visitNo: "CV2024052003",
      medicalCard: "CV********2003",
      phone: "136****1988",
      time: "10:00",
      tag: "房颤",
      allergy: "磺胺类药物过敏",
      height: "170cm",
      weight: "73kg",
      bmi: "25.3（超重）",
      department: CARDIO_DEPARTMENT,
      doctor: "张医生",
      visitDate: "2024-05-20 10:00",
      waitEstimate: "约35分钟",
      summary: cardioSummary({
        overview: "阵发性房颤随访，近期心悸发作频率增加，需评估心室率控制、抗凝适应证和出血风险。",
        features: ["阵发性房颤", "心悸发作增加", "需评估抗凝", "高血压合并风险"],
        important: [
          { label: "过敏史", value: "磺胺类药物过敏", level: "danger" },
          { label: "当前症状", value: "心悸每周2-3次，偶伴胸闷", level: "warning" },
          { label: "风险评估", value: "需计算CHA2DS2-VASc和HAS-BLED评分" }
        ],
        medications: [{ label: "控制心率", count: 1 }, { label: "抗凝评估", count: 1 }],
        suggestions: ["完善动态心电图", "评估抗凝获益与出血风险", "复核电解质和甲状腺功能"]
      })
    },
    {
      id: "cv004",
      status: "waiting",
      name: "赵美华",
      sex: "女",
      age: 76,
      visitNo: "CV2024052004",
      medicalCard: "CV********2004",
      phone: "137****6612",
      time: "10:15",
      tag: "心衰随访",
      allergy: "无",
      height: "160cm",
      weight: "64kg",
      bmi: "25.0",
      department: CARDIO_DEPARTMENT,
      doctor: "张医生",
      visitDate: "2024-05-20 10:15",
      waitEstimate: "约45分钟",
      summary: cardioSummary({
        overview: "慢性心衰随访，近期活动耐量下降伴夜间憋醒，需评估容量负荷、BNP和心功能变化。",
        features: ["慢性心衰", "活动耐量下降", "夜间憋醒", "需评估容量状态"],
        important: [
          { label: "过敏史", value: "无" },
          { label: "当前症状", value: "平地步行约300米即气促，下肢轻度水肿", level: "warning" },
          { label: "本次重点", value: "评估利尿剂使用和心衰标准治疗达标情况" }
        ],
        medications: [{ label: "利尿剂", count: 1 }, { label: "心衰标准治疗", count: 2 }],
        suggestions: ["完善NT-proBNP和心脏超声", "记录体重和尿量变化", "复核钾离子、肾功能和血压"]
      })
    },
    {
      id: "cv005",
      status: "waiting",
      name: "孙立强",
      sex: "男",
      age: 55,
      visitNo: "CV2024052005",
      medicalCard: "CV********2005",
      phone: "135****3345",
      time: "10:30",
      tag: "血脂异常",
      allergy: "无",
      height: "172cm",
      weight: "82kg",
      bmi: "27.7（超重）",
      department: CARDIO_DEPARTMENT,
      doctor: "张医生",
      visitDate: "2024-05-20 10:30",
      waitEstimate: "约55分钟",
      summary: cardioSummary({
        overview: "血脂异常伴超重，近期LDL-C仍高，需结合ASCVD风险分层评估调脂强度和生活方式干预。",
        features: ["血脂异常", "LDL-C偏高", "BMI 27.7", "ASCVD风险评估"],
        important: [
          { label: "过敏史", value: "无" },
          { label: "当前问题", value: "外食较多，运动不足，LDL-C持续偏高", level: "warning" },
          { label: "生活方式", value: "需控制油脂摄入和体重" }
        ],
        medications: [{ label: "调脂药", count: 1 }, { label: "生活方式干预", count: 1 }],
        suggestions: ["复查血脂四项和肝酶", "评估他汀耐受性", "制定体重管理和运动计划"]
      })
    },
    {
      id: "cv006",
      status: "waiting",
      name: "周雅琴",
      sex: "女",
      age: 62,
      visitNo: "CV2024052006",
      medicalCard: "CV********2006",
      phone: "132****9988",
      time: "10:45",
      tag: "胸痛评估",
      allergy: "头孢过敏",
      height: "158cm",
      weight: "60kg",
      bmi: "24.0",
      department: CARDIO_DEPARTMENT,
      doctor: "张医生",
      visitDate: "2024-05-20 10:45",
      waitEstimate: "约65分钟",
      summary: cardioSummary({
        overview: "间断胸痛2天，疼痛与活动关系不明确，合并高血压和血脂异常，需优先排除急性冠脉综合征。",
        features: ["胸痛2天", "高血压", "血脂异常", "头孢过敏", "需排除ACS"],
        important: [
          { label: "过敏史", value: "头孢过敏", level: "danger" },
          { label: "当前症状", value: "胸骨后隐痛，每次约5-10分钟", level: "warning" },
          { label: "本次重点", value: "心电图、肌钙蛋白动态复查" }
        ],
        medications: [{ label: "降压药", count: 1 }, { label: "调脂药", count: 1 }],
        suggestions: ["立即复核心电图", "完善肌钙蛋白和心肌酶谱", "根据危险分层决定观察或进一步检查"]
      })
    },
    {
      id: "cv007",
      status: "waiting",
      name: "吴志远",
      sex: "男",
      age: 50,
      visitNo: "CV2024052007",
      medicalCard: "CV********2007",
      phone: "131****8832",
      time: "11:00",
      tag: "早搏",
      allergy: "无",
      height: "178cm",
      weight: "80kg",
      bmi: "25.2（超重）",
      department: CARDIO_DEPARTMENT,
      doctor: "张医生",
      visitDate: "2024-05-20 11:00",
      waitEstimate: "约80分钟",
      summary: cardioSummary({
        overview: "频发室性早搏随访，近期熬夜后心悸明显，需评估早搏负荷、结构性心脏病和诱因。",
        features: ["室性早搏", "心悸", "睡眠不足", "需动态心电图评估"],
        important: [
          { label: "过敏史", value: "无" },
          { label: "诱因", value: "近期加班、咖啡摄入增加", level: "warning" },
          { label: "本次重点", value: "评估早搏负荷及是否需要药物干预" }
        ],
        medications: [{ label: "控制心率", count: 1 }, { label: "生活方式干预", count: 1 }],
        suggestions: ["完善24小时动态心电图", "减少咖啡和熬夜", "复查电解质和甲状腺功能"]
      })
    },
    {
      id: "cv008",
      status: "waiting",
      name: "郑雪梅",
      sex: "女",
      age: 63,
      visitNo: "CV2024052008",
      medicalCard: "CV********2008",
      phone: "130****7721",
      time: "11:15",
      tag: "瓣膜病",
      allergy: "无",
      height: "164cm",
      weight: "62kg",
      bmi: "23.1",
      department: CARDIO_DEPARTMENT,
      doctor: "张医生",
      visitDate: "2024-05-20 11:15",
      waitEstimate: "约95分钟",
      summary: cardioSummary({
        overview: "二尖瓣反流随访，近期活动后气促较前增加，需复查心脏超声并评估心腔大小和肺动脉压力。",
        features: ["二尖瓣反流", "活动后气促", "需复查心脏超声", "瓣膜病随访"],
        important: [
          { label: "过敏史", value: "无" },
          { label: "当前症状", value: "上楼后气促，休息可缓解", level: "warning" },
          { label: "随访重点", value: "反流程度、左房大小和肺动脉压力" }
        ],
        medications: [{ label: "随访观察", count: 1 }, { label: "血压管理", count: 1 }],
        suggestions: ["复查心脏超声", "评估运动耐量变化", "必要时转瓣膜专病门诊"]
      })
    },
    {
      id: "cv009",
      status: "active",
      name: "张建国",
      sex: "男",
      age: 65,
      visitNo: "CV2024052001",
      medicalCard: "CV********2001",
      phone: "138****5678",
      time: "09:30",
      tag: "高血压",
      allergy: "青霉素过敏",
      height: "175cm",
      weight: "78kg",
      bmi: "25.5（超重）",
      department: CARDIO_DEPARTMENT,
      doctor: "张医生",
      visitDate: "2024-05-20 09:30",
      consultStartedAt: "09:31:00",
      summary: null
    },
    {
      id: "cv010",
      status: "active",
      name: "刘秀兰",
      sex: "女",
      age: 72,
      visitNo: "CV2024052002",
      medicalCard: "CV********2002",
      phone: "139****2210",
      time: "09:45",
      tag: "冠心病",
      allergy: "无",
      height: "158cm",
      weight: "61kg",
      bmi: "24.4",
      department: CARDIO_DEPARTMENT,
      doctor: "张医生",
      visitDate: "2024-05-20 09:45",
      consultStartedAt: "09:48:00"
    },
    {
      id: "cv011",
      status: "done",
      name: "钱国平",
      sex: "男",
      age: 49,
      visitNo: "CV2024052009",
      medicalCard: "CV********2009",
      phone: "139****4821",
      time: "08:15",
      tag: "高血压复诊",
      allergy: "无",
      height: "171cm",
      weight: "70kg",
      bmi: "23.9",
      department: CARDIO_DEPARTMENT,
      doctor: "张医生",
      visitDate: "2024-05-20 08:15",
      completedAt: "2024-05-20 08:27",
      summary: cardioSummary({
        overview: "高血压复诊已完成，家庭血压较前稳定，无明显头晕胸痛，继续当前方案并强化生活方式管理。",
        features: ["高血压复诊", "血压较稳定", "无急性胸痛", "长期随访"],
        important: [
          { label: "过敏史", value: "无" },
          { label: "本次结论", value: "继续当前降压方案，按月记录家庭血压" },
          { label: "随访计划", value: "3个月后复诊，复查肾功能和电解质" }
        ],
        medications: [{ label: "降压药", count: 1 }, { label: "生活方式干预", count: 1 }],
        suggestions: ["维持规律服药", "继续家庭血压监测", "按期复诊复查"]
      })
    },
    {
      id: "cv012",
      status: "done",
      name: "陈丽华",
      sex: "女",
      age: 62,
      visitNo: "CV2024052010",
      medicalCard: "CV********2010",
      phone: "136****7309",
      time: "08:30",
      tag: "血脂复诊",
      allergy: "无",
      height: "160cm",
      weight: "58kg",
      bmi: "22.7",
      department: CARDIO_DEPARTMENT,
      doctor: "张医生",
      visitDate: "2024-05-20 08:30",
      completedAt: "2024-05-20 08:44",
      summary: cardioSummary({
        overview: "血脂复诊已完成，LDL-C较前下降但仍需结合危险分层继续达标管理。",
        features: ["血脂复诊", "LDL-C下降", "他汀治疗", "生活方式干预"],
        important: [
          { label: "过敏史", value: "无" },
          { label: "本次结论", value: "继续调脂治疗，关注肌痛和肝酶变化" },
          { label: "生活方式", value: "控制油脂摄入，增加规律运动" }
        ],
        medications: [{ label: "调脂药", count: 1 }, { label: "其他", count: 1 }],
        suggestions: ["继续他汀治疗", "8-12周复查血脂", "关注肌痛等不良反应"]
      })
    },
    {
      id: "cv013",
      status: "done",
      name: "何长青",
      sex: "男",
      age: 70,
      visitNo: "CV2024052011",
      medicalCard: "CV********2011",
      phone: "135****2108",
      time: "08:45",
      tag: "冠心病复诊",
      allergy: "无",
      height: "169cm",
      weight: "68kg",
      bmi: "23.8",
      department: CARDIO_DEPARTMENT,
      doctor: "张医生",
      visitDate: "2024-05-20 08:45",
      completedAt: "2024-05-20 09:05",
      summary: cardioSummary({
        overview: "冠心病复诊已完成，近期无典型心绞痛发作，继续二级预防并评估运动耐量。",
        features: ["冠心病复诊", "二级预防", "无典型心绞痛", "运动耐量评估"],
        important: [
          { label: "过敏史", value: "无" },
          { label: "本次结论", value: "症状稳定，继续抗血小板和调脂治疗" },
          { label: "随访计划", value: "如胸痛加重及时复诊，3个月后复查" }
        ],
        medications: [{ label: "抗血小板", count: 1 }, { label: "调脂药", count: 1 }, { label: "抗心绞痛", count: 1 }],
        suggestions: ["继续二级预防", "规律记录胸痛诱因和持续时间", "复查心电图和血脂"]
      })
    }
  ],
  hypertensionHistory: [
    ["主要病史", "高血压10年，血脂异常4年"],
    ["最高血压", "168/102 mmHg"],
    ["目前血压", "晨起 160/95 mmHg，服药后约145/88 mmHg"],
    ["相关症状", "头晕、心慌，偶有胸闷，无持续胸痛"],
    ["靶器官评估", "颈动脉斑块形成，肾功能目前正常"],
    ["家族史", "父亲高血压，母亲冠心病"],
    ["生活方式", "不吸烟，偶饮酒，低盐饮食执行一般，规律散步不足"]
  ],
  imaging: [
    { date: "2024-05-18", name: "冠脉CTA", status: "轻中度狭窄", desc: "前降支近段钙化斑块，管腔约40%狭窄；右冠近段轻度狭窄。" },
    { date: "2024-03-18", name: "颅脑CT平扫", status: "正常", desc: "脑实质未见急性异常，脑室系统未见扩大。" },
    { date: "2023-08-10", name: "颈动脉CTA", status: "轻度狭窄", desc: "双侧颈动脉粥样硬化，右侧颈内动脉起始段约30%狭窄。" },
    { date: "2022-11-06", name: "胸痛三联CTA", status: "未见急症", desc: "未见主动脉夹层及肺栓塞征象，冠脉轻度粥样硬化改变。" }
  ],
  ultrasound: [
    { date: "2024-05-18", name: "心脏超声", status: "左室舒张功能减低", desc: "左室射血分数EF 58%，左室舒张功能减低，轻度二尖瓣反流。" },
    { date: "2024-05-18", name: "颈动脉超声", status: "斑块形成", desc: "双侧颈动脉内膜不均增厚，右侧斑块最大厚度约2.1mm。" },
    { date: "2023-12-12", name: "下肢动脉超声", status: "轻度硬化", desc: "双下肢动脉硬化改变，未见明显血流受限。" },
    { date: "2023-06-20", name: "心脏超声复查", status: "基本稳定", desc: "各房室大小基本正常，EF 61%，瓣膜轻度退行性改变。" }
  ],
  lipids: {
    dates: ["2022-05", "2022-07", "2022-09", "2022-11", "2023-01", "2023-03", "2023-05", "2023-07", "2023-09", "2023-11", "2024-01", "2024-03", "2024-05"],
    tc: [5.4, 5.2, 5.1, 4.8, 4.7, 4.6, 4.5, 4.4, 4.35, 4.28, 4.35, 4.12, 4.35],
    tg: [2.02, 1.92, 1.86, 1.72, 1.68, 1.62, 1.65, 1.58, 1.51, 1.52, 1.35, 1.38, 1.25],
    ldl: [3.58, 3.42, 3.22, 3.08, 2.94, 2.82, 2.86, 2.78, 2.68, 2.71, 2.62, 2.45, 2.48],
    hdl: [0.86, 0.9, 0.94, 0.98, 1.02, 1.06, 1.08, 1.1, 1.12, 1.15, 1.16, 1.18, 1.18]
  },
  lis: [
    { item: "总胆固醇（TC）", result: "4.35", trend: "up", unit: "mmol/L", ref: "< 5.18", date: "2024-05-18" },
    { item: "甘油三酯（TG）", result: "1.25", trend: "down", unit: "mmol/L", ref: "< 1.70", date: "2024-05-18" },
    { item: "高密度脂蛋白（HDL-C）", result: "1.18", trend: "", unit: "mmol/L", ref: "≥ 1.04", date: "2024-05-18" },
    { item: "低密度脂蛋白（LDL-C）", result: "2.48", trend: "up", unit: "mmol/L", ref: "高危目标 <1.8", date: "2024-05-18" },
    { item: "肌钙蛋白I（cTnI）", result: "0.012", trend: "", unit: "ng/mL", ref: "< 0.04", date: "2024-05-18" },
    { item: "NT-proBNP", result: "286", trend: "up", unit: "pg/mL", ref: "< 125", date: "2024-05-18" },
    { item: "肌酐（CREA）", result: "78.0", trend: "", unit: "μmol/L", ref: "44~97", date: "2024-05-18" },
    { item: "钾（K）", result: "4.2", trend: "", unit: "mmol/L", ref: "3.5~5.3", date: "2024-05-18" }
  ],
  medications: [
    { name: "苯磺酸氨氯地平片", spec: "5mg", usage: "每日1次 每次1片", purpose: "降压" },
    { name: "厄贝沙坦片", spec: "150mg", usage: "每日1次 每次1片", purpose: "降压/心肾保护" },
    { name: "阿托伐他汀钙片", spec: "20mg", usage: "每晚1次 每次1片", purpose: "调脂" },
    { name: "阿司匹林肠溶片", spec: "100mg", usage: "每日1次 每次1片", purpose: "抗血小板" },
    { name: "琥珀酸美托洛尔缓释片", spec: "47.5mg", usage: "每日1次 每次半片", purpose: "控制心率/抗心绞痛" }
  ],
  consultDialog: [
    { role: "doctor", time: "09:31:12", text: "张先生，您好！今天主要哪里不舒服？" },
    { role: "patient", time: "09:31:18", text: "医生，我最近早上起床头晕，有时候还会心慌。" },
    { role: "doctor", time: "09:31:27", text: "这种情况多久了？血压最近测过吗？" },
    { role: "patient", time: "09:31:42", text: "大概一周。昨天早上160/95，吃药后晚上是145/88。" },
    { role: "doctor", time: "09:32:03", text: "有没有胸痛、胸闷、气短或者下肢水肿？" },
    { role: "patient", time: "09:32:15", text: "胸痛没有，就是爬楼会有点胸闷和喘，下肢不肿。" },
    { role: "doctor", time: "09:32:25", text: "降压药和降脂药最近有没有漏服？" },
    { role: "patient", time: "09:32:35", text: "有时候晚上应酬回来会忘记吃他汀，我也想看看这次血脂结果怎么样。" }
  ],
  aiAssistantHistory: [
    { role: "assistant", text: "您好，我是AI助手小诊，可以协助整理心血管风险、检查检验和用药信息。", time: "09:31" },
    { role: "user", text: "这位患者的血压控制情况如何？", time: "09:31" },
    { role: "assistant", text: "患者晨起血压最高160/95mmHg，服药后仍约145/88mmHg，提示晨峰控制不佳，需复核服药时间和家庭血压记录。", time: "09:31" },
    { role: "user", text: "血脂达标了吗？", time: "09:32" },
    { role: "assistant", text: "LDL-C 2.48 mmol/L，对已有颈动脉斑块和冠脉粥样硬化风险的患者仍未达高危目标，建议评估他汀依从性和强化方案。", time: "09:32" }
  ],
  aiResponses: {
    summary: "患者为65岁男性，高血压病史10年，近期晨起血压偏高，伴头晕、心慌和活动后胸闷。既往颈动脉斑块及冠脉轻中度粥样硬化，LDL-C仍未达高危目标，需综合评估降压、调脂和心肌缺血风险。",
    labs: "心血管相关检验：LDL-C 2.48 mmol/L，高危目标建议 <1.8 mmol/L；肌钙蛋白I 0.012 ng/mL暂未提示急性心肌损伤；NT-proBNP 286 pg/mL偏高，需结合心衰症状和心脏超声判断。",
    medication: "用药建议仅供医生参考：复核氨氯地平、厄贝沙坦服药时间和晨峰血压控制；调脂方面关注他汀依从性，必要时评估强化他汀或联合依折麦布；抗血小板治疗需结合出血风险复核。",
    record: "主诉：头晕伴心慌1周。现病史：患者近1周晨起头晕明显，偶有心慌，家庭自测血压最高160/95mmHg，服药后145/88mmHg，伴爬楼胸闷气促，否认持续胸痛及下肢水肿。"
  }
};

window.MedicalMock.medicationProfiles = {
  高血压: [
    { name: "苯磺酸氨氯地平片", spec: "5mg", usage: "每日1次 每次1片", purpose: "降压" },
    { name: "厄贝沙坦片", spec: "150mg", usage: "每日1次 每次1片", purpose: "降压/心肾保护" },
    { name: "阿托伐他汀钙片", spec: "20mg", usage: "每晚1次 每次1片", purpose: "调脂" }
  ],
  冠心病: [
    { name: "阿司匹林肠溶片", spec: "100mg", usage: "每日1次 每次1片", purpose: "抗血小板" },
    { name: "阿托伐他汀钙片", spec: "20mg", usage: "每晚1次 每次1片", purpose: "调脂" },
    { name: "单硝酸异山梨酯缓释片", spec: "40mg", usage: "每日1次 每次1片", purpose: "抗心绞痛" }
  ],
  房颤: [
    { name: "琥珀酸美托洛尔缓释片", spec: "47.5mg", usage: "每日1次 每次半片", purpose: "控制心率" },
    { name: "利伐沙班片", spec: "15mg", usage: "每日1次 每次1片", purpose: "抗凝" }
  ],
  心衰随访: [
    { name: "呋塞米片", spec: "20mg", usage: "每日1次 每次1片", purpose: "利尿" },
    { name: "沙库巴曲缬沙坦钠片", spec: "50mg", usage: "每日2次 每次1片", purpose: "心衰标准治疗" },
    { name: "螺内酯片", spec: "20mg", usage: "每日1次 每次1片", purpose: "抗醛固酮" }
  ],
  血脂异常: [
    { name: "瑞舒伐他汀钙片", spec: "10mg", usage: "每晚1次 每次1片", purpose: "调脂" },
    { name: "依折麦布片", spec: "10mg", usage: "每日1次 每次1片", purpose: "联合降脂" }
  ],
  胸痛评估: [
    { name: "阿托伐他汀钙片", spec: "20mg", usage: "每晚1次 每次1片", purpose: "调脂" },
    { name: "硝酸甘油片", spec: "0.5mg", usage: "胸痛时舌下含服", purpose: "胸痛急救备用" }
  ],
  早搏: [
    { name: "琥珀酸美托洛尔缓释片", spec: "47.5mg", usage: "每日1次 每次半片", purpose: "控制心率/减少早搏" },
    { name: "辅酶Q10胶囊", spec: "10mg", usage: "每日2次 每次1粒", purpose: "辅助治疗" }
  ],
  瓣膜病: [
    { name: "厄贝沙坦片", spec: "150mg", usage: "每日1次 每次1片", purpose: "血压管理" },
    { name: "呋塞米片", spec: "20mg", usage: "气促或水肿时遵医嘱使用", purpose: "容量管理" }
  ]
};

const respiratoryPatients = [
  ["rp001", "waiting", "王方寿", "男", 86, "慢阻肺", "青霉素过敏", "09:30"],
  ["rp002", "waiting", "刘桂兰", "女", 78, "慢阻肺", "无", "09:45"],
  ["rp003", "waiting", "陈建国", "男", 69, "肺部感染", "头孢过敏", "10:00"],
  ["rp004", "waiting", "赵美华", "女", 63, "哮喘", "无", "10:15"],
  ["rp005", "waiting", "孙立强", "男", 58, "慢阻肺", "无", "10:30"],
  ["rp006", "waiting", "周雅琴", "女", 71, "支气管扩张", "无", "10:45"],
  ["rp007", "waiting", "吴志远", "男", 52, "睡眠呼吸暂停", "无", "11:00"],
  ["rp008", "waiting", "郑雪梅", "女", 60, "肺结节随访", "无", "11:15"],
  ["rp009", "active", "王方寿", "男", 86, "慢阻肺", "青霉素过敏", "09:30"],
  ["rp010", "active", "陈建国", "男", 69, "肺部感染", "头孢过敏", "10:00"],
  ["rp011", "done", "钱国平", "男", 74, "慢阻肺复诊", "无", "08:15"],
  ["rp012", "done", "陈丽华", "女", 62, "肺结节复诊", "无", "08:30"],
  ["rp013", "done", "何长青", "男", 70, "哮喘复诊", "无", "08:45"]
].map(([id, status, name, sex, age, tag, allergy, time], index) => ({
  id,
  status,
  name,
  sex,
  age,
  visitNo: `RP20240520${String(index + 1).padStart(2, "0")}`,
  medicalCard: `RP********20${String(index + 1).padStart(2, "0")}`,
  phone: `13${(800000000 + index * 17321).toString().slice(0, 9)}`,
  time,
  tag,
  allergy,
  height: sex === "男" ? "170cm" : "160cm",
  weight: sex === "男" ? "68kg" : "56kg",
  bmi: sex === "男" ? "23.5" : "21.9",
  department: "呼吸科",
  doctor: "张医生",
  visitDate: `2024-05-20 ${time}`,
  waitEstimate: status === "waiting" ? `约${15 + index * 8}分钟` : undefined,
  consultStartedAt: status === "active" ? `${time}:00` : undefined,
  completedAt: status === "done" ? `2024-05-20 ${time}` : undefined,
  summary: cardioSummary({
    overview: `${tag}患者，近期以咳嗽、咳痰、气促或复查为主，需结合胸部影像、炎症指标、血氧和当前呼吸用药评估。`,
    features: [tag, "呼吸科", "胸部影像评估", "血氧监测"],
    important: [
      { label: "过敏史", value: allergy, level: allergy !== "无" ? "danger" : "" },
      { label: "当前重点", value: "评估急性加重、感染风险和吸入治疗依从性", level: "warning" },
      { label: "随访计划", value: "结合肺功能、胸部CT和症状变化制定复查周期" }
    ],
    medications: [{ label: "呼吸治疗", count: 1 }, { label: "对症治疗", count: 1 }],
    suggestions: ["复核吸入装置使用方法", "监测SpO2和活动后气促", "结合影像和炎症指标调整方案"]
  })
}));

const respiratoryData = {
  appMeta: { departmentKey: "respiratory", departmentName: "呼吸科" },
  statusTabs: window.MedicalMock.statusTabs,
  patients: respiratoryPatients,
  hypertensionHistory: [
    ["主要病史", "慢性呼吸道疾病或肺部影像异常随访"],
    ["近期症状", "咳嗽、咳痰、气促，部分患者夜间加重"],
    ["诱发因素", "受凉、感染、粉尘/烟雾暴露或吸入药不规律"],
    ["既往检查", "胸部CT、肺功能、血氧饱和度记录"],
    ["生活方式", "戒烟/避免二手烟，规律吸入治疗，适度肺康复训练"]
  ],
  imaging: [
    { date: "2024-05-18", name: "胸部CT平扫", status: "异常", desc: "双肺纹理增多，局部支气管壁增厚，需结合感染指标。" },
    { date: "2024-03-10", name: "胸部DR", status: "随访", desc: "双下肺少许慢性炎性改变，未见明显胸腔积液。" },
    { date: "2023-12-12", name: "低剂量肺CT", status: "结节随访", desc: "右上肺微小结节，形态较前稳定。" }
  ],
  ultrasound: [
    { date: "2024-05-18", name: "心脏超声", status: "基本正常", desc: "EF 61%，肺动脉压未见明显升高。" },
    { date: "2024-05-18", name: "下肢静脉超声", status: "正常", desc: "双下肢深静脉未见明显血栓形成。" }
  ],
  lipids: window.MedicalMock.lipids,
  lis: [
    { item: "白细胞计数（WBC）", result: "9.8", trend: "up", unit: "10^9/L", ref: "3.5~9.5", date: "2024-05-18" },
    { item: "C反应蛋白（CRP）", result: "18.6", trend: "up", unit: "mg/L", ref: "< 8", date: "2024-05-18" },
    { item: "降钙素原（PCT）", result: "0.08", trend: "", unit: "ng/mL", ref: "< 0.05", date: "2024-05-18" },
    { item: "血氧饱和度（SpO2）", result: "94", trend: "down", unit: "%", ref: "95~100", date: "2024-05-18" },
    { item: "FEV1/FVC", result: "61", trend: "", unit: "%", ref: "> 70", date: "2024-05-18" }
  ],
  medications: [
    { name: "布地奈德福莫特罗吸入粉雾剂", spec: "160/4.5μg", usage: "每日2次 每次1吸", purpose: "吸入控制治疗" },
    { name: "噻托溴铵吸入粉雾剂", spec: "18μg", usage: "每日1次 每次1粒", purpose: "长效支气管扩张" }
  ],
  medicationProfiles: {
    rp002: [
      { name: "布地奈德福莫特罗吸入粉雾剂", spec: "160/4.5μg", usage: "每日2次 每次1吸", purpose: "维持治疗" },
      { name: "孟鲁司特钠片", spec: "10mg", usage: "每晚1次 每次1片", purpose: "减轻夜间咳嗽" }
    ],
    慢阻肺: [
      { name: "噻托溴铵吸入粉雾剂", spec: "18μg", usage: "每日1次 每次1粒", purpose: "长效支气管扩张" },
      { name: "乙酰半胱氨酸颗粒", spec: "0.2g", usage: "每日3次 每次1包", purpose: "祛痰" }
    ],
    肺部感染: [
      { name: "盐酸氨溴索口服溶液", spec: "30mg/10ml", usage: "每日3次 每次10ml", purpose: "化痰" },
      { name: "对乙酰氨基酚片", spec: "0.5g", usage: "发热时按需使用", purpose: "退热" }
    ],
    哮喘: [
      { name: "布地奈德福莫特罗吸入粉雾剂", spec: "160/4.5μg", usage: "每日2次 每次1吸", purpose: "控制治疗" },
      { name: "沙丁胺醇气雾剂", spec: "100μg", usage: "喘息时按需吸入", purpose: "急救缓解" }
    ],
    支气管扩张: [
      { name: "乙酰半胱氨酸泡腾片", spec: "0.6g", usage: "每日1次 每次1片", purpose: "祛痰" },
      { name: "生理盐水雾化", spec: "5ml", usage: "每日1-2次", purpose: "气道廓清" }
    ],
    睡眠呼吸暂停: [
      { name: "CPAP治疗", spec: "夜间", usage: "每晚使用", purpose: "改善夜间低氧" },
      { name: "体重管理处方", spec: "生活方式", usage: "持续执行", purpose: "非药物干预" }
    ],
    肺结节随访: []
  },
  consultDialog: [
    { role: "doctor", time: "09:31:12", text: "最近咳嗽、咳痰和气喘有没有加重？" },
    { role: "patient", time: "09:31:18", text: "这几天痰比以前多，活动以后喘得明显。" },
    { role: "doctor", time: "09:31:27", text: "有没有发热，血氧测过吗？吸入药最近规律用吗？" },
    { role: "patient", time: "09:31:42", text: "没明显发热，血氧有时候94，吸入药偶尔会忘。" }
  ],
  aiAssistantHistory: [
    { role: "assistant", text: "您好，我可以协助整理呼吸症状、胸部影像、炎症指标和吸入用药情况。", time: "09:31" }
  ],
  aiResponses: {
    summary: "患者为呼吸科随访患者，近期咳嗽咳痰及活动后气促加重，需结合胸部影像、血氧、炎症指标和吸入治疗依从性评估急性加重风险。",
    labs: "炎症指标和血氧提示需关注感染或急性加重风险：CRP升高，SpO2偏低，建议结合胸部CT和痰液情况判断。",
    medication: "建议复核吸入装置使用方法和依从性；根据症状、痰量、血氧和炎症指标决定是否调整支扩、祛痰或抗感染方案。",
    record: "主诉：咳嗽咳痰伴活动后气促加重。现病史：患者近期痰量增加，活动后气喘明显，血氧偶有下降，需评估感染及慢性气道病急性加重。"
  }
};

window.MedicalMock.departments = {
  cardiology: window.MedicalMock,
  respiratory: respiratoryData
};

window.MedicalMock.departmentOptions = [
  { key: "cardiology", name: "心血管内科" },
  { key: "respiratory", name: "呼吸科" }
];

window.MedicalMock.defaultDepartmentKey = "cardiology";
