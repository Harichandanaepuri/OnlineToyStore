const user_key = 'user_name';
const is_admin = 'is_admin';

export default class Auth {

  // Sets user details in localStorage
  setSession = (userName, isAdmin) => {
    localStorage.setItem(user_key, userName);
    localStorage.setItem(is_admin, isAdmin);
  }

  getSession = () => {
      return localStorage.getItem(user_key);
  }

  isAdmin = () => {
    let admin = localStorage.getItem(is_admin);
    return admin=="true";
  }
  // removes user details from localStorage
  logout = () => {
    localStorage.removeItem(user_key);
    localStorage.removeItem(is_admin);
  }

  // checks if the user is authenticated
  isAuthenticated = () => {
    let userName = localStorage.getItem(user_key);
    return userName!=null;
  }
}