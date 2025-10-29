import React from "react";
import CustomButton from "./Button";

export default function Model({show,onClose,children}: {show:boolean,onClose:()=>void,children?:React.ReactNode}) {

    if(!show){
        return null;
    }
  return(<>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10">
      <div className="bg-white rounded p-6">
        <CustomButton onClick={onClose} className="float-right text-xl">&times;</CustomButton>
        {children}
      </div>
    </div>
    </>
  )}