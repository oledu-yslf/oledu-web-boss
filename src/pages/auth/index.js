import React from 'react';
import { connect } from 'dva';
import { Form, Select, DatePicker, Button, Table, message, Tabs, PageHeader } from 'antd';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import styles from './index.less';
import router from 'umi/router';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

class Auth extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    const roleInfo = sessionStorage.getItem('roleInfo')
      ? JSON.parse(sessionStorage.getItem('roleInfo'))
      : '';
    const staffId = roleInfo ? roleInfo.staffId : '';
    // const staffName = roleInfo ? roleInfo.staffName : '';

    const { dispatch, menuList, form, roleId } = this.props;
    const { resetFields } = form;

    let newMenuList = cloneDeep(menuList) || [];
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { rangeTime, right } = values;
        const effTime = rangeTime[0].valueOf();
        const expTime = rangeTime[1].valueOf();
        const obj = {};
        obj.roleId = roleId;
        obj.effTime = effTime;
        obj.expTime = expTime;
        obj.menuId = JSON.parse(right).rightId;
        obj.menuName = JSON.parse(right).rightName;

        obj.createStaffId = staffId;
        let isDiff = true;
        if (newMenuList && newMenuList.length > 0) {
          for (let i = 0; i < newMenuList.length; i++) {
            if (newMenuList[i].menuId === obj.menuId) {
              isDiff = false;
              break;
            }
          }
        }

        if (!isDiff) {
          message.warn('菜单选择重复');
          return;
        }
        newMenuList.push(obj);
        resetFields();
        dispatch({
          type: 'auth/rolerightSave',
          payload: [
            {
              roleId,
              effDate: effTime,
              expDate: expTime,
              createStaffId: staffId,
              funType: 1,
              rightId: JSON.parse(right).rightId,
            },
          ],
        });
      }
    });
  };
  deleteMenu = record => {
    const roleInfo = sessionStorage.getItem('roleInfo')
      ? JSON.parse(sessionStorage.getItem('roleInfo'))
      : '';
    const staffId = roleInfo ? roleInfo.staffId : '';
    const { dispatch, roleId, menuList, funList } = this.props;
    let newMenuList = cloneDeep(menuList) || [];
    let list = [];
    if (newMenuList && newMenuList.length > 0) {
      for (let i = 0; i < newMenuList.length; i++) {
        if (newMenuList[i].menuId !== record.menuId) {
          let obj = {};
          obj.effDate = newMenuList[i].effTime;
          obj.expDate = newMenuList[i].expTime;
          obj.roleId = roleId;
          obj.funType = 1;
          obj.createStaffId = staffId;
          obj.rightId = newMenuList[i].menuId;
          list.push(obj);
        }
      }
    }
    if (funList && funList.length > 0) {
      for (let i = 0; i < funList.length; i++) {
        let obj = {};
        obj.effDate = funList[i].effDate;
        obj.expDate = funList[i].expDate;
        obj.roleId = roleId;
        obj.funType = 2;
        obj.createStaffId = staffId;
        obj.rightId = funList[i].menuFuncId;
        list.push(obj);
      }
    }

    dispatch({
      type: 'auth/rolerightUpdate',
      payload: list || [],
    });
  };

  handleTabClick = e => {
    const { roleId } = this.props;
    console.log(e);
    if (parseInt(e) === 2) {
      router.push(`/auth2?roleId=${roleId}`);
    }
  };
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'auth/save',
      payload: {
        list: [],
        menuList: [],
        roleId: '',
        funList: [],
      },
    });
  }
  render() {
    const { list, form, menuList } = this.props;
    const { getFieldDecorator } = form;
    const columns = [
      {
        title: '菜单名称',
        dataIndex: 'menuName',
        key: 'menuName',
      },
      {
        title: '生效时间',
        dataIndex: 'effTime',
        key: 'effTime',
        render: text => <span>{moment(parseInt(text)).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '失效时间',
        dataIndex: 'expTime',
        key: 'expTime',
        render: text => <span>{moment(parseInt(text)).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        render: (text, record) => (
          <span>
            <Button type="link" onClick={e => this.deleteMenu(record, e)}>
              删除
            </Button>
          </span>
        ),
      },
    ];
    return (
      <div className={styles.normal}>
        <Tabs defaultActiveKey="1" onTabClick={this.handleTabClick}>
          <TabPane tab="菜单权限" key="1">
            <Form onSubmit={this.handleSubmit} layout={'inline'}>
              <Form.Item label="权限菜单">
                {getFieldDecorator('right', {
                  rules: [{ required: true, message: '请选择权限菜单!' }],
                })(
                  <Select style={{ width: 160 }} placeholder="请选择权限菜单!">
                    {list.map(item => (
                      <Option
                        key={item.menuId}
                        value={JSON.stringify({ rightId: item.menuId, rightName: item.menuName })}
                      >
                        {item.menuName}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="生效起止日期">
                {getFieldDecorator('rangeTime', {
                  rules: [{ type: 'array', required: true, message: '请选择生效起止时间!' }],
                })(<RangePicker />)}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  添加权限
                </Button>
              </Form.Item>
            </Form>
            <Table
              pagination={false}
              rowKey={record => record.menuId}
              columns={columns}
              dataSource={menuList}
            ></Table>
          </TabPane>
          <TabPane tab="按钮权限" key="2"></TabPane>
        </Tabs>
      </div>
    );
  }
}
const AuthForm = Form.create({ name: 'UserEdit' })(Auth);
export default connect(state => ({ ...state.auth, loading: state.loading.models.auth }))(AuthForm);
