const INITIAL_STATE = {
  list: [],
  loading: true, //why do we use bool?
  errors: {},
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  console.log('postsReducer', type);
  switch (type) {
    case 'FETCHING_POSTS':
      return {
        ...state,
        loading: true,
        errors: {},
      };
    case 'FETCH_POSTS':
      return {
        ...state,
        list: [...list, ...payload],
        loading: false,
      };
    case 'POSTS_FAILED':
      return {
        ...state,
        loading: false,
        errors: payload,
      };
    default:
      return state;
  }
};
