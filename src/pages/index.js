import styles from './index.less';
import React from 'react';
import router from 'umi/router';

class Index extends React.Component {
  componentWillMount() {
    router.push('/depart');
  }
  render() {
    return <div className={styles.normal}></div>;
  }
}

export default Index;
