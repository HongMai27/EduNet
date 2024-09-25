import { useState, useEffect } from 'react';
import axios from 'axios';
import { IUser } from '../types/IUser';  

interface UseUserResult {
  user: IUser | null;  
  loading: boolean;
  error: string | null;
}

export const useUser = (userId: string | null): UseUserResult => {
  const [user, setUser] = useState<IUser | null>(null);  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;  

      setLoading(true);
      setError(null);  

      try {
        const response = await axios.get<IUser>(`http://localhost:5000/api/auth/user/${userId}`);  
        setUser(response.data);  
      } catch (err) {
        setError('Error fetching user data');  
        console.error(err);
      } finally {
        setLoading(false);  
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };  
};
