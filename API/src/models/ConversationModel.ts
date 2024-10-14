import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
    participants: mongoose.Types.ObjectId[];
}

const ConversationSchema: Schema = new Schema({
    participants: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User', 
            required: true,
        },
    ],
}); 

const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
export default Conversation;
