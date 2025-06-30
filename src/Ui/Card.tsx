import { ReactNode } from "react";

export default function Card({
    children , 
    className,

}:{
    children:ReactNode,
    className?:string,
}){
    return(
        <div className={`  items-center  ${className}`}>
                {children}
        </div>
    )
}