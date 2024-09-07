import { beforeAll, afterAll, describe, it, expect, beforeEach } from "vitest"
import request from "supertest"
import { app } from "../src/app"
import { execSync } from "node:child_process"

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex -- migrate:rollback --all')
    execSync('npm run knex -- migrate:latest')
  })

  it('should be able to create a new meal', async () => {
    const user = await request(app.server)
      .post('/auth')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
      })
      .expect(201)

    const cookies = user.get('Set-Cookie') || []

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Test Meal',
        description: 'Test Description',
        date: new Date(),
        isOnDiet: true,
      })
      .expect(201)
  })

  it('should be able to update a meal', async () => {
    const user = await request(app.server)
      .post('/auth')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
      })
      .expect(201)

    const cookies = user.get('Set-Cookie') || []

    const meal = {
      name: 'Test Meal',
      description: 'Test Description',
      date: new Date(),
      isOnDiet: true,
    }

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send(meal)
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send({
        ...meal,
        name: 'Test Meal Update'
      })
      .expect(200)
  })

  it('should be able to delete a meal', async () => {
    const user = await request(app.server)
      .post('/auth')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
      })
      .expect(201)

    const cookies = user.get('Set-Cookie') || []

    const meal = {
      name: 'Test Meal',
      description: 'Test Description',
      date: new Date(),
      isOnDiet: true,
    }

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send(meal)
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)
  })

  it('should be able to get a specific meal', async () => {
    const user = await request(app.server)
      .post('/auth')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
      })
      .expect(201)

    const cookies = user.get('Set-Cookie') || []

    const meal = {
      name: 'Test Meal',
      description: 'Test Description',
      date: new Date(),
      isOnDiet: true,
    }

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send(meal)
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        ...meal,
        date: meal.date.toISOString(),
      })
    )
  })

  it('should be able to list all meals', async () => {
    const user = await request(app.server)
      .post('/auth')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
      })
      .expect(201)

    const cookies = user.get('Set-Cookie') || []

    const meal = {
      name: 'Test Meal',
      description: 'Test Description',
      date: new Date(),
      isOnDiet: true,
    }

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send(meal)
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        ...meal,
        date: meal.date.toISOString(),
      })
    ])
  })

  it('should be able to get the summary', async () => {
    const user = await request(app.server)
      .post('/auth')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
      })
      .expect(201)

    const cookies = user.get('Set-Cookie') || []

    const meals = [
      {
        name: 'Meal 1',
        description: 'Meal 1 Description',
        date: (new Date()).setMinutes(1),
        isOnDiet: true,
      },
      {
        name: 'Meal 2',
        description: 'Meal 2 Description',
        date: (new Date()).setMinutes(2),
        isOnDiet: true,
      },
      {
        name: 'Meal 3',
        description: 'Meal 3 Description',
        date: (new Date()).setMinutes(3),
        isOnDiet: false,
      },
    ]

    meals.forEach(async (meal) => {
      await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send(meal)
        .expect(201)
    })

    const getSummaryResponse = await request(app.server)
      .get('/meals/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(getSummaryResponse.body.summary).toEqual(
      expect.objectContaining({
        mealsQuantity: 3,
        mealsOnDietQuantity: 2,
        mealsOutOfDietQuantity: 1,
        longerMealsOnDietSequence: 2,
      })
    )
  })
})