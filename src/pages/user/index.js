import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Table, Divider, Button, Form, Input, Select, Modal,TreeSelect } from 'antd';
import moment from 'moment';
import styles from './index.less';
const { TreeNode } = TreeSelect;

const { Option } = Select;

class User extends React.Component {
  pageChange = (page, pageSize) => {
    const { dispatch, staffName, staffType, state } = this.props;
    dispatch({
      type: 'user/staffList',
      payload: {
        staffId: '',
        departId: '',
        staffNo: '',
        staffName,
        sex: '',
        staffType,
        state,
        page: {
          pageSize,
          pageNum: page,
        },
      },
    });
  };
  handleUserSearch = e => {
    e.preventDefault();
    const { dispatch } = this.props;
    const value = this.props.form.getFieldsValue();
    dispatch({
      type: 'user/save',
      payload: {
        ...value,
      },
    });
    dispatch({
      type: 'user/staffList',
      payload: {
        staffId: '',
        departId: '',
        staffNo: '',
        sex: '',
        ...value,
        page: {
          pageSize: 10,
          pageNum: 1,
        },
      },
    });
  };
  onNewStaffClick = () => {
    router.push(`/userEdit`);
  };
  toUserEdit = (data, e) => {
    router.push(`/userEdit?staffId=${data.staffId}`);
  };
  deleteUser = (data, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/save',
      payload: {
        staffDetail: data,
        deteleUserVisible: true,
      },
    });
  };
  HandleUserDelete = () => {
    const { dispatch, staffDetail } = this.props;
    dispatch({
      type: 'user/staffDelete',
      payload: {
        staffId: staffDetail.staffId,
      },
    });
  };
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/save',
      payload: {
        deteleUserVisible: false,
        staffDetail: {},
      },
    });
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/save',
      payload: {
        userList: [],
        total: '',
        staffName: '',
        staffType: '',
        state: '',
        deteleUserVisible: false,
        staffDetail: {},
      },
    });
  }

  

  render() {
    const { userList, total, loading, deteleUserVisible, staffDetail,treeDepartData } = this.props;
    const columns = [
      {
        title: '员工工号',
        dataIndex: 'staffNo',
        key: 'staffNo',
      },
      {
        title: '员工姓名',
        dataIndex: 'staffName',
        key: 'staffName',
        render: text => <span>{text}</span>,
      },
      {
        title: '员工类型',
        dataIndex: 'staffType',
        key: 'staffType',
        render: text => <span>{text === '0' ? '管理员' : text === '1' ? '教师' : '学生'}</span>,
      },
      {
        title: '生效时间',
        dataIndex: 'effDate',
        key: 'effDate',
        render: text => <span>{moment(parseInt(text)).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '失效时间',
        dataIndex: 'expDate',
        key: 'expDate',
        render: text => <span>{moment(parseInt(text)).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        render: (text, record) => (
          <span>
            {/* <a >
              编辑
            </a> */}
            <Button type="link" onClick={e => this.toUserEdit(record, e)}>
              编辑
            </Button>
            <Divider type="vertical" />
            <Button type="link" onClick={e => this.deleteUser(record, e)}>
              删除
            </Button>
          </span>
        ),
      },
    ];
    const { getFieldDecorator } = this.props.form;
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
    return (
      <div className={styles.normal}>
        <div className="clearfix" style={{ marginBottom: '10px' }}>
          <div className="pullleft">
            <Form layout="inline" onSubmit={this.handleUserSearch}>
              <Form.Item label="员工类型:">
                {getFieldDecorator('staffType')(
                  <Select placeholder="请选择员工类型" style={{ width: '160px' }}>
                    <Option value={''}>全部类型</Option>
                    <Option value={0}>管理员</Option>
                    <Option value={1}>教师</Option>
                    <Option value={2}>学生</Option>
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="员工状态:">
                {getFieldDecorator('state')(
                  <Select placeholder="请选择员工状态" style={{ width: '160px' }}>
                    <Option value={''}>全部状态</Option>
                    <Option value={1}>正常</Option>
                    <Option value={0}>已经离职</Option>
                    <Option value={2}>暂时冻结</Option>
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="发布部门">
                {getFieldDecorator('departId', {
                })(
                  <TreeSelect
                    showSearch
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    style={{ width: '200px' }}
                    placeholder="请选择发布部门"
                    allowClear
                    onChange={this.treeChange}
                  >
                    {renderDepartTreeNodes(treeDepartData)}
                  </TreeSelect>,
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('staffName')(<Input placeholder={'请输入员工姓名'} />)}
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" type="primary">
                  搜索
                </Button>
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={this.onNewStaffClick}>
                添加员工
                </Button>
              </Form.Item>
            </Form>
          </div>
          {/* <Button className="pullright">
            添加员工
          </Button> */}
        </div>
        <Table
          rowKey={record => record.staffId}
          columns={columns}
          dataSource={userList}
          pagination={{
            total,
            pageSize: 10,
            onChange: (page, pageSize) => {
              this.pageChange(page, pageSize);
            },
          }}
        />

        <Modal
          title="删除用户"
          visible={deteleUserVisible}
          onOk={this.HandleUserDelete}
          onCancel={this.handleCancel}
          confirmLoading={loading}
        >
          <p>确定删除{staffDetail.staffName}吗？</p>
        </Modal>
      </div>
    );
  }
}
const UserList = Form.create({ name: 'User' })(User);
export default connect(state => ({ ...state.user, loading: state.loading.models.user }))(UserList);
