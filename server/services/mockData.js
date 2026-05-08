export const statusTabs = [
  { key: "waiting", label: "待诊", count: 8 },
  { key: "active", label: "接诊中", count: 2 },
  { key: "done", label: "已完成", count: 3 }
];

function summary({ overview, features, important, medications, suggestions }) {
  return { overview, features, important, medications, suggestions };
}

export const patients = [
  {
    id: "record-8979",
    status: "waiting",
    name: "王方寿",
    sex: "男",
    age: 86,
    visitNo: "20240165",
    medicalCard: "EMR********0165",
    phone: "138****5678",
    time: "09:30",
    tag: "慢阻肺",
    allergy: "青霉素过敏",
    height: "168cm",
    weight: "62kg",
    bmi: "22.0",
    department: "呼吸与危重症医学科",
    doctor: "张医生",
    visitDate: "2024-11-26 10:32",
    waitEstimate: "约15分钟",
    recordId: "record-8979",
    summary: summary({
      overview: "慢阻肺病史多年，近期咳嗽咳痰及活动后气喘加重，需结合胸部CT、炎症指标和吸入药依从性评估急性加重风险。",
      features: ["慢阻肺", "咳嗽咳痰加重", "活动后气喘", "高龄", "青霉素过敏"],
      important: [
        { label: "过敏史", value: "青霉素过敏", level: "danger" },
        { label: "当前症状", value: "咳黄白痰，活动后气促较前明显", level: "warning" },
        { label: "本次重点", value: "排查感染诱发慢阻肺急性加重" }
      ],
      medications: [
        { label: "吸入制剂", count: 1 },
        { label: "祛痰药", count: 1 },
        { label: "其他", count: 1 }
      ],
      suggestions: ["复核吸入装置使用方法", "评估血常规、CRP和胸部影像", "关注血氧饱和度和呼吸困难分级"]
    })
  },
  {
    id: "record-8980",
    status: "waiting",
    name: "刘桂兰",
    sex: "女",
    age: 78,
    visitNo: "20240166",
    medicalCard: "EMR********0166",
    phone: "139****2210",
    time: "09:45",
    tag: "慢阻肺",
    allergy: "无",
    height: "156cm",
    weight: "54kg",
    bmi: "22.2",
    department: "呼吸与危重症医学科",
    doctor: "张医生",
    visitDate: "2024-11-26 10:46",
    waitEstimate: "约25分钟",
    recordId: "record-8980",
    summary: summary({
      overview: "慢阻肺稳定期随访，近期夜间咳嗽增加，暂无明显发热，需评估吸入治疗依从性和肺功能变化。",
      features: ["慢阻肺随访", "夜间咳嗽", "无发热", "需复查肺功能"],
      important: [
        { label: "过敏史", value: "无" },
        { label: "目前病情", value: "夜间咳嗽增多，白痰，无明显喘憋" },
        { label: "随访重点", value: "吸入药依从性和急性加重预防" }
      ],
      medications: [{ label: "吸入制剂", count: 1 }, { label: "祛痰药", count: 1 }],
      suggestions: ["复查肺功能", "指导吸入药规范使用", "接种流感/肺炎相关疫苗评估"]
    })
  },
  {
    id: "record-8981",
    status: "waiting",
    name: "陈建国",
    sex: "男",
    age: 69,
    visitNo: "20240167",
    medicalCard: "EMR********0167",
    phone: "136****1988",
    time: "10:00",
    tag: "肺部感染",
    allergy: "头孢过敏",
    height: "172cm",
    weight: "70kg",
    bmi: "23.7",
    department: "呼吸与危重症医学科",
    doctor: "张医生",
    visitDate: "2024-11-26 10:58",
    waitEstimate: "约35分钟",
    recordId: "record-8981",
    summary: summary({
      overview: "咳嗽发热3天，炎症指标升高，既往头孢过敏，需结合胸部CT评估肺部感染范围及抗感染用药选择。",
      features: ["发热", "咳嗽咳痰", "CRP升高", "头孢过敏"],
      important: [
        { label: "过敏史", value: "头孢过敏", level: "danger" },
        { label: "目前病情", value: "最高体温38.5℃，黄痰，活动耐量下降", level: "warning" },
        { label: "用药限制", value: "抗感染方案需避开明确过敏药物" }
      ],
      medications: [{ label: "退热药", count: 1 }, { label: "祛痰药", count: 1 }],
      suggestions: ["完善胸部CT和病原学检查", "结合过敏史选择抗感染方案", "监测体温、血氧和炎症指标"]
    })
  },
  {
    id: "record-8982",
    status: "waiting",
    name: "赵敏华",
    sex: "女",
    age: 64,
    visitNo: "20240168",
    medicalCard: "EMR********0168",
    phone: "137****6612",
    time: "10:15",
    tag: "哮喘",
    allergy: "阿司匹林诱发喘息",
    height: "160cm",
    weight: "61kg",
    bmi: "23.8",
    department: "呼吸与危重症医学科",
    doctor: "张医生",
    visitDate: "2024-11-26 11:10",
    waitEstimate: "约45分钟",
    recordId: "record-8982",
    summary: summary({
      overview: "支气管哮喘病史，近期接触冷空气后喘息加重，需评估控制水平、诱因和急性发作风险。",
      features: ["哮喘", "喘息加重", "冷空气诱发", "阿司匹林相关不耐受"],
      important: [
        { label: "过敏/不耐受", value: "阿司匹林诱发喘息", level: "danger" },
        { label: "当前症状", value: "夜间咳喘2次，使用急救药后缓解", level: "warning" },
        { label: "本次重点", value: "评估哮喘控制水平和吸入激素使用" }
      ],
      medications: [{ label: "吸入激素/支扩", count: 1 }, { label: "急救药", count: 1 }],
      suggestions: ["复核峰流速或肺功能", "规避明确诱因", "评估是否需要阶梯调整控制治疗"]
    })
  },
  {
    id: "record-8983",
    status: "waiting",
    name: "孙保民",
    sex: "男",
    age: 72,
    visitNo: "20240169",
    medicalCard: "EMR********0169",
    phone: "135****3345",
    time: "10:30",
    tag: "慢阻肺",
    allergy: "无",
    height: "170cm",
    weight: "68kg",
    bmi: "23.5",
    department: "呼吸与危重症医学科",
    doctor: "张医生",
    visitDate: "2024-11-26 11:25",
    waitEstimate: "约55分钟",
    recordId: "record-8983",
    summary: summary({
      overview: "慢阻肺合并长期吸烟史，近期活动后气促，需评估肺功能、影像变化及戒烟干预。",
      features: ["慢阻肺", "长期吸烟史", "活动后气促", "需肺功能评估"],
      important: [
        { label: "过敏史", value: "无" },
        { label: "危险因素", value: "吸烟40余年，近期未完全戒烟", level: "warning" },
        { label: "当前状态", value: "爬二层楼气促，静息可缓解" }
      ],
      medications: [{ label: "吸入制剂", count: 1 }, { label: "戒烟干预", count: 1 }],
      suggestions: ["完善肺功能和胸部CT随访", "强化戒烟干预", "评估运动耐量和康复训练"]
    })
  },
  {
    id: "record-8984",
    status: "waiting",
    name: "周秀英",
    sex: "女",
    age: 81,
    visitNo: "20240170",
    medicalCard: "EMR********0170",
    phone: "132****9988",
    time: "10:45",
    tag: "支气管扩张",
    allergy: "无",
    height: "158cm",
    weight: "49kg",
    bmi: "19.6",
    department: "呼吸与危重症医学科",
    doctor: "张医生",
    visitDate: "2024-11-26 11:37",
    waitEstimate: "约65分钟",
    recordId: "record-8984",
    summary: summary({
      overview: "支气管扩张病史，近期痰量增多偶有血丝，需评估感染、咯血风险和气道廓清情况。",
      features: ["支气管扩张", "痰量增多", "痰中带血丝", "高龄"],
      important: [
        { label: "过敏史", value: "无" },
        { label: "风险提示", value: "偶有痰中带血丝，需关注咯血风险", level: "danger" },
        { label: "本次重点", value: "评估感染控制和排痰能力" }
      ],
      medications: [{ label: "祛痰药", count: 1 }, { label: "雾化治疗", count: 1 }],
      suggestions: ["完善胸部CT和痰培养", "指导体位引流/气道廓清", "如咯血增多需及时处理"]
    })
  },
  {
    id: "record-8985",
    status: "waiting",
    name: "吴志强",
    sex: "男",
    age: 59,
    visitNo: "20240171",
    medicalCard: "EMR********0171",
    phone: "131****8832",
    time: "11:00",
    tag: "睡眠呼吸暂停",
    allergy: "无",
    height: "176cm",
    weight: "88kg",
    bmi: "28.4（超重）",
    department: "呼吸与危重症医学科",
    doctor: "张医生",
    visitDate: "2024-11-26 11:50",
    waitEstimate: "约80分钟",
    recordId: "record-8985",
    summary: summary({
      overview: "夜间打鼾伴憋醒，白天嗜睡，体重超重，需评估阻塞性睡眠呼吸暂停及心血管风险。",
      features: ["夜间打鼾", "憋醒", "白天嗜睡", "BMI 28.4"],
      important: [
        { label: "过敏史", value: "无" },
        { label: "目前病情", value: "家属诉夜间呼吸暂停明显", level: "warning" },
        { label: "本次重点", value: "完善睡眠监测和减重干预评估" }
      ],
      medications: [{ label: "非药物治疗", count: 2 }],
      suggestions: ["安排睡眠呼吸监测", "评估CPAP适应证", "制定体重管理和睡姿干预方案"]
    })
  },
  {
    id: "record-8986",
    status: "waiting",
    name: "郑美芳",
    sex: "女",
    age: 67,
    visitNo: "20240172",
    medicalCard: "EMR********0172",
    phone: "130****7721",
    time: "11:15",
    tag: "肺结节随访",
    allergy: "碘造影剂过敏",
    height: "164cm",
    weight: "60kg",
    bmi: "22.3",
    department: "呼吸与危重症医学科",
    doctor: "张医生",
    visitDate: "2024-11-26 12:02",
    waitEstimate: "约95分钟",
    recordId: "record-8986",
    summary: summary({
      overview: "肺结节随访患者，既往右上肺磨玻璃结节，需对比既往影像评估大小和密度变化。",
      features: ["肺结节随访", "磨玻璃结节", "需影像对比", "碘造影剂过敏"],
      important: [
        { label: "过敏史", value: "碘造影剂过敏", level: "danger" },
        { label: "随访重点", value: "右上肺磨玻璃结节大小及实性成分变化" },
        { label: "本次资料", value: "已预约薄层胸部CT" }
      ],
      medications: [{ label: "暂无长期用药", count: 0 }],
      suggestions: ["调阅既往CT影像对比", "根据结节风险分层确定随访周期", "注意造影剂过敏史"]
    })
  },
  {
    id: "record-8987",
    status: "active",
    name: "王方寿",
    sex: "男",
    age: 86,
    visitNo: "20240165",
    medicalCard: "EMR********0165",
    phone: "138****5678",
    time: "09:30",
    tag: "慢阻肺",
    allergy: "青霉素过敏",
    height: "168cm",
    weight: "62kg",
    bmi: "22.0",
    department: "呼吸与危重症医学科",
    doctor: "张医生",
    visitDate: "2024-11-26 10:32",
    consultStartedAt: "10:35:00",
    recordId: "record-8979",
    summary: null
  },
  {
    id: "record-8988",
    status: "active",
    name: "陈建国",
    sex: "男",
    age: 69,
    visitNo: "20240167",
    medicalCard: "EMR********0167",
    phone: "136****1988",
    time: "10:00",
    tag: "肺部感染",
    allergy: "头孢过敏",
    height: "172cm",
    weight: "70kg",
    bmi: "23.7",
    department: "呼吸与危重症医学科",
    doctor: "张医生",
    visitDate: "2024-11-26 10:58",
    consultStartedAt: "11:02:00",
    recordId: "record-8981",
    summary: null
  },
  {
    id: "record-8989",
    status: "done",
    name: "何淑珍",
    sex: "女",
    age: 75,
    visitNo: "20240158",
    medicalCard: "EMR********0158",
    phone: "139****4821",
    time: "08:10",
    tag: "慢阻肺复诊",
    allergy: "无",
    height: "157cm",
    weight: "52kg",
    bmi: "21.1",
    department: "呼吸与危重症医学科",
    doctor: "张医生",
    visitDate: "2024-11-26 08:10",
    completedAt: "2024-11-26 08:42",
    recordId: "record-8989",
    summary: summary({
      overview: "慢阻肺复诊已完成，症状较前稳定，完成吸入药使用指导和随访计划。",
      features: ["慢阻肺复诊", "症状稳定", "吸入药指导", "长期随访"],
      important: [
        { label: "过敏史", value: "无" },
        { label: "本次结论", value: "无急性加重表现，继续维持治疗" },
        { label: "随访计划", value: "3个月后复查肺功能" }
      ],
      medications: [{ label: "吸入制剂", count: 1 }, { label: "祛痰药", count: 1 }],
      suggestions: ["继续当前吸入治疗", "记录急性加重次数", "按期复查肺功能"]
    })
  },
  {
    id: "record-8990",
    status: "done",
    name: "马德海",
    sex: "男",
    age: 62,
    visitNo: "20240159",
    medicalCard: "EMR********0159",
    phone: "136****7309",
    time: "08:35",
    tag: "肺结节随访",
    allergy: "无",
    height: "173cm",
    weight: "74kg",
    bmi: "24.7",
    department: "呼吸与危重症医学科",
    doctor: "张医生",
    visitDate: "2024-11-26 08:35",
    completedAt: "2024-11-26 09:05",
    recordId: "record-8990",
    summary: summary({
      overview: "肺结节复查已完成，影像较前无明显增大，建议按风险分层继续定期随访。",
      features: ["肺结节随访", "较前稳定", "无明显新发症状", "继续观察"],
      important: [
        { label: "过敏史", value: "无" },
        { label: "本次结论", value: "结节较前稳定，暂不提示快速进展" },
        { label: "随访计划", value: "6-12个月薄层CT复查" }
      ],
      medications: [{ label: "暂无长期用药", count: 0 }],
      suggestions: ["保存本次影像用于下次对比", "若咯血/消瘦等及时复诊", "继续戒烟和肺部健康管理"]
    })
  },
  {
    id: "record-8991",
    status: "done",
    name: "许兰芝",
    sex: "女",
    age: 70,
    visitNo: "20240160",
    medicalCard: "EMR********0160",
    phone: "137****0954",
    time: "08:55",
    tag: "哮喘复诊",
    allergy: "花粉过敏",
    height: "160cm",
    weight: "59kg",
    bmi: "23.0",
    department: "呼吸与危重症医学科",
    doctor: "张医生",
    visitDate: "2024-11-26 08:55",
    completedAt: "2024-11-26 09:24",
    recordId: "record-8991",
    summary: summary({
      overview: "哮喘复诊已完成，近期控制尚可，明确花粉诱因，调整季节性预防和急救药备用方案。",
      features: ["哮喘复诊", "控制尚可", "花粉过敏", "季节性诱发"],
      important: [
        { label: "过敏史", value: "花粉过敏", level: "warning" },
        { label: "本次结论", value: "近期无急性发作，夜间症状减少" },
        { label: "随访计划", value: "换季前复诊评估控制水平" }
      ],
      medications: [{ label: "控制药", count: 1 }, { label: "急救药", count: 1 }],
      suggestions: ["继续规范吸入治疗", "花粉季减少暴露", "记录急救药使用频次"]
    })
  }
];

