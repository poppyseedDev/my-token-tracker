"use client"

import { ReactNode } from "react"
import { useAccount } from "wagmi"
import React from "react"

interface IsWalletDisconnectedProps {
  children: ReactNode
}

export const IsWalletDisconnected = ({
  children,
}: IsWalletDisconnectedProps) => {
  const { address } = useAccount()

  if (!address) return <>{children}</>

  return null
}
