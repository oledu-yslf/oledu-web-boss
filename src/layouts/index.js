import React from 'react';
import BasicLayout from './components/BasicLayout';
import LoginLayout from './components/LoginLayout';
import router from 'umi/router'

class Main extends React.Component {
  componentWillMount(){
    const roleInfo = sessionStorage.getItem('roleInfo')
      ? JSON.parse(sessionStorage.getItem('roleInfo'))
      : '';
    const staffId = roleInfo ? roleInfo.staffId : '';
    if(!staffId){
      router.replace('/login');
    }
  }
  render() {
    const { location, children } = this.props;
    return (
      <div>
        {location.pathname=='/login' ? (
          <LoginLayout>{children}</LoginLayout>
        ) : (
          <BasicLayout>{children}</BasicLayout>
        )}
      </div>
    );
  }
}

export default Main;
