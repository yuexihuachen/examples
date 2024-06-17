import React from 'react';
import ReactDom from 'react-dom';
import Homepage from './src/Homepage';
import { createHashRouter, RouterProvider } from 'react-router-dom';

const App = () => {
    const router = createHashRouter([
        {
          path: "*",
          element: <Homepage />,
        },
      ]);

    return (
        <RouterProvider router={router} />
    );
};

ReactDom.render(<App />, document.getElementById('app'));