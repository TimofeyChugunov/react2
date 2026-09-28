import { FC, useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { registerUser } from '../../services/slices/userSlice';
import { RegisterUI } from '@ui-pages';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';
  const { error } = useSelector((state) => state.user);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(registerUser({ name: userName, email, password })).then(
      (action) => {
        if (action.meta.requestStatus === 'fulfilled') {
          navigate(from, { replace: true });
        }
      }
    );
  };

  return (
    <RegisterUI
      errorText={error ?? undefined} // 🔥 ИСПРАВЛЕНО: преобразуем null в undefined
      userName={userName}
      setUserName={setUserName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
