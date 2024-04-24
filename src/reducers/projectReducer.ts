import { types } from "../types/types";

const initialState = {
  projects: [],
  selectedProject: {}
};

export const projectReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case types.addProject:
      return {
        ...state
      };
    case types.updateProject:
      return {
        ...state,
        selectedProject: action.payload
      };
    case types.deleteProject:
      return {
        ...state
      };
    case types.projectsLoaded:
      return {
        ...state,
        projects: [...action.payload]
      };
    case types.loadSelectedProject:
      return {
        ...state,
        selectedProject: action.payload
      };
    case types.editItemList:
      return {
        ...state,
        selectedProject: {
          ...state.selectedProject,
          itemsList: [...action.payload]
        }
      };

    default:
      return state;
  }
};
