import { Conversation } from '@botpress/client';
import defaultAvatarImg from '../assets/juta_icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartBar,
  faEnvelope,
  faCalendar,
  faUsers,
  faHandshake,
  faDollarSign,
  faBullhorn,
  faCogs,
  faClipboardList,
  faRobot
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import '../style.css';

export interface ConversationWithMessagesAndUsers extends Conversation {
  // messages: Message[];
  // users: User[];
}

export const Dashboard = () => {
  return (
    <div className="dashboard-container">
           <div className="sidebar">
        <img src={defaultAvatarImg} alt="Default avatar" className="aspect-w-1" />
        <div className="sidebar-item bg-custom-green">
    <Link to="/">
      <FontAwesomeIcon icon={faChartBar} className="mr-2" />
      Dashboard
    </Link>
  </div>
  

  <div className="sidebar-item">
    <Link to="/bot">
      <FontAwesomeIcon icon={faRobot} className="mr-2" />
      Bot
    </Link>
  </div>
       
      </div>

      <div className="main-content">
    
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
         
        </div>
        
        <div className="content">
          <div className="crm-overview">
            <div className="crm-card">
              <FontAwesomeIcon icon={faUsers} className="crm-card-icon" />
              <p>Contacts</p>
              <p>450</p>
            </div>
            
            <div className="crm-card">
              <FontAwesomeIcon icon={faCalendar} className="crm-card-icon" />
              <p>Appointments</p>
              <p>32</p>
            </div>

            <div className="crm-card">
              <FontAwesomeIcon icon={faHandshake} className="crm-card-icon" />
              <p>Opportunities</p>
              <p>180</p>
            </div>

            {/*... (more cards) */}
          </div>

          <div className="crm-analytics">
            <h2>Sales Analytics</h2>
            {/* (analytics graph component here) */}
          </div>

          <div className="crm-tasks">
            <h2>Tasks</h2>
            {/* (task list component here) */}
          </div>

          <div className="crm-messages">
            <h2>Recent Messages</h2>
            {/* (message list component here) */}
          </div>
        </div>
      </div>
    </div>
  );
};