import React from 'react';
import BasicLayout from './components/BasicLayout';
import LoginLayout from './components/LoginLayout';

class Main extends React.Component {
  render() {
    const { location, children } = this.props;
    return (
      <div>
        {location.pathname.indexOf('/login') >= 0 ? (
          <LoginLayout>{children}</LoginLayout>
        ) : (
          <BasicLayout>{children}</BasicLayout>
        )}
      </div>
    );
  }
}

export default Main;
