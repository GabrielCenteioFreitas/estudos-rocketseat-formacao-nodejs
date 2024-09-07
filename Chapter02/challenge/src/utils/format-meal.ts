import { Meal } from "../@types/knex"

export const formatMeal = (meal: Meal) => {
  return {
    id: meal.id,
    user_id: meal.user_id,
    name: meal.name,
    description: meal.description,
    isOnDiet: meal.is_on_diet ? true : false,
    date: meal.date,
  }
}