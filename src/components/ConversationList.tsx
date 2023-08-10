import { Conversation, User, } from '@botpress/client';
import { ConversationItem } from './ConversationItem';
import { ConversationWithMessagesAndUsers } from '../pages/Dashboard';

interface ConversationListProps {
	conversations: ConversationWithMessagesAndUsers[];
	selectedConversationId?: string;
	onSelectConversation: (conversation: Conversation) => void;
	className?: string;
	users:User[]
	// loadOlderConversations?: () => void;
}

export const ConversationList = ({
	conversations,
	selectedConversationId,
	onSelectConversation,
	className,
	users
  }: ConversationListProps) => {
	return (
		<div className={`flex flex-col ${className}`}>
		  <div className="overflow-y-auto flex w-full flex-col divide-y-2">
			{conversations
			  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
			  .map((conversation) => {
				
		
				let userName = ""
					for (const user of users) {
					  const userId = user.tags?.['whatsapp:userId'];
					 
				  
					  if (conversation.tags?.['whatsapp:userPhone'] === userId) {
						
						 userName = user.tags?.['whatsapp:name'] ?? '';
						// You can update the conversation or perform any other action here
						// For example:
						// conversation.tags?.['whatsapp:matchedUserName'] = userName;
						
						break; // Assuming a user can only match once, you can remove this if not
					  }
					  userName = conversation.tags?.['whatsapp:userPhone'] ?? '';
					}
			
	
				return (
				  <button
					className="w-full"
					onClick={() => onSelectConversation(conversation)}
					key={conversation.id}
				  >
					<ConversationItem
					  conversation={conversation}
					  userName={userName}
					  isSelected={conversation.id === selectedConversationId}
					/>
				  </button>
				);
			  })}
		  </div>
		</div>
	  );
	};
