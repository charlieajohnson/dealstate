"use client";
import { useEffect,useState } from "react";
export function ThemeToggle(){const[dark,setDark]=useState(false);useEffect(()=>setDark(document.documentElement.classList.contains("dark")),[]);return <button className="btn" type="button" aria-label={`Use ${dark?"light":"dark"} theme`} onClick={()=>{const next=!dark;setDark(next);document.documentElement.classList.toggle("dark",next);localStorage.setItem("dealstate-theme",next?"dark":"light")}}>{dark?"Light":"Dusk"}</button>}
