import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  getSmoothStepPath
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

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    data.onColorChange(data._id, newColor);
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
      <Handle type="target" position={Position.Top} id="t" />
      <Handle type="source" position={Position.Top} id="t" />
      <Handle type="target" position={Position.Right} id="r" />
      <Handle type="source" position={Position.Right} id="r" />
      <Handle type="target" position={Position.Bottom} id="b" />
      <Handle type="source" position={Position.Bottom} id="b" />
      <Handle type="target" position={Position.Left} id="l" />
      <Handle type="source" position={Position.Left} id="l" />
      {data.isEmptyNode ? (
        <div className="absolute top-0 left-0 right-0 flex justify-center pt-1">
          <button
            onClick={() => data.onDelete(data._id)}
            className="bg-red-500 text-white px-1 py-0.5 rounded text-xs hover:bg-red-700 hover:text-white transition duration-300 ease-in-out"
            style={{ fontSize: '0.5rem' }}
          >
            X
          </button>
        </div>
      ) : data.isTextNode ? (
        <div className="flex flex-col items-center">
          <div className="whitespace-nowrap overflow-hidden text-center p-2 mt-9" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {data.textContent}
          </div>
          <div className="mb-3">
            <button
              onClick={() => data.onDelete(data._id)}
              className="bg-red-500 text-white px-1 py-0.5 rounded text-xs hover:bg-red-700 hover:text-white transition duration-300 ease-in-out"
            >
              X
            </button>
          </div>
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
          <div className="mt-2 flex justify-center">
            <button
              onClick={() => data.onEdit(data)}
              className="bg-blue-500 text-white px-2 py-1 rounded mr-2 text-xs hover:bg-blue-700 hover:text-white transition duration-300 ease-in-out"
            >
              Ubah
            </button>
            <button
              onClick={() => data.onDelete(data._id)}
              className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-700 hover:text-white transition duration-300 ease-in-out"
            >
              Hapus
            </button>
          </div>
          <input
            type="color"
            value={data.color || '#ffffff'}
            onChange={handleColorChange}
            className="mt-2"
          />
        </>
      )}
    </div>
  );
};

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  selected,
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeContextMenu = (evt) => {
    evt.preventDefault();
    if (data && typeof data.onDelete === 'function') {
      data.onDelete(id);
    }
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    if (data && typeof data.onColorChange === 'function') {
      data.onColorChange(id, newColor);
    }
  };

  return (
    <>
      <path
        id={id}
        style={{ ...style, stroke: data.color || '#000000' }}
        className="react-flow__edge-path"
        d={edgePath}
        onContextMenu={onEdgeContextMenu}
      />
      {selected && (
        <foreignObject
          width={80}
          height={40}
          x={labelX - 40}
          y={labelY - 20}
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div className="flex items-center justify-between bg-white p-1 rounded">
            <input
              type="color"
              value={data.color || '#000000'}
              onChange={handleColorChange}
              className="w-6 h-6 mr-1"
            />
            <div
              className="bg-red-500 text-white text-center rounded cursor-pointer px-2"
              onClick={(event) => {
                event.stopPropagation();
                if (data && typeof data.onDelete === 'function') {
                  data.onDelete(id);
                }
              }}
            >
              X
            </div>
          </div>
        </foreignObject>
      )}
    </>
  );
};

