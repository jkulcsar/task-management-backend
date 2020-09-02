
export interface JwtPayload {
    username: string,
    // add here other relevant props such as roles, email address, etc
    // but no sensitive information since this is visible
}