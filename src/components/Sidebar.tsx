import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'

const Sidebar = () => {
  const [sidebarActive, setSidebarActive] = useState<boolean>();
  const router = useRouter()

  return (
    <>
      <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        onClick={() => setSidebarActive(!sidebarActive)}
      >
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
      </button>

      <aside id="default-sidebar" className={`fixed left-0 top-[4rem] z-40 w-[10rem] h-screen transition-transform ${sidebarActive ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`} aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto gradient-sidebar flex flex-col gap-20 text-white">
          <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className={`inline-flex items-center p-2 mt-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 bg-slate-500 mx-auto`}
            onClick={() => setSidebarActive(!sidebarActive)}
          >
            {/* <span className="sr-only">Open sidebar</span> */}
            <Icon icon="pajamas:close" width={20} className="text-white" />
          </button>
          <ul className="space-y-2 font-medium">
            <li>
              <Link href="/" className="flex items-center p-2 rounded-lg text-white hover:bg-slate-500 gap-2">
                <Icon icon="material-symbols:home" width={20} className="text-slate-100" /> Dashboard
              </Link>
            </li>
            <li>
              <Link href="/" className="flex items-center p-2 rounded-lg text-white hover:bg-slate-500 gap-2">
                <Icon icon="ic:twotone-content-copy" width={20} className="text-slate-100" /> Content
              </Link>
            </li>
            <li>
              <Link href="/curriculum" className="flex items-center p-2 rounded-lg text-white hover:bg-slate-500 gap-2">
                <Icon icon="streamline:business-user-curriculum" width={20} className="text-slate-100" /> Curriculum
              </Link>
            </li>
            <li>
              <Link href="/course" className="flex items-center p-2 rounded-lg text-white hover:bg-slate-500 gap-2">
                <Icon icon="tdesign:course" width={20} className="text-slate-100" /> Course
              </Link>
            </li>
            <li>
              <Link href="/student" className="flex items-center p-2 rounded-lgtext-white hover:bg-slate-500 gap-2">
                <Icon icon="ph:student-fill" width={20} className="text-slate-100" />Student
              </Link>
            </li>
            <li>
              <Link href="/teacher" className="flex items-center p-2 rounded-lg text-white hover:bg-slate-500 gap-2">
                <Icon icon="ph:chalkboard-teacher-duotone" width={20} className="text-slate-100" />Teacher
              </Link>
            </li>
            <li>
              <Link href="/" className="flex items-center p-2 rounded-lg text-white hover:bg-slate-500 gap-2">
                <Icon icon="fluent-mdl2:open-enrollment" width={20} className="text-slate-100" />Enrollment
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
