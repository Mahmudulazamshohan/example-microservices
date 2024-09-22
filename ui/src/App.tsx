import * as React from 'react';
import { useEffect,useState } from 'react';
import Header from './components/Header';
import { Link, Outlet } from "react-router-dom";
import { Box } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

const App: React.FC = () => {

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default App;