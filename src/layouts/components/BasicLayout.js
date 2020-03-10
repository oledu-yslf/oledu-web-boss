import React from 'react';
import router from 'umi/router';
import { connect } from 'dva';

import { Layout, Menu, Breadcrumb, Icon, Avatar, Button } from 'antd';
import styles from '../index.less';

const { Header, Content, Sider } = Layout;

class BasicLayout extends React.Component {
  state = {
    collapsed: false,
    contentHeight:document.body.clientHeight*3/4
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  onMenuClick = e => {
    const {dispatch} = this.props;
    dispatch({
      type:'global/save',
      payload:{
        currentRouter:e.key
      }
    })
    router.push(e.key);
  };

  handleLogout = () => {
    sessionStorage.clear();
    router.push('/login');
  };

  componentDidMount(){
    var contentHeight = document.body.clientHeight - 100;
    this.setState({
      contentHeight
    })
  }

  componentWillMount() {
    //获取logo信息
    const {dispatch} = this.props;

    dispatch({
      type: 'global/queryLogo',
    });
  }

  render() {
    const { children,currentRouter,currentRouterName,logoFileInfo } = this.props;
    const { collapsed ,contentHeight} = this.state;

    let imageUrl = '';
    if (logoFileInfo) {
      imageUrl = `/api${logoFileInfo.url}\/${logoFileInfo.fileName}`;
    }

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className={styles.logo} >
          </div>
          <Menu
            theme="dark"
            defaultSelectedKeys={['1']}
            mode="inline"
            onClick={this.onMenuClick}
            selectedKeys={[currentRouter]}
          >
            <Menu.Item key="/depart">
              <Icon type="profile" />
              <span>部门管理</span>
            </Menu.Item>
            <Menu.Item key="/role">
              <Icon type="team" />
              <span>角色管理</span>
            </Menu.Item>
            <Menu.Item key="/user">
              <Icon type="user" />
              <span>用户管理</span>
            </Menu.Item>
            <Menu.Item key="/logo">
              <Icon type="setting" />
              <span>Logo设置</span>
            </Menu.Item>

            <Menu.Item key="/loginbanner">
              <Icon type="picture" />
              <span>背景图设置</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>


          <Header style={{ background: '#fff', padding: 0 }}>
            <div className={styles.logo_left}>
              <img src={imageUrl} alt="avatar" className={styles.image}/>
            </div>
            <Button
              type="link"
              onClick={this.handleLogout}
              className="pullright"
              style={{ marginTop: 16, marginRight: 20 }}
            >
              退出
            </Button>

            <Avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              className="pullright"
              style={{ marginTop: 16, marginRight: 20 }}
            />
          </Header>
          <Content style={{ margin: '0 16px'}}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>{currentRouterName}</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, background: '#fff', minHeight: contentHeight }}>{children}</div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default connect(state => ({ ...state.global }))(BasicLayout)
