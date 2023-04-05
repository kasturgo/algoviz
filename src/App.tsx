import React, { Component, useState } from 'react';
import GraphCanvas from './Graph';

type Edge = {
  from: number;
  to: number;
  isEdge: boolean | null
};

export interface Graph {
  edges: Edge[];
  nodes: Node[];
  currentActive: number;
  stack: number[];
}
export interface Node
{
    name: string;
    discoveryTime: number;
    low: number;
    visited: boolean;
    positionX: number;
    positionY: number;
    color: string;
    componentRoot: boolean
}

type TarjanResult = {
  bridges: Edge[];
  components: string[][];
};


interface ExampleComponentState {
  count: number;
  graph: Graph,
  result: TarjanResult
}

class ExampleComponent2 extends Component<{}, ExampleComponentState> {
  constructor(props: {}) {
    super(props);

    function getEdges(source: number, dest: number): Array<Edge>
    {
      return [{ from: source, to: dest, isEdge: null }/*, { from: dest, to: source, isEdge: null }*/]
    }



    var graph: Graph = {
      edges: [], //edges,
      nodes:[],
      currentActive: -1,
      stack: []
    };
    const emptyResult: TarjanResult = {
      bridges: [],
      components: []
    };
    this.state = {
      count: 0,
      graph: graph,
      result: emptyResult
    };
  }

