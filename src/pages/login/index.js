import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { notification } from 'antd';


import { Form, Icon, Input, Button, Row, Col } from 'antd';
import styles from './index.less';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class LoginForm extends React.Component {

  handleSubmit = e => {
    const { dispatch, form, prerouter } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {

        if (values.username !== 'admin'){
          notification.error({
            message: "用户名不正确",
          });

          return;
        }

        dispatch({
          type: 'login/token',
          payload: {
            ...values,
          },
        }).then(res => {
          if (res.code !== 200) {
            notification.error({
              message: res.msg,
            });

            return;
          }
          dispatch({
            type: 'login/loadUserByUserName',
            payload: {
              staffNo: values.username,
            },
          }).then(res => {
            const roleInfo = res.data;
            // roleInfo.staffNo_bak = roleInfo.staffNo;
            // roleInfo.staffNo = roleInfo.staffId;
            sessionStorage.setItem('roleInfo', JSON.stringify(roleInfo));
            if (prerouter) {
              router.push(prerouter);
            } else {
              router.push('/depart');
            }
          });
        });
      }
    });
  };
  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const usernameError = isFieldTouched('username') && getFieldError('username');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    return (
      <div className={styles.loginBox}>
        <Row>
          <Col offset={9} span={6}>
            <Form onSubmit={this.handleSubmit} className={styles['login-form']}>
              <Form.Item validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: '请输入你的用户名' }],
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="用户名"
                  />,
                )}
              </Form.Item>
              <Form.Item validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入你的密码!' }],
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="密码"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles['login-form-button']}
                  style={{width:'100%'}}
                  disabled={hasErrors(getFieldsError())}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

const WrappedLoginForm = Form.create({ name: 'login_from' })(LoginForm);
export default connect(state => ({ ...state.login, loading: state.loading.models.login }))(
  WrappedLoginForm,
);
