"use client"

import { ReactNode } from "react"
import { useTheme } from "next-themes"
import React from "react"

interface IsLightThemeProps {
  children: ReactNode
}

export const IsLightTheme = ({ children }: IsLightThemeProps) => {
  const { resolvedTheme } = useTheme()

  if (resolvedTheme === "light") return <>{children}</>

  return null
}
