
import { botpressClient } from '../services/botpress';
import { Conversation, } from '@botpress/client';
import { ConversationDetails } from '../components/ConversationDetails';
import { ConversationList } from '../components/ConversationList';
import { useEffect, useState } from 'react';
import { User as BotpressUser } from '@botpress/client/dist/gen';
import '../style.css';

export interface ConversationWithMessagesAndUsers extends Conversation {
	// messages: Message[];
	// users: User[];
}

export const Bot = () => {
	const [selectedConversation, setSelectedConversation] =
		useState<Conversation>();

	const [conversations, setConversations] = useState<
		ConversationWithMessagesAndUsers[]
	>([]);
	  // Add the search query state
    const [pageNumber, setPageNumber] = useState(1);
	  const [searchQuery, setSearchQuery] = useState<string>('');
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [users, setUsers] = useState<BotpressUser[]>([]);

    const [isLoadingConversations, setIsLoadingConversations] = useState(true);

  useEffect(() => {
    fetchData();
  }, [searchQuery, pageNumber]);

  async function fetchData() {
    try {
      setIsLoadingConversations(true);
      setIsLoadingMessages(true);

      const allConversations: Conversation[] = [];
      let nextTokenConversations: string | undefined;

      do {
        const listConversations =
          botpressClient &&
          (await botpressClient.listConversations({
            nextToken: nextTokenConversations,
          }));

        if (!listConversations) {
          return;
        }

        allConversations.push(...listConversations.conversations);
        nextTokenConversations = listConversations.meta.nextToken;
      } while (nextTokenConversations);

      const filteredConversations = allConversations.filter((conversation) =>
        conversation.tags?.['whatsapp:userPhone']?.includes(searchQuery)
      );

      const conversationsPerPage = 10;
      const startIndex = (pageNumber - 1) * conversationsPerPage;
      const endIndex = startIndex + conversationsPerPage;

      const paginatedConversations = filteredConversations.slice(
        startIndex,
        endIndex
      );
  
      const usersPromises = paginatedConversations.map(async (conversation) => {
        try {
          const getUsers = await botpressClient.listUsers({
            conversationId: conversation.id,
          });

          const usersWithData = getUsers.users.map((user) => ({
            ...user,
            conversationId: conversation.id, // Include conversation ID for reference
          }));

          return usersWithData;
        } catch (error: any) {
          return [];
        }
      });

      const usersResults = await Promise.all(usersPromises);
      const allUsers = usersResults.flat();

      setConversations(paginatedConversations);
      
      setUsers(allUsers);
   
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoadingConversations(false);
      setIsLoadingMessages(false);
    }
  }

return (
  <div className="dashboard-container">
  
  


  
     

    

    <div className="conversation-container">
    
      <div className="conversation-list">
        <div className="search-container">
     
        <input
       type="text"
       value={searchQuery}
       onChange={(e) => setSearchQuery(e.target.value)}
       placeholder="Search ..."
       className="search-input"
        />
          </div>
        {isLoadingConversations ? (
              <div className="flex justify-center  min-h-screen">
              <div className="loading-spinner"> 
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 width="50px"
                 height="50px"
                 viewBox="0 0 100 100"
                 preserveAspectRatio="xMidYMid"
               >
                 <circle cx="50" cy="50" fill="none" stroke="#00FF15" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138">
                   <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0 50 50;360 50 50"></animateTransform>
                 </circle>
               </svg>
             </div>
             </div>
        ) : (
          <ConversationList
            conversations={conversations}
            users={users}
            selectedConversationId={selectedConversation?.id}
            onSelectConversation={(conversation: Conversation) =>
              setSelectedConversation(conversation)
            }
          />
        )}
       <div className="pagination-container flex items-center justify-center mt-5">
  <button
    className="bg-custom-green text-white rounded-full px-4 py-2 mr-2"
    onClick={() => setPageNumber((prevPage) => prevPage - 1)}
    disabled={pageNumber === 1}
  >
    Previous Page
  </button>
  <span className="text-lg font-semibold">Page {pageNumber}</span>
  <button
    className="bg-custom-green text-white rounded-full px-4 py-2 ml-2"
    onClick={() => setPageNumber((prevPage) => prevPage + 1)}
    disabled={conversations.length < 10}
  >
    Next Page
  </button>
</div>
          </div>

          <div className="conversation-details">
        {isLoadingMessages ? (
            <div className="flex justify-center  min-h-screen">
           <div className="loading-spinner"> 
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50px"
              height="50px"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid"
            >
              <circle cx="50" cy="50" fill="none" stroke="#00FF15" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138">
                <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0 50 50;360 50 50"></animateTransform>
              </circle>
            </svg>
          </div>
          </div>
          
          
        ) : selectedConversation ? (
          <ConversationDetails
            conversation={selectedConversation}
            onDeleteConversation={(conversationId: string) => {
              setSelectedConversation(undefined);
              setConversations(
                conversations.filter(
                  (conversation) => conversation.id !== conversationId
                )
              );
            }}
          />
        ) : (
          <div className="flex justify-center  min-h-screen">
          <div className="bg-black-100 p-5 text-lg font-medium rounded-xl mt-10 mb-100"> {/* Added mt-10 and mb-10 */}
            Select a conversation
          </div>
        </div>
          )}
          </div>
          </div>

  


          
    </div>
);
};