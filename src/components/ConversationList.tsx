import { Conversation, } from '@botpress/client';
import { ConversationItem } from './ConversationItem';
import { ConversationWithMessagesAndUsers } from '../pages/Dashboard';

interface ConversationListProps {
	conversations: ConversationWithMessagesAndUsers[];
	selectedConversationId?: string;
	onSelectConversation: (conversation: Conversation) => void;
	className?: string;
	// loadOlderConversations?: () => void;
}

export const ConversationList = ({
	conversations,
	selectedConversationId,
	onSelectConversation,
	className,
  }: ConversationListProps) => {
	return (
		<div className={`flex flex-col ${className}`}>
		  <div className="overflow-y-auto flex w-full flex-col divide-y-2">
			{conversations
			  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
			  .map((conversation) => {
				const userName = conversation.tags?.['whatsapp:userPhone'] ?? '';
	
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
