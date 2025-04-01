import * as React from 'react';
import Button from './components/Button';

const App: React.FC = () => {
  return (
    <div>
      <h1>Hello World</h1>
      <p>Welcome to my React App!</p>
      <Button text="Submit" />
    </div>
  );
};

export default App;
