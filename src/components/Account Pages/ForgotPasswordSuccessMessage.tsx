"use client";
import React from "react";
import styled, { keyframes } from "styled-components";
import { slideInLeft, fadeOutRight } from "react-animations";
import { FiCheck } from "react-icons/fi";
import { stage } from "./ErrorMessageForLoginPage";
type Props = {
  SuccessMessageShowed: boolean;
  successMessage: string;
  stageAnimations: stage.first | stage.second;
};
// Create a styled component for the slide-in animation
const SlideIn = styled.div`
  animation: 1s ${keyframes`${slideInLeft}`} ease-in-out;
`;
const FadeOut = styled.div`
  animation: 1s ${keyframes`${fadeOutRight}`} ease-in-out;
`;

function ForgotPasswordSuccessMessage(props: Props) {
  console.log("render ErrorMessageForLoginPage");
  if (props.SuccessMessageShowed && props.stageAnimations === stage.first) {
    return (
      <SlideIn>
        <div
          className={"bg-red-500 flex flex-nowrap w-[450px] h-[80px] pt-2 pb-2"}
        >
          <div className="flex justify-center items-center h-full">
            <FiCheck className="text-6xl text-white inline" />
          </div>
          <div className="flex justify-center items-center w-[80%] mx-auto h-full text-center">
            <span className="text-base text-white font-sans font-base">
              {props.successMessage}!!
            </span>
          </div>
        </div>
      </SlideIn>
    );
  } else if (
    props.SuccessMessageShowed &&
    props.stageAnimations === stage.second
  ) {
    return (
      <FadeOut>
        <div
          data-twe-animation-start="manually"
          className="bg-red-500 flex flex-nowrap w-[450px] h-[80px] pt-2 pb-2"
        >
          <div className="flex justify-center items-center h-full">
            <FiCheck className="text-6xl text-white inline" />
          </div>
          <div className="flex justify-center items-center w-[80%] mx-auto h-full text-center">
            <span className="text-base text-white font-sans font-base">
              {props.successMessage}!!
            </span>
          </div>
        </div>
      </FadeOut>
    );
  }
}
export default ForgotPasswordSuccessMessage;
