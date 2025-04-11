import Cookies from "js-cookie";

// Set a cookie
export const setCookie = (
  name: string,
  value: string,
  options?: Cookies.CookieAttributes
) => {
  Cookies.set(name, value, { expires: 7, ...options }); // Default expiration: 7 days
};

// Get a cookie
export const getCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

// Delete a cookie
export const deleteCookie = (
  name: string,
  options?: Cookies.CookieAttributes
) => {
  Cookies.remove(name, options);
};
