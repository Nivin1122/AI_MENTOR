import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../redux/slices/auth/AuthSlice';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ username: '', password: '' });

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
    navigate('/')
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Username" onChange={e => setFormData({ ...formData, username: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setFormData({ ...formData, password: e.target.value })} />
      <button type="submit">Login</button>
    </form>
  );
}
