import React from 'react';
import { Form, Input, Radio, TreeSelect, DatePicker, Button } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './index.less';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { TreeNode } = TreeSelect;

class UserEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pwd: '',
    };
  }
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { resetFields } = form;
    const roleInfo = sessionStorage.getItem('roleInfo')
      ? JSON.parse(sessionStorage.getItem('roleInfo'))
      : '';
    const staffId = roleInfo ? roleInfo.staffId : '';
    this.props.form.validateFields((err, values) => {
      const {
        departId,
        staffNo,
        staffName,
        staffPwd,
        sex,
        birthdayTime,
        staffType,
        contactTel,
        email,
        address,
        state,
        rangeTime,
        roleId,
        remark,
      } = values;
      const effDate = rangeTime[0].valueOf();
      const expDate = rangeTime[1].valueOf();
      let birthday = '';
      if (birthdayTime) {
        birthday = birthdayTime.valueOf();
      }
      let baseStaffRoleList = [];
      for (var i in roleId) {
        let obj = {};
        obj.roleId = roleId[i];
        obj.createStaffId = staffId;
        baseStaffRoleList.push(obj);
      }

      if (!err) {
        if (!this.props.staffDetail.staffId) {
          resetFields();
          dispatch({
            type: 'userEdit/staffSave',
            payload: {
              departId,
              staffNo,
              staffName,
              staffPwd,
              sex,
              birthday: birthday,
              staffType,
              contactTel,
              email,
              address,
              state,
              effDate,
              expDate,
              remark,
              createStaffId: staffId,
              baseStaffRoleList,
            },
          });
        } else {
          resetFields();
          dispatch({
            type: 'userEdit/staffUpdate',
            payload: {
              staffId: this.props.staffDetail.staffId,
              departId,
              staffNo,
              staffName,
              staffPwd,
              sex,
              birthday,
              staffType,
              contactTel,
              email,
              address,
              state,
              effDate,
              expDate,
              remark,
              updateStaffId: staffId,
              baseStaffRoleList,
            },
          });
        }
      }
    });
  };
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userEdit/save',
      payload: {
        staffDetail: {},
        treeDepartData: [],
        treeRoleData: [],
      },
    });
  }
  render() {
    const { form, staffDetail, treeDepartData, treeRoleData } = this.props;
    const { getFieldDecorator } = form;
    let {
      departId,
      staffNo,
      staffName,
      staffPwd,
      sex,
      staffType,
      contactTel,
      email,
      address,
      state,
      remark,
      expDate,
      effDate,
      birthday,
      roleVOMap,
    } = staffDetail;
    let rangeTime, birthdayTime;
    if (effDate && expDate) {
      rangeTime = [moment(effDate), moment(expDate)];
    }
    if (birthday) {
      birthdayTime = moment(birthday);
    }
    sex = sex === '0' ? 0 : 1;
    staffType = parseInt(staffType) > 0 ? parseInt(staffType) : 0;
    state = parseInt(state) === 1 ? 1 : parseInt(state) === 0 ? 0 : parseInt(state) === 2 ? 2 : 1;
    const renderRoleTreeNodes = data => {
      if (data) {
        return data.map(item => {
          if (item.childRoleVOList) {
            return (
              <TreeNode value={item.roleId} title={item.roleName} key={item.roleId} dataRef={item}>
                {renderRoleTreeNodes(item.childRoleVOList)}
              </TreeNode>
            );
          }
          return (
            <TreeNode value={item.roleId} title={item.roleName} key={item.roleId} dataRef={item} />
          );
        });
      }
    };
    const renderDepartTreeNodes = data => {
      if (data) {
        return data.map(item => {
          if (item.childDepartVOList) {
            return (
              <TreeNode
                value={item.departId}
                title={item.departName}
                key={item.departId}
                dataRef={item}
              >
                {renderDepartTreeNodes(item.childDepartVOList)}
              </TreeNode>
            );
          }
          return (
            <TreeNode
              value={item.departId}
              title={item.departName}
              key={item.departId}
              dataRef={item}
            />
          );
        });
      }
    };
    let roleId = [];
    if (roleVOMap) {
      for (let i in roleVOMap) {
        roleId.push(roleVOMap[i].roleId);
      }
    }

    let inputType = 'input';
    if (!staffNo) {
      inputType = 'password';
    }
    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
    };
    return (
      <div className={styles.normal}>
        <Form layout="vertical" onSubmit={this.handleSubmit} {...formItemLayout} labelAlign="right">
          <Form.Item label="所属部门">
            {getFieldDecorator('departId', {
              initialValue: departId,
              rules: [{ required: true, message: '请选择所属部门！' }],
            })(
              <TreeSelect
                showSearch
                // style={{ width: '440px' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择所属部门"
                allowClear
                onChange={this.treeChange}
              >
                {renderDepartTreeNodes(treeDepartData)}
              </TreeSelect>,
            )}
          </Form.Item>
          <Form.Item label="员工工号（学号）">
            {getFieldDecorator('staffNo', {
              initialValue: staffNo,
              rules: [{ required: true, message: '请输入员工工号！' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="员工姓名">
            {getFieldDecorator('staffName', {
              initialValue: staffName,
              rules: [{ required: true, message: '请输入员工姓名！' }],
            })(<Input />)}
          </Form.Item>
          {!staffPwd && (
            <Form.Item label="密码">
              {getFieldDecorator('staffPwd', {
                initialValue: staffPwd,
                rules: [{ required: true, message: '请输入密码！' }],
              })(<Input type={inputType} />)}
            </Form.Item>
          )}

          <Form.Item label="性别">
            {getFieldDecorator('sex', {
              initialValue: sex,
            })(
              <Radio.Group>
                <Radio value={1}>男</Radio>
                <Radio value={0}>女</Radio>
              </Radio.Group>,
            )}
          </Form.Item>

          <Form.Item label="生日">
            {getFieldDecorator('birthdayTime', {
              initialValue: birthdayTime,
            })(<DatePicker />)}
          </Form.Item>

          <Form.Item label="员工类型">
            {getFieldDecorator('staffType', {
              initialValue: staffType,
            })(
              <Radio.Group default={0}>
                <Radio value={0}>管理员</Radio>
                <Radio value={1}>教师</Radio>
                <Radio value={2}>学生</Radio>
              </Radio.Group>,
            )}
          </Form.Item>

          <Form.Item label="联系电话">
            {getFieldDecorator('contactTel', {
              initialValue: contactTel,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="邮箱">
            {getFieldDecorator('email', {
              initialValue: email,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="地址">
            {getFieldDecorator('address', {
              initialValue: address,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="员工状态">
            {getFieldDecorator('state', {
              initialValue: state,
            })(
              <Radio.Group default={0}>
                <Radio value={1}>正常</Radio>
                <Radio value={0}>已经离职</Radio>
                <Radio value={2}>暂时冻结</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item label="所属角色">
            {getFieldDecorator('roleId', {
              initialValue: roleId,
              rules: [{ required: true, message: '请选择角色！' }],
            })(
              <TreeSelect
                showSearch
                multiple
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择角色！"
                allowClear
                onChange={this.treeChange}
              >
                {renderRoleTreeNodes(treeRoleData)}
              </TreeSelect>,
            )}
          </Form.Item>
          <Form.Item label="生效起止日期">
            {getFieldDecorator('rangeTime', {
              initialValue: rangeTime,
              rules: [{ type: 'array', required: true, message: '请选择生效起止时间!' }],
            })(<RangePicker />)}
          </Form.Item>
          <Form.Item label="员工描述">
            {getFieldDecorator('remark', {
              initialValue: remark,
            })(<TextArea rows={4} />)}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
const UserEditForm = Form.create({ name: 'UserEdit' })(UserEdit);
export default connect(state => ({ ...state.userEdit, loading: state.loading.models.userEdit }))(
  UserEditForm,
);
