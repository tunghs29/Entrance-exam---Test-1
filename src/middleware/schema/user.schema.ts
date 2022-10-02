import { JSONSchemaType } from 'ajv';
import { ICreateUser, ISignIn } from "../../modules/user/user.interface";

export const validateSignUp: JSONSchemaType<ICreateUser> = {
    type: 'object',
    required: ['firstName', 'lastName', 'email', 'password'],
    properties: {
        firstName: {
            type: 'string',
            maxLength: 30
        },
        lastName: {
            type: 'string',
            maxLength: 30
        },
        email: {
            type: 'string',
            format: 'email',
            minLength: 5,
            maxLength: 255
        },
        password: {
            type: 'string',
            minLength: 8,
            maxLength: 20
        }
    },
    errorMessage: {
        type: 'Invalid input',
        properties: {
            email: 'Email không đúng định dạng',
            password: 'Mật khẩu phải từ 8 đến 25 ký tự',
        },
        required: {
            firstName: 'Tên không được để trống',
            lastName: 'Tên không được để trống',
            email: 'Email không được để trống',
            password: 'Mật khẩu không được để trống',
        },
        additionalProperties: 'Invalid input',
        _: 'Invalid input'
    }
};

export const validateSignIn: JSONSchemaType<ISignIn> = {
    type: 'object',
    required: ['email', 'password'],
    properties: {
        email: {
            type: 'string',
            format: 'email',
            minLength: 5,
            maxLength: 255
        },
        password: {
            type: 'string',
            minLength: 8,
            maxLength: 20
        }
    },
    errorMessage: {
        type: 'Invalid input',
        properties: {
            email: 'Email không đúng định dạng',
            password: 'Mật khẩu phải từ 8 đến 25 ký tự',
        },
        required: {
            email: 'Email không được để trống',
            password: 'Mật khẩu không được để trống',
        },
        additionalProperties: 'Invalid input',
        _: 'Invalid input'
    }
};
