import React from 'react';
import {connect} from 'dva';
import {Upload, Icon, Button, message, Spin} from 'antd';
import * as Util from '@/utils/util'

class LoginBanner extends React.Component {

  beforeFileUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' ||
      file.type == 'image/x-ms-bmp' || file.type == 'image/gif';
    if (!isJpgOrPng) {
      message.error('只能上传jpeg、png、bmp、gif格式的文件');
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error('图片最大支持 10MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  handleChange = (info) => {
    const {dispatch} = this.props;

    if (info.file.status === 'uploading') {
      this.setState({loading: true});
      return;
    }
    if (info.file.status === 'done') {
      this.setState({loading: false});

      console.log(info.file.response);
      let response = info.file.response;

      if (response.code == 200) {
        dispatch({
          type: 'loginbanner/saveBanner',
          payload: {
            fileId: response.data.fileId,
            createStaffId: Util.getStaffId(),
          }
        });

        dispatch({
          type: 'loginbanner/save',
          payload: {
            fileInfo: response.data,
          }
        })

      } else {
        message.error("上传图片失败:" + response.msg);
      }

    }
  }


  componentWillMount() {
    const {dispatch} = this.props;

    dispatch({
      type: 'loginbanner/queryBanner',
    });
  }

  render() {
    const {fileInfo, loading} = this.props;

    const uploadButton = (
      <div  style={{width: '180px', height: 'auto'}}>
        <Icon type={'plus'}/>
        <div style={{width: '180px', height: 'auto'}} className="ant-upload-text">请选择登录背景图</div>
      </div>
    );


    let imageUrl = '';
    if (fileInfo) {
      imageUrl = `api${fileInfo.url}\/${fileInfo.fileName}`;
    }


    return (
      <div >

        <Upload
          listType="picture-card"
          className="avatar-uploader"
          accept=".jpg,.gif,.png,.bmp"
          showUploadList={false}
          action="../api/zuul/fileserver/upLoad"
          data={{
            fileType: 'logo',
            createStaffId: Util.getStaffId(),
          }}

          onChange={this.handleChange}

          beforeUpload={this.beforeFileUpload}
        >
          <Spin spinning={loading}>
            {fileInfo ? <img src={imageUrl} alt="avatar" style={{width: 'auto', height: 'auto',maxWidth:'320px'}}/> : uploadButton}
          </Spin>
        </Upload>,
        <div >图片格式：1920px*900px</div>
      </div>
    );
  }
}
export default connect(state => ({
    ...state.loginbanner,
    loading: state.loading.models.loginbanner
  })
)(LoginBanner);
