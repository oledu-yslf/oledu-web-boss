import React from 'react';
import { Tree } from 'antd';
import { connect } from 'dva';
const { TreeNode } = Tree;
class OTree extends React.Component {
  // state = {
  //   selectedKeys:[]
  // };
  renderTreeNodes = data => {
    if (data){
      return data.map(item => {
        if (item.childDepartVOList) {
          return (
            <TreeNode title={item.departName} key={item.departId} dataRef={item}>
              {this.renderTreeNodes(item.childDepartVOList)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            title={item.departName}
            key={item.departId}
            dataRef={item}
          />
        );
      });
    }
  };

  onSelect = (selectedKeys, info) => {
    const { dispatch } = this.props;
    if (selectedKeys.length > 0) {
      // this.setState({ selectedKeys });
      dispatch({
        type:'depart/save',
        payload:{
          selectedNodes: info.selectedNodes[0].props.dataRef,
          selectedKeys
        }
      })
    } else {
      this.setState({ selectedKeys: []});
      dispatch({
        type:'depart/save',
        payload:{
          selectedNodes: {},
          selectedKeys:[]
        }
      })
    }
    
  };

  render() {
    const { treeData ,selectedKeys} = this.props;
    
    return (
      <div>
        {treeData.length ? (
          <Tree
            onSelect={this.onSelect}
            selectedKeys={selectedKeys}
            defaultExpandAll = {true}
          >
            {this.renderTreeNodes(treeData)}
          </Tree>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default connect(state => ({
  ...state.depart,
  loading: state.loading.models.depart,
}))(OTree);
