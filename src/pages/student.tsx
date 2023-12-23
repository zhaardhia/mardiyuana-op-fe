import React, { useState } from 'react'
import Layout from '@/components/Layout'
import Select, { ActionMeta } from 'react-select';
import { ModalAddEditStudent } from '@/components/student/ModalAddEditStudent';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type Option = { value: string; label: string };

const testOption = [
  { value: "Wakwaw", label: "Hehe" },
  { value: "Ahay", label: "Hoho" },
]

const Student = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [testSelect, setTestSelect] = useState<Option>();
  const onPageChange = (page: number) => setCurrentPage(page);

  const onChange = (option: Option | null, actionMeta: ActionMeta<Option>) => {
    console.log({option})
  }
  return (
    <Layout>
      <div className="w-[90%] mx-auto ">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl">Daftar Murid (Student List)</h1>
          <ModalAddEditStudent />
        </div>
        <hr />
        <Select
          className="basic-single w-full rounded-xl mx-auto"
          classNamePrefix="select"
          // defaultValue={ testSelect }
          // isLoading={isLoading}
          value={testSelect}
          isClearable={false}
          isSearchable={true}
          name="courier"
          options={testOption}
          placeholder="Pilih Bulan & Tahun"
          onChange={onChange}
        />
        <div className="">
          <Table>
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Murid Sejak</TableHead>
                <TableHead>Tempat Tanggal Lahir</TableHead>
                <TableHead>Nama Orang Tua</TableHead>
                <TableHead>Telepon Orang Tua</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        <div className="flex overflow-x-auto sm:justify-center mt-5">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem >
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </Layout>
  )
}

export default Student
