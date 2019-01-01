import { Tree, TreeNode } from './Model'

export class CytoscapeExport {
  public static renderNodeInformation(node: TreeNode): any {
    return {
      data: {
        id: node.sourceEdge.hash(),
        label: this.renderLabel(node.value)
      }
    }
  }
  public static toDot(tree: Tree): string {
    let i = 1
    let leaveEdges = Object.values(tree.edges)
      .map(e => e.node)
      .map(node => node.leafes())
      .reduce((a, b) => a.concat(b), [])
      .map(leave => leave.branch())

    const allEdges: Array<any> = []
    const nodeInformation: {[s: string]: any} = {}
    leaveEdges.map(edges => edges.reduce( (prev, current) => {
        let currentHash = current.sourceEdge.hash()
        nodeInformation[currentHash] = this.renderNodeInformation(current)
        if (current && prev) {
          allEdges.push({
            data: {
              id: prev.sourceEdge.hash()+currentHash,
              source: prev.sourceEdge.hash(),
              target: currentHash,
              label: this.renderLabel(current.sourceEdge.name)
            }
          })
        }
        return current
    }))

    return JSON.stringify(
      [this.renderNodeInformation(tree)]
        .concat(Object.values(nodeInformation))
        .concat(allEdges), undefined, '  '
    )
  }

  private static renderLabel(value: any): string {
    let str;
    if(!isNaN(value)) {
      str = value
    } else {
      str = JSON.stringify(value)
      if(str && str.length > 0) {
        str = str.slice(1, -1)
      }
    }

    if (!str) {
      return ""
    }

    if(str.length > 20) {
      str = str.slice(0, 20)+'…'
    }

    return str
  }
}
