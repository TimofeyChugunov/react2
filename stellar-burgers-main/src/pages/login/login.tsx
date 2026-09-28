import { FC, useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';
import { LoginUI } from '@ui-pages';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';
  const { error } = useSelector((state) => state.user);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password })).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        navigate(from, { replace: true });
      }
    });
  };

  return (
    <LoginUI
      errorText={error ?? undefined} // 🔥 ИСПРАВЛЕНО: преобразуем null в undefined
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
