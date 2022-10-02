export enum USER_ERROR_CODE {
    U_001 = 'U_001',
    U_002 = 'U_002',
    U_003 = 'U_003',
    U_004 = 'U_004',
}

export const USER_ERROR_MESSAGE = {
    [USER_ERROR_CODE.U_001]: 'Email này đã tồn tại.',
    [USER_ERROR_CODE.U_002]: 'Có lỗi xảy ra khi tạo tài khoản.',
    [USER_ERROR_CODE.U_003]: 'Mật khẩu hoặc tài khoản không chính xác.',
    [USER_ERROR_CODE.U_004]: 'Invalid token',
    
};