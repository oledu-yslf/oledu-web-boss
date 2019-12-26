import React from 'react';
import { Tree } from 'antd';
import { connect } from 'dva';
const { TreeNode } = Tree;
class OTree extends React.Component {
  
  renderTreeNodes = data => {
    if (data){
      return data.map(item => {
        if (item.childRoleVOList) {
          return (
            <TreeNode title={item.roleName} key={item.roleId} dataRef={item}>
              {this.renderTreeNodes(item.childRoleVOList)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            title={item.roleName}
            key={item.roleId}
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
        type:'role/save',
        payload:{
          selectedNodes: info.selectedNodes[0].props.dataRef,
          selectedKeys
        }
      })
    } else {
      this.setState({ selectedKeys: []});
      dispatch({
        type:'role/save',
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
  ...state.role,
  loading: state.loading.models.role,
}))(OTree);
