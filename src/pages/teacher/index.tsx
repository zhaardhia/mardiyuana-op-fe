import React, { useState, ChangeEvent } from 'react'
import Layout from '@/components/Layout'
import Select, { ActionMeta } from 'react-select';
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
import { ModalAddEditTeacher } from '@/components/teacher/ModalAddEditTeacher';
import { DebounceInput } from 'react-debounce-input';
import { useSessionUser } from '@/contexts/SessionUserContext';
import { ListTeacherTableType, TeacherStatus } from '@/types';
import moment from 'moment';
import { statusTeacher } from '@/utils/constant';
import { Icon } from '@iconify/react';
import Link from 'next/link';

type Option = { value: string; label: string };

const optionFilter = [
  { label: "Semua", value: "" },
  { label: "Guru Aktif", value: "active" },
  { label: "Guru Pindah Sekolah / Keluar", value: "inactive" },
]

const gparam = {
  page: 1,
  pageSize: 10,
}

const Teacher = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [testSelect, setTestSelect] = useState<Option>();

  const { state, axiosJWT, refreshToken, dispatch } = useSessionUser()
  const [selectFilter, setSelectFilter] = useState<Option>({ label: "Guru Aktif", value: "active" });
  const [searchTeacherVal, setSearchTeacherVal] = useState<string>('');

  const [teacherData, setTeacherData] = useState<ListTeacherTableType[]>();
  const [totalData, setTotalData] = useState<number | null>();
  const [totalPages, setTotalPages] = useState<number>(10);
  const [nextPage, setNextPage] = useState<number | null>();
  
  React.useEffect(() => {
    fetchData()
  }, [selectFilter, currentPage, searchTeacherVal])

  const onPageChange = (page: number) => setCurrentPage(page);

  const onChange = (option: Option | null, actionMeta: ActionMeta<Option>) => {
    if (option) setSelectFilter(option)
    gparam.page = 1
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTeacherVal(e.target.value);
  }

  const fetchData = async () => {
    try {
      console.log({beforeFetch: gparam})
      const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/admin-teacher/list-teacher-table?page=${gparam.page}&pageSize=${gparam.pageSize}&filterBy=${selectFilter?.value}&teacherName=${searchTeacherVal}`, {
        headers: {
          Authorization: `Bearer ${state?.token}`
        }
      })
      console.log({response})

      if (response?.data?.statusCode === "000") {
        setTeacherData(response?.data?.data?.teacherData);
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
      <div className="w-[90%] mx-auto ">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl">Daftar Guru (Teacher List)</h1>
          <ModalAddEditTeacher isEdit={false} />
        </div>
        <hr />
        <div className="mt-5">
          <div className="flex justify-between mb-5">
            <Select
              className="basic-single w-[20rem] rounded-xl"
              classNamePrefix="select"
              defaultValue={optionFilter[1]}
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
              placeholder="Cari nama guru"
              className="px-3 py-1 border-[2px] border-gray-100 rounded-lg w-[20rem]"
            />
          </div>
          <Table>
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>No. Telpon</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Menjadi Guru Semenjak</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teacherData && teacherData.length > 0 && teacherData?.map((data: ListTeacherTableType) => {
                return (
                  <TableRow>
                    <TableCell className="">
                      <Link className="flex gap-2 items-center hover:underline" href={`/teacher/${data?.id}`}>
                        {data?.fullname}
                        <Icon icon="solar:to-pip-outline" className="text-lg" />
                      </Link>
                    </TableCell>
                    <TableCell>{data.email}</TableCell>
                    <TableCell>{data.phone}</TableCell>
                    <TableCell className="font-medium">{statusTeacher[data.status as keyof TeacherStatus]}</TableCell>
                    <TableCell>{moment(data.createdDate).format("DD MMMM YYYY")}</TableCell>
                    <TableCell><ModalAddEditTeacher isEdit={true} defaultData={data} /></TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex overflow-x-auto sm:justify-center mt-5">
          {totalData && (
            <Pagination>
              <PaginationContent>{renderPaginationItems()}</PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(Teacher), {
  ssr: false,
});
