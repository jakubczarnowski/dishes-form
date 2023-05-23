import { useMutation } from 'react-query';

type DishCommon = {
  name: string;
  preparation_time: string;
};

type DishSoup = DishCommon & {
  type: 'soup';
  spiciness_scale: number;
};

type DishPizza = DishCommon & {
  type: 'pizza';
  no_of_slices: number;
  diameter: number;
};

type DishSandwich = DishCommon & {
  type: 'sandwich';
  slices_of_bread: number;
};

export type Dish = DishSoup | DishPizza | DishSandwich;
// Usually would use T3 env, but for the sake of simplicity I'll use .env
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

const addDish = async (dish: Dish) => {
  const response = await fetch(`${BASE_URL}/dishes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dish),
  });
  if (!response.ok) {
    throw new Error(`Error: while deleting dish`);
  }
  const data: unknown = await response.json();
  return data;
};

export const useAddDish = () => {
  const mutation = useMutation('addDish', addDish);
  return mutation;
};
