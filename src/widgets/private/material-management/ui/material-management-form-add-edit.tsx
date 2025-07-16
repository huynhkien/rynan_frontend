'use client'
import { createMaterial, getMaterialById, updateMaterial } from "@/features/material/api/materialApi";
import MaterialFormInput from "@/features/material/components/MaterialFormInput";
import { MaterialData, UpdateMaterial } from "@/features/material/type/materialType";
import { Button } from "@/shared/components";
import { ControlledSelect } from "@/shared/components/ui/private/ControlledSelect";
import { useAppDispatch } from "@/shared/hooks/useAppHook";
import { showModal } from "@/shared/store/appSlice";
import { Box, Typography, useTheme } from "@mui/material"
import { useEffect } from "react";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { toast } from "react-toastify";

export const MaterialManagementFormAddEdit = ({isUpdateMaterial, render, specification} : UpdateMaterial) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const { register, handleSubmit,  formState: { errors }, reset, control} = useForm<MaterialData>();
    
    // Thêm nguyên liệu
    const handleAddMaterial = async(data: MaterialData) => {
        const materialData = {
            name: data.name,
            name_short: data.name_short,
            code: data.code,
            note: data.note,
            specification: data.specification
        }
        dispatch(showModal({ isShowModal: true, modalType: 'loading' }));
        const response = await createMaterial(materialData);
        if(response.success){
            dispatch(showModal({ isShowModal: false, modalType: null }));
            toast.success(response.message);
            render();
            reset();
        } else{
            dispatch(showModal({ isShowModal: false, modalType: null }));
            toast.error(response.message);
        }
    }
    // Cập nhật nguyê liệu
    useEffect(() => {
        if(!isUpdateMaterial) return;
        const fetchMaterial = async () => {
            const response = await getMaterialById(isUpdateMaterial as string);
            if(response.success && response.data){
                reset({
                    name: response.data.name,
                    code: response.data.code,
                    note: response.data.note,
                    specification: response.data.specification,
                    name_short: response.data.name_short,
                })
            } 
        }
        fetchMaterial();
    },[isUpdateMaterial, reset]);
    const handleUpdateMaterial = async(data: MaterialData) => {
        if(!isUpdateMaterial) return;
        const materialData = {
            name: data.name,
            name_short: data.name_short,
            code: data.code,
            note: data.note,
            specification: data.specification
        }
        dispatch(showModal({ isShowModal: true, modalType: 'loading' }));
        const response = await updateMaterial(materialData, isUpdateMaterial as string);
        if(response.success){
            dispatch(showModal({ isShowModal: false, modalType: null }));
            toast.success(response.message);
            render();
            reset();
        } else{
            dispatch(showModal({ isShowModal: false, modalType: null }));
            toast.error(response.message);
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
                    {isUpdateMaterial ? 'Cập nhật nguyên liệu' : 'Thêm mới nguyên liệu'}
                </Typography>
            </Box>
            
            <form onSubmit={handleSubmit(isUpdateMaterial ? handleUpdateMaterial : handleAddMaterial)}
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
                    <MaterialFormInput
                    label='Tên nguyên liệu'
                    important
                    placeholder='Thêm tên nguyên liệu'
                    register={register as UseFormRegister<MaterialData>}
                    errors={errors as FieldErrors<MaterialData>}
                    id='name'
                    validate={{
                        required: 'Tên nguyên liệu không được để trống',
                        minLength: {
                            value: 2,
                            message: 'Tên nguyên liệu phải có ít nhất 2 ký tự'
                        }
                    }}
                    sx={{width: '50%'}}
                    />
                    <MaterialFormInput
                        label='Tên ngắn'
                        important
                        placeholder='Tên ngắn'
                        register={register as UseFormRegister<MaterialData>}
                        errors={errors as FieldErrors<MaterialData>}
                        id='name_short'
                        validate={{
                            required: 'Tên nguyên liệu không được để trống',
                            minLength: {
                                value: 2,
                                message: 'Tên nguyên liệu phải có ít nhất 2 ký tự'
                            }
                        }}
                        sx={{width: '50%'}}
                    />
                </Box>
                <Box
                    sx={{display: 'flex', justifyContent: 'space-between', gap:1, width: '100%'}}
                >
                    <MaterialFormInput
                    label='Mã code'
                    important
                    placeholder='Thêm mã code'
                    register={register as UseFormRegister<MaterialData>}
                    errors={errors as FieldErrors<MaterialData>}
                    id='code'
                    validate={{
                        required: 'Mã code không được để trống',
                        minLength: {
                            value: 2,
                            message: 'Mã code phải có ít nhất 2 ký tự'
                        }
                    }}
                    sx={{width: '50%'}}
                    />
                    <MaterialFormInput
                        label='Mô tả'
                        important
                        placeholder='Mô tả'
                        register={register as UseFormRegister<MaterialData>}
                        errors={errors as FieldErrors<MaterialData>}
                        id='note'
                        validate={{
                            required: 'Mô tả không được để trống',
                            minLength: {
                                value: 2,
                                message: 'Mô tả phải có ít nhất 2 ký tự'
                            }
                        }}
                        sx={{width: '50%'}}
                    />
                </Box>
                <ControlledSelect
                    label='Quy cách đóng gói'
                    important
                    name='specification'
                    control={control}
                    options={specification}
                    rules={{
                    required: 'Vui lòng chọn danh mục',
                    validate: (value) => {
                        if (value === 'electronics') return 'Không được chọn điện tử';
                        return true;
                    }
                    }}
                />
                <Box sx={{ pt: 0.5 }}>
                    <Button 
                        name={isUpdateMaterial ? 'Cập nhật nguyên liệu' : 'Thêm nguyên liệu'}
                    />
                </Box>
            </form>
        </Box>
    )
}