export default interface IUser {
 email: string,
 password?: string,
 age: number, 
 name: string,
 phoneNumber: string
}
// The above can also be achieved with a class
// export default class IUser {
//     email?: string;
//     password?: string;
//     age?: number; 
//     name?: string;
//     phoneNumber?: string;
//    }