const baseRespiratoryContext = {
  hypertensionHistory: [
    ["入院诊断", "慢性呼吸系统疾病随访"],
    ["病程", "慢性病长期管理"],
    ["当前状态", "需结合病历、检验、检查综合评估"],
    ["过敏史", "见患者基础信息"],
    ["生活方式", "需评估吸烟史、吸入药依从性和运动耐量"]
  ],
  imaging: [
    { date: "2024-11-26", name: "胸部CT平扫", status: "待解读", desc: "双肺纹理增多，局部慢性炎症改变，需结合既往片对比。" },
    { date: "2024-08-18", name: "胸部DR", status: "慢性改变", desc: "双肺透亮度增高，未见明确大片实变影。" },
    { date: "2023-12-05", name: "胸部CT复查", status: "稳定", desc: "肺气肿改变较前相仿，未见明显新发占位。" }
  ],
  ultrasound: [
    { date: "2024-11-26", name: "心脏超声", status: "待回报", desc: "评估肺心病相关改变及心功能情况。" },
    { date: "2024-06-12", name: "下肢静脉超声", status: "未见血栓", desc: "双下肢深静脉血流通畅。" }
  ],
  lipids: {
    dates: ["2024-05", "2024-07", "2024-09", "2024-11"],
    tc: [4.35, 4.12, 4.28, 4.2],
    tg: [1.25, 1.36, 1.28, 1.31],
    ldl: [2.48, 2.36, 2.41, 2.39],
    hdl: [1.18, 1.15, 1.2, 1.16]
  },
  labs: [
    { item: "白细胞计数", result: "9.8", trend: "up", unit: "10^9/L", ref: "3.5~9.5", date: "2024-11-26" },
    { item: "中性粒细胞百分比", result: "78.6", trend: "up", unit: "%", ref: "40~75", date: "2024-11-26" },
    { item: "C反应蛋白", result: "18.2", trend: "up", unit: "mg/L", ref: "< 8", date: "2024-11-26" },
    { item: "降钙素原", result: "0.08", trend: "", unit: "ng/mL", ref: "< 0.10", date: "2024-11-26" },
    { item: "血氧饱和度", result: "94", trend: "down", unit: "%", ref: "95~100", date: "2024-11-26" }
  ],
  medications: [
    { name: "布地奈德福莫特罗吸入剂", spec: "160/4.5μg", usage: "每日2次 每次1吸", purpose: "平喘/抗炎" },
    { name: "噻托溴铵吸入粉雾剂", spec: "18μg", usage: "每日1次 每次1吸", purpose: "支气管舒张" },
    { name: "氨溴索片", spec: "30mg", usage: "每日3次 每次1片", purpose: "化痰" }
  ],
  dialog: [
    { role: "doctor", time: "10:35:12", text: "您好，请问今天主要哪里不舒服？" },
    { role: "patient", time: "10:35:18", text: "最近咳嗽咳痰明显，活动后气喘比以前重。" },
    { role: "doctor", time: "10:35:36", text: "痰是什么颜色？有没有发热或者胸痛？" },
    { role: "patient", time: "10:35:51", text: "痰有点黄白色，没明显胸痛，昨天晚上有点低热。" },
    { role: "doctor", time: "10:36:10", text: "吸入药最近有没有规律使用？走路气喘到什么程度？" },
    { role: "patient", time: "10:36:28", text: "吸入药有时候会忘，走快一点就喘，需要停下来歇。" }
  ],
  vitals: {
    bloodPressure: "136/78 mmHg",
    heartRate: "92次/分",
    temperature: "37.4℃",
    spo2: "94%"
  }
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function contextOverrides(patient) {
  if (/肺部感染/.test(patient.tag)) {
    return {
      hypertensionHistory: [
        ["入院诊断", "肺部感染待评估"],
        ["病程", "咳嗽发热3天"],
        ["当前状态", "炎症指标升高，需结合影像和病原学判断"],
        ["过敏史", patient.allergy || "无"]
      ],
      imaging: [
        { date: "2024-11-26", name: "胸部CT平扫", status: "炎症改变", desc: "右下肺斑片状渗出影，考虑感染性病变可能。" },
        { date: "2024-11-26", name: "胸部DR", status: "异常", desc: "右下肺纹理增多，局部渗出待排。" }
      ],
      labs: [
        { item: "白细胞计数", result: "12.4", trend: "up", unit: "10^9/L", ref: "3.5~9.5", date: "2024-11-26" },
        { item: "中性粒细胞百分比", result: "84.1", trend: "up", unit: "%", ref: "40~75", date: "2024-11-26" },
        { item: "C反应蛋白", result: "56.8", trend: "up", unit: "mg/L", ref: "< 8", date: "2024-11-26" },
        { item: "降钙素原", result: "0.18", trend: "up", unit: "ng/mL", ref: "< 0.10", date: "2024-11-26" }
      ],
      medications: [
        { name: "乙酰半胱氨酸颗粒", spec: "0.2g", usage: "每日3次 每次1包", purpose: "化痰" },
        { name: "对乙酰氨基酚片", spec: "0.5g", usage: "必要时口服", purpose: "退热" }
      ],
      dialog: [
        { role: "doctor", time: "11:02:04", text: "发热大概几天？最高体温多少？" },
        { role: "patient", time: "11:02:16", text: "三天了，最高到38度5，咳黄痰。" },
        { role: "doctor", time: "11:02:38", text: "以前对头孢过敏具体是什么表现？" },
        { role: "patient", time: "11:02:55", text: "吃过以后身上起疹子，还觉得胸闷。" }
      ],
      vitals: { bloodPressure: "128/76 mmHg", heartRate: "98次/分", temperature: "38.2℃", spo2: "95%" }
    };
  }

  if (/哮喘/.test(patient.tag)) {
    return {
      hypertensionHistory: [
        ["入院诊断", "支气管哮喘"],
        ["病程", "反复喘息多年，近期诱因后加重"],
        ["当前状态", "需评估哮喘控制水平和急性发作风险"],
        ["过敏史", patient.allergy || "无"]
      ],
      imaging: [
        { date: "2024-11-26", name: "胸部DR", status: "未见实变", desc: "双肺未见明确大片实变影，支气管炎性改变可能。" }
      ],
      labs: [
        { item: "嗜酸性粒细胞百分比", result: "6.8", trend: "up", unit: "%", ref: "0.4~8.0", date: "2024-11-26" },
        { item: "总IgE", result: "186", trend: "up", unit: "IU/mL", ref: "< 100", date: "2024-11-26" },
        { item: "峰流速", result: "68", trend: "down", unit: "%预计值", ref: "> 80", date: "2024-11-26" }
      ],
      medications: [
        { name: "布地奈德福莫特罗吸入剂", spec: "160/4.5μg", usage: "每日2次 每次1吸", purpose: "控制哮喘" },
        { name: "沙丁胺醇气雾剂", spec: "100μg", usage: "喘息时按需吸入", purpose: "急救缓解" }
      ],
      vitals: { bloodPressure: "122/74 mmHg", heartRate: "88次/分", temperature: "36.8℃", spo2: "97%" }
    };
  }

  if (/肺结节/.test(patient.tag)) {
    return {
      hypertensionHistory: [
        ["入院诊断", "肺结节随访"],
        ["病程", "发现肺结节后定期影像复查"],
        ["当前状态", "需对比既往薄层CT评估变化"],
        ["过敏史", patient.allergy || "无"]
      ],
      imaging: [
        { date: "2024-11-26", name: "胸部薄层CT", status: "待对比", desc: "右上肺磨玻璃结节约6mm，建议结合既往片比较。" },
        { date: "2024-05-15", name: "胸部薄层CT", status: "稳定", desc: "右上肺磨玻璃结节约5-6mm，未见明显实性成分。" }
      ],
      labs: [
        { item: "癌胚抗原（CEA）", result: "2.1", trend: "", unit: "ng/mL", ref: "< 5.0", date: "2024-11-26" },
        { item: "细胞角蛋白19片段", result: "2.4", trend: "", unit: "ng/mL", ref: "< 3.3", date: "2024-11-26" }
      ],
      medications: [],
      dialog: [
        { role: "doctor", time: "11:50:12", text: "这次主要是复查肺结节，对吗？最近有没有咳血、消瘦？" },
        { role: "patient", time: "11:50:28", text: "是复查，没有咳血，也没有明显瘦。" }
      ],
      vitals: { bloodPressure: "130/80 mmHg", heartRate: "76次/分", temperature: "36.6℃", spo2: "98%" }
    };
  }

  if (/睡眠呼吸暂停/.test(patient.tag)) {
    return {
      hypertensionHistory: [
        ["入院诊断", "阻塞性睡眠呼吸暂停待评估"],
        ["病程", "夜间打鼾多年，近半年憋醒增多"],
        ["当前状态", "需完善睡眠呼吸监测"],
        ["过敏史", patient.allergy || "无"]
      ],
      labs: [
        { item: "空腹血糖", result: "6.4", trend: "up", unit: "mmol/L", ref: "3.9~6.1", date: "2024-11-26" },
        { item: "低密度脂蛋白（LDL-C）", result: "3.12", trend: "up", unit: "mmol/L", ref: "< 3.37", date: "2024-11-26" },
        { item: "夜间最低血氧", result: "82", trend: "down", unit: "%", ref: "> 90", date: "2024-11-26" }
      ],
      medications: [
        { name: "持续气道正压通气（CPAP）", spec: "待滴定", usage: "夜间睡眠时使用", purpose: "改善睡眠低通气/低氧" },
        { name: "体重管理处方", spec: "生活方式", usage: "每日执行", purpose: "减重及降低气道阻塞风险" }
      ],
      dialog: [
        { role: "doctor", time: "11:15:12", text: "家属有没有观察到夜间呼吸暂停？" },
        { role: "patient", time: "11:15:30", text: "有，说我打鼾很响，有时候突然不喘气，然后又憋醒。" }
      ],
      vitals: { bloodPressure: "148/88 mmHg", heartRate: "84次/分", temperature: "36.7℃", spo2: "96%" }
    };
  }

  if (/支气管扩张/.test(patient.tag)) {
    return {
      hypertensionHistory: [
        ["入院诊断", "支气管扩张"],
        ["病程", "反复咳痰多年，近期痰量增多"],
        ["当前状态", "需评估感染和咯血风险"],
        ["过敏史", patient.allergy || "无"]
      ],
      imaging: [
        { date: "2024-11-26", name: "胸部CT", status: "支扩改变", desc: "双下肺支气管扩张伴管壁增厚，局部黏液栓形成。" }
      ],
      labs: [
        { item: "白细胞计数", result: "10.6", trend: "up", unit: "10^9/L", ref: "3.5~9.5", date: "2024-11-26" },
        { item: "C反应蛋白", result: "22.4", trend: "up", unit: "mg/L", ref: "< 8", date: "2024-11-26" },
        { item: "痰培养", result: "待回报", trend: "", unit: "", ref: "", date: "2024-11-26" }
      ],
      medications: [
        { name: "乙酰半胱氨酸颗粒", spec: "0.2g", usage: "每日3次 每次1包", purpose: "化痰" },
        { name: "雾化吸入治疗", spec: "按医嘱", usage: "每日2次", purpose: "气道湿化" }
      ],
      vitals: { bloodPressure: "132/72 mmHg", heartRate: "90次/分", temperature: "37.2℃", spo2: "95%" }
    };
  }

  return {};
}

function mergeContext(base, overrides) {
  return { ...base, ...overrides };
}

export function buildMockContext(patient) {
  const context = mergeContext(clone(baseRespiratoryContext), contextOverrides(patient));
  return {
    ...context,
    patient,
    records: [
      {
        id: patient.recordId || patient.id,
        date: patient.visitDate,
        body: `患者${patient.name}，${patient.sex}，${patient.age}岁，门诊号${patient.visitNo}，因${patient.tag}相关问题至${patient.department}就诊。`
      }
    ],
    diagnoses: [patient.tag || "待评估"],
    vitals: context.vitals || {}
  };
}
