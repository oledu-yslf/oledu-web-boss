import React from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import {Upload, Icon, Button, message, Spin} from 'antd';
import * as Util from '@/utils/util'

class Logo extends React.Component {

  beforeFileUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' ||
      file.type == 'image/x-ms-bmp' || file.type == 'image/gif';
    if (!isJpgOrPng) {
      message.error('只能上传jpeg、png、bmp、gif格式的文件');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片最大支持 2MB!');
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
          type: 'logo/saveLogo',
          payload: {
            fileId: response.data.fileId,
            createStaffId: Util.getStaffId(),
          }
        });

        dispatch({
          type: 'logo/save',
          payload: {
            logoFileInfo: response.data,
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
      type: 'logo/queryLogo',
    });
  }

  render() {
    const {logoFileInfo, loading} = this.props;

    const uploadButton = (
      <div >
        <Icon type={'plus'}/>
        <div style={{width: '240px', height: '120px'}} className="ant-upload-text">请选择Logo</div>
      </div>
    );


    let imageUrl = '';
    if (logoFileInfo) {
      imageUrl = `api${logoFileInfo.url}\/${logoFileInfo.fileName}`;
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
            {logoFileInfo ? <img src={imageUrl} alt="avatar" style={{width: '240px', height: '120px'}}/> : uploadButton}
          </Spin>
        </Upload>,

      </div>
    );
  }
}
export default connect(state => ({
    ...state.logo,
    loading: state.loading.models.logo
  })
)(Logo);
