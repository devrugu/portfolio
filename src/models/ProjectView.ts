import mongoose, { Schema, models, Model } from 'mongoose';

export interface IProjectView {
    slug: string;
    views: number;
}

const ProjectViewSchema = new Schema<IProjectView>({
    slug: { type: String, required: true, unique: true },
    views: { type: Number, default: 0 },
}, { timestamps: true });

const ProjectViewModel =
    (models.ProjectView as Model<IProjectView>) ||
    mongoose.model<IProjectView>('ProjectView', ProjectViewSchema);

export default ProjectViewModel;