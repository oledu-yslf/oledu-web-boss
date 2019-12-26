import React from 'react';

class LoginLayout extends React.Component{
  render(){
    const {children} = this.props
    return (
      <div>
        {children}
      </div>
    )
  }
}

export default LoginLayout