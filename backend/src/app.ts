import { CheckersGame } from '@shared/classes';
import { StoneColor } from '@shared/types';
import express from 'express';

export const app = express();

const checkersGame = new CheckersGame([], StoneColor.RED);
