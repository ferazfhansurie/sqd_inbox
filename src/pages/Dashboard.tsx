import toast from 'react-hot-toast';
import { botpressClient } from '../services/botpress';
import { Conversation } from '@botpress/client';
import { ConversationDetails } from '../components/ConversationDetails';
import { ConversationList } from '../components/ConversationList';
import { useEffect, useState } from 'react';
import { User, getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore/lite';
import defaultAvatarImg from '../assets/jutaicon.png';
import '../style.css';
export interface ConversationWithMessagesAndUsers extends Conversation {
	// messages: Message[];
	// users: User[];
}

export const Dashboard = () => {
	const [selectedConversation, setSelectedConversation] =
		useState<Conversation>();

	const [conversations, setConversations] = useState<
		ConversationWithMessagesAndUsers[]
	>([]);
	  // Add the search query state
	  const [searchQuery, setSearchQuery] = useState<string>('');
	const auth = getAuth();
	const [user, setUser] = useState<User | null>(null);
	const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                // Sign-out successful.
            })
            .catch((error) => {
                // An error happened.
                console.error('Error signing out:', error);
            });
    };

	useEffect(() => {
        // Set up an auth state observer to track the user's authentication state
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        // Clean up the observer when the component unmounts
        return () => unsubscribe();
    }, [auth]);
	useEffect(() => {
    // Check if the user is signed in and if the user's email is a non-null string
    if (user && typeof user.email === 'string') {
        // Get a reference to the Firestore database
        const db = getFirestore();

        // Set the path to the document in Firestore using the user's email as the document ID
        const userDocRef = doc(db, 'users', user.email); // 'users' is the name of the collection, and 'user.email' is the document ID

        // Fetch the data from Firestore
        getDoc(userDocRef)
            .then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    // Data exists for this user
                    const userData = docSnapshot.data();
                    console.log('User Data:', userData);
                    // You can now use the data retrieved from Firestore in your application
                } else {
                    console.log('User data does not exist');
                }
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    }
}, [user]);
useEffect(() => {
	(async () => {
	  try {
		const allConversations: ConversationWithMessagesAndUsers[] = [];
		let nextTokenConversations: string | undefined;
  
		do {
		  // Adding a check for botpressClient to handle the 'null' possibility
		  const listConversations =
			botpressClient &&
			(await botpressClient.listConversations({
			  nextToken: nextTokenConversations,
			}));
  
		  if (!listConversations) {
			// Handle the case when botpressClient is null
			return;
		  }
  
		  const conversationsWithData: ConversationWithMessagesAndUsers[] = [];
  
		  listConversations.conversations.forEach(async (conversation) => {
			conversationsWithData.push({
			  ...conversation,
			});
		  });
  
		  allConversations.push(...conversationsWithData);
		  nextTokenConversations = listConversations.meta.nextToken;
		} while (nextTokenConversations);
  
		const filteredConversations = allConversations.filter((conversation) =>
		conversation.tags?.['whatsapp:userPhone']?.includes(searchQuery)
	  );

	  setConversations(filteredConversations);
	} catch (error: any) {
	  console.log(error);
	  console.log(error.response?.data || error);

	  toast.error("Couldn't load older conversations");
	}
  })();
}, [searchQuery]);

return (
  <div className="dashboard-container">
     
    <div className="search-container">
    <img
					src={defaultAvatarImg}
					alt="Default avatar"
					className="h-12"
				/>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by User Phone..."
        className="search-input"
      />
    </div>

    <div className="conversation-container">
      <div className="conversation-list">
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversation?.id}
          onSelectConversation={(conversation: Conversation) =>
            setSelectedConversation(conversation)
          }
        />
      </div>

      <div className="conversation-details">
        {selectedConversation ? (
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
          <div className="bg-gray-100 p-5 text-lg font-medium rounded-xl my-auto">
            Select a conversation
          </div>
        )}
      </div>
    </div>

    {user && <p className="text-center mt-4">User ID: {user.email}</p>}

    <button onClick={handleSignOut} className="sign-out-button">
      Sign Out
    </button>
  </div>
);
};