const INITIAL_STATE = {
  post: {
    user: {},
    author: '',
    skillLevel: '',
    cohort: '',
    categories: [],
    link: '',
    resourceType: '',
    publishedAt: Date,
    videoLength: Number,
    timeToComplete: Number,
    comments: {},
    likes: [],
  },
  loading: true,
  errors: {},
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'UPDATE_POST':
    case 'SUBMIT_POST':
      return {
        ...state,
        post: payload,
        loading: false,
        errors: {},
      };
    case 'POST_FAILURE':
      return {
        ...state,
        post: null,
        loading: false,
        errors: {},
      };
    case 'POST_SUCCESS':
      return {
        ...state,
        ...payload,
        loading: false,
      };
  }
};
