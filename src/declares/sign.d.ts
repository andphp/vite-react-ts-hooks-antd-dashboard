declare namespace Sign {
    /** user's role */
    export type Role = 'guest' | 'admin'

    export interface LoginParams {
        /** 用户名 */
        account_name: string
        /** 用户密码 */
        password: string
        /** 记住密码 */
        remember: boolean
    }

    export interface LoginResultData {
        /** auth token */
        accessToken: string
        expireToken: number
    }

    export interface LogoutParams {
        token: string
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface LogoutResult {}
}
