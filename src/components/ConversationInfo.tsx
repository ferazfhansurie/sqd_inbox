import { Conversation, User } from '@botpress/client';
import { format } from 'date-fns';
import { UserItem } from './UserItem';

interface ConversationInfoProps {
	conversation: Conversation;
	users: User[];
	onDeleteConversation: (conversationId: string) => void;
	// onUpdateConversation: (
	// 	conversationId: string,
	// 	data: {
	// 		name?: string;
	// 		phone?: string;
	// 	}
	// ) => void;
	className?: string;
}

export interface UserForm {
	name: string;
	phone: string;
	about: string | null;
}

export const ConversationInfo = ({
	conversation,
	users,
	onDeleteConversation,
	className,
}: ConversationInfoProps) => {
	 return (
		<div className={`flex gap-8 p-4 ${className}`}>

	
	  
		<div>
		  {users.length > 0 ? (
			<div className="flex flex-wrap gap-2">
			<UserItem key={users[1].id} user={users[1]} />
			</div>
		  ) : (
			<div className="text-gray-600">No user info</div>
		  )}
		</div>
	  
	
	  
		<div className="flex gap-1">
  <p className="flex items-center gap-1">
    <span>📅</span>
    <span className="font-medium">
      Started at {format(new Date(conversation.createdAt), 'dd/MM/yyyy HH:mm')}
    </span>
  </p>
  <p className="flex items-center gap-1">
    <span>📝</span>
    <span className="font-medium">
      Updated at {format(new Date(conversation.updatedAt), 'dd/MM/yyyy HH:mm')}
    </span>
  </p>
</div>
	  
		<button
		  className="bg-red-500 text-white rounded-xl p-2 "
		  type="button"
		  onClick={() => onDeleteConversation(conversation.id)}
		>
		  Delete
		</button>
	  </div>
  );
};