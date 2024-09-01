import { randomUUID } from "node:crypto"
import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
      } : null)
  
      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title || !description) {
        return res.writeHead(400).end(JSON.stringify({
          message: 'Title or description not found.'
        }))
      }
  
      const id = randomUUID()
      const task = {
        id,
        title,
        description,
        created_at: new Date(),
        updated_at: null,
        completed_at: null,
      }
      
      database.insert('tasks', task)
  
      return res.writeHead(201).end(JSON.stringify({ id }))
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      if (!title && !description) {
        return res.writeHead(400).end(JSON.stringify({
          message: 'Title or description not found.'
        }))
      }

      const task = database.select('tasks').find(task => task.id === id)

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({
          message: 'Task not found.'
        }))
      }

      if (title) {
        task.title = title
      }

      if (description) {
        task.description = description
      }

      database.update('tasks', id, {
        ...task,
        updated_at: new Date(),
      })

      return res.writeHead(200).end(JSON.stringify({ id }))
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const task = database.select('tasks').find(task => task.id === id)

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({
          message: 'Task not found.'
        }))
      }

      database.update('tasks', id, {
        ...task,
        completed_at: task.completed_at ? null : new Date(),
      })

      return res.writeHead(200).end(JSON.stringify({ id }))
    }
  },
]