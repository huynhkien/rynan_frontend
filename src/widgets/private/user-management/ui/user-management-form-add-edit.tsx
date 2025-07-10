'use client'

import { BaseOption, fetchDistricts, fetchProvinces, fetchWards } from "@/features/user/api/addressApis";
import { addUserByAdmin, getAllUser, getUserById, updateUserByAdmin } from "@/features/user/api/userApis";
import UserFormInput from "@/features/user/components/UserFormInput";
import { UserInputImage } from "@/features/user/components/UserInputImage";
import { UserData, UserDataProps } from "@/features/user/type/userTypes";
import { ControlledSelect } from "@/shared/components/ui/private/ControlledSelect";
import { CustomerGender, CustomerSource, CustomerType } from "@/shared/constant/common";
import { Box, Paper, Typography, useTheme, CircularProgress, Button } from "@mui/material"
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { toast } from "react-toastify";

export const UserManagementFormAddEdit = () => {
    const { register, watch, setValue, formState: { errors }, control, getValues, reset, handleSubmit } = useForm<UserDataProps>();
    const theme = useTheme();
    // Lấy id khi có cập nhật thông tin
    const {id} = useParams();
    // State cho khách hàng
    // Lấy thông tin khách hàng
    
    // State cho preview image
    const [preview, setPreview] = useState<string | null>(null);
    //  State cho nhân viên
    const [staff, setStaff] = useState<UserData[] | []>([]);
    const [user, setUser] = useState<UserData[] | []>([]);

    // State quản lý mã khách hàng
    const [lastCodeNumber, setLastCodeNumber] = useState<number>(0);

    
    // State cho địa chỉ 
    const [provinces, setProvinces] = useState<BaseOption[]>([]);
    const [districts, setDistricts] = useState<BaseOption[]>([]);
    const [wards, setWards] = useState<BaseOption[]>([]);
    
    
    // State cho loading
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);

    // Watch các giá trị địa chỉ
    const selectedProvince = watch('address.province.code');
    const selectedDistrict = watch('address.district.code');
    const selectedWard = watch('address.ward.code');
    // Xử lý thông tin nhân viên
    const fetchUser = async () => {
            const response = await getAllUser();
            if (response.success) setUser(response.data);
    }
    useEffect(() => {
        fetchUser();
        
    },[]);
    useEffect(() => {
    if (user.length > 0) {
        const filteredUsers = user.filter((el) =>
            ['2002', '2004', '2006'].includes(el.role || '')
        );
        setStaff(filteredUsers);
    }
}, [user]); 
    // Tạo mã khách hàng
    const handleGenerateCode = useCallback(() => {
        if (user.length === 0) {
            setValue('code', 'RYNAN1');
            setLastCodeNumber(1);
            return;
        }
        
        let newNumber = lastCodeNumber + 1;
        let newCode = `RYNAN${newNumber}`;
        
        while (user.some((el) => el.code === newCode)) {
            newNumber += 1;
            newCode = `RYNAN${newNumber}`;
        }
        
        setLastCodeNumber(newNumber);
        setValue('code', newCode);
    }, [user, lastCodeNumber, setValue]); 


    // Load danh sách tỉnh/thành phố
    const loadProvinces = useCallback(async () => {
        setLoadingProvinces(true);
        try {
            const response = await fetchProvinces();
            setProvinces(response);
        } catch (error) {
            console.error('Error loading provinces:', error);
        } finally {
            setLoadingProvinces(false);
        }
    }, []);

    // Load danh sách quận/huyện theo tỉnh
    const loadDistricts = useCallback(async (provinceCode: number) => {
        if (!provinceCode) return;
        
        setLoadingDistricts(true);
        try {
            const response = await fetchDistricts(provinceCode);
            setDistricts(response); 
            // Reset district và ward khi đổi tỉnh
            setValue('address.district.code', '');
            setValue('address.ward.code', '');
            setWards([]);
        } catch (error) {
            console.error('Error loading districts:', error);
            setDistricts([]);
        } finally {
            setLoadingDistricts(false);
        }
    }, [setValue]);

    // Load danh sách phường/xã theo quận
    const loadWards = useCallback(async (districtCode: number) => {
        if (!districtCode) return;
        
        setLoadingWards(true);
        try {
            const response = await fetchWards(districtCode);
            setWards(response); 
            setValue('address.ward.code', '');
        } catch (error) {
            console.error('Error loading wards:', error);
            setWards([]);
        } finally {
            setLoadingWards(false);
        }
    }, [setValue]);

    // Effect để load tỉnh khi component mount
    useEffect(() => {
        loadProvinces();
    }, [loadProvinces]);

    // Effect để load quận khi đổi tỉnh
    useEffect(() => {
        if (selectedProvince) {
            loadDistricts(selectedProvince as number);
        } else {
            setDistricts([]);
            setWards([]);
            setValue('address.district.code', '');
            setValue('address.ward.code', '');
        }
    }, [selectedProvince, loadDistricts, setValue]);

    // Effect để load phường khi đổi quận
    useEffect(() => {
        if (selectedDistrict) {
            loadWards(selectedDistrict as number);
        } else {
            setWards([]);
            setValue('address.ward.code', '');
        }
    }, [selectedDistrict, loadWards, setValue]);

    // Hàm để lấy tên địa chỉ đầy đủ
    const getFullAddress = useCallback(() => {
    const provinceName = provinces.find(p => String(p._id) === String(selectedProvince))?.name || '';
    const districtName = districts.find(d => String(d._id) === String(selectedDistrict))?.name || '';
    const wardName = wards.find(w => String(w._id) === String(selectedWard))?.name || '';
    const detailedAddress = getValues('address.addressAdd') || '';
    
    const addressParts = [detailedAddress, wardName, districtName, provinceName].filter(Boolean);
    return addressParts.join(', ');
}, [provinces, districts, wards, selectedProvince, selectedDistrict, selectedWard, getValues]);
    // Hàm để reset toàn bộ địa chỉ
    const resetAddress = useCallback(() => {
        setValue('address.province.code', '');
        setValue('address.district.code', '');
        setValue('address.ward.code', '');
        setValue('address.addressAdd', '');
        setDistricts([]);
        setWards([]);
    }, [setValue]);

    // Xử lý thông tin nhân viên
    // Component để hiển thị địa chỉ đã chọn
    const AddressPreview = () => {
        const fullAddress = getFullAddress();
        if (!fullAddress) return null;
        
        return (
            <Box sx={{ mt: 2, p: 2, bgcolor: theme.palette.grey[100], borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="textSecondary">
                            Địa chỉ đã chọn:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                            {fullAddress}
                        </Typography>
                    </Box>
                    <Button 
                        size="small" 
                        onClick={resetAddress}
                        sx={{ ml: 1, minWidth: 'auto' }}
                    >
                        Reset
                    </Button>
                </Box>
            </Box>
        );
    };

    // Xử lý thêm thông tin khách hàng
    const handleAddUser = async (data: UserDataProps) => {
        // Format data address
        const addressData = {
            province: {
                    code: selectedProvince,
                    name: provinces.find(p => p._id === selectedProvince)?.name || '',
                },
                district: {
                    code: selectedDistrict,
                    name: districts.find(d => d._id === selectedDistrict)?.name || '',
                },
                ward: {
                    code: selectedWard,
                    name: wards.find(w => w._id === selectedWard)?.name || ''
                },
                detail: getFullAddress(),
                addressAdd: getValues('address.addressAdd'),
            }
        try{
            const formData = new FormData();
            formData.append('code', data.code);
            formData.append('phone', data.phone);
            formData.append('email', data.email);
            formData.append('name', data.name);
            formData.append('address', JSON.stringify(addressData));
            const dateOfBirth = data.dateOfBirth instanceof Date 
                ? data.dateOfBirth 
                : new Date(data.dateOfBirth);
            formData.append('dateOfBirth', dateOfBirth.toISOString());
            formData.append('gender', data.gender);
            formData.append('identification_card', data.identification_card);
            formData.append('tax_code', data.tax_code);
            formData.append('invoice_address', data.invoice_address);
            formData.append('staff', data.staff);
            formData.append('type', data.type);
            formData.append('source', data.source);
            if (data.note) formData.append('note', data.note);
            if (data.website) formData.append('website', data.website);
            if (data.avatar && data.avatar.length > 0) {
                    formData.append('avatar', data.avatar[0]);
            }

            const response = await addUserByAdmin(formData);
            if(response.success){
                toast.success(response.message);
                reset();
                setPreview('')
            }
        }catch(error: unknown){
            const errorMessage = (error as Error)?.message || 'Đã xảy ra lỗi không xác định';
            toast.error(errorMessage)
        }
    };
    // Xử lý cập nhật thông tin khách hàng

    useEffect(() => {
        const fetchClient = async () => {
            if (!id) return;
            
            try {
                const response = await getUserById(id as string);
                if (response.success && response.data) {
                    const userData = response.data;
                    
                    // Reset form với dữ liệu cơ bản
                    reset({
                        name: userData.name || '',
                        code: userData.code || '',
                        phone: userData.phone || '',
                        email: userData.email || '',
                        identification_card: userData.identification_card || '',
                        website: userData.website || '',
                        dateOfBirth: (userData.dateOfBirth as string)?.split('T')[0] || '', 
                        gender: userData.gender || '',
                        type: userData.type || '',
                        source: userData.source || '',
                        tax_code: userData.tax_code || '',
                        invoice_address: userData.invoice_address || '',
                        note: userData.note || '',
                        staff: userData.staff || '',
                    });
                    setPreview(userData.avatar?.url || '');
                    
                    // Xử lý địa chỉ theo chuỗi
                    if (userData.address) {
                        // Step 1: Set Province
                        if (userData.address.province?.code) {
                            setValue('address.province.code', userData.address.province.code);
                            setTimeout(async () => {
                                await loadDistricts(userData.address?.province.code as number);
                                if (userData.address?.district.code as number) {
                                    setValue('address.district.code', userData.address?.district.code as number);
                                    setTimeout(async () => {
                                        await loadWards(userData.address?.district.code as number);
                                        if (userData.address?.ward.code as number) {
                                            setValue('address.ward.code', userData.address?.ward.code as number);
                                        }
                                    }, 100);
                                }
                            }, 100);
                        }
                        if (userData.address.detail) {
                            setValue('address.detail', userData.address.detail);
                        }
                        if (userData.address.addressAdd) {
                            setValue('address.addressAdd', userData.address.addressAdd);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Có lỗi xảy ra khi tải thông tin khách hàng');
            }
        };
        
        fetchClient();
    }, [id, reset, setValue, loadDistricts, loadWards ]);

    const handleUpdateUser = async (data: UserDataProps) => {
        if(!id) return; 
        const addressData = {
            province: {
                    code: selectedProvince,
                    name: provinces.find(p => p._id === selectedProvince)?.name || '',
                },
                district: {
                    code: selectedDistrict,
                    name: districts.find(d => d._id === selectedDistrict)?.name || '',
                },
                ward: {
                    code: selectedWard,
                    name: wards.find(w => w._id === selectedWard)?.name || ''
                },
                detail: getFullAddress(),
                addressAdd: getValues('address.addressAdd'),
            }
        try{
            const formData = new FormData();
            formData.append('code', data.code);
            formData.append('phone', data.phone);
            formData.append('email', data.email);
            formData.append('name', data.name);
            formData.append('address', JSON.stringify(addressData));
            const dateOfBirth = data.dateOfBirth instanceof Date 
                ? data.dateOfBirth 
                : new Date(data.dateOfBirth);
            formData.append('dateOfBirth', dateOfBirth.toISOString());
            formData.append('gender', data.gender);
            formData.append('identification_card', data.identification_card);
            formData.append('tax_code', data.tax_code);
            formData.append('invoice_address', data.invoice_address);
            formData.append('staff', data.staff);
            formData.append('type', data.type);
            formData.append('source', data.source);
            if (data.note) formData.append('note', data.note);
            if (data.website) formData.append('website', data.website);
            if (data.avatar && data.avatar.length > 0) {
                    formData.append('avatar', data.avatar[0]);
            }

            const response = await updateUserByAdmin(id as string , formData);
            if(response.success){
                toast.success(response.message);
                reset();
            }
        }catch(error: unknown){
            const errorMessage = (error as Error)?.message || 'Đã xảy ra lỗi không xác định';
            toast.error(errorMessage)
        }
    };


    return (
        <Paper sx={{ mb: 2, p: 2, borderRadius: 0, backgroundColor: theme.palette.background.paper }}>
            <Box sx={{ py: 2 }}>
                <Typography variant='h6' sx={{ color: theme.palette.primary.main }}>
                    {id ? 'Cập nhật thông tin khách hàng' : 'Thêm thông tin khách hàng'}
                </Typography>
            </Box>
            
            {/* Form */}
            <form onSubmit={handleSubmit(id ? handleUpdateUser : handleAddUser)}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 5 }}>
                    <Box sx={{ width: '50%' }}>
                        <Box sx={{ py: 2 }}>
                            <Typography variant='body2' sx={{ color: theme.palette.primary.main }}>
                                Thông tin khách
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {/* Ảnh đại diện */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                <Typography>Ảnh đại diện</Typography>
                                <UserInputImage
                                    id='avatar'
                                    register={register}
                                    errors={errors}
                                    preview={preview}
                                    setPreview={setPreview}
                                />
                            </Box>
                            
                            {/* Loại khách và Nguồn khách */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                                <ControlledSelect
                                    label='Loại khách'
                                    important
                                    sx={{ width: '50%' }}
                                    name='type'
                                    control={control}
                                    options={CustomerType}
                                    rules={{ required: 'Vui lòng chọn loại khách' }}
                                />
                                <ControlledSelect
                                    label='Nguồn khách'
                                    important
                                    sx={{ width: '50%' }}
                                    name='source'
                                    control={control}
                                    options={CustomerSource}
                                    rules={{ required: 'Vui lòng chọn nguồn khách' }}
                                />
                            </Box>
                            <UserFormInput
                                    label='Tên khách hàng'
                                    important
                                    placeholder='Thêm tên khách hàng'
                                    register={register as UseFormRegister<UserDataProps>}
                                    errors={errors as FieldErrors<UserDataProps>}
                                    id='name'
                                    validate={{ required: 'Tên khách hàng không được để trống' }}
                                />

                            {/* Các trường thông tin khác */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                
                                <UserFormInput
                                    label='Mã khách hàng'
                                    important
                                    placeholder='Thêm mã khách hàng'
                                    register={register as UseFormRegister<UserDataProps>}
                                    errors={errors as FieldErrors<UserDataProps>}
                                    id='code'
                                    validate={{ required: 'Mã khách hàng không được để trống' }}
                                    sx={{
                                        width: '70%'
                                    }}
                                />
                                <Button onClick={handleGenerateCode}>
                                    <Typography>Tạo mã</Typography>
                                </Button>
                            </Box>

                            {/* Ngày sinh và Giới tính */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                                <UserFormInput
                                    label='Ngày sinh'
                                    important
                                    type='date'
                                    register={register as UseFormRegister<UserDataProps>}
                                    errors={errors as FieldErrors<UserDataProps>}
                                    id='dateOfBirth'
                                    sx={{ width: '50%' }}
                                    validate={{ required: 'Ngày sinh không được để trống' }}
                                />
                                <ControlledSelect
                                    label='Giới tính'
                                    important
                                    sx={{ width: '50%' }}
                                    name='gender'
                                    control={control}
                                    options={CustomerGender}
                                    rules={{ required: 'Vui lòng chọn giới tính' }}
                                />
                            </Box>

                            {/* Các trường khác */}
                            <UserFormInput
                                label='CCCD'
                                important
                                placeholder='Thêm CCCD'
                                register={register as UseFormRegister<UserDataProps>}
                                errors={errors as FieldErrors<UserDataProps>}
                                id='identification_card'
                                validate={{ 
                                    required: 'CCCD không được để trống',
                                    pattern: {
                                        value: /^[0-9]{9,12}$/,
                                        message: 'CCCD phải có 9-12 chữ số'
                                    }
                                }}
                            />

                            <UserFormInput
                                label='Mã số thuế'
                                placeholder='Thêm mã số thuế'
                                register={register as UseFormRegister<UserDataProps>}
                                errors={errors as FieldErrors<UserDataProps>}
                                id='tax_code'
                            />

                            <UserFormInput
                                label='Website'
                                placeholder='Website'
                                register={register as UseFormRegister<UserDataProps>}
                                errors={errors as FieldErrors<UserDataProps>}
                                id='website'
                                validate={{
                                    pattern: {
                                        value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                                        message: 'URL không hợp lệ'
                                    }
                                }}
                            />

                            <UserFormInput
                                label='Địa chỉ xuất hóa đơn'
                                placeholder='Thêm địa chỉ xuất hóa đơn'
                                register={register as UseFormRegister<UserDataProps>}
                                errors={errors as FieldErrors<UserDataProps>}
                                id='invoice_address'
                            />

                            <UserFormInput
                                label='Ghi chú'
                                placeholder='Thêm ghi chú'
                                register={register as UseFormRegister<UserDataProps>}
                                errors={errors as FieldErrors<UserDataProps>}
                                id='note'
                            />
                        </Box>
                    </Box>

                    <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ py: 2 }}>
                            <Typography variant='body2' sx={{ color: theme.palette.primary.main }}>
                                Thông tin liên hệ
                            </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <ControlledSelect
                                label='Nhân viên phụ trách'
                                important
                                name='staff'
                                control={control}
                                options={staff}
                                rules={{ required: 'Vui lòng chọn nhân viên phụ trách' }}
                            />
                            <Typography variant='body2' sx={{color: theme.palette.primary.main, my:2}}>Thông tin liên hệ khách </Typography>
                            <UserFormInput
                                label='Số điện thoại'
                                important
                                placeholder='Thêm số điện thoại'
                                register={register as UseFormRegister<UserDataProps>}
                                errors={errors as FieldErrors<UserDataProps>}
                                id='phone'
                                validate={{
                                    required: 'Số điện thoại không được để trống',
                                    pattern: {
                                        value: /^[0-9]{10,11}$/,
                                        message: 'Số điện thoại phải có 10-11 chữ số'
                                    }
                                }}
                            />

                            <UserFormInput
                                label='Email'
                                important
                                placeholder='Thêm email'
                                register={register as UseFormRegister<UserDataProps>}
                                errors={errors as FieldErrors<UserDataProps>}
                                id='email'
                                validate={{
                                    required: 'Email không được để trống',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Email không hợp lệ'
                                    }
                                }}
                            />

                            {/* Phần địa chỉ */}
                            <Box sx={{ mt: 2 }}>
                                <Typography variant='body2' sx={{ color: theme.palette.primary.main, mb: 2 }}>
                                    Địa chỉ
                                </Typography>
                                
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {/* Tỉnh/Thành phố */}
                                    <Box sx={{ position: 'relative' }}>
                                        <ControlledSelect
                                            name="address.province.code"
                                            control={control}
                                            label="Tỉnh / Thành phố"
                                            important
                                            options={provinces}
                                            rules={{ required: 'Vui lòng chọn tỉnh/thành phố' }}
                                        />
                                        {loadingProvinces && (
                                            <CircularProgress 
                                                size={20} 
                                                sx={{ position: 'absolute', right: 40, top: 35 }} 
                                            />
                                        )}
                                    </Box>

                                    {/* Quận/Huyện */}
                                    <Box sx={{ position: 'relative' }}>
                                        <ControlledSelect
                                            name="address.district.code"
                                            control={control}
                                            label="Quận / Huyện"
                                            important
                                            options={districts} 
                                            rules={{ required: 'Vui lòng chọn quận/huyện' }}
                                        />
                                        {loadingDistricts && (
                                            <CircularProgress 
                                                size={20} 
                                                sx={{ position: 'absolute', right: 40, top: 35 }} 
                                            />
                                        )}
                                    </Box>

                                    {/* Phường/Xã */}
                                    <Box sx={{ position: 'relative' }}>
                                        <ControlledSelect
                                            name="address.ward.code"
                                            control={control}
                                            label="Phường / Xã"
                                            important
                                            options={wards} 
                                            rules={{ required: 'Vui lòng chọn phường/xã' }}
                                        />
                                        {loadingWards && (
                                            <CircularProgress 
                                                size={20} 
                                                sx={{ position: 'absolute', right: 40, top: 35 }} 
                                            />
                                        )}
                                    </Box>

                                    {/* Địa chỉ chi tiết */}
                                    <UserFormInput
                                        label='Địa chỉ chi tiết'
                                        placeholder='Số nhà, tên đường...'
                                        register={register as UseFormRegister<UserDataProps>}
                                        errors={errors as FieldErrors<UserDataProps>}
                                        id='address.addressAdd'
                                    />

                                    {/* Preview địa chỉ đã chọn */}
                                    <AddressPreview />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Submit buttons */}
                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button variant="outlined" onClick={() => reset()}>
                        Reset Form
                    </Button>
                    <Button type="submit" variant="contained">
                        Lưu thông tin
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};