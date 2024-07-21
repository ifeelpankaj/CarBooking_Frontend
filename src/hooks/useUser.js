// hooks/useUser.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useMeQuery } from '../redux/api/userApi';
import { userExist, userNotExist } from '../redux/reducer/userReducer';

export const useUser = () => {
  const dispatch = useDispatch();
  const { data, isLoading, isError, refetch } = useMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (data) {
      const isUserVerified = data.user.verified || false;
      if (isUserVerified) {
        dispatch(userExist(data));
      } else {
        dispatch(userNotExist());
      }
    } else if (isError) {
      dispatch(userNotExist());
    }
  }, [data, dispatch, isError]);

  return { userData: data, isLoading, isError, refetch };
};