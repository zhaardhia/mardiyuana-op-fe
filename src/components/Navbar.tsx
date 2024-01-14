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
          <p className="text-sm">Welcome, <strong>Operator</strong>!</p>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
