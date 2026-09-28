import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TOrdersData, TUser } from './types';

// Если переменная окружения не задана, используем официальный API Яндекс Практикума
const URL =
  process.env.BURGER_API_URL || 'https://norma.nomoreparties.space/api';

// 🔥 РЕЖИМ МОКОВ: установи true, чтобы использовать заглушки, false — для реального API
const USE_MOCKS = true;

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

type TServerResponse<T> = {
  success: boolean;
} & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

// ==================== МОКОВЫЕ ДАННЫЕ ====================

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Флюоресцентная булка R2-D3',
    type: 'bun',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1257,
    image: 'https://code.s3.yandex.net/react/code/bun-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0943',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0944',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
  }
];

const mockUser: TUser = {
  email: 'test@test.com',
  name: 'Тестовый Космонавт'
};

const mockOrder: TOrder = {
  _id: '660a4b7e8b0b7d001b8e5f1a',
  status: 'done',
  name: 'Флюоресцентный бургер',
  createdAt: '2024-04-01T12:00:00.000Z',
  updatedAt: '2024-04-01T12:05:00.000Z',
  number: 12345,
  ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0943']
  // price удалён, так как его нет в типе TOrder
};

// ==================== API ФУНКЦИИ ====================

export const refreshToken = (): Promise<TRefreshResponse> => {
  if (USE_MOCKS) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          refreshToken: 'mock_refresh_token_123',
          accessToken: 'mock_access_token_123'
        });
      }, 500);
    });
  }

  return fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken);
      return refreshData;
    });
};

export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
) => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if ((err as { message: string }).message === 'jwt expired') {
      const refreshData = await refreshToken();
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken;
      }
      const res = await fetch(url, options);
      return await checkResponse<T>(res);
    } else {
      return Promise.reject(err);
    }
  }
};

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

type TOrdersResponse = TServerResponse<{
  data: TOrder[];
}>;

export const getIngredientsApi = () => {
  if (USE_MOCKS) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockIngredients);
      }, 500);
    });
  }

  return fetch(`${URL}/ingredients`)
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => {
      if (data?.success) return data.data;
      return Promise.reject(data);
    });
};

export const getFeedsApi = () => {
  if (USE_MOCKS) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          orders: [mockOrder],
          total: 1,
          totalToday: 1
        });
      }, 500);
    });
  }

  return fetch(`${URL}/orders/all`)
    .then((res) => checkResponse<TFeedsResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });
};

export const getOrdersApi = () => {
  if (USE_MOCKS) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([mockOrder]);
      }, 500);
    });
  }

  return fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit
  }).then((data) => {
    if (data?.success) return data.orders;
    return Promise.reject(data);
  });
};

type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

export const orderBurgerApi = (data: string[]) => {
  if (USE_MOCKS) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          order: { ...mockOrder, ingredients: data },
          name: 'Тестовый бургер'
        });
      }, 500);
    });
  }

  return fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: data
    })
  }).then((data) => {
    if (data?.success) return data;
    return Promise.reject(data);
  });
};

type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

export const getOrderByNumberApi = (number: number) => {
  if (USE_MOCKS) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          orders: [mockOrder]
        });
      }, 500);
    });
  }

  return fetch(`${URL}/orders/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => checkResponse<TOrderResponse>(res));
};

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export const registerUserApi = (data: TRegisterData) => {
  if (USE_MOCKS) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: { email: data.email, name: data.name },
          accessToken: 'mock_access_token_123',
          refreshToken: 'mock_refresh_token_123'
        });
      }, 500);
    });
  }

  return fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });
};

export type TLoginData = {
  email: string;
  password: string;
};

export const loginUserApi = (data: TLoginData) => {
  if (USE_MOCKS) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: { email: data.email, name: 'Тестовый Космонавт' },
          accessToken: 'mock_access_token_123',
          refreshToken: 'mock_refresh_token_123'
        });
      }, 500);
    });
  }

  return fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });
};

export const forgotPasswordApi = (data: { email: string }) => {
  if (USE_MOCKS) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }

  return fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });
};

export const resetPasswordApi = (data: { password: string; token: string }) => {
  if (USE_MOCKS) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }

  return fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });
};

type TUserResponse = TServerResponse<{ user: TUser }>;

export const getUserApi = () => {
  if (USE_MOCKS) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: mockUser
        });
      }, 500);
    });
  }

  return fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    headers: {
      authorization: getCookie('accessToken')
    } as HeadersInit
  });
};

export const updateUserApi = (user: Partial<TRegisterData>) => {
  if (USE_MOCKS) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: { ...mockUser, ...user }
        });
      }, 500);
    });
  }

  return fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify(user)
  });
};

export const logoutApi = () => {
  if (USE_MOCKS) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }

  return fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((res) => checkResponse<TServerResponse<{}>>(res));
};
