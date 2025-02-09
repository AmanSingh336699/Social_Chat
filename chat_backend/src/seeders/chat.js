import { faker, simpleFaker } from "@faker-js/faker";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

const createSingleChats = async () => {
  try {
    const users = await User.find().select("_id");
    const chats = [];

    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        chats.push({
          name: faker.lorem.words(2),
          members: [users[i]._id, users[j]._id],
        });
      }
    }

    await Chat.insertMany(chats);
    console.log("Single chats created successfully");
  } catch (error) {
    console.error("Error creating single chats:", error.message);
  }
};

const createGroupChats = async (numChats) => {
  try {
    const users = await User.find().select("_id");
    const chats = [];

    for (let i = 0; i < numChats; i++) {
      const numMembers = simpleFaker.number.int({ min: 3, max: users.length });
      const membersSet = new Set();

      while (membersSet.size < numMembers) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        membersSet.add(randomUser._id);
      }

      chats.push({
        groupChat: true,
        name: faker.lorem.words(1),
        members: [...membersSet],
        creator: [...membersSet][0],
      });
    }

    await Chat.insertMany(chats);
    console.log("Group chats created successfully");
  } catch (error) {
    console.error("Error creating group chats:", error.message);
  }
};

const createMessages = async (numMessages) => {
  try {
    const users = await User.find().select("_id");
    const chats = await Chat.find().select("_id");
    const messages = [];

    for (let i = 0; i < numMessages; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomChat = chats[Math.floor(Math.random() * chats.length)];

      messages.push({
        chat: randomChat._id,
        sender: randomUser._id,
        content: faker.lorem.sentence(),
      });
    }

    await Message.insertMany(messages);
    console.log("Messages created successfully");
  } catch (error) {
    console.error("Error creating messages:", error.message);
  }
};

const createMessagesInAChat = async (chatId, numMessages) => {
  try {
    const chatExists = await Chat.findById(chatId);
    if (!chatExists) {
      console.error("Chat not found, cannot create messages.");
      return;
    }

    const users = await User.find().select("_id");
    const messages = [];

    for (let i = 0; i < numMessages; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      messages.push({
        chat: chatId,
        sender: randomUser._id,
        content: faker.lorem.sentence(),
      });
    }

    await Message.insertMany(messages);
    console.log(`Messages created successfully in chat: ${chatId}`);
  } catch (error) {
    console.error("Error creating messages in chat:", error.message);
  }
};

export {
  createSingleChats,
  createGroupChats,
  createMessages,
  createMessagesInAChat,
};