(function () {
  const initialState = {
    patients: [],
    statusTabs: [],
    patientContext: null,
    skillResults: {},
    dataLoading: false,
    contextLoading: false,
    skillLoading: {},
    dataError: "",
    contextError: ""
  };

  const state = { ...initialState };
  const listeners = new Set();

  function getState() {
    return state;
  }

  function setState(patch) {
    Object.assign(state, patch);
    listeners.forEach((listener) => listener(state));
  }

  function setSkillLoading(skill, loading) {
    state.skillLoading = { ...state.skillLoading, [skill]: loading };
    listeners.forEach((listener) => listener(state));
  }

  function setSkillResult(skill, result) {
    state.skillResults = {
      ...state.skillResults,
      [skill]: {
        ...result,
        updatedAt: new Date().toISOString()
      }
    };
    listeners.forEach((listener) => listener(state));
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  window.AppStore = {
    getState,
    setState,
    setSkillLoading,
    setSkillResult,
    subscribe
  };
})();
