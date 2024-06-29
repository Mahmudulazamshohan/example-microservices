import * as React from 'react';
import ResponsiveAppBar from './common/AppBar';

const App: React.FC = () => {
  return (
    <>
      <ResponsiveAppBar />
      <div id="mainSection" />
    </>
  );
};
export default App;