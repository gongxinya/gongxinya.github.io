import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Index from './index';
import NewPageComponent from './NewPageComponent'; // Import the new page component you want to navigate to

const App = () => {
  return (
    <Switch>
      <Route exact path="/" component={Index} />
      <Route path="/new-page" component={NewPageComponent} />
    </Switch>
  );
};

export default App;
