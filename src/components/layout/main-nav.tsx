"use client"

import React from "react"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Separator } from "@/components/ui/separator"
import { LightDarkImage } from "@/components/shared/light-dark-image"
import { siteConfig } from "@/config/menu/site"

import { LinkComponent } from "../shared/link-component"
import Image from "next/image"

export const integrationCategories = [
  "general",
  "protocols",
  "services",
] as const

export function MainNav() {
  return (
    <div className="mr-4 ml-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <div className="text-2xl">
          {siteConfig.emoji}
        </div>
        <span className="hidden bg-gradient-to-br from-black to-stone-500 bg-clip-text text-2xl font-bold text-transparent dark:from-stone-100 dark:to-yellow-200 sm:inline-block">
         {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center space-x-6 text-base font-medium">
        <MainNavMenu />
      </nav>
    </div>
  )
}

function MainNavMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Integrations</NavigationMenuTrigger>
          <NavigationMenuContent className="max-h-[768px] overflow-y-scroll">
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[768px] lg:grid-cols-3">
              {integrationCategories.map((category: string, idx:number) => (
                <div key={idx}>
                  <h4
                    key={category}
                    className="text-lg font-medium leading-none md:col-span-2 lg:col-span-3"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h4>
                  <Separator className="md:col-span-2 lg:col-span-3" />
                </div>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="https://docs.lastic.xyz/">
                <span>Documentation</span>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

interface NavMenuListItemProps {
  name: string
  description: string
  href: string
  lightImage: string
  darkImage: string
}

const NavMenuListItem = ({
  name,
  description,
  href,
  lightImage,
  darkImage,
}: NavMenuListItemProps) => {
  return (
    <li className="w-full min-w-full" key={name}>
      <NavigationMenuLink asChild>
        <a
          href={href}
          className="flex select-none flex-col gap-y-2 rounded-md p-3 leading-none no-underline outline-none transition-colors"
        >
          <div className="flex items-center gap-x-2">
            <LightDarkImage
              LightImage={lightImage}
              DarkImage={darkImage}
              alt="icon"
              height={24}
              width={24}
              className="h-6 w-6"
            />
            <span className="text-base font-medium leading-none">{name}</span>
          </div>
          <p className="line-clamp-2 text-sm leading-snug">
            {description}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
}
