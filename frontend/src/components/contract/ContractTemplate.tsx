import React, { useState } from "react";
import { FunctionParam, IFuncTemplate } from "../types";
import { contractTemplates } from "./templates";

interface Params {
  /*   setFuncName: React.Dispatch<React.SetStateAction<string>>
    setFuncType: React.Dispatch<React.SetStateAction<string>>
    setFunctionInputParams: React.Dispatch<React.SetStateAction<FunctionParam[]>>
    setFunctionOutputParams: React.Dispatch<React.SetStateAction<FunctionParam[]>>
    setUseTemplate: React.Dispatch<React.SetStateAction<boolean>> */
  addTemplateFunctions: (functions: IFuncTemplate[]) => void;
}

export function ContractTemplate(params: Params) {
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);

  const templates = contractTemplates;

  const addFunctions = () => {
    params.addTemplateFunctions(templates[selectedTemplateIndex].functions);

    /*  const funcParams = templates[index];

        params.setUseTemplate(index > 0);

        params.setFuncName(funcParams.funcName);
        params.setFuncType(funcParams.funcType);
        params.setFunctionInputParams(funcParams.funcInputParams);
        params.setFunctionOutputParams(funcParams.funcOutputParams); */
  };

  return (
    <div>
      <label>Add functions from template:</label>
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
      <input type="button" value="Add functions" onClick={addFunctions}></input>
    </div>
  );
}
