import { Response } from 'express';
import { RESPONSE_STATUS, SUCCESS_CODE } from '../../constants';

type ResponseWithBody = {
    code: string;
    status: RESPONSE_STATUS;
    data: any;
};

export class BaseResponse {
    private static _responseWithBody(
        data: string | { [key: string]: string } | any | null,
        code: string = SUCCESS_CODE.S100
    ): ResponseWithBody {
        return {
            code,
            status: RESPONSE_STATUS.SUCCESS,
            data: data
        };
    }

    public static SuccessResponse(
        res: Response,
        data: string | { [key: string]: string } | any | null = null,
        status: number = 200
    ): Response<any, Record<string, any>> {
        return res.status(status).json(this._responseWithBody(data));
    }
}
