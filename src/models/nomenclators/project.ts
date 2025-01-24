import { Schema, model, models, Model } from "mongoose";

export interface IProjectNomenclator {
  projectNumber: string;
  projectName: string;
}

const ProjectNomenclatorSchema = new Schema<IProjectNomenclator, Model<IProjectNomenclator>>({
  projectNumber: {
    type: String,
    required: true,
    unique: true
  },
  projectName: {
    type: String,
    required: true,
    unique: true
  }
});

const ProjectNomenclator =
  models.ProjectNomenclator || model("ProjectNomenclator", ProjectNomenclatorSchema);
export default ProjectNomenclator;
