import { useCallback, useDebugValue, useRef } from "react";
import { SignInCredencials } from "../types/Auth";
import { resetAuth, setAuth } from "../store";
import { api, setAuthorizationHeader } from "../api";
import { ONE_MINUTE } from "../constants";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./useRedux";

const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, accessToken } = useAppSelector((state) => state.auth.data);

  const intervalRef = useRef<NodeJS.Timer>();

  const navigate = useNavigate();

  useDebugValue(user, (user) => (user ? "Logged In" : "Logged Out"));

  const signIn = async (params: SignInCredencials) => {
    const { userId, password } = params;

    try {
      const response = await api.post("/auth/login", { userId, password });
      const { accessToken, expired, ...user } = response.data;
      dispatch(setAuth({ user, accessToken }));
      setAuthorizationHeader(api.defaults, accessToken);

      intervalRef.current = setInterval(() => {
        silentRefresh();
      }, expired - ONE_MINUTE);
    } catch (error) {
      return error as AxiosError;
    }
  };

  const signOut = useCallback(
    async (pathname = "/") => {
      try {
        await api.post("/auth/logout");
      } catch (error) {
        return error as AxiosError;
      } finally {
        dispatch(resetAuth());
        clearInterval(intervalRef.current);
        setAuthorizationHeader(api.defaults, "");
        navigate(pathname);
      }
    },
    [navigate, dispatch]
  );

  const requestRefresh = useCallback(async () => {
    const response = await api.post("/auth/refresh");
    const { accessToken, expired, ...user } = response.data;
    dispatch(setAuth({ user, accessToken }));
    setAuthorizationHeader(api.defaults, accessToken);

    return expired;
  }, [dispatch]);

  const silentRefresh = useCallback(async () => {
    try {
      await requestRefresh();
    } catch (error) {
      signOut(window.location.pathname);
    }
  }, [requestRefresh, signOut]);

  return {
    user,
    accessToken,
    signIn,
    signOut,
    silentRefresh,
    requestRefresh,
  };
};

export default useAuth;
