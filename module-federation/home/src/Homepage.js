import React from 'react';
import Button from 'uicomponents/Button';
import { Link } from 'react-router-dom';

const Homepage = ({ children }) => {

  return (
    <>
      <h1>Module Federation with Webpack 5</h1>
      <p>
        Module Federation is a new feature in Webpack 5 that allows you to
        dynamically load code from other webpack bundles at runtime.
      </p>
      <p>This is a React button</p>
      <Button onClick={() => alert('Button component from federated ui components library')}>Click me</Button>
      <br />
      <br />
      <Link to="/signup">Signup</Link>
    </>
  );
};

export default Homepage;