import React from 'react';
import { connect } from 'dva';
import { Button, message, Modal } from 'antd';

import EditDepartModal from './components/NewDepartModal';
import OTree from './components/Tree';

import styles from './index.less';
class Depart extends React.Component {
  setNewDepartVisible = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'depart/save',
      payload: {
        editDepartVisible: true,
      },
    });
  };

  setEditDepartVisible = () => {
    const { dispatch, selectedKeys, selectedNodes } = this.props;
    if (selectedKeys.length > 0) {
      dispatch({
        type: 'depart/save',
        payload: {
          departDetail: selectedNodes,
          editDepartVisible: true,
        },
      });
      dispatch({
        type: 'depart/departList',
        payload: {
          departKindType: parseInt(selectedNodes.departKindType) - 1,
        },
      });
    } else {
      message.warning('请先选择操作节点！');
    }
  };

  setDeleteDepartVisible = () => {
    const { dispatch, selectedKeys, selectedNodes } = this.props;
    if (selectedKeys.length > 0) {
      dispatch({
        type: 'depart/save',
        payload: {
          departDetail: selectedNodes,
          deteleDepartVisible: true,
        },
      });
    } else {
      message.warning('请先选择操作节点！');
    }
  };

  HandleDepartDelete = () => {
    const { dispatch, departDetail } = this.props;
    debugger;
    dispatch({
      type: 'depart/departDetele',
      payload: {
        departId: departDetail.departId,
      },
    });
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'depart/save',
      payload: {
        deteleDepartVisible: false,
        // departDetail:{}
      },
    });
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'depart/save',
      payload: {
        editDepartVisible: false,
        deteleDepartVisible: false,
        departDetail: {},
        selectedNodes: {},
        selectedKeys: [],
        parentDepartList: [],
        treeData: [],
      },
    });
  }

  render() {
    const { editDepartVisible, deteleDepartVisible, departDetail, loading } = this.props;
    return (
      <div className={styles.normal}>
        <div className="clearfix" style={{ marginBottom: '10px' }}>
          <Button
            style={{ marginLeft: '10px' }}
            className="pullright"
            type="danger"
            onClick={this.setDeleteDepartVisible}
          >
            部门删除
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            className="pullright"
            type="primary"
            onClick={this.setEditDepartVisible}
          >
            部门编辑
          </Button>
          <Button className="pullright" type="primary" onClick={this.setNewDepartVisible}>
            部门新增
          </Button>
        </div>
        <OTree />
        <EditDepartModal visible={editDepartVisible} />
        <Modal
          title="删除部门"
          visible={deteleDepartVisible}
          onOk={this.HandleDepartDelete}
          onCancel={this.handleCancel}
          confirmLoading={loading}
        >
          <p>删除{departDetail.departName}会一并下面的子部门,确定删除该部门吗？</p>
        </Modal>
      </div>
    );
  }
}
export default connect(state => ({ ...state.depart, loading: state.loading.models.depart }))(
  Depart,
);
