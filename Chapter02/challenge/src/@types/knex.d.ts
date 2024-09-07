// eslint-disable-next-line
import { Knex } from "knex";

declare type User = {
  id: string;
  session_id: string;
  name: string;
  email: string;
  created_at: string;
}

declare type Meal = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  is_on_diet: boolean;
  date: string;
  created_at: string;
}

declare module 'knex/types/tables' {
  export interface Tables {
    users: User,
    meals: Meal,
  }
}