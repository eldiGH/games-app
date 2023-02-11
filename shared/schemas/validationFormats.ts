import { TypeSystem } from '@sinclair/typebox/system';
import validator from 'validator';

export const addValidationFormats = () => {
	TypeSystem.CreateFormat('email', (email) => validator.isEmail(email));
};
