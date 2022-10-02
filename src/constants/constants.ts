import { RESPONSE_STATUS } from '.';

export const SUCCESS = {
    WithBody: (data: any) => {
        return {
            code: 'S100',
            status: 'success',
            data
        };
    },
    WithoutBody: {
        code: 'S100',
        status: 'success',
        data: null
    }
};

export const SUCCESS_CODE = {
    S100: 'S100'
};

export type IResponse = {
    code: string;
    status: RESPONSE_STATUS;
    data?: any;
    message?: string;
};
