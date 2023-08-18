import React from 'react';
import { useEffect,useState,useRef } from "react";
import './style.css';
import './script.js';


function Card() {
    const[tickets,setTickets] = useState([]);
    const[users,SetUsers]  = useState([]);
    const [groupingOption, setGroupingOption] = useState('status');
    const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedOptiona, setSelectedOptiona] = useState('');

  const modalRef = useRef(null);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleDropdownChange = (event) => {
    const selectedValue = event.target.value;
    // console.log(selectedValue);

    setSelectedOption(selectedValue);

    // Call your specific function based on the selected option
    if (selectedValue === 'Status') {
      
      setGroupingOption('status');
    } else if (selectedValue === 'User') {
      setGroupingOption('user');
    } 
    
  };
  const handleDropdownChangea = (event) => {
    const selectedValuea = event.target.value;
    // console.log(selectedValuea);
    setSelectedOptiona(selectedValuea);
    if (selectedValuea === 'Priority') {

      setGroupingOption('priority');
        } 
  };

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsModalOpen(false);
      setSelectedOption('');
    }
  };


    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
            const data = await response.json();
            console.log(data);
            setTickets(data.tickets);
            SetUsers(data.users);
          } catch (error) {
            console.error('Error fetching tickets:', error);
          }
        };
        fetchData();
      }, []);



      useEffect(() => {
        if (isModalOpen) {
          document.addEventListener('mousedown', handleOutsideClick);
        } else {
          document.removeEventListener('mousedown', handleOutsideClick);
        }
    
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
      }, [isModalOpen]);
    

      const groupTicketsByStatus = () => {
        const groupedTickets = {};
        tickets.forEach(ticket => {
          const status = ticket.status;
          if (!groupedTickets[status]) {
            groupedTickets[status] = [];
          }
          groupedTickets[status].push(ticket);
        });
        return groupedTickets;
      };

    //   Group tickets by user
    const groupTicketsByUser = () => {
        const userMap = {}; // Map of user IDs to user names
      
        users.forEach(user => {
          userMap[user.id] = user.name;
        });
      
        const groupedTickets = {};
      
        tickets.forEach(ticket => {
          const userId = ticket.userId;
          const userName = userMap[userId]; // Get the user name from the map
      
          if (!groupedTickets[userName]) {
            groupedTickets[userName] = [];
          }
          groupedTickets[userName].push(ticket);
        });
      
        return groupedTickets;
      };
    
// Group tickets by priority
const groupTicketsByPriority = () => {
    const groupedTickets = {
      'Urgent': [],
      'High': [],
      'Medium': [],
      'Low': [],
      'No priority': [],
    };
  
    tickets.forEach(ticket => {
      const priorityValue = ticket.priority;
  
      // Map priority values to their corresponding labels
      let priorityLabel = '';
      switch (priorityValue) {
        case 4:
          priorityLabel = 'Urgent';
          break;
        case 3:
          priorityLabel = 'High';
          break;
        case 2:
          priorityLabel = 'Medium';
          break;
        case 1:
          priorityLabel = 'Low';
          break;
        case 0:
          priorityLabel = 'No priority';
          break;
        default:
          priorityLabel = 'No priority'; // Handle unknown values
      }
  
      groupedTickets[priorityLabel].push(ticket);
    });
  
    return groupedTickets;
  };
  
      const renderTickets = () => {
        let groupedTickets;
    
        if (groupingOption === 'status') {
          groupedTickets = groupTicketsByStatus();
        } else if (groupingOption === 'user') {
          groupedTickets = groupTicketsByUser();
        } else if (groupingOption === 'priority') {
          groupedTickets = groupTicketsByPriority();
        }
        //   }
        return Object.entries(groupedTickets).map(([group, tickets]) => (
            <div className='main'> 
          <div className='main2'  key={group}>
            <h3 className='head'>{group}</h3>
            {tickets.map(ticket => (
              <div className='main2' key={ticket.id}>
              

<div className='card'>
  <div className='id'>
    <span className ='usid'> {ticket.id} </span>
    <div className = 'profile'> </div>
  </div>
  <div className='todo'> 
  <div className='todotask'> 
  <img className='icon1' width="50" height="50" src="https://img.icons8.com/ios/50/inactive-state.png" alt="inactive-state"/>

<div className='todotext'>
{ticket.title}  </div>
  </div>
  <div className='todotask'>
<div className='more'>

</div>


  <img className='icon2' width="50" height="50" src="https://img.icons8.com/ios/50/inactive-state.png" alt="inactive-state"/>

    <div className = 'priority'> {ticket.priority === 4 ? 'Urgent' : ticket.priority === 3 ? 'High' :ticket.priority === 2 ? 'Medium' :ticket.priority === 1 ? 'Low':  ticket.priority === 0 ? 'No Priority': 'No Priority'}</div>
  </div>
  </div>
</div>
              </div>
            ))}
          </div> </div>
        ));
    
      };
    
      return (
        <div className='topnav'>
         <div className='nav'>
         <div className='nav2'>
         <button className='modal-btn' onClick={handleButtonClick}>Display ▼</button>
      {isModalOpen && (
        <div className="modal" ref={modalRef}>
  <div className='modal2'>

<p>Grouping</p>
<select className='drop' value={selectedOption} onChange={handleDropdownChange}>
<option value="Status">Status</option>
<option value="User">User</option>
</select>
</div>
<div className='modal2'>

<p>Ordering</p>
      <select className='drop' value={selectedOptiona} onChange={handleDropdownChangea}>
        <option value="Priority">Priority</option>
        <option value="User">User</option>

      </select>
      </div>

        
        

        </div>
      )}

          </div>
        
         </div>
       <div className='main'>
       {renderTickets()}
       </div>
         
        </div>
      );
    };
    
export default Card;