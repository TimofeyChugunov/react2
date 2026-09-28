import { FC, useMemo } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import { resetConstructor, setOrderRequest, setOrderModalData } from '../../services/slices/burgerConstructorSlice'; // <-- НОВОЕ ИМЯ
import { orderBurgerApi } from '../../utils/burger-api';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // <-- ЧИТАЕМ ИЗ burgerConstructor, а не constructor
  const { bun, ingredients, orderRequest, orderModalData } = useSelector((state: any) => state.burgerConstructor || {});
  const { user } = useSelector((state: any) => state.user);

  const constructorItems = {
    bun: bun || null,
    ingredients: ingredients || []
  };

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    
    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    dispatch(setOrderRequest(true));

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item: any) => item._id),
      constructorItems.bun._id
    ];

    orderBurgerApi(ingredientIds)
      .then((data: any) => {
        dispatch(setOrderModalData(data.order));
      })
      .catch((error: any) => {
        console.error('Ошибка заказа:', error);
      })
      .finally(() => {
        dispatch(setOrderRequest(false));
      });
  };

  const closeOrderModal = () => {
    dispatch(resetConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce((s: number, v: any) => s + v.price, 0),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};