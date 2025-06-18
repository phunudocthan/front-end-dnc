import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateUser as updateReduxUser } from '../store/slices/authSlice';
import { IUser } from '../types';

export const useAuth = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const updateUser = (user: IUser) => {
    dispatch(updateReduxUser(user));
  };

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isAdmin: auth.user?.role === 'admin',
    loading: auth.loading,
    error: auth.error,
    updateUser,
  };
}; 