import { Role } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";

export function verifyRole(roleToVerify: Role) {
  return async (req: FastifyRequest, res: FastifyReply) => {
    const { role } = req.user
  
    if (role !== roleToVerify) {
      return res.status(401).send({ message: 'Unauthorized.'})
    }
  }
}