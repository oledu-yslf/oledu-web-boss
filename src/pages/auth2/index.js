import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Select, DatePicker, Button, Table, message, Tabs, PageHeader } from 'antd';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import styles from './index.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

class Auth2 extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    const roleInfo = sessionStorage.getItem('roleInfo')
      ? JSON.parse(sessionStorage.getItem('roleInfo'))
      : '';
    const staffId = roleInfo ? roleInfo.staffId : '';

    const { dispatch, list, form, roleId } = this.props;
    const { resetFields } = form;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { rangeTime, rightBtn } = values;
        const effTime = rangeTime[0].valueOf();
        const expTime = rangeTime[1].valueOf();

        let isDiff = true;
        if (list && list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            if (list[i].menuId === JSON.parse(rightBtn).rightId) {
              isDiff = false;
              break;
            }
          }
        }

        if (!isDiff) {
          message.warn('权限按钮选择重复');
          return;
        }
        resetFields();
        dispatch({
          type: 'auth2/rolerightSave',
          payload: [
            {
              roleId,
              effDate: effTime,
              expDate: expTime,
              createStaffId: staffId,
              funType: 2,
              rightId: JSON.parse(rightBtn).rightId,
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
    let { dispatch, roleId, list, list2 } = this.props;
    let newFunList = cloneDeep(list) || [];
    let newlist = [];
    if (newFunList && newFunList.length > 0) {
      for (let i = 0; i < newFunList.length; i++) {
        if (newFunList[i].menuFuncId !== record.menuFuncId) {
          let obj = {};
          obj.effDate = newFunList[i].effDate;
          obj.expDate = newFunList[i].expDate;
          obj.roleId = roleId;
          obj.funType = 2;
          obj.createStaffId = staffId;
          obj.rightId = newFunList[i].menuFuncId;
          newlist.push(obj);
        }
      }
    }

    for (let i = 0; i < list2.length; i++) {
      let obj = {};
      obj.effDate = list2[i].effTime;
      obj.expDate = list2[i].expTime;
      obj.roleId = roleId;
      obj.funType = 1;
      obj.createStaffId = staffId;
      obj.rightId = list2[i].menuId;
      newlist.push(obj);
    }

    dispatch({
      type: 'auth2/rolerightUpdate',
      payload: newlist || [],
    });
  };
  handleRightMenuChange = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'auth2/menufunList',
      payload: {
        menuId: JSON.parse(e).rightId,
      },
    });
  };

  handleTabClick = e => {
    const { roleId } = this.props;
    console.log(e);
    if (parseInt(e) === 1) {
      router.push(`/auth?roleId=${roleId}`);
    }
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'auth2/save',
      payload: {
        list: [],
        menuList: [],
        roleId: '',
        funList: [],
      },
    });
  }

  render() {
    const { list, form, funList, menuList } = this.props;
    const { getFieldDecorator } = form;
    const columns = [
      {
        title: '按钮名称',
        dataIndex: 'funcName',
        key: 'funcName',
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
            <Button type="link" onClick={e => this.deleteMenu(record, e)}>
              删除
            </Button>
          </span>
        ),
      },
    ];
    return (
      <div className={styles.normal}>
        <Tabs defaultActiveKey="2" onTabClick={this.handleTabClick}>
          <TabPane tab="菜单权限" key="1"></TabPane>
          <TabPane tab="按钮权限" key="2">
            <Form onSubmit={this.handleSubmit} layout={'inline'}>
              <Form.Item label="权限菜单">
                {getFieldDecorator('rightMenu', {
                  rules: [{ required: true, message: '请选择权限菜单!' }],
                })(
                  <Select
                    style={{ width: 160 }}
                    placeholder="请选择权限菜单!"
                    onChange={this.handleRightMenuChange}
                  >
                    {menuList.map(item => (
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
              <Form.Item label="权限按钮">
                {getFieldDecorator('rightBtn', {
                  rules: [{ required: true, message: '请选择权限按钮!' }],
                })(
                  <Select style={{ width: 220 }} placeholder="请选择权限按钮!">
                    {funList.map(item => (
                      <Option
                        key={item.menuFuncId}
                        value={JSON.stringify({
                          rightId: item.menuFuncId,
                          rightName: item.funcName,
                        })}
                      >
                        {item.funcName}
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
              rowKey={record => record.menuFuncId}
              columns={columns}
              dataSource={list}
            ></Table>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
const Auth2Form = Form.create({ name: 'auth2Form' })(Auth2);
export default connect(state => ({ ...state.auth2, loading: state.loading.models.auth2 }))(
  Auth2Form,
);
