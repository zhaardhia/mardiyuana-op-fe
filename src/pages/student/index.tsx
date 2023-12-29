import React, { useState, ChangeEvent, useEffect } from 'react'
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
import dynamic from 'next/dynamic';
import { DebounceInput } from 'react-debounce-input';
import { useSessionUser } from '@/contexts/SessionUserContext';
import { ListStudentTableType } from '@/types'
import moment from "moment"
import Link from 'next/link';
import { Icon } from '@iconify/react';

type Option = { value: string; label: string };

const optionFilter = [
  { label: "Tahun ajaran aktif", value: "activeAcademicYear" },
  { label: "Belum terdaftar tahun ajaran aktif", value: "notRegisteredAcademicYear" },
  { label: "Lulus", value: "graduated" },
  { label: "Dikeluarkan", value: "dropout" },
  { label: "Mengundurkan diri", value: "resign" },
]

const gparam = {
  page: 1,
  pageSize: 10,
}

const Student = () => {
  const { state, axiosJWT } = useSessionUser()
  const [currentPage, setCurrentPage] = useState(1);
  const [selectFilter, setSelectFilter] = useState<Option>();
  const [searchStudentVal, setSearchStudentVal] = useState<string>('');

  const [studentData, setStudentData] = useState<ListStudentTableType[]>();
  const [totalData, setTotalData] = useState<number | null>();
  const [totalPages, setTotalPages] = useState<number>(10);
  const [nextPage, setNextPage] = useState<number | null>();

  useEffect(() => {
    fetchData()
  }, [selectFilter, currentPage, searchStudentVal])

  const onPageChange = (page: number) => setCurrentPage(page);

  const onChange = (option: Option | null, actionMeta: ActionMeta<Option>) => {
    if (option) setSelectFilter(option)
    gparam.page = 1
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchStudentVal(e.target.value);
  }

  const fetchData = async () => {
    try {
      console.log({beforeFetch: gparam})
      const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/admin-student/list-student-table?page=${gparam.page}&pageSize=${gparam.pageSize}&filterBy=${selectFilter?.value}&studentName=${searchStudentVal}`, {
        headers: {
          Authorization: `Bearer ${state?.token}`
        }
      })
      console.log({response})

      if (response?.data?.statusCode === "000") {
        setStudentData(response?.data?.data?.studentData);
        setTotalData(response?.data?.data?.totalData);
        setTotalPages(response?.data?.data?.totalPages);
        setNextPage(response?.data?.data?.nextPage);
      } else {
        throw Error("Fetch data error.")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const renderPaginationItems = () => {
    const paginationItems = [];

    paginationItems.push(
      <PaginationItem key="previous">
        <PaginationPrevious
          // href="#"
          onClick={() => {
            if (currentPage > 1) {
              setCurrentPage(currentPage - 1)
              gparam.page = currentPage - 1
            }
          }}
          isActive={currentPage !== 1}
        />
      </PaginationItem>
    );

    paginationItems.push(
      <PaginationItem key={currentPage}>
        <PaginationLink isActive onClick={() => {
          setCurrentPage(currentPage)
          gparam.page = currentPage
        }}>
          {currentPage}
        </PaginationLink>
      </PaginationItem>
    );

    for (let page = currentPage + 1; page <= currentPage + 2 && page <= totalPages; page++) {
      paginationItems.push(
        <PaginationItem key={page}>
          <PaginationLink href="#" onClick={() => {
            setCurrentPage(page)
            gparam.page = page
          }}>
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

    paginationItems.push(
      <PaginationItem key="next">
        <PaginationNext
          // href="#"
          onClick={() => {
            if (totalPages > currentPage) {
              setCurrentPage(currentPage + 1)
              gparam.page = currentPage + 1
            }
          }}
          isActive={currentPage !== totalPages}
        />
      </PaginationItem>
    );

    return paginationItems;
  };

  return (
    <Layout>
      <div className="w-[90%] mx-auto pb-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl">Daftar Murid (Student List)</h1>
          <ModalAddEditStudent isEdit={false} />
        </div>
        <hr />
        <div className="mt-5">
          <div className="flex justify-between mb-5">
            <Select
              className="basic-single w-[20rem] rounded-xl"
              classNamePrefix="select"
              defaultValue={ optionFilter[0] }
              // isLoading={isLoading}
              value={selectFilter}
              isClearable={false}
              isSearchable={true}
              name="courier"
              options={optionFilter}
              placeholder="Pilih Bulan & Tahun"
              onChange={onChange}
            />
            <DebounceInput 
              onChange={handleInput}
              minLength={2}
              debounceTimeout={500}
              type="text" 
              name="search-bar" 
              id="search-bar"
              placeholder="Cari nama murid"
              className="px-3 py-1 border-[2px] border-gray-100 rounded-lg w-[20rem]"
            />
          </div>
          <Table>
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Murid Sejak</TableHead>
                <TableHead>Nama Orang Tua</TableHead>
                <TableHead>Telepon Orang Tua</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentData && studentData.length > 0 && studentData?.map((data: ListStudentTableType) => {
                return (
                  <TableRow>
                    <TableCell className="">
                      <Link className="flex gap-2 items-center hover:underline" href={`/student/${data?.id}`}>
                        {data?.fullname}
                        <Icon icon="solar:to-pip-outline" className="text-lg" />
                      </Link>
                    </TableCell>
                    <TableCell>{data?.enrollment_student?.className || "-"}</TableCell>
                    <TableCell>{moment(data?.createdDate).format('LL')}</TableCell>
                    <TableCell>{data?.parent?.fullname}</TableCell>
                    <TableCell>{data?.parent?.phone || "-"}</TableCell>
                    <TableCell>
                      <ModalAddEditStudent isEdit={true} defaultData={data} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex overflow-x-auto sm:justify-center mt-5">
          {totalData && (
            <Pagination>
              {/* <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink 
                    isActive
                    onClick={() => gparam.page = 1}
                  >1</PaginationLink>
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
              </PaginationContent> */}
              <PaginationContent>{renderPaginationItems()}</PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(Student), {
  ssr: false,
});
