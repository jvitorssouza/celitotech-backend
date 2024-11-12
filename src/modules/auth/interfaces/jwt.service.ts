export interface IJwtService {
    sign: (payload: string | Buffer | object) => Promise<string>
}
