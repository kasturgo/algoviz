export type NodeType = {
    id: number;
    x: number;
    y: number;
    discoveryTime: number;
    low: number;
  };
  
  export type EdgeType = {
    source: NodeType;
    target: NodeType;
  };
  
  export type GraphType = {
    nodes: NodeType[];
    edges: EdgeType[];
  };
  