import { types } from "../types/types";

const initialState = {
  projects: [],
  selectedProject: {},
};

export const projectReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case types.addProject:
      return {
        ...state,
      };
    case types.updateProject:
      return {
        ...state,
      };
    case types.deleteProject:
      return {
        ...state,
      };
    case types.projectsLoaded:
      return {
        ...state,
        projects: [...action.payload],
      };
    case types.selectedProject:
      return {
        ...state,
        selectedProject: action.payload,
      };

    default:
      return state;
  }
};
