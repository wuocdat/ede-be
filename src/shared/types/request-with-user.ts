import { Request as ExpressRequest } from 'express';
import { ERole } from '../enums/roles.enum';

export type Request = ExpressRequest & {
  user: {
    username: string;
    id: number;
    role: ERole;
    isActive: boolean;
  };
};
