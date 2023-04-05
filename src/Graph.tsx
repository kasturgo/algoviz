import React, { FC, useRef, useEffect, useState } from 'react';
import { Graph, Node } from './App';

interface GraphCanvasProps {
  graph: Graph;
  width: number;
  height: number;
  addNode: (node: Node)=> void;
  addEdge: (src: number, dest: number) => void;
}

const GraphCanvas: FC<GraphCanvasProps> = ({ graph, width, height, addNode, addEdge }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(-1);
  const [letter, setLetter] = useState<string>('A');
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, width + 200, height + 200);

    // Calculate the positions of the nodes
    const positions: { x: number; y: number }[] = [];
    for (let i = 0; i < graph.nodes.length; i++) {
      var node = graph.nodes[i];
      const x = node.positionX;
      const y = node.positionY;
      positions.push({ x, y });
    }

    // Draw the edges
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    for (const edge of graph.edges) {
      var { from, to, isEdge } = edge;
      if (graph.edges.filter((e) => e.to == from && e.from == to)[0]?.isEdge == true)
      {
        isEdge = true;
      }
      const fromPos = positions[from];
      const toPos = positions[to];
      
      ctx.beginPath();
      ctx.moveTo(fromPos.x, fromPos.y);
      ctx.lineTo(toPos.x, toPos.y);
      if (isEdge == true)
      {
        ctx.strokeStyle = 'red';
      }
      else if (isEdge == false)
      {
        ctx.strokeStyle = 'green';
      }
      else {
        ctx.strokeStyle = 'black';
      }
      ctx.stroke();
      const midX = (fromPos.x + toPos.x) / 2;
      const midY = (fromPos.y + toPos.y) / 2;
      const arrowSize = 10; // size of the arrowhead
        const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x); // calculate angle of line segment
        const arrowX = midX + arrowSize * Math.cos(angle); // calculate x coordinate of arrowhead
        const arrowY = midY + arrowSize * Math.sin(angle); // calculate y coordinate of arrowhead
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX - arrowSize * Math.cos(angle - Math.PI / 6), arrowY - arrowSize * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(arrowX - arrowSize * Math.cos(angle + Math.PI / 6), arrowY - arrowSize * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = 'black';
        ctx.fill(); // draw the arrowhead
    }

    // Draw the nodes
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < graph.nodes.length; i++) {
      const pos = positions[i];
      var node = graph.nodes[i];
      ctx.beginPath();
      ctx.setLineDash([]);
      console.log(selectedNodeIndex);
      if (i == selectedNodeIndex)
      {
        ctx.setLineDash([5, 5]);
      }
      else if (i == graph.currentActive)
      {
        ctx.strokeStyle = "green";
      }
      else if (graph.stack.indexOf(i) != -1)
      {
        ctx.strokeStyle = "green";
      }
      else{
        ctx.strokeStyle = node.color;
      }
      
      if (graph.nodes[i].componentRoot == true)
      {
        ctx.fillStyle = node.color;
      }

      ctx.arc(pos.x, pos.y, 40, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "red";
      ctx.fillText(node.name + ",D=" + node.discoveryTime + ",L=" + node.low + ",V=" + node.visited, pos.x, pos.y - 50);
      
      ctx.fillStyle = "white";
    }

    drawStack(ctx, width, 10, 80, 30, 10);

    function drawStack(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, padding: number) {

        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let i = graph.stack.length - 1; i >= 0; i--) {
          const item = graph.nodes[graph.stack[i]].name;
          const text = item.toString();
          const textX = x + width / 2;
          const textY = y + height / 2;
          ctx.fillStyle = '#ccc';
          ctx.fillRect(x, y, width, height);
          ctx.fillStyle = '#000';
          ctx.fillText(text, textX, textY);
          y += height + padding;
        }
      }

       
  }, [graph, width, height, selectedNodeIndex]);

  

  const handleIncrement = () => {
    const nextLetterCode = letter.charCodeAt(0) + 1;
    if (nextLetterCode > 90) {
      // wrap around to 'A' if we go past 'Z'
      setLetter('A');
    } else {
      setLetter(String.fromCharCode(nextLetterCode));
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // check if a node was clicked
    for (let i = 0; i < graph.nodes.length; i++) {
        const node = graph.nodes[i];
        const dx = x - node.positionX;
        const dy = y - node.positionY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= 40) {
          console.log("Distance is " + dist);
          if (selectedNodeIndex == - 1)
          {  
            setSelectedNodeIndex(i);
            return;
          }
          else
          {
            addEdge(selectedNodeIndex, i);
            setSelectedNodeIndex(-1);
            return;
          }
        }
      }
    // Create a new node at the clicked position
    const node: Node = {
      name: letter,
      discoveryTime: -1,
      low: -1,
      visited: false,
      positionX: x,
      positionY: y,
      color: 'black',
      componentRoot: false
    };
    addNode(node);
    handleIncrement();
  }; 

  return (
    <canvas
      ref={canvasRef}
      width={width + 100}
      height={height + 100}
      style={{ border: '1px solid #000000' }}
      onClick={handleCanvasClick}
    />
  );
};

export default GraphCanvas;
