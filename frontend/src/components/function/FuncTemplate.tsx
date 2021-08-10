import React, { useState } from "react";
import { FunctionParam } from "../types";
import { functionTemplates } from "./templates";

interface Params {
    setFuncName: React.Dispatch<React.SetStateAction<string>>
    setFuncType: React.Dispatch<React.SetStateAction<string>>
    setFunctionInputParams: React.Dispatch<React.SetStateAction<FunctionParam[]>>
    setFunctionOutputParams: React.Dispatch<React.SetStateAction<FunctionParam[]>>
    setUseTemplate: React.Dispatch<React.SetStateAction<boolean>>
}

export function FuncTemplate(params : Params) {
    const [selectedTemplate, setSelectedTemplate] = useState<number>(0);

    const templates = functionTemplates;

    const selectTemplate = (index : number) => {
        setSelectedTemplate(index);
        const funcParams = templates[index];

        params.setUseTemplate(index > 0);

        params.setFuncName(funcParams.funcName);
        params.setFuncType(funcParams.funcType);
        params.setFunctionInputParams(funcParams.funcInputParams);
        params.setFunctionOutputParams(funcParams.funcOutputParams);
    }

    return (
    <div>
        <label>Select function template:</label>
        <select onChange={(e) => { selectTemplate(+e.target.value) }} value={selectedTemplate}>
        {templates.map((template, index) => {
            return (
            <option key={index} value={index}>{template.selectionTitle}</option>
            )})}    
        </select>
    </div>
  );
}
