import "./App.css";

import { useState } from "react";

import PixelContainer from "./components/PixelContainer";

import grid_sample from "./fixtures/grid";
import { INITIAL_TOOL_OPTIONS } from "./constants";

import type { Tool, ToolOption } from "./types/Tool";

import Navbar from "./components/Navbar";
import ToolConatiner from "./components/ToolConatiner";
import PublishToggleSwitch from "./components/PublishToggleSwitch";
import Title from "./components/Title";
import PixelSize from "./components/PixelSize";
import Dimensions from "./components/Dimensions";
import NewProject from "./components/NewProject";
import LoadProject from "./components/LoadProject";
import SaveProject from "./components/SaveProject";
import ResetProject from "./components/ResetProject";
import PreviewHandler from "./components/PreviewHandler";
import ColorPallete from "./components/ColorPallete";

function App() {
  const [grid, setGrid] = useState(JSON.parse(grid_sample));
  const [toolOptions, setToolOptions] = useState(INITIAL_TOOL_OPTIONS);
  const [selectedTool, setSelectedTool] = useState<Tool>("pen");
  const [columns, setColumns] = useState(20);
  const [rows, setRows] = useState(20);

  const handleChangeToolSize = ({
    tool,
    size,
  }: {
    tool: keyof ToolOption;
    size: number;
  }) => {
    setToolOptions((prevOptions) => {
      return {
        ...prevOptions,
        [tool]: {
          ...prevOptions[tool],
          size,
        },
      };
    });
  };

  return (
    <>
      <div className="min-h-screen bg-black">
        <Navbar />
        <main>
          <div className="mx-auto flex max-w-7xl flex-col justify-between md:flex-row">
            <div className="order-2 flex flex-grow flex-col justify-between md:order-1">
              <div className="flex flex-col items-center md:flex-row">
                <ToolConatiner
                  selectedTool={selectedTool}
                  toolOptions={toolOptions}
                  onChangeToolSize={handleChangeToolSize}
                  onChangeTool={({ tool }) => setSelectedTool(tool)}
                />
                <div className="flex flex-grow flex-col items-center p-10">
                  <div className="h-72 w-72 touch-none select-none sm:h-80 sm:w-80 md:h-96 md:w-96 lg:h-[32rem] lg:w-[32rem]  xl:h-[50rem] xl:w-[50rem]">
                    <PixelContainer
                      columns={columns}
                      rows={rows}
                      grid={grid}
                      onUpdateGrid={setGrid}
                      toolOptions={toolOptions}
                      selectedTool={selectedTool}
                    />
                  </div>
                </div>
              </div>
              <div className="ml-4 mr-4 mt-4 flex flex-col">
                <PreviewHandler />
                <div className="flex divide-x divide-gray-700 rounded bg-neutral-900">
                  <div className="p-4">
                    <div className="h-24 w-36 bg-black text-white">preview</div>
                  </div>
                  <div className="flex-grow">
                    <h1 className="text-white">Frames</h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 flex flex-col gap-6 divide-y divide-gray-700 bg-neutral-900 md:order-2">
              <div className="flex flex-col gap-2 p-4">
                <NewProject />
                <div className="flex grow justify-center gap-2">
                  <LoadProject />
                  <SaveProject />
                </div>
                <ResetProject />
              </div>
              <div className="flex flex-col gap-2 p-4">
                <div className="flex items-center">
                  <Dimensions />
                </div>
                <div className="flex items-center">
                  <PixelSize />
                </div>
                <div className="flex items-center">
                  <Title />
                </div>
              </div>
              <div className="flex justify-center p-4">
                <ColorPallete
                  toolOptions={toolOptions}
                  onChangeToolOptions={setToolOptions}
                  onChangeSelectedTool={setSelectedTool}
                ></ColorPallete>
              </div>
              <div className="p-4">
                <PublishToggleSwitch />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
