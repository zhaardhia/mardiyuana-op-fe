import React from 'react'
import Layout from '@/components/Layout'
import { ModalAddCourse } from '@/components/course/ModalAddCourse'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const CourseDetail = () => {
  return (
    <Layout>
      <div className="w-[90%] mx-auto ">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl">Matematika Kelas 7</h1>
          <ModalAddCourse />
        </div>
        <hr />
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Matematika</AccordionTrigger>
            <AccordionContent>
              Kelas 7
            </AccordionContent>
            <AccordionContent>
              Kelas 8
            </AccordionContent>
            <AccordionContent>
              Kelas 9
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>IPA</AccordionTrigger>
            <AccordionContent>
              Kelas 7
            </AccordionContent>
            <AccordionContent>
              Kelas 8
            </AccordionContent>
            <AccordionContent>
              Kelas 9
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Bahasa Inggris</AccordionTrigger>
            <AccordionContent>
              Kelas 7
            </AccordionContent>
            <AccordionContent>
              Kelas 8
            </AccordionContent>
            <AccordionContent>
              Kelas 9
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Bahasa Indonesia</AccordionTrigger>
            <AccordionContent>
              Kelas 7
            </AccordionContent>
            <AccordionContent>
              Kelas 8
            </AccordionContent>
            <AccordionContent>
              Kelas 9
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Layout>
  )
}

export default CourseDetail
