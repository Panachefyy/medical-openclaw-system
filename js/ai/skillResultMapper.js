(function () {
  const actionToSkill = {
    summary: "patient_summary",
    labs: "lab_interpretation",
    medication: "medication_advice",
    record: "medical_record_generation",
    extraction: "consultation_extraction",
    diagnosis: "diagnosis_suggestion",
    chat: "general_consultation_chat"
  };

  function toSummaryCard(result) {
    const structured = result.structured || result;
    return {
      overview: structured.overview || structured.summary || result.displayText || "",
      features: structured.keyFindings || structured.features || [],
      important:
        structured.important ||
        [
          structured.riskLevel ? { label: "风险等级", value: structured.riskLevel, level: "danger" } : null,
          structured.allergy ? { label: "过敏史", value: structured.allergy, level: "danger" } : null,
          structured.currentCondition ? { label: "目前病情", value: structured.currentCondition } : null
        ].filter(Boolean),
      medications: structured.medicationGroups || [
        { label: "当前用药", count: Array.isArray(structured.medications) ? structured.medications.length : 0 }
      ],
      suggestions: structured.recommendations || []
    };
  }

  function normalize(skill, payload) {
    const result = payload?.result || payload?.structured || payload || {};
    const displayText = payload?.displayText || result.displayText || result.summary || result.text || "";
    const structured = result.structured || result;

    const mapped = {
      skill,
      displayText,
      structured,
      warnings: payload?.warnings || result.warnings || [],
      confidence: payload?.confidence || result.confidence || null,
      raw: payload
    };

    if (skill === "patient_summary") {
      mapped.summaryCard = toSummaryCard({ ...result, displayText, structured });
    }

    if (skill === "consultation_extraction") {
      mapped.extraction = {
        chiefComplaint: structured.chiefComplaint || "待提取",
        presentIllness: structured.presentIllness || "",
        vitals: structured.vitals || {},
        negativeSymptoms: structured.negativeSymptoms || [],
        patientConcerns: structured.patientConcerns || []
      };
    }

    if (skill === "diagnosis_suggestion") {
      mapped.diagnosis = {
        assessment: structured.assessment || displayText,
        differential: structured.differential || structured.diagnosisSuggestions || [],
        nextSteps: structured.nextSteps || structured.recommendations || []
      };
    }

    if (skill === "medical_record_generation") {
      mapped.recordDraft = structured.recordDraft || displayText;
    }

    return mapped;
  }

  window.SkillResultMapper = {
    actionToSkill,
    normalize
  };
})();
