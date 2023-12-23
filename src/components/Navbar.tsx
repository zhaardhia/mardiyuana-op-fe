import React from 'react'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import Image from 'next/image'

const Navbar = () => {
  return (
    <nav className="fixed z-50 backdrop-blur-lg w-full bg-white">
      <div className="flex justify-between py-3 px-5 text-xl w-full mx-auto items-center">
        <Link href="/" className="flex gap-3">
          <Image src={"/my_logo.png"} width={25} height={20} alt={'mardiyuana logo'} />
          SMP Mardi Yuana
        </Link>
        <div className="flex items-center gap-3 p-2">
          <p className="text-sm">Welcome, Jamets</p>
          <div className="w-[2rem] h-[2rem] rounded-full bg-slate-100"></div>
          {/* <Link href="/" className={cn(
            "hover:border-[1px] hover:bg-slate-50 border-slate-300 p-1 rounded-xl w-[30px] h-[30px] flex justify-center"
          )}><Icon icon="mdi:creation-outline" /></Link> */}
          {/* <Link href="/profile" className="hover:border-[1px] hover:bg-slate-50 border-slate-300 p-1 rounded-xl w-[30px] h-[30px] flex justify-center"><Icon icon="iconamoon:profile" /></Link> */}
          
        </div>
      </div>
    </nav>
  )
}

export default Navbar
