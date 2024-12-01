import { Request, Response } from 'express';
import Message from '../models/MessagesModel';
import Conversation from '../models/ConversationModel';

interface AuthRequest extends Request {
    userId?: string;
  }
// send mess
export const sendMess = async (req: AuthRequest, res: Response) => {
    const userId = req.params.id;  
    const receiverId = req.params.receiverId;  
    const content = req.body.content;  
    const date = new Date().toISOString();  

    try {
        // check conversation or create new
        let conversation = await Conversation.findOne({
            participants: { $all: [userId, receiverId] }
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [userId, receiverId],
            });
            await conversation.save();
        }

        // Tạo tin nhắn mới
        const newMessage = new Message({
            conversationId: conversation._id,
            sender: userId,
            receiver: receiverId,
            content,
            date,
        });

        await newMessage.save();
        res.status(200).json(newMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message', error });
    }
};

// get mess
export const getMess = async (req: AuthRequest, res: Response) => {
    const userId = req.params.id; 
    const receiverId = req.params.receiverId; 

    try {
        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: receiverId },
                { sender: receiverId, receiver: userId }
            ]
        }).sort({ date: 1 }); 

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages', error });
    }
};

// create conversation
export const createConversation = async (req: Request, res: Response) => {
    const { participants } = req.body;
  
    try {
      const newConversation = new Conversation({
        participants,
      });
  
      await newConversation.save();
      res.status(200).json(newConversation);
    } catch (error) {
      res.status(500).json({ message: 'Error creating conversation', error });
    }
  };