  async findBridges(): Promise<TarjanResult> {
  const visited: boolean[] = new Array(this.state.graph.nodes.length).fill(false);
  const ids: number[] = new Array(this.state.graph.nodes.length).fill(-1);
  const low: number[] = new Array(this.state.graph.nodes.length).fill(-1);
  const onStack: boolean[] = new Array(this.state.graph.nodes.length).fill(false);
  const stack: number[] = [];

  let id = 0;
  const components: string[][] = [];
  const bridges: Edge[] = [];

  async function waitForEnter(): Promise<void> {
    return new Promise(resolve => {
      document.addEventListener("keydown", function handler(event) {
        if (event.key === "Enter") {
          document.removeEventListener("keydown", handler);
          resolve();
        }
      });
    });
  }

  async function waitOneSecond(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 2000));
  }  

  const dfs = async (v: number, parent: number) => {
    console.log("Waiting for user input at node " + v);
    await waitOneSecond();
    console.log("Got input");
    console.log(id);
    visited[v] = true;
    ids[v] = id;
    low[v] = id;
    this.setState((prevState) => {
      // Create a new copy of the graph state object
      var currentId = id;
      const newGraph = { ...prevState.graph };
      // Update the node at the specified index with the new data
      newGraph.nodes[v].visited = true;
      newGraph.nodes[v].discoveryTime = currentId;
      newGraph.nodes[v].low = currentId;
      // Return the updated state object
      return { ...prevState, graph: newGraph };
    }, () => {id++});

    onStack[v] = true;
    stack.push(v);

    this.setState((prevState) => {
      // Create a new copy of the graph state object
      const newGraph = { ...prevState.graph };
      // Update the node at the specified index with the new data
      newGraph.stack = stack;
      // Return the updated state object
      return { ...prevState, graph: newGraph };
    });

    console.log("to nodes are: " + this.state.graph.edges.filter((e) => e.from === v).map((edge) => edge.to).join(","))

    for (const e of this.state.graph.edges.filter((e) => e.from === v)) {
      const w = e.to;

      if (!visited[w]) {
        await dfs(w, v);
        low[v] = Math.min(low[v], low[w]);

        this.setState((prevState) => {
          // Create a new copy of the graph state object
          const newGraph = { ...prevState.graph };
          // Update the node at the specified index with the new data
          newGraph.nodes[v].low = low[v];
          // Return the updated state object
          return { ...prevState, graph: newGraph };
        });
      } else if (onStack[w]) {
        low[v] = Math.min(low[v], ids[w]);
        this.setState((prevState) => {
          // Create a new copy of the graph state object
          const newGraph = { ...prevState.graph };
          // Update the node at the specified index with the new data
          newGraph.nodes[v].low = low[v];
          // Return the updated state object
          return { ...prevState, graph: newGraph };
        });
      }
    }

    if (ids[v] === low[v]) {
      await waitOneSecond();
      console.log("Component found rooted at " + this.state.graph.nodes[v].name);
      const component: string[] = [];
      let w = -1;
      var color: string = getRandomColor();
      this.setState((prevState) => {
        // Create a new copy of the graph state object
        const newGraph = { ...prevState.graph };
        // Update the node at the specified index with the new data
        newGraph.stack = stack;
        newGraph.nodes[v].componentRoot = true;
        // Return the updated state object
        return { ...prevState, graph: newGraph };
      });
      while (w !== v) {
        await waitOneSecond();
        w = stack.pop()!;

        this.setState((prevState) => {
          // Create a new copy of the graph state object
          const newGraph = { ...prevState.graph };
          // Update the node at the specified index with the new data
          newGraph.stack = stack;
          newGraph.nodes[w].color = color;
          // Return the updated state object
          return { ...prevState, graph: newGraph };
        });
        onStack[w] = false;
        component.push(this.state.graph.nodes[w].name);
      }
      console.log("Component " + JSON.stringify(component));
      components.push(component);
    }
  };

  function getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const dfs2 = async (v: number, parent: number) => {
    console.log("Waiting for user input at node " + v);
    await waitOneSecond();
    console.log("Got input");
    console.log(id);
    visited[v] = true;
    ids[v] = id;
    low[v] = id;
    this.setState((prevState) => {
      // Create a new copy of the graph state object
      var currentId = id;
      const newGraph = { ...prevState.graph };
      // Update the node at the specified index with the new data
      newGraph.nodes[v].visited = true;
      newGraph.nodes[v].discoveryTime = currentId;
      newGraph.nodes[v].low = currentId;
      // Return the updated state object
      return { ...prevState, graph: newGraph };
    }, () => {id++});

    // onStack[v] = true;
    stack.push(v);

    this.setState((prevState) => {
      // Create a new copy of the graph state object
      const newGraph = { ...prevState.graph };
      // Update the node at the specified index with the new data
      newGraph.stack = stack;
      // Return the updated state object
      return { ...prevState, graph: newGraph };
    });

    console.log("to nodes are: " + this.state.graph.edges.filter((e) => e.from === v).map((edge) => edge.to).join(","))

    for (const e of this.state.graph.edges.filter((e) => e.from === v)) {
      const w = e.to;

      if (!visited[w]) {
        await dfs2(w, v);
        low[v] = Math.min(low[v], low[w]);

        this.setState((prevState) => {
          // Create a new copy of the graph state object
          const newGraph = { ...prevState.graph };
          // Update the node at the specified index with the new data
          newGraph.nodes[v].low = low[v];
          // Return the updated state object
          return { ...prevState, graph: newGraph };
        });

        if (low[w] > ids[v]) {
          console.log("Bridge found from " + v + " to " + w);
          bridges.push({ from: v, to: w, isEdge: true });
          this.setState((prevState) => {
            // Create a new copy of the graph state object
            const newGraph = { ...prevState.graph };
            // Update the node at the specified index with the new data
            newGraph.edges.filter((edge) => {return edge.from === v && edge.to === w})[0].isEdge = true;
            // Return the updated state object
            return { ...prevState, graph: newGraph };
          });
        }
      } else if (visited[w] && w !== parent) {
        low[v] = Math.min(low[v], ids[w]);
        this.setState((prevState) => {
          // Create a new copy of the graph state object
          const newGraph = { ...prevState.graph };
          // Update the node at the specified index with the new data
          newGraph.nodes[v].low = low[v];
          // Return the updated state object
          return { ...prevState, graph: newGraph };
        });
      }
    }
    await waitOneSecond();
    stack.pop();
    this.setState((prevState) => {
      // Create a new copy of the graph state object
      const newGraph = { ...prevState.graph };
      // Update the node at the specified index with the new data
      newGraph.stack = stack;
      // Return the updated state object
      return { ...prevState, graph: newGraph };
    });
  };
  console.log("In find bridges")
  //await waitForEnter();
  for (let v = 0; v < this.state.graph.nodes.length; v++) {
    if (!visited[v]) {
      console.log("DFS started")
      await dfs(v, -1);
    }
  }

  return {
    components,
    bridges,
  };
}

  async start(): Promise<void> {
    console.log("Started")
    const result: TarjanResult = await this.findBridges();
    console.log("done")
    console.log(JSON.stringify(result));
  }

  async addNode(node: Node)
  {
    console.log("in add node");
    this.setState((prevState) => {
      // Create a new copy of the graph state object
      const newGraph = { ...prevState.graph };
      // Update the node at the specified index with the new data
      if (newGraph.nodes.filter((n) => n.name == node.name).length > 0)
      {
        return;
      }
      newGraph.nodes.push(node);
      console.log(JSON.stringify(newGraph.nodes))
      // Return the updated state object
      return { ...prevState, graph: newGraph };
    });
  }

  async addEdge(src: number, dest: number)
  {
    this.setState((prevState) => {
      // Create a new copy of the graph state object
      const newGraph = { ...prevState.graph };
      // Update the node at the specified index with the new data
      newGraph.edges.push({from: src, to: dest, isEdge: null})
      // Return the updated state object
      return { ...prevState, graph: newGraph };
    });
  }

  render() {
    return (
      <div style={{ display: "flex", alignItems: "top" }}>
        <GraphCanvas graph={this.state.graph} width={900} height={600} addNode={this.addNode.bind(this)} 
        addEdge={this.addEdge.bind(this)}></GraphCanvas>
        <div style={{ marginLeft: "20px" }}>
          <ul style={{ listStyle: "disc", marginLeft: "20px" }}>
            <li>To create node, click anywhere in the canvas</li>
            <li>To create an edge, click on an existing node (and it turns into a dotted circle) and then click on target node.
              Check image below.
              <img src="./create_edge.gif" alt="Logo" style={{ width: "250px", marginTop: "20px"}}/>
            </li>
            <li>To create a bidirectional edge, do above step two times but reversing source and destination second time.</li>
            <li>Once the graph is built, click on button below to start algorithm<br/>
              <button id="start" onClick={()=>this.start()}>Start</button>
            </li>
            <li>
              Algorithm works by DFS and pushing all visited nodes on to the stack. If it encounters and node which is already visited,
              it checks if it is part of the stack. If it is part of the stack, low value of the current node is updated to reflect that 
              there is path from current node to the node on the stack and also there is a path from node on the stack to current node.
              Basically, they are strongly connected.
            </li>
            <li>If a node's discovery time equals to the value of the lowest discoverd node from where it is reachable, d == v, that is root of SCC
              and stack will be popped until that node is found on the stack. Root of SCC will be filled in solid color and other nodes in SCC will have same color border
            </li>
          </ul>
          
        </div>
      </div>
    );
  }
}

const App = () => {
  return (
    <div>
      <h1>Tarjan's Algorithm for finding SCCs in a directed graph</h1>
      <ExampleComponent2 />
    </div>
  );
};

export default App;
