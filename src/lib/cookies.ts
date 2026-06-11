import Cookies from "universal-cookie";

const cookies = new Cookies();

export const getToken = (): string => cookies.get("@olpaw/token");

export const setToken = (token: string) => {
	cookies.set("@olpaw/token", token, { path: "/" });
};

export const removeToken = () => cookies.remove("@olpaw/token", { path: "/" });
