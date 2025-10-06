import { useEffect, useReducer } from 'react';
import './App.css';
import { User } from './types';

type State = {
  searchQuery: string;
  currentUser: User | null;
  userList: User[];
};

type Action =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_USER'; payload: User | null }
  | { type: "SET_USER_LIST"; payload: User[] };

const initialState: State = {
  searchQuery: '',
  currentUser: null,
  userList: []
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case "SET_USER_LIST":
      return { ...state, userList: action.payload };
    default:
      return state;
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { searchQuery, currentUser, userList } = state;

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      const data = await response.json();
      dispatch({ type: "SET_USER_LIST", payload: data });
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      dispatch({ type: 'SET_USER', payload: null });
      return;
    }

    const fetchFunc = async () => {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users?username=${searchQuery}`
      );
      const resJson = await response.json();
      dispatch({
        type: 'SET_USER',
        payload: resJson.length > 0 ? resJson[0] : null,
      });
    };

    fetchFunc();
  }, [searchQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_QUERY', payload: e.target.value });
  };

  return (
    <div className="card">
      <input type="search" value={searchQuery} onChange={handleChange} />
      {searchQuery ? (
        currentUser ? (
          <div>
            <h3>{currentUser.name}</h3>
            <h3>{currentUser.username}</h3>
            <h3>{currentUser.email}</h3>
          </div>
        ) : (
          <p>No user found</p>
        )
      ) : (
        <ul className="user-list">
          {userList.map((user) => (
            <li key={user.id}>
              {user.name} ({user.username})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
