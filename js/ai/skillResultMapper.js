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

  const realSkillNames = {
    patient_summary: "Medical Document Processor + medical",
    lab_interpretation: "medical-terms + medical-qa",
    medication_advice: "medical-advice",
    medical_record_generation: "Medical Document Processor + medical-note-assistant",
    consultation_extraction: "medical-entity-extractor",
    diagnosis_suggestion: "medsyniq-lite + medical-research-toolkit",
    general_consultation_chat: "medical-qa"
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

  function firstValue(...values) {
    return values.find((value) => value !== undefined && value !== null && value !== "");
  }

  function asArray(value) {
    if (Array.isArray(value)) return value;
    if (typeof value === "string" && value.trim()) return [value.trim()];
    return [];
  }

  function toCamelFallback(structured, camelKey, snakeKey) {
    return firstValue(structured[camelKey], structured[snakeKey]);
  }

  function normalize(skill, payload) {
    const result = payload?.result || payload?.structured || payload || {};
    const displayText = payload?.displayText || result.displayText || result.summary || result.text || "";
    const structured = result.structured || result;

    const mapped = {
      skill,
      skillName: payload?.skillName || realSkillNames[skill] || skill,
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
        chiefComplaint: toCamelFallback(structured, "chiefComplaint", "chief_complaint") || "待提取",
        presentIllness: toCamelFallback(structured, "presentIllness", "present_illness") || "",
        symptoms: asArray(structured.symptoms),
        medications: asArray(structured.medications),
        labValues: asArray(toCamelFallback(structured, "labValues", "lab_values")),
        diagnoses: asArray(structured.diagnoses),
        actionItems: asArray(toCamelFallback(structured, "actionItems", "action_items")),
        vitals: structured.vitals || structured.vitalSigns || structured.vital_signs || {},
        negativeSymptoms: asArray(toCamelFallback(structured, "negativeSymptoms", "negative_symptoms")),
        patientConcerns: asArray(toCamelFallback(structured, "patientConcerns", "patient_concerns"))
      };
    }

    if (skill === "lab_interpretation") {
      mapped.labInterpretation = {
        summary: structured.summary || displayText,
        abnormalItems: asArray(toCamelFallback(structured, "abnormalItems", "abnormal_items")),
        riskHints: asArray(toCamelFallback(structured, "riskHints", "risk_hints")),
        recommendations: asArray(structured.recommendations)
      };
    }

    if (skill === "medication_advice") {
      mapped.medicationAdvice = {
        summary: structured.summary || displayText,
        recommendations: asArray(structured.recommendations),
        cautions: asArray(structured.cautions || structured.warnings)
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
