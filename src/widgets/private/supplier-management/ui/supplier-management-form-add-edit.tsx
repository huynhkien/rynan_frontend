'use client'
import { createSupplier, getSupplierById, updateSupplier } from "@/features/supplier/api/supplierApi";
import SupplierFormInput from "@/features/supplier/components/SupplierFormInput";
import { SupplierData, UpdateSupplier } from "@/features/supplier/type/supplierType";
import { BaseOption, fetchDistricts, fetchProvinces, fetchWards } from "@/features/user/api/addressApis";
import { Button } from "@/shared/components";
import { ControlledSelect } from "@/shared/components/ui/private/ControlledSelect";
import { BANK_LIST,  isActiveSupplier } from "@/shared/constant/common";
import { useAppDispatch } from "@/shared/hooks/useAppHook";
import { showModal } from "@/shared/store/appSlice";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material"
import { useCallback, useEffect, useState } from "react";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { toast } from "react-toastify";

export const SupplierManagementFormAddEdit = ({isUpdateSupplier, render} : UpdateSupplier) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const { register, handleSubmit,  formState: { errors }, reset, control, setValue, watch, getValues} = useForm<SupplierData>();
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
            setValue('address.district.code', 0);
            setValue('address.ward.code', 0);
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
            setValue('address.ward.code', 0);
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
            setValue('address.district.code', 0);
            setValue('address.ward.code', 0);
        }
    }, [selectedProvince, loadDistricts, setValue]);

    // Effect để load phường khi đổi quận
    useEffect(() => {
        if (selectedDistrict) {
            loadWards(selectedDistrict as number);
        } else {
            setWards([]);
            setValue('address.ward.code', 0);
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
    // Thêm nhà cung cấp
    const handleAddSupplier = async (data: SupplierData) => {
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
        const bankAccount = {
            bank_name: data.bank_account.bank_name,
            account_number: data.bank_account.account_number
        }
        const supplierData = {
            name: data.name,
            note: data.note,
            code: data.code,
            contact_person: data.contact_person,
            phone: data.phone,
            email: data.email,
            tax_code: data.tax_code,
            isActive: data.isActive ,
            address: addressData,
            bank_account: bankAccount
        }
        dispatch(showModal({ isShowModal: true, modalType: 'loading' }));
        const response = await createSupplier(supplierData);
        if(response.success){
            dispatch(showModal({ isShowModal: false, modalType: null }));
            toast.success(response.message);
            render();
            reset();
        }else{
            dispatch(showModal({ isShowModal: false, modalType: null }));
            toast.error(response.message);
            render();
        }
    }
    // Cập nhật 
    useEffect(() => {
        if(!isUpdateSupplier) return;
        const fetchSupplier = async() => {
            const response = await getSupplierById(isUpdateSupplier as string);
            if(response.success && response.data){
                reset({
                    name: response.data?.name,
                    note: response.data?.note,
                    code: response.data?.code,
                    contact_person: response.data?.contact_person,
                    phone: response.data?.phone,
                    email: response.data?.email,
                    tax_code: response.data?.tax_code,
                    isActive: response.data?.isActive ,
                    bank_name: response.data.bank_account.bank_name,
                });
                setValue('bank_account.bank_name', response.data.bank_account.bank_name); 
                setValue('bank_account.account_number', response.data.bank_account.account_number); 
                // Xử lý địa chỉ theo chuỗi
                    if (response.data.address) {
                        // Step 1: Set Province
                        if (response.data.address.province?.code) {
                            setValue('address.province.code', response.data.address.province.code);
                            setTimeout(async () => {
                                await loadDistricts(response.data?.address.province.code as number);
                                if (response.data?.address.district.code as number) {
                                    setValue('address.district.code', response.data?.address?.district.code as number);
                                    setTimeout(async () => {
                                        await loadWards(response.data?.address?.district.code as number);
                                        if (response.data?.address?.ward.code as number) {
                                            setValue('address.ward.code', response.data?.address?.ward.code as number);
                                        }
                                    }, 100);
                                }
                            }, 100);
                        }
                        if (response.data.address.detail) {
                            setValue('address.detail', response.data.address.detail);
                        }
                        if (response.data.address.addressAdd) {
                            setValue('address.addressAdd', response.data.address.addressAdd);
                        }
                    }
            }
        }
        fetchSupplier();
    },[isUpdateSupplier, reset, loadDistricts, loadWards, setValue])
    const handleUpdateSupplier = async (data: SupplierData) => {
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
        const bankAccount = {
            bank_name: data.bank_account.bank_name,
            account_number: data.bank_account.account_number
        }
        const supplierData = {
            name: data.name,
            note: data.note,
            code: data.code,
            contact_person: data.contact_person,
            phone: data.phone,
            email: data.email,
            tax_code: data.tax_code,
            isActive: data.isActive ,
            address: addressData,
            bank_account: bankAccount
        }
        dispatch(showModal({ isShowModal: true, modalType: 'loading' }));
        const response = await updateSupplier(supplierData, isUpdateSupplier as string);
        if(response.success){
            dispatch(showModal({ isShowModal: false, modalType: null }));
            toast.success(response.message);
            render();
        }else{
            dispatch(showModal({ isShowModal: false, modalType: null }));
            toast.error(response.message);
            render();
        }
    }
    return (
        <Box
            sx={{
                width: '100%'
            }}
        >
            <Box sx={{
                backgroundColor: theme.palette.primary.light,
                py: 2,
                textAlign: 'center',
                color: theme.palette.text.secondary,
                fontWeight: theme.typography.fontWeightBold
            }}>
                <Typography variant='body2'>
                    {isUpdateSupplier ? 'Cập nhật nhà cung cấp' : 'Thêm mới nhà cung cấp'}
                </Typography>
            </Box>
            
            <form onSubmit={handleSubmit(isUpdateSupplier ? handleUpdateSupplier : handleAddSupplier)}
                style={{
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                }}
            >
                <Box
                    sx={{display: 'flex', justifyContent: 'space-between', gap:1, width: '100%'}}
                >
                    <SupplierFormInput
                    label='Tên nhà cung cấp'
                    important
                    placeholder='Thêm tên nhà cung cấp'
                    register={register as UseFormRegister<SupplierData>}
                    errors={errors as FieldErrors<SupplierData>}
                    id='name'
                    validate={{
                        required: 'Tên nhà cung cấp không được để trống',
                        minLength: {
                            value: 2,
                            message: 'Tên nhà cung cấp phải có ít nhất 2 ký tự'
                        }
                    }}
                    sx={{width: '33%'}}
                    />
                    <SupplierFormInput
                        label='Mã code'
                        important
                        placeholder='Mã code'
                        register={register as UseFormRegister<SupplierData>}
                        errors={errors as FieldErrors<SupplierData>}
                        id='code'
                        validate={{
                            required: 'Mã code không được để trống',
                            minLength: {
                                value: 2,
                                message: 'Mã code phải có ít nhất 2 ký tự'
                            }
                        }}
                        sx={{width: '33%'}}
                    />
                    <SupplierFormInput
                        label='Email'
                        important
                        placeholder='Email'
                        register={register as UseFormRegister<SupplierData>}
                        errors={errors as FieldErrors<SupplierData>}
                        id='email'
                        validate={{
                            required: 'Email không được để trống',
                            minLength: {
                                value: 7,
                                message: 'Email phải có ít nhất 7 ký tự'
                            }
                        }}
                        sx={{width: '33%'}}
                    />
                </Box>
                <Box
                    sx={{display: 'flex', justifyContent: 'space-between', gap:1, width: '100%'}}
                >
                    <SupplierFormInput
                    label='Số điện thoại'
                    important
                    placeholder='Thêm Số điện thoại'
                    register={register as UseFormRegister<SupplierData>}
                    errors={errors as FieldErrors<SupplierData>}
                    id='phone'
                    validate={{
                        required: 'Số điện thoại không được để trống',
                        minLength: {
                            value: 10,
                            message: 'Số điện thoại phải có ít nhất 10 ký tự'
                        }
                    }}
                    sx={{width: '33%'}}
                    />
                    <SupplierFormInput
                        label='Thông tin người liên hệ'
                        important
                        placeholder='Thông tin người liên hệ'
                        register={register as UseFormRegister<SupplierData>}
                        errors={errors as FieldErrors<SupplierData>}
                        id='contact_person'
                        validate={{
                            required: 'Thông tin người liên hệ không được để trống',
                            minLength: {
                                value: 5,
                                message: 'Thông tin người liên hệ phải có ít nhất 2 ký tự'
                            }
                        }}
                        sx={{width: '33%'}}
                    />
                    <SupplierFormInput
                        label='Mã số thuế(nếu có)'
                        placeholder='Mã số thuế'
                        register={register as UseFormRegister<SupplierData>}
                        errors={errors as FieldErrors<SupplierData>}
                        id='tax_code'
                        sx={{width: '33%'}}
                    />
                </Box>
                <ControlledSelect
                        label='Tên ngân hàng (nếu có)'
                        name='bank_account.bank_name'
                        control={control}
                        options={BANK_LIST}
                    />
                <Box sx={{display: 'flex', justifyContent: 'space-between', gap:1, width: '100%'}}>
                    <SupplierFormInput
                        label='Số tài khoản(nếu có)'
                        placeholder='Số tài khoản'
                        register={register as UseFormRegister<SupplierData>}
                        errors={errors as FieldErrors<SupplierData>}
                        id='bank_account.account_number'
                        validate={{
                            required: 'Số tài khoản không được để trống',
                            minLength: {
                                value: 5,
                                message: 'Số tài khoản phải có ít nhất 2 ký tự'
                            }
                        }}
                        sx={{width: '33%'}}
                    />
                    <SupplierFormInput
                        label='Ghi chú'
                        placeholder='Ghi chú'
                        register={register as UseFormRegister<SupplierData>}
                        errors={errors as FieldErrors<SupplierData>}
                        id='note'
                        sx={{width: '33%'}}
                    />
                    <ControlledSelect
                        label='Trạng thái'
                        name='isActive'
                        control={control}
                        options={isActiveSupplier}
                        sx={{width: '33%'}}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 1, width: '100%' }}>
                    {/* Tỉnh/Thành phố */}
                    <Box sx={{ position: 'relative', width: '33%' }}>
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
                    <Box sx={{ position: 'relative', width: '33%' }}>
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
                    </Box >
                    {/* Phường/Xã */}
                    <Box sx={{ position: 'relative', width: '33%' }}>
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
                    
                </Box>
                <SupplierFormInput
                        label='Địa chỉ chi tiết'
                        placeholder='Số nhà, tên đường...'
                        register={register as UseFormRegister<SupplierData>}
                        errors={errors as FieldErrors<SupplierData>}
                        id='address.addressAdd'
                    />
                <Box sx={{ pt: 0.5 }}>
                    <Button 
                        name={isUpdateSupplier ? 'Cập nhật nhà cung cấp' : 'Thêm nhà cung cấp'}
                    />
                </Box>
            </form>
        </Box>
    )
}