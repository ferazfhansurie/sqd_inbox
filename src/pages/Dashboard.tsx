import toast from 'react-hot-toast';
import { botpressClient } from '../services/botpress';
import { Conversation } from '@botpress/client';
import { ConversationDetails } from '../components/ConversationDetails';
import { ConversationList } from '../components/ConversationList';
import { useEffect, useState } from 'react';
import { User, getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore/lite';

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
  
		setConversations(allConversations);
	  } catch (error: any) {
		console.log(error);
		console.log(error.response?.data || error);
  
		toast.error("Couldn't load older conversations");
	  }
	})();
  }, []);

	return (
		<div className="flex h-screen">
			<div className="rounded-lg mx-auto max-w-7xl border-2 shadow-2xl flex w-full my-24 divide-x-4">
				<ConversationList
					conversations={conversations}
					className="w-1/4"
					selectedConversationId={selectedConversation?.id}
					onSelectConversation={(conversation: Conversation) =>
						setSelectedConversation(conversation)
					}
					// loadOlderConversations={
					// 	nextToken ? loadOlderConversations : undefined
					// }
				/>

				<div className="w-3/4 flex">
					{selectedConversation ? (
						<ConversationDetails
							conversation={selectedConversation}
							className="divide-x-4 w-full"
							onDeleteConversation={(conversationId: string) => {
								setSelectedConversation(undefined);
								setConversations(
									conversations.filter(
										(conversation) =>
											conversation.id !== conversationId
									)
								);
							}}
						/>
					) : (
						<div className="bg-gray-100 p-5 text-lg font-medium rounded-xl my-auto mx-auto">
							Select a conversation
						</div>
					)}
				</div>
			</div>
			{user && <p>User ID: {user.email}</p>}
			<button onClick={handleSignOut}>Sign Out</button>
		</div>
	);
};
