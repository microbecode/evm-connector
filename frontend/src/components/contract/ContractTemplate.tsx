import React, { useState } from "react";
import { IFuncTemplate } from "../types";
import { contractTemplates } from "./templates";

interface Params {
  addTemplateFunctions: (functions: IFuncTemplate[]) => void;
}

export function ContractTemplate(params: Params) {
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);

  const templates = contractTemplates;

  const addFunctions = () => {
    params.addTemplateFunctions(templates[selectedTemplateIndex].functions);
  };

  return (
    <div>
      <label>Choose standard:</label>
      <select
        onChange={(e) => {
          setSelectedTemplateIndex(+e.target.value);
        }}
        value={selectedTemplateIndex}
      >
        {templates.map((template, index) => {
          return (
            <option key={index} value={index}>
              {template.name}
            </option>
          );
        })}
      </select>
      <input
        type="button"
        value="Import functions"
        onClick={addFunctions}
      ></input>
    </div>
  );
}
