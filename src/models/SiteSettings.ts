import mongoose, { Schema, models, Model } from 'mongoose';

export interface ISiteSettings {
    key: string;
    value: any;
}

const SiteSettingsSchema = new Schema<ISiteSettings>({
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
}, { timestamps: true });

const SiteSettingsModel =
    (models.SiteSettings as Model<ISiteSettings>) ||
    mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

export default SiteSettingsModel;