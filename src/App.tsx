import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';
import './styles/tailwind-input.css';
import { initializeApp } from 'firebase/app';
import { config } from './config/config';
import AuthRoute from './components/AuthRoute';
import LoginPage from './pages/Login';
import { Bot } from './pages/Bot';

initializeApp(config.firebaseConfig);

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={  <AuthRoute>
                            <Bot />
                        </AuthRoute>} />
				<Route path="*" element={ <Bot />} />
				<Route path="/bot" element={ <Bot />} />
			</Routes>
			<Toaster />
		</BrowserRouter>
	);
}
