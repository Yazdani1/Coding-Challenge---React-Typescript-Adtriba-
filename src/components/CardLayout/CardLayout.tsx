import React,{FC,ReactNode} from 'react'

import style from "./CardLayout.module.scss";

interface CardLayoutProps {
    children?: ReactNode,
    title?: string
}

const CardLayout:FC<CardLayoutProps> = ({children,title}) => {
  return (
    <div className={style.cardContainer}>
        <h5>{title}</h5>

        {children}

    </div>
  )
}

export default CardLayout