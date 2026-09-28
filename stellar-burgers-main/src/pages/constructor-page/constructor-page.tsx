import { useSelector } from '../../services/store';
import styles from './constructor-page.module.css';
import { BurgerIngredients, BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';

export const ConstructorPage: FC = () => {
  // Берём только статус загрузки из Redux
  const { loading } = useSelector((state) => state.ingredients);

  if (loading) {
    return <Preloader />;
  }

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        {/* Компонент сам берёт ингредиенты из Redux */}
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
