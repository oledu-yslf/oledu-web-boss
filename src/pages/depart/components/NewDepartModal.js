import React from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Radio, Select } from 'antd';

import styles from '../index.less';

const { TextArea } = Input;
const { Option } = Select;

class NewDepartModal extends React.Component {
  state = {
    departState: 1,
    departKindType: 1,
  };
  onCancel = () => {
    const { dispatch, form } = this.props;
    const { resetFields } = form;
    resetFields();
    this.setState({
      departState: 1,
      departKindType: 1,
    });
    dispatch({
      type: 'depart/save',
      payload: {
        editDepartVisible: false,
        departDetail: {},
        parentDepartList: [],
      },
    });
  };
  onOk = () => {
    const { form, dispatch } = this.props;
    const { resetFields } = form;
    const roleInfo = localStorage.getItem('roleInfo')
      ? JSON.parse(localStorage.getItem('roleInfo'))
      : '';
    const staffId = roleInfo ? roleInfo.staffId : '';
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let state = values.departState;
        if (!this.props.departDetail.departId) {
          resetFields();
          dispatch({
            type: 'depart/departSave',
            payload: Object.assign(
              {
                ...values,
                createStaffId: staffId,
              },
              { state, departLevel: values.departKindType },
            ),
          });
        } else {
          resetFields();
          dispatch({
            type: 'depart/departUpdate',
            payload: Object.assign(
              {
                ...values,
                modifyStaffId: staffId,
              },
              {
                state,
                departLevel: values.departKindType,
                departId: this.props.departDetail.departId,
              },
            ),
          });
        }
      }
    });
  };

  departTypeChange = e => {
    console.log('change')
    const { dispatch } = this.props;
    let departKindType = parseInt(e.target.value);

    this.setState({
      departKindType,
    });
    if (departKindType !== 1) {
      dispatch({
        type: 'depart/departList',
        payload: {
          departKindType: departKindType - 1,
        },
      });
    }
  };

  departStatusChange = e => {
    let departState = parseInt(e.target.value);
    this.setState({
      departState,
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.departDetail.departKindType !== this.props.departDetail.departKindType) {
      this.setState({
        departKindType: nextProps.departDetail.departKindType?parseInt(nextProps.departDetail.departKindType):1,
      });
    }
    if (nextProps.departDetail.state !== this.props.departDetail.state) {
      this.setState({
        departState: nextProps.departDetail.state === '1'?parseInt(nextProps.departDetail.state):0,
      });
    }
  }

  render() {
    const { editDepartVisible, form, loading, departDetail, parentDepartList } = this.props;
    const { getFieldDecorator } = form;
    let { departName, departNameEn, parentDepartId, remark } = departDetail;
    let { departKindType, departState } = this.state;

    return (
      <Modal
        visible={editDepartVisible}
        title={'部门编辑'}
        okText="保存"
        cancelText="取消"
        confirmLoading={loading}
        onCancel={this.onCancel}
        onOk={this.onOk}
      >
        <Form layout="vertical">
          <Form.Item label="部门名称">
            {getFieldDecorator('departName', {
              initialValue: departName,
              rules: [{ required: true, message: '请输入部门名称！' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="部门英文名称">
            {getFieldDecorator('departNameEn', {
              initialValue: departNameEn,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="部门类型">
            {getFieldDecorator('departKindType', {
              initialValue: departKindType,
              rules: [{ required: true, message: '请输入部门名称！' }],
            })(
              <Radio.Group onChange={this.departTypeChange}>
                {/* <Radio value="0">学校</Radio> */}
                <Radio value={1}>学院</Radio>
                <Radio value={2}>系</Radio>
                <Radio value={3}>班级</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item label="部门状态">
            {getFieldDecorator('departState', {
              initialValue: departState,
              rules: [{ required: true, message: '请选择部门状态！' }],
            })(
              <Radio.Group onChange={this.departStatusChange}>
                <Radio value={1}>有效</Radio>
                <Radio value={0}>无效</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          {departKindType !== 1 ? (
            <Form.Item label="部门所属">
              {getFieldDecorator('parentDepartId', {
                initialValue: parentDepartId,
                rules: [{ required: true, message: '请选择部门所属！' }],
              })(
                <Select placeholder="请选择所属部门">
                  {parentDepartList.map(item => (
                    <Option key={item.departId} value={item.departId}>
                      {item.departName}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          ) : (
            ''
          )}

          <Form.Item label="部门描述">
            {getFieldDecorator('remark', {
              initialValue: remark,
            })(<TextArea rows={4} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
const NewDepartModalFrom = Form.create({ name: 'NewDepartModalFrom' })(NewDepartModal);

export default connect(state => ({ ...state.depart, loading: state.loading.models.depart }))(
  NewDepartModalFrom,
);
