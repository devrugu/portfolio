import mongoose, { Schema, models, Model } from 'mongoose';

export interface IPhoneViewer {
    firstName: string;
    lastName: string;
    phone: string;
    ip?: string;
    country?: string;
    viewedAt: Date;
}

const PhoneViewerSchema = new Schema<IPhoneViewer>(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        ip: { type: String },
        country: { type: String },
        viewedAt: { type: Date, default: Date.now },
    },
    { timestamps: false }
);

const PhoneViewerModel =
    (models.PhoneViewer as Model<IPhoneViewer>) ||
    mongoose.model<IPhoneViewer>('PhoneViewer', PhoneViewerSchema);

export default PhoneViewerModel;