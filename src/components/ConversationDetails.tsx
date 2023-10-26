import toast from 'react-hot-toast';
import { botpressClient } from '../services/botpress';
import { Conversation, Message } from '@botpress/client';
import { ConversationInfo } from './ConversationInfo';
import { isDefinedAndHasItems } from '../utils';
import { MessageList } from './MessageList';
import { useEffect, useState } from 'react';
import { User } from '@botpress/client/dist/gen';


interface ConversationDetailsProps {
	conversation: Conversation;
	onDeleteConversation: (conversationId: string) => void;
	className?: string;
}

export const ConversationDetails = ({
	conversation,
	onDeleteConversation,
	className,
  }: ConversationDetailsProps) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoadingMessages, setIsLoadingMessages] = useState(true);
	const [nextToken, setNextToken] = useState<string>();
  
	const [users, setUsers] = useState<User[]>([]);
	const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  
	async function loadOlderMessages() {
	  try {
		if (!nextToken) {
		  return;
		}
  
		const getMessages = await botpressClient.listMessages({
		  conversationId: conversation.id,
		  nextToken,
		});
  
		setMessages((prevMessages) => [...getMessages.messages, ...prevMessages]);
		setNextToken(getMessages.meta.nextToken || undefined);
	  } catch (error: any) {
		console.log(error.response?.data || error);
  
		toast.error("Couldn't load older messages");
	  }
	}
  
	async function handleDeleteConversation(conversationId: string) {
	  if (confirm('Are you sure you want to delete this conversation?')) {
		try {
		  const deleteConversation = await botpressClient.deleteConversation({
			id: conversationId,
		  });
  
		  if (deleteConversation) {
			toast.success('This conversation was deleted successfully!');
			onDeleteConversation(conversationId);
		  }
		} catch (error: any) {
		  console.log(error.response.data);
		  toast.error("Couldn't delete this conversation");
		}
	  }
	}
  
	useEffect(() => {
	  setMessages([]); // reset messages
	  setUsers([]); // reset users
  
	  (async () => {
		setIsLoadingMessages(true);
  
		try {
		  const getMessages = await botpressClient.listMessages({
			conversationId: conversation.id,
		  });
  
		  setMessages(getMessages.messages);
		  setNextToken(getMessages.meta.nextToken || undefined);
		} catch (error: any) {
		  console.log(error.response.data);
		  toast.error("Couldn't load messages");
		}
  
		setIsLoadingMessages(false);
	  })();
	}, [conversation]);
  
	useEffect(() => {
	  isDefinedAndHasItems(messages) &&
		(async () => {
		  setIsLoadingUsers(true);
  
		  try {
			const userIds = messages.reduce(
			  (acc: string[], message: Message) => {
				if (message.userId && !acc.includes(message.userId)) {
				  acc.push(message.userId);
				}
  
				return acc;
			  },
			  []
			);
  
			const usersData = await Promise.all(
			  userIds.map(async (userId) => {
				try {
				  const showUserRequest = await botpressClient.getUser({
					id: userId,
				  });
  
				  if (showUserRequest && showUserRequest.user) {
					return showUserRequest.user;
				  } else {
					throw new Error('Could not get user');
				  }
				} catch (error: any) {
				  console.log(error.response?.data || error);
				  toast.error(`Couldn't load user info for ${userId}`);
				  return null;
				}
			  })
			);
  
			setUsers(usersData.filter((user) => user !== null) as User[]);
		  } catch (error) {
			console.log(error);
			toast.error("Couldn't load users' details");
		  }
  
		  setIsLoadingUsers(false);
		})();
	}, [messages]);
  
	return (
		<div className="flex flex-col w-full h-full">
		{isLoadingUsers ? (
			<div className="self-center bg-gray-100 p-5 text-lg font-medium rounded-xl my-auto">
			  Loading users' details...
			</div>
		  ) : (
			<ConversationInfo
			  conversation={conversation}
			  users={users}
			  onDeleteConversation={handleDeleteConversation}
			  className="flex-shrink-0"
			/>
		  )}
	  
		<hr className="border-t my-4 w-full border-black-300" />
	  
		<div className={`flex ${className} h-full overflow-hidden`}>
		  <div className="flex flex-col w-full overflow-hidden">
			{/* Rest of your code... */}
			{isLoadingMessages ? (
			  <div className="self-center bg-black-100 p-5 text-lg font-medium rounded-xl my-auto">
				Loading messages...
			  </div>
			) : (
			  <MessageList
				messages={messages}
				conversationId={conversation.id}
				loadOlderMessages={nextToken ? loadOlderMessages : undefined}
			  />
			)}
		  </div>
		</div>
	  </div>
	  );
	};