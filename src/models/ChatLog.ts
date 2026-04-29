import mongoose, { Schema, models, Model } from 'mongoose';

export interface IChatLog {
    messages: { role: string; content: string }[];
    model: string;
    ipAddress?: string;
    createdAt: Date;
}

const ChatLogSchema = new Schema<IChatLog>({
    messages: { type: [{ role: String, content: String }], required: true },
    model: { type: String, required: true },
    ipAddress: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const ChatLogModel =
    (models.ChatLog as Model<IChatLog>) ||
    mongoose.model<IChatLog>('ChatLog', ChatLogSchema);

export default ChatLogModel;