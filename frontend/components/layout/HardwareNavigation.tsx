'use client';

import React from 'react';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { 
  Wrench, 
  Zap, 
  Droplet, 
  Home, 
  Hammer,
  Shield,
  Lightbulb,
  PaintBucket,
  ChevronRight
} from 'lucide-react';

const departments = [
  {
    title: 'Power Tools',
    icon: <Zap className="h-5 w-5" />,
    description: 'Cordless drills, saws, grinders',
    categories: [
      { name: 'Cordless Drills', href: '/products/power-tools/cordless-drills' },
      { name: 'Circular Saws', href: '/products/power-tools/circular-saws' },
      { name: 'Angle Grinders', href: '/products/power-tools/angle-grinders' },
      { name: 'Impact Drivers', href: '/products/power-tools/impact-drivers' },
      { name: 'Rotary Hammers', href: '/products/power-tools/rotary-hammers' },
    ],
    featured: [
      { name: 'DeWalt 18V Drill Kit', href: '/products/dw-dcd780c2' },
      { name: 'Milwaukee M18 Fuel', href: '/products/mw-2712-20' },
    ]
  },
  {
    title: 'Hand Tools',
    icon: <Hammer className="h-5 w-5" />,
    description: 'Wrenches, sockets, pliers',
    categories: [
      { name: 'Socket Sets', href: '/products/hand-tools/socket-sets' },
      { name: 'Wrenches', href: '/products/hand-tools/wrenches' },
      { name: 'Pliers', href: '/products/hand-tools/pliers' },
      { name: 'Screwdrivers', href: '/products/hand-tools/screwdrivers' },
      { name: 'Tool Boxes', href: '/products/hand-tools/tool-boxes' },
    ],
    featured: [
      { name: 'Chrome Vanadium Set', href: '/products/skt-cv-145' },
      { name: 'Pipe Wrench Set', href: '/products/pw-ss-set3' },
    ]
  },
  {
    title: 'Electrical',
    icon: <Lightbulb className="h-5 w-5" />,
    description: 'Wiring, lighting, circuit breakers',
    categories: [
      { name: 'Electrical Wire', href: '/products/electrical/wire' },
      { name: 'Circuit Breakers', href: '/products/electrical/breakers' },
      { name: 'Lighting', href: '/products/electrical/lighting' },
      { name: 'Switches & Outlets', href: '/products/electrical/switches' },
      { name: 'Conduit & Fittings', href: '/products/electrical/conduit' },
    ],
    featured: [
      { name: 'Copper Wire 2.5mm', href: '/products/ew-cu-25' },
      { name: 'LED Panel Lights', href: '/products/led-panel-36w' },
    ]
  },
  {
    title: 'Plumbing',
    icon: <Droplet className="h-5 w-5" />,
    description: 'Pipes, fittings, valves',
    categories: [
      { name: 'PVC Pipes', href: '/products/plumbing/pvc-pipes' },
      { name: 'Pipe Fittings', href: '/products/plumbing/fittings' },
      { name: 'Valves', href: '/products/plumbing/valves' },
      { name: 'Water Pumps', href: '/products/plumbing/pumps' },
      { name: 'Sealants & Tapes', href: '/products/plumbing/sealants' },
    ],
    featured: [
      { name: 'PVC Pipe 1"', href: '/products/pvc-pipe-1' },
      { name: 'Brass Fittings Set', href: '/products/brass-fittings' },
    ]
  },
  {
    title: 'Building Materials',
    icon: <Home className="h-5 w-5" />,
    description: 'Cement, blocks, steel',
    categories: [
      { name: 'Cement', href: '/products/building/cement' },
      { name: 'Sandcrete Blocks', href: '/products/building/blocks' },
      { name: 'Steel Rods', href: '/products/building/steel' },
      { name: 'Roofing Sheets', href: '/products/building/roofing' },
      { name: 'Aggregates', href: '/products/building/aggregates' },
    ],
    featured: [
      { name: 'Dangote Cement', href: '/products/cement-dangote' },
      { name: '6" Sandcrete Blocks', href: '/products/blocks-6inch' },
    ]
  },
  {
    title: 'Safety Equipment',
    icon: <Shield className="h-5 w-5" />,
    description: 'Hard hats, gloves, safety gear',
    categories: [
      { name: 'Hard Hats', href: '/products/safety/hard-hats' },
      { name: 'Safety Gloves', href: '/products/safety/gloves' },
      { name: 'Safety Boots', href: '/products/safety/boots' },
      { name: 'Eye Protection', href: '/products/safety/eye-protection' },
      { name: 'Respirators', href: '/products/safety/respirators' },
    ],
    featured: [
      { name: 'Industrial Hard Hat', href: '/products/hard-hat-ansi' },
      { name: 'Leather Safety Gloves', href: '/products/gloves-leather' },
    ]
  },
];

export const HardwareNavigation: React.FC = () => {
  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600 font-medium bg-transparent">
            Shop by Department
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[800px] grid-cols-3 gap-6 p-6 bg-white">
              {departments.map((department) => (
                <div key={department.title} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="text-blue-600">
                      {department.icon}
                    </div>
                    <h4 className="font-semibold text-gray-900">{department.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{department.description}</p>
                  
                  <div className="space-y-2">
                    {department.categories.slice(0, 4).map((category) => (
                      <NavigationMenuLink asChild key={category.name}>
                        <Link
                          href={category.href}
                          className="block text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                        >
                          {category.name}
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                  
                  {department.featured.length > 0 && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 mb-1">Featured</p>
                      {department.featured.map((item) => (
                        <NavigationMenuLink asChild key={item.name}>
                          <Link
                            href={item.href}
                            className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                          >
                            <ChevronRight className="h-3 w-3 mr-1" />
                            {item.name}
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/brands"
              className="text-gray-700 hover:text-blue-600 font-medium px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              Brands
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/deals"
              className="text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded-md hover:bg-red-50 transition-colors"
            >
              Deals
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/pro-contractor"
              className="text-purple-600 hover:text-purple-700 font-medium px-4 py-2 rounded-md hover:bg-purple-50 transition-colors"
            >
              Pro Contractor
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default HardwareNavigation;
