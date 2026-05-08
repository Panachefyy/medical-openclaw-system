(function () {
  function countStatusTabs(baseTabs, patients) {
    return (baseTabs || []).map((tab) => ({
      ...tab,
      count: (patients || []).filter((patient) => patient.status === tab.key).length
    }));
  }

  function filterPatients(patients, { status, search }) {
    const keyword = String(search || "").trim().toLowerCase();
    return (patients || []).filter((patient) => {
      const inStatus = patient.status === status;
      if (!keyword) return inStatus;
      return (
        inStatus &&
        [patient.name, patient.visitNo, patient.medicalCard, patient.phone].some((value) =>
          String(value || "").toLowerCase().includes(keyword)
        )
      );
    });
  }

  window.PatientStats = {
    countStatusTabs,
    filterPatients
  };
})();
