import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable, { CellContext } from '@/components/shared/DataTable';
import { Button, Input, Switcher } from '@/components/ui';
import { GrEdit } from "react-icons/gr";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { FiPlusCircle } from "react-icons/fi";
import { toast } from 'react-toastify';
import { RiMoonClearLine, RiSunLine } from 'react-icons/ri';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FaFileDownload } from "react-icons/fa";

type AddressDTO = {
    id: number;
    name: string;
    phone: string;
    provinceId: string;
    province: string;
    districtId: string;
    district: string;
    wardId: string;
    ward: string;
    detail: string;
    isDefault: boolean;
};

type CustomerListDTO = {
    id: number;
    name: string;
    email: string;
    phone: string;
    birthDate: string;
    defaultAddress?: AddressDTO; // Địa chỉ mặc định
    status: string;
    gender?: string;
};

const CustomerTable = () => {

    const navigate = useNavigate();

    const [data, setData] = useState<CustomerListDTO[]>([])
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(5);
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    useEffect(() => {
        fetchData(pageIndex, pageSize, query, statusFilter);
    }, [pageIndex, pageSize, query, statusFilter]);

    const fetchData = async (page: number, size: number, searchTerm: string, status?: string | null) => {
        setLoading(true);
        try {
            let url = `http://localhost:8080/api/v1/customer?page=${page}&size=${size}`;

            if (searchTerm) {
                url = `http://localhost:8080/api/v1/customer/search?query=${searchTerm}&page=${page}&size=${size}`;
            }

            if (status && status !== '') {
                url += `&status=${status}`;
            }

            const response = await axios.get(url);
            const data = response.data;
            let fetchedCustomers: CustomerListDTO[] = [];

            if (data && data.content) {
                fetchedCustomers = data.content;
            }

            setData(fetchedCustomers);
            setTotal(data.totalElements || 0);
            console.log('Fetched customers:', fetchedCustomers);
            console.log('Total elements:', data.totalElements);

        } catch (error) {
            console.log("Error fetching customer data: ", error);
            toast.error("Error fetching customer data")
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: number, newStatus: boolean) => {
        try {
            await axios.patch(`http://localhost:8080/api/v1/customer/status/${id}`, { status: newStatus ? 'Active' : 'Inactive' });
            toast.success('cập nhật thành công');
            fetchData(pageIndex, pageSize, query)
        } catch (error) {
            toast.error('Error updating status');
            console.error('Error updating status:', error);
        }
    };

    const exportToExcel = () => {
        // Transform the data to include flattened address fields
        const exportData = data.map((customer) => {
            return {
                STT: (pageIndex - 1) * pageSize + data.indexOf(customer) + 1, // Add serial number
                Name: customer.name,
                Email: customer.email,
                Phone: customer.phone,
                BirthDate: customer.birthDate,
                Gender: customer.gender,
                Status: customer.status,
                Address: customer.defaultAddress
                    ? `${customer.defaultAddress.detail}, ${customer.defaultAddress.ward}, ${customer.defaultAddress.district}, ${customer.defaultAddress.province}`
                    : 'N/A',
            };
        });
    
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Customer');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'customer_data.xlsx');
    };



    // ham chuyen sang trang add
    const handleAddClick = () => {
        navigate('/manage/customer/add');
    }

    // ham chuyen sang trang update
    const handleUpdateClick = (customerId: number) => {
        navigate(`/manage/customer/update/${customerId}`);
    }

    // Ham xu ly phan trang
    const handlePaginationChange = (pageIndex: number) => {
        setPageIndex(pageIndex);
    }

    // Ham xu ly thay doi kich thuoc trang
    const handleSelectChange = (pageSize: number) => {
        setPageSize(pageSize);
    }

    // Ham xu ly tim kiem
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
    }

    // // Ham xu ly loc
    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(event.target.value);
    };


    const colums = [

        {
            header: 'STT',
            id: 'serialNumber',
            cell: ({ row }: CellContext<CustomerListDTO, unknown>) => {
                const serialNumber = (pageIndex - 1) * pageSize + row.index + 1;
                return serialNumber;
            },
        },

        {
            header: 'Tên',
            accessorKey: 'name',
        },
        {
            header: 'Email',
            accessorKey: 'email',
        },
        {
            header: 'Số điện thoại',
            accessorKey: 'phone',
        },
        {
            header: 'Ngày sinh',
            accessorKey: 'birthDate',
        },
        {
            header: 'Giới tính',
            accessorKey: 'gender',
        },
        {
            header: 'Địa chỉ',
            cell: ({ row }: CellContext<CustomerListDTO, unknown>) => {

                const defaultAddress = row.original.defaultAddress;

                // Kiểm tra nếu có địa chỉ mặc định, hiển thị chi tiết
                if (defaultAddress) {
                    return `${defaultAddress.detail}, ${defaultAddress.ward}, ${defaultAddress.district}, ${defaultAddress.province}`;
                }

                return 'N/A';
            },
        },
        {
            header: 'Trạng thái',
            accessorKey: 'status',
            cell: ({ row }: CellContext<CustomerListDTO, unknown>) => {
                const { status } = row.original;
                const isActive = status === 'Active';

                const displayStatus = isActive ? 'Hoạt động' : 'Không hoạt động';

                return (
                    <span
                        className={`flex items-center font-bold ${isActive ? 'text-green-600' : 'text-red-600'}`}
                    >
                        <span
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${isActive ? 'bg-green-600' : 'bg-red-600'}`}
                        ></span>
                        {displayStatus}
                    </span>
                );
            },
            size: 100,
        },
        {
            header: 'Hành động',
            id: 'action',
            cell: ({ row }: CellContext<CustomerListDTO, unknown>) => {
                const customer = row.original;
                const { id, status } = row.original;
                const isActive = status === 'Active';
                return (
                    <div className='flex space-x-2 justify-center items-center'>
                        <GrEdit
                            className='text-2xl mr-3'
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleUpdateClick(customer.id)}
                        />
                        <Switcher
                            color="green-500"
                            checked={isActive}
                            className="text-sm"
                            unCheckedContent={<RiMoonClearLine />}
                            checkedContent={<RiSunLine />}
                            onChange={() => updateStatus(id, !isActive)}
                        />
                    </div>
                );
            },

        },
    ];

    return (
        <div className="bg-white p-6 shadow-md rounded-lg mb-6 w-full">
            <h1 className="text-center font-semibold text-2xl mb-4 text-transform: uppercase">Danh sách khách hàng</h1>

            <div className='flex justify-between items-center mb-4'>
                <div className='flex items-center'>
                    <div className="relative w-80 mr-4">
                        <Input
                            placeholder='Tìm kiếm theo tên, email, số điện thoại...'
                            size='sm'
                            style={{ backgroundColor: '#fff', height: '40px' }}
                            className='w-full pl-10 pr-2 py-1 border border-gray-300 rounded focus:outline-none'
                            onChange={handleSearch}
                        />
                        <IoIosSearch style={{ height: '40px' }} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-2xl" />
                    </div>

                    <div className="relative w-40 mr-4">
                        <select
                            className='w-full pl-2 pr-2 py-2 border border-gray-300 rounded focus:outline-none'
                            value={statusFilter || ''}
                            style={{ backgroundColor: '#fff', height: '40px' }}
                            onChange={handleStatusChange}
                        >
                            <option value="">Tất cả</option>
                            <option value="Active">Hoạt động</option>
                            <option value="Inactive">Không hoạt động</option>
                        </select>
                    </div>
                </div>

                <div className='flex items-center'>
                    <Button
                        size="sm"
                        className="w-full h-10 flex items-center justify-center mr-4"
                        style={{ backgroundColor: '#fff', height: '40px' }}
                        onClick={exportToExcel}
                    >
                        <FaFileDownload className="mr-2" />
                        Tải Excel
                    </Button>

                    <Button
                        size='sm'
                        variant="solid"
                        style={{ backgroundColor: 'rgb(79, 70, 229)', height: '40px' }}
                        className='lg:w-24 flex items-center justify-center gap-2 button-bg-important'
                        onClick={handleAddClick}
                    >
                        <FiPlusCircle />
                        Thêm
                    </Button>
                </div>
            </div>

            <DataTable
                columns={colums}
                data={data}
                loading={loading}
                pagingData={{
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                    total: total,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
            />

        </div>
    )
}


export default CustomerTable;

