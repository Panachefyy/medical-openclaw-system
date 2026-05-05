export const statusTabs = [
  { key: "waiting", label: "待诊", count: 8 },
  { key: "active", label: "接诊中", count: 2 },
  { key: "done", label: "已完成", count: 15 }
];

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
    recordId: "record-8979"
  },
  {
    id: "p001",
    status: "waiting",
    name: "张三",
    sex: "男",
    age: 65,
    visitNo: "0000123456",
    medicalCard: "110********1234",
    phone: "138****5678",
    time: "09:45",
    tag: "高血压",
    allergy: "青霉素过敏",
    height: "175cm",
    weight: "78kg",
    bmi: "25.5（超重）",
    department: "心血管内科",
    doctor: "张医生",
    visitDate: "2024-05-20 09:45",
    waitEstimate: "约25分钟"
  },
  { id: "p002", status: "active", name: "李四", sex: "女", age: 58, visitNo: "0000123457", time: "09:50", tag: "糖尿病", department: "内分泌科", doctor: "张医生", visitDate: "2024-05-20 09:50" },
  { id: "p003", status: "done", name: "王五", sex: "男", age: 72, visitNo: "0000123458", time: "08:30", tag: "冠心病", department: "心血管内科", doctor: "张医生", visitDate: "2024-05-20 08:30" }
];

export function buildMockContext(patient) {
  return {
    patient,
    hypertensionHistory: [
      ["入院诊断", patient.tag || "待评估"],
      ["病程", "慢性病长期随访"],
      ["当前状态", "需结合病历、检验、检查综合评估"],
      ["过敏史", patient.allergy || "无"]
    ],
    imaging: [
      { date: "2024-11-26", name: "胸部CT", status: "待解读", desc: "请由 OpenClaw 结合病历和检查报告解读。" }
    ],
    ultrasound: [
      { date: "2024-11-26", name: "心脏超声", status: "待解读", desc: "报告待回传。" }
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
      { item: "C反应蛋白", result: "18.2", trend: "up", unit: "mg/L", ref: "< 8", date: "2024-11-26" },
      { item: "低密度脂蛋白（LDL-C）", result: "2.39", trend: "", unit: "mmol/L", ref: "< 3.37", date: "2024-11-26" }
    ],
    medications: [
      { name: "布地奈德福莫特罗吸入剂", spec: "160/4.5μg", usage: "每日2次 每次1吸", purpose: "平喘" },
      { name: "氨溴索片", spec: "30mg", usage: "每日3次 每次1片", purpose: "化痰" }
    ],
    dialog: [
      { role: "doctor", time: "09:31:12", text: "您好，请问今天主要哪里不舒服？" },
      { role: "patient", time: "09:31:18", text: "最近咳嗽咳痰明显，活动后气喘加重。" }
    ],
    records: [
      {
        id: patient.recordId || patient.id,
        date: patient.visitDate,
        body: `患者${patient.name}，${patient.sex}，${patient.age}岁，住院号${patient.visitNo}，因${patient.tag}相关问题就诊。`
      }
    ],
    diagnoses: [patient.tag || "待评估"],
    vitals: {}
  };
}
