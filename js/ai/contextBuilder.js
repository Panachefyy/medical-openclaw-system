(function () {
  function limitArray(items, max = 20) {
    return Array.isArray(items) ? items.slice(0, max) : [];
  }

  function build(context) {
    const patient = context.patient || {};
    return {
      basicInfo: {
        patientId: patient.id,
        visitNo: patient.visitNo,
        name: patient.name,
        sex: patient.sex,
        age: patient.age,
        department: patient.department,
        doctor: patient.doctor,
        visitDate: patient.visitDate,
        allergy: patient.allergy,
        height: patient.height,
        weight: patient.weight,
        bmi: patient.bmi
      },
      diagnoses: limitArray(context.diagnoses),
      history: {
        hypertension: context.hypertensionHistory || []
      },
      labs: limitArray(context.lis),
      exams: {
        imaging: limitArray(context.imaging),
        ultrasound: limitArray(context.ultrasound)
      },
      trends: {
        lipids: context.lipids || {}
      },
      medications: limitArray(context.medications),
      dialog: limitArray(context.consultDialog, 40),
      vitals: context.vitals || {},
      records: limitArray(context.records, 10)
    };
  }

  window.PatientContextBuilder = {
    build
  };
})();