const nodeTypes = {
  familyNode: FamilyMemberNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const AdminTaromboPage = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    photo: null,
    birthDate: '',
    bio: '',
    isEmptyNode: false,
    isTextNode: false,
    textContent: ''
  });
  const navigate = useNavigate();
  const [showFamilyData, setShowFamilyData] = useState(false);
  const [familyData, setFamilyData] = useState([]);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addType, setAddType] = useState('family');
  const [isLoading, setIsLoading] = useState(false);

  const handleNodeColorChange = useCallback(async (nodeId, newColor) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`https://tarombo-sinaga-api.vercel.app/api/family-members/${nodeId}/color`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ color: newColor }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update node color: ${errorData.message || response.statusText}`);
      }

      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, color: newColor } } : node
        )
      );
    } catch (error) {
      console.error('Error updating node color:', error);
      alert('Failed to update node color: ' + error.message);
    }
  }, [setNodes]);

  const handleEdgeColorChange = useCallback((edgeId, newColor) => {
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === edgeId ? { ...edge, data: { ...edge.data, color: newColor } } : edge
      )
    );
  }, [setEdges]);

  const handleDelete = useCallback(async (id) => {
    const confirmDelete = window.confirm(`Apakah yakin ingin menghapus?`);
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await fetch(`https://tarombo-sinaga-api.vercel.app/api/family-members/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setNodes((nds) => nds.filter((n) => n.id !== id));
          setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
        } else if (response.status === 403) {
          throw new Error('You do not have permission to delete this node');
        } else {
          const errorData = await response.json();
          throw new Error(`Failed to delete node: ${errorData.message || response.statusText}`);
        }
      } catch (error) {
        console.error('Error deleting node:', error);
        alert('Failed to delete node: ' + error.message);
      }
    }
  }, [setNodes, setEdges]);

  const handleEdit = useCallback((data) => {
    setSelectedMember(data);
    setFormData({
      name: data.name,
      photo: null,
      birthDate: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : '',
      bio: data.bio,
      isEmptyNode: data.isEmptyNode,
      isTextNode: data.isTextNode,
      textContent: data.textContent
    });
    setIsEditModalOpen(true);
  }, []);

  const fetchFamilyMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const response = await fetch('https://tarombo-sinaga-api.vercel.app/api/family-members', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
  
      if (response.status === 403) {
        throw new Error('You do not have permission to access family members');
      }
  
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
        data: { 
          ...member, 
          onEdit: handleEdit, 
          onDelete: handleDelete,
          onColorChange: handleNodeColorChange,
          color: member.color || '#ffffff'
        },
      }));
      setNodes(flowNodes);
      setIsDataLoaded(true);
    }
    catch (error) {
      console.error('Error fetching family members:', error);
      if (error.message.includes('No authentication token found')) {
        alert('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        alert('Failed to load family members: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [handleEdit, handleDelete, handleNodeColorChange, setNodes, navigate]);

  const handleDeleteEdge = useCallback((edgeId) => {
    setEdges((eds) => eds.filter((e) => e.id !== edgeId));
  }, [setEdges]);

  const fetchDiagramState = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const checkResponse = async (response, errorMessage) => {
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            throw new Error('Session expired. Please log in again.');
          }
          const errorData = await response.json();
          throw new Error(`${errorMessage}: ${errorData.message || response.statusText}`);
        }
        return response.json();
      };
  
      const diagramData = await fetch('https://tarombo-sinaga-api.vercel.app/api/family-diagram', {
        headers: { 'Authorization': `Bearer ${token}` },
      }).then(res => checkResponse(res, 'Failed to fetch diagram state'));
  
      if (diagramData && Array.isArray(diagramData.edges)) {
        setEdges(diagramData.edges.map(edge => ({
          ...edge,
          type: 'custom',
          data: { 
            onDelete: handleDeleteEdge,
            onColorChange: handleEdgeColorChange,
            color: edge.color || '#000000'
          }
        })));
      } else {
        console.warn('Unexpected diagram data structure:', diagramData);
      }
  
    } catch (error) {
      console.error('Error fetching diagram state:', error);
      if (error.message.includes('Session expired')) {
        alert(error.message);
        navigate('/login');
      } else {
        alert('Failed to load diagram state: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [setEdges, handleDeleteEdge, handleEdgeColorChange, navigate]);

  useEffect(() => {
    fetchFamilyMembers();
    fetchDiagramState();
  }, [fetchFamilyMembers, fetchDiagramState]);

  const handleInputChange = (e) => {
    if (e.target.name === 'photo') {
      setFormData({ ...formData, photo: e.target.files[0] });
    } else if (e.target.name === 'isEmptyNode' || e.target.name === 'isTextNode') {
      setFormData({ ...formData, [e.target.name]: e.target.checked });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const validateForm = () => {
    if (!formData.isEmptyNode && !formData.isTextNode) {
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      if (formData.birthDate && isNaN(new Date(formData.birthDate).getTime())) {
        throw new Error('Invalid birth date');
      }
    }
    if (formData.isTextNode && !formData.textContent.trim()) {
      throw new Error('Text content is required for text nodes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      validateForm();
  
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
  
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === 'photo' && formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else if (key !== 'photo') {
          formDataToSend.append(key, formData[key]);
        }
      }
  
      if (!reactFlowInstance) {
        throw new Error('React Flow instance not initialized');
      }
  
      // Calculate a new position for the node
      const newPosition = { 
        x: nodes.length * 250, 
        y: 0 
      };
      formDataToSend.append('position', JSON.stringify(newPosition));
  
      const url = selectedMember
        ? `https://tarombo-sinaga-api.vercel.app/api/family-members/${selectedMember._id}`
        : 'https://tarombo-sinaga-api.vercel.app/api/family-members';
      const method = selectedMember ? 'PUT' : 'POST';
  
      console.log(`Submitting ${method} request to ${url}`);
  
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
  
      if (response.status === 403) {
        throw new Error('You do not have permission to perform this action');
      }
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save family member: ${errorData.message || response.statusText}`);
      }
  
      const updatedMember = await response.json();
      console.log('Received updated member data:', updatedMember);
  
      setNodes((nds) => {
        let newNodes;
        if (selectedMember) {
          newNodes = nds.map((n) =>
            n.id === updatedMember._id ? { ...n, data: updatedMember, position: updatedMember.position } : n
          );
        } else {
          newNodes = [
            ...nds,
            {
              id: updatedMember._id,
              type: 'familyNode',
              position: newPosition,
              data: { ...updatedMember, onEdit: handleEdit, onDelete: handleDelete },
            },
          ];
        }
        return newNodes;
      });
  
      setSelectedMember(null);
      setFormData({ name: '', photo: null, birthDate: '', bio: '', isEmptyNode: false, isTextNode: false, textContent: '' });
      setIsEditModalOpen(false);
  
      alert(selectedMember ? 'Berhasil memperbarui' : 'Berhasil ditambahkan');
  
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      if (error.message.includes('No authentication token found')) {
        alert('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        alert('Failed to save family member: ' + error.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleFamilyDataClick = useCallback(() => {
    if (familyData.filter(member => !member.isEmptyNode && !member.isTextNode).length === 0) {
      fetchFamilyMembers();
    }
    setShowFamilyData(true);
  }, [familyData, fetchFamilyMembers]);

  const handleFamilyMemberClick = useCallback((member) => {
    const foundNode = nodes.find(node => node.id === member._id);
    if (foundNode && reactFlowInstance) {
      const x = foundNode.position.x + reactFlowWrapper.current.offsetWidth / 2 - 550;
      const y = foundNode.position.y + reactFlowWrapper.current.offsetHeight / 2 - 200;
      const zoom = 1.85;

      reactFlowInstance.setCenter(x, y, { zoom, duration: 1000 });
      setShowFamilyData(false);
    }
  }, [nodes, reactFlowInstance]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const saveDiagramState = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const updatedNodes = nodes.map(node => ({
        id: node.id,
        position: node.position,
        color: node.data.color
      }));
      await fetch('https://tarombo-sinaga-api.vercel.app/api/family-members/update-positions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedNodes),
      });
  
      const edgesData = edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        color: edge.data.color
      }));
      const response = await fetch('https://tarombo-sinaga-api.vercel.app/api/family-diagram/save-diagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ edges: edgesData }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save diagram: ${errorData.message || response.statusText}`);
      }
  
      alert('Diagram saved successfully!');
    } catch (error) {
      console.error('Error saving diagram state:', error);
      alert('Failed to save diagram state: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const onConnect = useCallback((params) => {
    setEdges((eds) => {
      const newEdge = {
        ...params,
        type: 'custom',
        data: { 
          onDelete: handleDeleteEdge,
          onColorChange: handleEdgeColorChange,
          color: '#000000'
        },
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle
      };
      return addEdge(newEdge, eds);
    });
  }, [setEdges, handleDeleteEdge, handleEdgeColorChange]);

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleAddTypeChange = (e) => {
    setAddType(e.target.value);
  };

  const handleAddConfirm = () => {
    setSelectedMember(null);
    setFormData({
      name: '',
      photo: null,
      birthDate: '',
      bio: '',
      isEmptyNode: addType === 'empty',
      isTextNode: addType === 'text',
      textContent: ''
    });
    setIsEditModalOpen(true);
    setIsAddModalOpen(false);
  };

  const memoizedNodes = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onColorChange: handleNodeColorChange,
      },
    }));
  }, [nodes, handleEdit, handleDelete, handleNodeColorChange]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FFF8E5]">
      <header className="bg-[#8F6E0B] text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tarombo Admin</h1>
        <div className="flex items-center">
          <button
            onClick={saveDiagramState}
            disabled={isSaving}
            className={`bg-green-500 text-white px-4 py-2 rounded mr-4 ${
              isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
            }`}
          >
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button
            onClick={handleFamilyDataClick}
            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-700 mr-4 hover:text-white transition duration-300 ease-in-out"
          >
            Data Keluarga
          </button>
          <Link
            to="/admin-berita"
            className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-green-700 mr-4 hover:text-white transition duration-300 ease-in-out"
          >
            Edit Berita
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 hover:text-white transition duration-300 ease-in-out"
          >
            Keluar
          </button>
        </div>
      </header>
      <main className="container mx-auto mt-8">
        <h2 className="text-xl font-bold mb-4 text-[#8B0000] text-center">TAROMBO TOGA SINAGA - BONOR SUHUT NI HUTA</h2>
        <h2 className="text-lg font-bold mb-4 text-[#8B0000] text-center">HUTA SOSOR LONTUNG, PARBABA DOLOK, SAMOSIR</h2>
        <button
          onClick={handleAddClick}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 hover:text-white transition duration-300 ease-in-out mr-4"
        >
          Tambah
        </button>
        <div style={{ height: '600px', width: '100%' }} ref={reactFlowWrapper}>
          <ReactFlow
            nodes={memoizedNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            connectOnClick={false}
            edgesUpdatable={true}
            edgesFocusable={true}
            onInit={setReactFlowInstance}
            style={{ background: '#FFF8E5' }}
            minZoom={0.1}
            maxZoom={4}
          >
            <Controls />
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
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Tambah Anggota Keluarga</h2>
            <div className="mb-4">
              <label className="block mb-2">Type:</label>
              <select
                value={addType}
                onChange={handleAddTypeChange}
                className="w-full p-2 border rounded"
              >
                <option value="family">Anggota Keluarga</option>
                <option value="empty">Node Kosong</option>
                <option value="text">Node Tulisan</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsAddModalOpen
                  (false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Batal
              </button>
              <button
                onClick={handleAddConfirm}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">
              {selectedMember ? 'Edit Node' : 'Add New Node'}
            </h2>
            <form onSubmit={handleSubmit}>
              {!formData.isEmptyNode && !formData.isTextNode && (
                <>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nama"
                    className="w-full mb-2 p-2 border rounded"
                  />
                  <input
                    type="file"
                    name="photo"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="w-full mb-2 p-2 border rounded"
                  />
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="w-full mb-2 p-2 border rounded"
                  />
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Keterangan"
                    className="w-full mb-2 p-2 border rounded"
                  />
                </>
              )}
              {formData.isTextNode && (
                <textarea
                  name="textContent"
                  value={formData.textContent}
                  onChange={handleInputChange}
                  placeholder="Text Content"
                  className="w-full mb-2 p-2 border rounded"
                />
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTaromboPage;