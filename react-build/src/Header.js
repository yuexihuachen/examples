import React from "react";
import { hot } from 'react-hot-loader/root';

class Header extends React.Component {
  render() {
    const { name } = this.props;
    return (
      <>
        <h1>
          Hello {name}
        </h1>
      </>
    );
  }
}

export default hot(Header);