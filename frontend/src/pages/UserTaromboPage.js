import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

const FamilyDataPopup = ({ familyData, onClose, onMemberClick }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFamilyData = familyData.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) && !member.isEmptyNode && !member.isTextNode
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Data Keluarga</h2>
        <input
          type="text"
          placeholder="Cari anggota keluarga..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <ul>
          {filteredFamilyData.map(member => (
            <li
              key={member._id}
              className="mb-2 p-2 border rounded cursor-pointer hover:bg-gray-100"
              onClick={() => onMemberClick(member)}
            >
              {member.name}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

const FamilyMemberNode = ({ data, width = '190px', height = '290px', textNodeHeight = '20px' }) => {
  const isEmptyNodeWidth = '30px';
  const isEmptyNodeHeight = '30px';

  const calculateTextNodeWidth = (text) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '16px Arial';
    return `${context.measureText(text).width + 20}px`;
  };

  return (
    <div
      className={`rounded shadow relative ${
        data.isEmptyNode ? 'p-2' : 'p-4'
      }`}
      style={{
        width: data.isEmptyNode ? isEmptyNodeWidth : data.isTextNode ? calculateTextNodeWidth(data.textContent) : width,
        height: data.isEmptyNode ? isEmptyNodeHeight : data.isTextNode ? textNodeHeight : height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: data.color || '#ffffff',
      }}
    >
      <Handle type="target" position={Position.Top} id="t" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Top} id="t" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Right} id="r" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} id="r" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Bottom} id="b" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} id="b" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} id="l" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left} id="l" style={{ opacity: 0 }} />
      {data.isEmptyNode ? (
        <div></div>
      ) : data.isTextNode ? (
        <div className="whitespace-nowrap text-center p-2 mb-1" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {data.textContent}
        </div>
      ) : (
        <>
          <img
            src={`data:image/webp;base64,${data.photo}`}
            alt={data.name}
            className="w-24 h-24 rounded-full object-cover mx-auto mb-2"
          />
          <h3 className="text-lg font-semibold text-center">{data.name}</h3>
          {data.birthDate && (
            <p className="text-sm text-center text-gray-600">
              {new Date(data.birthDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
          <p className="text-xs text-center mt-2 overflow-hidden" style={{ maxHeight: '3em', textOverflow: 'ellipsis' }}>
            {data.bio}
          </p>
        </>
      )}
    </div>
  );
};

const nodeTypes = {
  familyNode: FamilyMemberNode,
};

const UserTaromboPage = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [familyData, setFamilyData] = useState([]);
  const [showFamilyData, setShowFamilyData] = useState(false);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const fetchFamilyMembers = useCallback(async () => {
    try {
      const response = await fetch('https://tarombo-sinaga-api.vercel.app/api/family-members');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch family members: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      const nonEmptyMembers = data.filter(member => !member.isEmptyNode && !member.isTextNode);
      setFamilyData(nonEmptyMembers);
      const flowNodes = data.map((member) => ({
        id: member._id,
        type: 'familyNode',
        position: member.position || { x: 0, y: 0 },
        data: { ...member },
      }));
      setNodes(flowNodes);
    } catch (error) {
      console.error('Error fetching family members:', error);
      alert('Failed to load family members: ' + error.message);
    }
  }, [setNodes]);

  const fetchDiagramState = useCallback(async () => {
    try {
      const response = await fetch('https://tarombo-sinaga-api.vercel.app/api/family-diagram');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch diagram state: ${errorData.message || response.statusText}`);
      }
      const diagramData = await response.json();
      if (diagramData && Array.isArray(diagramData.edges)) {
        setEdges(diagramData.edges.map(edge => ({
          ...edge,
          type: 'smoothstep',
          style: { stroke: edge.color || '#000000' } // Ensure the color is loaded
        })));
      } else {
        console.warn('Unexpected diagram data structure:', diagramData);
      }
    } catch (error) {
      console.error('Error fetching diagram state:', error);
      alert('Failed to load diagram state: ' + error.message);
    }
  }, [setEdges]);

  useEffect(() => {
    fetchFamilyMembers();
    fetchDiagramState();
  }, [fetchFamilyMembers, fetchDiagramState]);

  const handleFamilyDataClick = useCallback(() => {
    if (familyData.filter(member => !member.isEmptyNode && !member.isTextNode).length === 0) {
      fetchFamilyMembers();
    }
    setShowFamilyData(true);
  }, [familyData, fetchFamilyMembers]);

  const handleFamilyMemberClick = useCallback((member) => {
  const foundNode = nodes.find(node => node.id === member._id);
  if (foundNode && reactFlowInstance) {
    const isMobile = window.innerWidth <= 768;

    let x, y, zoom;

    if (isMobile) {
      x = foundNode.position.x + reactFlowWrapper.current.offsetWidth / 2 - 150;
      y = foundNode.position.y + reactFlowWrapper.current.offsetHeight / 2 - 150;
      zoom = 2.5; // mobile
    } else {
      x = foundNode.position.x + reactFlowWrapper.current.offsetWidth / 2 - 550;
      y = foundNode.position.y + reactFlowWrapper.current.offsetHeight / 2 - 220;
      zoom = 1.85; // desktop
    }

    reactFlowInstance.setCenter(x, y, { zoom, duration: 1000 });
    setShowFamilyData(false);
  }
}, [nodes, reactFlowInstance]);

  const memoizedNodes = useMemo(() => nodes, [nodes]);
  const memoizedEdges = useMemo(() => edges, [edges]);

  return (
    <div className="min-h-screen bg-[#FFF8E5]">
      <header className="bg-[#8F6E0B] text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tarombo</h1>
        <div className="flex items-center">
          <button
            onClick={handleFamilyDataClick}
            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-700 mr-4 hover:text-white transition duration-300 ease-in-out"
          >
            Data Keluarga
          </button>
        </div>
      </header>
      <main className="container mx-auto mt-8">
        <h2 className="text-xl font-bold mb-4 text-[#8B0000] text-center">TAROMBO TOGA SINAGA - BONOR SUHUT NI HUTA</h2>
        <h2 className="text-lg font-bold mb-4 text-[#8B0000] text-center">HUTA SOSOR LONTUNG, PARBABA DOLOK, SAMOSIR</h2>
        <div style={{ height: '600px', width: '100%' }} ref={reactFlowWrapper}>
          <ReactFlow
            nodes={memoizedNodes}
            edges={memoizedEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            onInit={setReactFlowInstance}
            style={{ background: '#FFF8E5' }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            zoomOnScroll={true}
            panOnScroll={false}
            panOnScrollMode="free"
            panOnDrag={true}
            minZoom={0.1}
            maxZoom={4}
          >
            <MiniMap />
            <Background variant="dots" gap={30} size={1} color="#4D3C0A" />
          </ReactFlow>
        </div>
      </main>
      {showFamilyData && (
        <FamilyDataPopup
          familyData={familyData}
          onClose={() => setShowFamilyData(false)}
          onMemberClick={handleFamilyMemberClick}
        />
      )}
    </div>
  );
};

export default UserTaromboPage;
