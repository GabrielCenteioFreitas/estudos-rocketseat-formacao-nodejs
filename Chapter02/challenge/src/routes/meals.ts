import { FastifyInstance } from "fastify";
import { checkIfSessionIdExists } from "../middlewares/check-if-session-id-exists";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "crypto";
import { formatMeal } from "../utils/format-meal";

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', {
    preHandler: [checkIfSessionIdExists]
  }, async (req, res) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      isOnDiet: z.boolean(),
    })

    const { sessionId } = req.cookies

    const { name, description, date, isOnDiet } = createMealBodySchema.parse(req.body)

    const user = await knex('users')
      .where('session_id', sessionId)
      .select()
      .first()

    if (!user) {
      return res.status(404).send({ message: 'User not found'})
    }

    await knex('meals').insert({
      id: randomUUID(),
      user_id: user.id,
      name,
      description,
      date: date.toISOString(),
      is_on_diet: isOnDiet,
    })

    return res.status(201).send()
  })

  app.put('/:id', {
    preHandler: [checkIfSessionIdExists]
  }, async (req, res) => {    
    const { sessionId } = req.cookies
    
    const user = await knex('users')
    .where('session_id', sessionId)
    .select()
    .first()
    
    if (!user) {
      return res.status(404).send('User not found')
    }

    const updateMealParamsSchema = z.object({
      id: z.string().uuid(),
    })
    
    const { id } = updateMealParamsSchema.parse(req.params)

    const doesMealExists = await knex('meals').where('id', id).first()

    if (!doesMealExists) {
      return res.status(404).send({ message: 'Meal not found' })
    }

    const updateMealBodySchema = z.object({
      name: z.string().nullish(),
      description: z.string().nullish(),
      date: z.coerce.date().nullish(),
      isOnDiet: z.boolean().nullish(),
    })
    
    const { name, description, date, isOnDiet } = updateMealBodySchema.parse(req.body)

    const newMeal = {
      ...(name && { name }),
      ...(description && { description }),
      ...(date && { date: date.toISOString() }),
      ...(typeof isOnDiet === 'boolean' && { is_on_diet: isOnDiet }),
    }

    if (Object.keys(newMeal).length > 0) {
      await knex('meals')
        .where({
          user_id: user.id,
          id,
        })
        .update(newMeal);
    }

    return res.status(200).send()
  })

  app.delete('/:id', {
    preHandler: [checkIfSessionIdExists]
  }, async (req, res) => {
    const { sessionId } = req.cookies
    
    const user = await knex('users')
      .where('session_id', sessionId)
      .select()
      .first()
    
    if (!user) {
      return res.status(404).send('User not found')
    }

    const deleteMealParamsSchema = z.object({
      id: z.string().uuid(),
    })
    
    const { id } = deleteMealParamsSchema.parse(req.params)

    const doesMealExists = await knex('meals').where('id', id).first()

    if (!doesMealExists) {
      return res.status(404).send({ message: 'Meal not found' })
    }

    await knex('meals')
      .where({
        user_id: user.id,
        id,
      })
      .delete()

    return res.status(200).send()
  })

  app.get('/', {
    preHandler: [checkIfSessionIdExists]
  }, async (req, res) => {
    const { sessionId } = req.cookies
    
    const user = await knex('users')
      .where('session_id', sessionId)
      .select()
      .first()
    
    if (!user) {
      return res.status(404).send('User not found')
    }

    const meals = await knex('meals')
      .where('user_id', user.id)
      .select()

    const formattedMeals = meals.map(meal => formatMeal(meal))

    return res.status(200).send({
      meals: formattedMeals,
    })
  })

  app.get('/:id', {
    preHandler: [checkIfSessionIdExists]
  }, async (req, res) => {
    const { sessionId } = req.cookies
    
    const user = await knex('users')
      .where('session_id', sessionId)
      .select()
      .first()
    
    if (!user) {
      return res.status(404).send('User not found')
    }

    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })
    
    const { id } = getMealParamsSchema.parse(req.params)

    const meal = await knex('meals')
      .where({
        user_id: user.id,
        id,
      })
      .select()
      .first()

    if (!meal) {
      return res.status(404).send({ message: 'Meal not found' })
    }

    const formattedMeal = formatMeal(meal)

    return res.status(200).send({
      meal: formattedMeal,
    })
  })

  app.get('/summary', {
    preHandler: [checkIfSessionIdExists]
  }, async (req, res) => {
    const { sessionId } = req.cookies
    
    const user = await knex('users')
      .where('session_id', sessionId)
      .select()
      .first()
    
    if (!user) {
      return res.status(404).send('User not found')
    }

    const meals = await knex('meals')
      .where('user_id', user.id)
      .select()

    const mealsQuantity = meals.length
    const mealsOnDietQuantity = meals.filter(meal => meal.is_on_diet).length
    const mealsOutOfDietQuantity = mealsQuantity - mealsOnDietQuantity

    const orderedByDateMeals = meals.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    const mealsOnDietSequences = [0];
    orderedByDateMeals.forEach(meal => {
      if (meal.is_on_diet) {
        const length = mealsOnDietSequences.length
        mealsOnDietSequences[length - 1]++
      } else {
        mealsOnDietSequences.push(0)
      }
    })

    const longerMealsOnDietSequence = Math.max(...mealsOnDietSequences)

    return res.status(200).send({
      summary: {
        mealsQuantity,
        mealsOnDietQuantity,
        mealsOutOfDietQuantity,
        longerMealsOnDietSequence,
      }
    })
  })
}