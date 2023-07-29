import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultAvatarImg from '../assets/jutaicon.png';

export interface ILoginPageProps {}

const LoginPage: React.FunctionComponent<ILoginPageProps> = (props) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [authing, setAuthing] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const signInWithEmailPassword = async () => {
    setAuthing(true);
    setError(null);

    signInWithEmailAndPassword(auth, email, password)
      .then((response) => {
        console.log(response.user.uid);
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
        setError('Failed to sign in. Please check your email and password.');
        setAuthing(false);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
       <img
					src={defaultAvatarImg}
					alt="Default avatar"
					className="h-12"
				/>
      <h1 className="text-3xl font-bold mb-8">Bot Inbox</h1>
      <div className="mb-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded p-2 w-64"
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded p-2 w-64"
        />
      </div>
      <button
        onClick={() => signInWithEmailPassword()}
        disabled={authing}
        className="bg-black text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Sign in
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default LoginPage;