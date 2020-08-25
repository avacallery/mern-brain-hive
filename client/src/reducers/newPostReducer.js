const INITIAL_STATE = {
  query: {
    author: '',
    skillLevel: '',
    cohort: '',
    title: '',
    categories: '',
    link: '',
    resourceType: '',
    publishedAt: Date,
    videoLength: Number,
    timeToComplete: Number,
  },
  submitted: false,
  // not submitting when we load the page
  errors: {},
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'UPDATE_FIELD':
      // monitor changes as user is making them
      return {
        ...state,
        query: { ...state.query, [payload.field]: payload.value },
      };
    case 'SUBMIT_POST':
      // tells system we are submitting
      return {
        ...state,
        submitted: true,
        // disable submit button by setting to true
        errors: {},
      };
    case 'FAILED_POST':
      return {
        ...state,
        // no longer submitting so loading set to false
        submitted: false,
        // give user the errors
        errors: payload,
      };
    case 'POST_SUCCESS':
      return {
        // we use spread operator so we don't overwrite state
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
};
