import { FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { BurgerIcon, ListIcon, ProfileIcon } from '@zlden/react-developer-burger-ui-components';

export const AppHeader: FC = () => {
  const location = useLocation();
  const userName = useSelector((state: any) => state.user?.user?.name);

  // Функция для определения активного класса ссылки
  const getLinkClass = (path: string) => {
    // Для профиля проверяем, начинается ли путь с /profile (чтобы работали и вложенные маршруты)
    if (path === '/profile') {
      return location.pathname.startsWith('/profile') ? 'text_color_primary' : 'text_color_inactive';
    }
    return location.pathname === path ? 'text_color_primary' : 'text_color_inactive';
  };

  return (
    <header className="pt-4 pb-4">
      <nav className="container">
        <ul className="d-flex justify-content-between">
          {/* Ссылка на Конструктор */}
          <li className="pt-4 pb-4 mr-10">
            <NavLink 
              to="/" 
              className={`d-flex align-items-center ${getLinkClass('/')}`} 
              style={{ textDecoration: 'none' }}
            >
              <BurgerIcon type="primary" />
              <p className="text text_type_main-default ml-2 mr-2">Конструктор</p>
            </NavLink>
          </li>

          {/* Ссылка на Ленту заказов */}
          <li className="pt-4 pb-4 mr-10">
            <NavLink 
              to="/feed" 
              className={`d-flex align-items-center ${getLinkClass('/feed')}`} 
              style={{ textDecoration: 'none' }}
            >
              <ListIcon type="primary" />
              <p className="text text_type_main-default ml-2 mr-2">Лента заказов</p>
            </NavLink>
          </li>

          {/* Ссылка на Личный кабинет */}
          <li className="pt-4 pb-4">
            <NavLink 
              to="/profile" 
              className={`d-flex align-items-center ${getLinkClass('/profile')}`} 
              style={{ textDecoration: 'none' }}
            >
              <ProfileIcon type="primary" />
              <p className="text text_type_main-default ml-2 mr-2">
                {userName || 'Личный кабинет'}
              </p>
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};