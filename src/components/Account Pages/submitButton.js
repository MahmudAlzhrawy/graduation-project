"use client";
import React from 'react'
import { CgSpinner } from "react-icons/cg";
import { FiCheckCircle } from "react-icons/fi";

function SubmitButton({ submitButtonStatus, HandleSubmitButton }) {

    if (submitButtonStatus.loading && submitButtonStatus.isSubmitted) {
        return (
            <button
                className="translate-x-[5%] py-3 px-4 bg-blue-700 w-[50%] mx-auto rounded-md hover:brightness-90 text-white font-bold"
                type="submit"
                disabled
            >
                <CgSpinner className="inline w-4 h-4 me-3 text-white animate-spin" />
                <span>{submitButtonStatus.submitButtonText}</span>
            </button>
        )
    }
    else if (submitButtonStatus.loading === false && submitButtonStatus.isSubmitted) {
        return (
            <button
                className="translate-x-[5%] py-3 px-4 bg-blue-700 w-[50%] mx-auto rounded-md hover:brightness-90 text-white font-bold"
                type="submit"
                disabled
            >
                <FiCheckCircle className="inline w-4 h-4 me-3 text-white " />
                <span>{submitButtonStatus.submitButtonText}</span>
            </button>
        )
    }
    else {
        return (
            <button
                className="translate-x-[5%] py-3 px-4 bg-blue-700 w-[50%] mx-auto rounded-md hover:brightness-90 text-white font-bold"
                type="submit"
                onClick={() => {
                    HandleSubmitButton(true);
                }}
            >

                <span>{submitButtonStatus.submitButtonText}</span>
            </button>
        )
    }
}

export default SubmitButton