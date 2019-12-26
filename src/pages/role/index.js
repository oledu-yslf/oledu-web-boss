import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, message, Modal } from 'antd';

import EditRoleModal from './components/NewRoleModal';
import OTree from './components/Tree';

import styles from './index.less';
class Role extends React.Component {
  toAuth = () => {
    const { selectedKeys, selectedNodes } = this.props;
    if (selectedKeys.length > 0) {
      router.push(`/auth?roleId=${selectedNodes.roleId}`);
    } else {
      message.warning('请先选择操作节点！');
    }
  };
  setNewRoleVisible = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/save',
      payload: {
        editRoleVisible: true,
      },
    });
  };

  setEditRoleVisible = () => {
    const { dispatch, selectedKeys, selectedNodes } = this.props;
    if (selectedKeys.length > 0) {
      dispatch({
        type: 'role/save',
        payload: {
          roleDetail: selectedNodes,
          editRoleVisible: true,
        },
      });
    } else {
      message.warning('请先选择操作节点！');
    }
  };

  setDeleteRoleVisible = () => {
    const { dispatch, selectedKeys, selectedNodes } = this.props;
    if (selectedKeys.length > 0) {
      dispatch({
        type: 'role/save',
        payload: {
          roleDetail: selectedNodes,
          deteleRoleVisible: true,
        },
      });
    } else {
      message.warning('请先选择操作节点！');
    }
  };

  HandleRoleDelete = () => {
    const { dispatch, roleDetail } = this.props;
    dispatch({
      type: 'role/roleDetele',
      payload: {
        roleId: roleDetail.roleId,
      },
    });
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/save',
      payload: {
        deteleRoleVisible: false,
      },
    });
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/save',
      payload: {
        editRoleVisible: false,
        deteleRoleVisible: false,
        roleDetail: {},
        selectedNodes: {},
        selectedKeys: [],
        parentRoleList: [],
        treeData: [],
      },
    });
  }

  render() {
    const { editRoleVisible, deteleRoleVisible, roleDetail, loading } = this.props;
    return (
      <div className={styles.normal}>
        <div className="clearfix" style={{ marginBottom: '10px' }}>
          <Button
            style={{ marginLeft: '10px' }}
            className="pullright"
            type="danger"
            onClick={this.setDeleteRoleVisible}
          >
            角色删除
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            className="pullright"
            type="primary"
            onClick={this.setEditRoleVisible}
          >
            角色编辑
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            className="pullright"
            type="primary"
            onClick={this.setNewRoleVisible}
          >
            角色新增
          </Button>
          <Button className="pullright" type="primary" onClick={this.toAuth}>
            角色权限编辑
          </Button>
        </div>
        <OTree />
        <EditRoleModal visible={editRoleVisible} />
        <Modal
          title="删除角色"
          visible={deteleRoleVisible}
          onOk={this.HandleRoleDelete}
          onCancel={this.handleCancel}
          confirmLoading={loading}
        >
          <p>删除{roleDetail.roleName}会一并下面的子角色,确定删除该角色吗？</p>
        </Modal>
      </div>
    );
  }
}
export default connect(state => ({ ...state.role, loading: state.loading.models.role }))(Role);
