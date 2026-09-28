import { FC, memo } from 'react';
import { useDispatch } from '../../services/store';
import { BurgerIngredientUI } from '../ui/burger-ingredient';
import { TIngredient } from '@utils-types';
import { addIngredient, setBun } from '../../services/slices/burgerConstructorSlice'; // <-- НОВОЕ ИМЯ
import { useLocation } from 'react-router-dom';

type TBurgerIngredientProps = {
  ingredient: TIngredient;
  count?: number;
};

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(({ ingredient, count = 0 }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const handleAdd = () => {
    const constructorIngredient = { 
      ...ingredient, 
      id: Date.now().toString() + Math.random().toString() 
    };

    if (ingredient.type === 'bun') {
      dispatch(setBun(constructorIngredient));
    } else {
      dispatch(addIngredient(constructorIngredient));
    }
  };

  return (
    <BurgerIngredientUI
      ingredient={ingredient}
      count={count}
      locationState={{ background: location }}
      handleAdd={handleAdd}
    />
  );
});