import { Request, Response } from 'express';
import Message from '../models/MessagesModel';
import Conversation from '../models/ConversationModel';

interface AuthRequest extends Request {
    userId?: string;
  }
// send mess
export const sendMess = async (req: AuthRequest, res: Response) => {
    const userId = req.params.id;  // ID của người gửi
    const receiverId = req.params.receiverId;  // ID của người nhận
    const content = req.body.content;  // Nội dung tin nhắn
    const date = new Date().toISOString();  // Thời gian gửi tin nhắn

    try {
        // Tìm cuộc hội thoại đã tồn tại giữa hai người
        let conversation = await Conversation.findOne({
            participants: { $all: [userId, receiverId] }
        });

        // Nếu cuộc hội thoại không tồn tại, tạo mới
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

        // Lưu tin nhắn vào cơ sở dữ liệu
        await newMessage.save();

        // Trả về tin nhắn vừa gửi
        res.status(200).json(newMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message', error });
    }
};

// get mess
export const getMess = async (req: AuthRequest, res: Response) => {
    const userId = req.params.id; // ID của người gửi
    const receiverId = req.params.receiverId; // ID của người nhận

    try {
        // Tìm cuộc hội thoại giữa người gửi và người nhận
        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: receiverId },
                { sender: receiverId, receiver: userId }
            ]
        }).sort({ date: 1 }); // Sắp xếp tin nhắn theo thời gian gửi

        // Trả về danh sách tin nhắn
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
