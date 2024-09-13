
import { useState, useEffect, useRef, ChangeEvent } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import DataTable from '@/components/shared/DataTable'
import debounce from 'lodash/debounce'
import axios from 'axios'
import type { ColumnDef, OnSortParam, CellContext } from '@/components/shared/DataTable'
import { Select } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { TypeBill } from '../store'
import BillDialog from './BillDialog'
type IOveriewBill = {
    id: string;
    code: string;
    phone: string;
    status: string;
    customerName: string;
    staffName: string;
    address: string;
    type: string;
    total: number;
    subTotal: number;
}
type ICustomer = {
    name: string
}
type IVoucher = {
    name: string
}
type IStaff = {
    name: string
}
type Props = {

}
export const BillTable = ({ }: Props) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [tableData, setTableData] = useState<{
        pageIndex: number
        pageSize: number
        sort: {
            order: '' | 'asc' | 'desc'
            key: string | number;
        };
        query: string
        total: number
    }>({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: {
            order: '',
            key: '',
        },
    })

    const inputRef = useRef(null)

    const debounceFn = debounce(handleDebounceFn, 500)

    function handleDebounceFn(val: string) {
        console.log(val)
        if (typeof val === 'string' && (val.length > 1 || val.length === 0)) {
            setTableData((prevData) => ({
                ...prevData,
                ...{ query: val, pageIndex: 1 },
            }))
        }
    }

    function truncateString(str: string, maxLength: number): string {
        if (str.length <= maxLength) {
            return str;
        }
        return str.slice(0, maxLength) + '...'; // Thay thế '...' bằng ký hiệu khác nếu cần
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }

    const handleAction = (cellProps: CellContext<IOveriewBill, unknown>) => {
        console.log('Action clicked', cellProps)
        setIsOpen(true)
    }

    const [dialogIsOpen, setIsOpen] = useState(false)


    const columns: ColumnDef<IOveriewBill>[] = [
        {
            header: 'Code',
            accessorKey: 'code',
        },
        {
            header: 'Phone',
            accessorKey: 'phone',
        },
        {
            header: 'Total',
            accessorKey: 'total',
            cell: (props) => (
                props.row.original.total
            ),
        },
        {
            header: 'SubTotal',
            accessorKey: 'subTotal',
            cell: (props) => (
                props.row.original.subTotal
            ),
        },
        {
            header: 'Status',
            accessorKey: 'status',
        },
        {
            header: 'Type',
            accessorKey: 'type',
        },
        {
            header: 'Customer',
            accessorKey: 'customer___name',
            cell: (props) => (
                props.row.original.customerName
            ),
        },
        {
            header: 'Staff',
            accessorKey: 'staff___name',
            cell: (props) => (
                props.row.original.staffName
            ),
        },
        {
            header: 'Address',
            accessorKey: 'address',
            cell: (props) => (
                truncateString(props.row.original.address, 25)
            ),

        },
        {
            header: '',
            id: 'action',
            cell: (props) => (
                <Button size="xs" onClick={() => handleAction(props)}>
                    Action
                </Button>
            ),
        },
    ]

    const options1 = [
        { value: '.com', label: '.com' },
        { value: '.net', label: '.net' },
        { value: '.io', label: '.io' },
    ]

    const typeBills: TypeBill[] = [
        { label: "ALL", value: "" },
        { label: "INSTORE", value: "INSTORE" },
        { label: "ONLINE", value: "ONLINE" },
    ];
    const [selectedTypeBill, setSelectedTypeBill] = useState<TypeBill>(typeBills[0])

    const handlePaginationChange = (pageIndex: number) => {
        setTableData((prevData) => ({ ...prevData, ...{ pageIndex } }))
    }

    const handleSelectChange = (pageSize: number) => {
        setTableData((prevData) => ({
            ...prevData,
            pageSize: pageSize, // Cập nhật pageSize mới
            pageIndex: 1 // Đặt pageIndex về 1
        }));
    }

    const handleSort = ({ order, key }: OnSortParam) => {
        console.log({ order, key })
        setTableData((prevData) => ({
            ...prevData,
            sort: {
                order,
                key: (key as string).replace("___", "."),
            },
        }));
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const response = await axios.post('http://localhost:8080/api/v1/bill/overview', tableData)
            console.log(response)
            if (response.data) {
                setData(response.data.content)
                setLoading(false)
                setTableData((prevData) => ({
                    ...prevData,
                    ...{ total: response.data.totalElements },
                }))
            }
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        tableData.pageIndex,
        tableData.sort,
        tableData.pageSize,
        tableData.query,
    ])

    return (
        <>
            <BillDialog setIsOpen={setIsOpen} dialogIsOpen={dialogIsOpen}></BillDialog>
            <div className="flex justify-between mb-4">
                <div className='flex justify-start'>
                    <TabList >
                        {
                            typeBills.map((item, index) => (
                                <TabNav key={index} className={` rounded ${selectedTypeBill.value === item.value ? "bg-opacity-80 bg-blue-100 text-indigo-600" : ""}`} value={item.value}>
                                    <button className='p-2 w-20' onClick={() => setSelectedTypeBill(item)}>
                                        {item.label}
                                    </button>
                                </TabNav>
                            ))
                        }
                    </TabList>
                </div>
                <div className='flex justify-end gap-5'>
                    <Select
                        isSearchable={true}
                        defaultValue={{ label: '.com', value: '.com' }}
                        options={options1}
                        size='sm'
                        className='lg:w-52'
                    />
                    <Input
                        ref={inputRef}
                        placeholder="Search..."
                        size="sm"
                        className="lg:w-52"
                        onChange={handleChange}
                    />
                </div>
            </div>
            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                pagingData={tableData}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
            />
        </>
    )
}

