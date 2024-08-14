import * as React from 'react';
import { useEffect,useState } from 'react';
import Header from './components/Header';
import { Link, Outlet } from "react-router-dom";
import { Box } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

const App: React.FC = () => {
  const [useAuth, setUseAuth] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();
  const user = queryClient.getQueryState<any>(['user']);
 
  useEffect(() => {
    // (async ()=>{
    //   const user = queryClient.getQueryState<any>(['user']);
    //   console.log('USER', user?.data['data']);
    // })()

    // if(user){
    //     console.log('=======>', user?.[0]?.[1]);
    // }
  }, []);
  // useEffect(() => {
  //   console.log('=======>', queryClient.getQueriesData({
  //     queryKey: ['user']
  //   }));
    // const loadUseAuth = async () => {
    //   try {
    //     const module = await import('authentication/useAuth');
    //     console.log(module);
    //     setUseAuth(() => module.default);
    //   } catch (e) {
    //     setError(e as Error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };

    // loadUseAuth();
  // }, []);
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default App;