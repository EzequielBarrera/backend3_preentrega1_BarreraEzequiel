export default class UserDTO {
    static getUserTokenFrom = (user) => {
        return {
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            email: user.email
        }
    }
}