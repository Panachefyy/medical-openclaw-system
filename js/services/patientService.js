(function () {
  function countTabs(patients) {
    const base = window.MedicalMock.statusTabs;
    return base.map((tab) => ({
      ...tab,
      count: patients.filter((patient) => patient.status === tab.key).length || tab.count
    }));
  }

  function normalizePatient(raw) {
    return {
      id: raw.id || raw.patientId || raw.visitId || raw.visitNo,
      status: raw.status || "waiting",
      name: raw.name || raw.patientName || "--",
      sex: raw.sex || raw.gender || "--",
      age: raw.age || "--",
      visitNo: raw.visitNo || raw.visitId || raw.encounterNo || "--",
      medicalCard: raw.medicalCard || raw.cardNo || raw.insuranceNo || "--",
      phone: raw.phone || raw.mobile || "--",
      time: raw.time || raw.visitTime || "--",
      tag: raw.tag || raw.diseaseTag || raw.primaryDiagnosis || "待评估",
      allergy: raw.allergy || raw.allergiesText || "无",
      height: raw.height || "--",
      weight: raw.weight || "--",
      bmi: raw.bmi || "--",
      department: raw.department || raw.deptName || "--",
      doctor: raw.doctor || raw.doctorName || "--",
      visitDate: raw.visitDate || raw.visitAt || raw.visitTime || "--",
      waitEstimate: raw.waitEstimate || raw.estimatedWait || "--",
      consultStartedAt: raw.consultStartedAt,
      summary: raw.summary || null
    };
  }

  function normalizeContext(raw, patient) {
    const mock = window.MedicalMock;
    return {
      patient,
      hypertensionHistory: raw.hypertensionHistory || raw.history?.hypertension || mock.hypertensionHistory,
      imaging: raw.imaging || raw.exams?.imaging || mock.imaging,
      ultrasound: raw.ultrasound || raw.exams?.ultrasound || mock.ultrasound,
      lipids: raw.lipids || raw.trends?.lipids || mock.lipids,
      lis: raw.lis || raw.labs || mock.lis,
      medications: raw.medications || mock.medications,
      consultDialog: raw.consultDialog || raw.dialog || mock.consultDialog,
      diagnoses: raw.diagnoses || [],
      vitals: raw.vitals || {},
      records: raw.records || []
    };
  }

  function mockContext(patient) {
    return normalizeContext({}, patient);
  }

  async function fetchTodayVisits(status) {
    const config = window.AppConfig.getConfig();
    if (!config.apiBaseUrl) {
      const patients = window.MedicalMock.patients.map(normalizePatient);
      return { patients, statusTabs: countTabs(patients), source: "mock" };
    }

    const payload = await window.HttpClient.request(config.patientEndpoints.todayVisits, {
      query: { status }
    });
    const rows = Array.isArray(payload) ? payload : payload?.patients || payload?.data || [];
    const patients = rows.map(normalizePatient);
    return {
      patients,
      statusTabs: payload?.statusTabs || countTabs(patients),
      source: "api"
    };
  }

  async function fetchVisitContext(patient) {
    const config = window.AppConfig.getConfig();
    if (!config.apiBaseUrl) return mockContext(patient);

    const path = config.patientEndpoints.visitContext.replace("{visitId}", encodeURIComponent(patient.visitNo));
    const payload = await window.HttpClient.request(path, {
      query: { patientId: patient.id }
    });
    return normalizeContext(payload || {}, patient);
  }

  window.PatientService = {
    fetchTodayVisits,
    fetchVisitContext,
    mockContext,
    normalizePatient,
    normalizeContext
  };
})();
