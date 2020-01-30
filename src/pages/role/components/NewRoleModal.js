import React from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, DatePicker, TreeSelect } from 'antd';
import moment from 'moment'
import styles from '../index.less';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { TreeNode } = TreeSelect;

class NewRoleModal extends React.Component {

  onCancel = () => {
    const { dispatch, form } = this.props;
    const { resetFields } = form;
    resetFields();

    dispatch({
      type: 'role/save',
      payload: {
        editRoleVisible: false,
        roleDetail: {},
        parentRoleList: [],
      },
    });
  };
  onOk = () => {
    const { form, dispatch } = this.props;
    const { resetFields } = form;
    const roleInfo = sessionStorage.getItem('roleInfo')
      ? JSON.parse(sessionStorage.getItem('roleInfo'))
      : '';
    const staffId = roleInfo ? roleInfo.staffId : '';
    this.props.form.validateFields((err, values) => {
      const { roleCode, roleName, roleDesc, rolePid, rangeTime } = values;
      const effDate = rangeTime[0].valueOf();
      const expDate = rangeTime[1].valueOf();
      if (!err) {
        if (!this.props.roleDetail.roleId) {
          resetFields();

          dispatch({
            type: 'role/roleSave',
            payload: {
              roleCode,
              roleName,
              roleDesc,
              rolePid,
              createStaffId: staffId,
              effDate,
              expDate,
            },
          });
        } else {
          resetFields();
          dispatch({
            type: 'role/roleUpdate',
            payload: {
              roleId:this.props.roleDetail.roleId,
              roleCode,
              roleName,
              roleDesc,
              rolePid,
              updateStaffId: staffId,
              effDate,
              expDate,
            },
          });
        }
      }
    });
  };




  render() {
    const { editRoleVisible, form, loading, roleDetail, treeData } = this.props;
    const { getFieldDecorator } = form;
    let { roleCode, roleName, roleDesc, rolePid,effDate ,expDate} = roleDetail;
    let rangeTime;
    if(effDate && expDate){
      rangeTime = [moment(effDate),moment(expDate)];
    }
    const renderTreeNodes = data => {
      if (data) {
        return data.map(item => {
          if (item.childRoleVOList) {
            return (
              <TreeNode value={item.roleId} title={item.roleName} key={item.roleId} dataRef={item}>
                {renderTreeNodes(item.childRoleVOList)}
              </TreeNode>
            );
          }
          return (
            <TreeNode value={item.roleId} title={item.roleName} key={item.roleId} dataRef={item} />
          );
        });
      }
    };
    return (
      <Modal
        visible={editRoleVisible}
        title={roleDetail.roleId?'角色编辑':'角色新增'}
        okText="保存"
        cancelText="取消"
        confirmLoading={loading}
        onCancel={this.onCancel}
        onOk={this.onOk}
      >
        <Form layout="vertical">
          <Form.Item label="角色编码">
            {getFieldDecorator('roleCode', {
              initialValue: roleCode,
              rules: [{ required: true, message: '请输入角色编码！' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="角色名称">
            {getFieldDecorator('roleName', {
              initialValue: roleName,
              rules: [{ required: true, message: '请输入角色名称！' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="角色描述">
            {getFieldDecorator('roleDesc', {
              initialValue: roleDesc,
              rules: [{ required: true, message: '请输入角色描述！' }],
            })(<TextArea rows={4} />)}
          </Form.Item>

          <Form.Item label="父角色">
            {getFieldDecorator('rolePid', {
              initialValue: rolePid,
            })(
              <TreeSelect
                showSearch
                style={{ width: '440px' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择父角色！"
                allowClear
                onChange={this.treeChange}
              >
                {renderTreeNodes(treeData)}
              </TreeSelect>,
            )}
          </Form.Item>
          <Form.Item label="生效起止日期">
            {getFieldDecorator('rangeTime', {
              initialValue: rangeTime,
              rules: [{ type: 'array', required: true, message: '请选择生效起止时间!' }],
            })(<RangePicker />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
const NewRoleModalFrom = Form.create({ name: 'NewRoleModalFrom' })(NewRoleModal);

export default connect(state => ({ ...state.role, loading: state.loading.models.role }))(
  NewRoleModalFrom,
);
