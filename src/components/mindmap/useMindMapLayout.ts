import { ConnectionLineType } from 'reactflow';
import { generateMindMap } from '@/services/moanaAI';

const NODE_WIDTH = 320;
const VERTICAL_GAP = 450;
const HORIZONTAL_GAP = 120;

export function useMindMapLayout() {
  const calculateLayout = async (prompt: string) => {
    const result = await generateMindMap(prompt);
    const allNodes: any[] = [];
    const allEdges: any[] = [];

    if (!result?.maps) return { newNodes: [], newEdges: [] };

    result.maps.forEach((mapData: any, mapIndex: number) => {
      const getBranchWidth = (node: any): number => {
        if (!node.children || node.children.length === 0) return NODE_WIDTH + HORIZONTAL_GAP;
        return node.children.reduce((acc: number, child: any) => acc + getBranchWidth(child), 0);
      };

      const buildTree = (nodeData: any, parentId: string | null = null, level = 0, currentX = 0) => {
        const id = parentId ? `${parentId}-${nodeData.topic.replace(/\s/g, '').toLowerCase()}` : `root-${mapIndex}`;
        const totalBranchWidth = getBranchWidth(nodeData);
        const xPos = currentX + (totalBranchWidth / 2) - (NODE_WIDTH / 2);
        
        allNodes.push({
          id,
          position: { x: xPos, y: level * VERTICAL_GAP },
          data: { label: nodeData.topic, description: nodeData.description },
          // ... styles
        });

        if (nodeData.children) {
          let nextX = currentX;
          nodeData.children.forEach((child: any) => {
            buildTree(child, id, level + 1, nextX);
            nextX += getBranchWidth(child);
          });
        }
      };
      buildTree(mapData);
    });

    return { newNodes: allNodes, newEdges: allEdges };
  };

  return { calculateLayout };
}