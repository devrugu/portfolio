'use client';
import React from 'react';
import ReactFlow, { Background, Controls, MiniMap } from '@reactflow/core';
import type { Graph } from '@/lib/graphUtils';
import '@reactflow/core/dist/style.css';

interface Props {
  graph: Graph;
}

export default function AutomatonGraph({ graph }: Props) {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ReactFlow nodes={graph.nodes} edges={graph.edges} fitView>
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
