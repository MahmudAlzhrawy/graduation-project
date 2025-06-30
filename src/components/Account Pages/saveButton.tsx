"use client";
import React from "react";
import { CgSpinner } from "react-icons/cg";
import { FiCheckCircle } from "react-icons/fi";
type Props = {
  saveButtonStatus: {
    loading: boolean;
    saveButtonText: string;
    isSubmitted: boolean;
  };
  HandleSaveButton: (arg: boolean) => void;
};
function SaveButton(props: Props) {
  if (props.saveButtonStatus.loading && props.saveButtonStatus.isSubmitted) {
    return (
      <button
        className="w-40 translate-x-[5%] py-3 px-4 bg-red-600 mx-auto rounded-md hover:brightness-90 text-white font-bold"
        type="submit"
        disabled
      >
        <CgSpinner className="inline w-4 h-4 me-3 text-white animate-spin" />
        <span>{props.saveButtonStatus.saveButtonText}</span>
      </button>
    );
  } else if (
    props.saveButtonStatus.loading === false &&
    props.saveButtonStatus.isSubmitted
  ) {
    return (
      <button
        className="w-40 translate-x-[5%] py-3 px-4 bg-red-600 mx-auto rounded-md hover:brightness-90 text-white font-bold"
        type="submit"
        disabled
      >
        <FiCheckCircle className="inline w-4 h-4 me-3 text-white " />
        <span>{props.saveButtonStatus.saveButtonText}</span>
      </button>
    );
  } else {
    return (
      <button
        className="w-40 translate-x-[5%] py-3 px-4 bg-red-600 mx-auto rounded-md hover:brightness-90 text-white font-bold"
        type="submit"
        onClick={() => {
          props.HandleSaveButton(true);
        }}
      >
        <span>{props.saveButtonStatus.saveButtonText}</span>
      </button>
    );
  }
}

export default SaveButton;
