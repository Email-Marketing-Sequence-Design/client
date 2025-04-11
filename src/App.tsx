import "@/App.css";
import { useTranslation } from "react-i18next";
import LangSelector from "@/components/common/LangSelector";
import LightDarkMode from "./components/common/LightDarkMode";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

function App() {
  const { t } = useTranslation();
  const [data, setData] = useState("");

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  console.log("nodes: ", nodes);
  console.log("edges: ", edges);
  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
      console.log("edges: ", params);
    },

    [setEdges]
  );

  useEffect(() => {
    const fetchData = async () => {
      console.log(import.meta.env.VITE_API_URL);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}`);
      console.log(response.data);
      setData(response.data);
    };
    fetchData();
  }, []);
  return (
    <div className="h-full flex flex-col items-center ">
      <div className="mt-20 text-center">
        <h1 className="text-4xl font-bold  mb-4">{t("Welcome to React")}</h1>
        <p className="text-lg  mb-8">{data}</p>
        <div className="flex space-x-4">
          <LangSelector />
          <LightDarkMode />
        </div>
        <div className="w-screen h-[80svh]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default App;
