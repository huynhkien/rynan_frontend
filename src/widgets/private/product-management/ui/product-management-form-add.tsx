'use client'


import { getAllCategory } from "@/features/category/api/categoryApi";
import { Category} from "@/features/category/type/categoryType";
import { createProduct, updateDescriptionProduct } from "@/features/product/api/productApi";
import ProductFormInput from "@/features/product/components/ProductFormInput";
import { ProductInputImage } from "@/features/product/components/ProductInputImage";
import { ProductInputTags } from "@/features/product/components/ProductInputTags";
import { MarkdownEditorProps, ProductData, ProductManagementFormAddInfoProps, } from "@/features/product/type/productType";
import { getAllSpecification } from "@/features/specification/api/specificationApi";
import { Specification } from "@/features/specification/type/specificationType";
import { Button } from "@/shared/components";
import { ControlledSelect } from "@/shared/components/ui/private/ControlledSelect";
import { isActive, Origin } from "@/shared/constant/common";
import { Box, Paper, Tab, Tabs, Typography, useTheme } from "@mui/material"
import { useCallback, useEffect, useState } from "react";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { Editor } from '@tinymce/tinymce-react';
import { toast } from "react-toastify";

const ProductManagementFormAddInfo = ({category, specification, preview, setPreview, handleAddProduct}: ProductManagementFormAddInfoProps) => {
    const { register, setValue, handleSubmit, watch,  formState: { errors }, control} = useForm<ProductData>();
    return (
         <form onSubmit={handleSubmit(handleAddProduct)}
                style={{
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 1
                    }}
                >
                    <ProductFormInput
                        label='Mã sản phẩm'
                        important
                        placeholder='Thêm mã sản phẩm'
                        register={register as UseFormRegister<ProductData>}
                        errors={errors as FieldErrors<ProductData>}
                        id='code'
                        validate={{
                            required: 'Tên mã sản phẩm không được để trống',
                            minLength: {
                                value: 2,
                                message: 'Tên mã sản phẩm phải có ít nhất 2 ký tự'
                            }
                        }}
                        sx={{
                            width: '50%'
                        }}
                    />
                    <ProductFormInput
                        label='Tên sản phẩm tiếng việt'
                        important
                        placeholder='Thêm tên sản phẩm'
                        register={register as UseFormRegister<ProductData>}
                        errors={errors as FieldErrors<ProductData>}
                        id='name_vn'
                        validate={{
                            required: 'Tên tên sản phẩm không được để trống',
                            minLength: {
                                value: 2,
                                message: 'Tên mã sản phẩm phải có ít nhất 2 ký tự'
                            }
                        }}
                        sx={{
                            width: '50%'
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 1
                    }}
                >
                    <ProductFormInput
                        label='Tên sản phẩm tiếng anh'
                        important
                        placeholder='Thêm tên sản phẩm tiếng anh'
                        register={register as UseFormRegister<ProductData>}
                        errors={errors as FieldErrors<ProductData>}
                        id='name_eng'
                        sx={{
                            width: '50%'
                        }}
                    />
                    <ProductFormInput
                        label='Tên ngắn rút gọn'
                        important
                        placeholder='Thêm tên ngắn rút gọn'
                        register={register as UseFormRegister<ProductData>}
                        errors={errors as FieldErrors<ProductData>}
                        id='name_short'
                        sx={{
                            width: '50%'
                        }}
                    />
                    
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 1
                    }}
                >
                    <ProductFormInput
                        label='Giá tham khảo'
                        important
                        type='number'
                        placeholder='Thêm giá tham khảo'
                        register={register as UseFormRegister<ProductData>}
                        errors={errors as FieldErrors<ProductData>}
                        id='price_reference'
                        sx={{
                            width: '50%'
                        }}
                    />
                    <ControlledSelect
                        label='Danh mục'
                        important
                        sx={{
                            width: '50%'
                        }}
                        name='category'
                        control={control}
                        options={category}
                        rules={{
                        required: 'Vui lòng chọn danh mục',
                        validate: (value) => {
                            if (value === 'electronics') return 'Không được chọn điện tử';
                            return true;
                        }
                        }}
                    />
                    
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 1
                    }}
                >
                    <ControlledSelect
                        label='Quy cách'
                        important
                        sx={{
                            width: '33%'
                        }}
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
                    <ControlledSelect
                        label='Nhà sản xuất'
                        important
                        sx={{
                            width: '33%'
                        }}
                        name='origin'
                        control={control}
                        options={Origin}
                        rules={{
                        required: 'Vui lòng chọn danh mục',
                        validate: (value) => {
                            if (value === 'electronics') return 'Không được chọn điện tử';
                            return true;
                        }
                        }}
                    />
                    <ControlledSelect
                        label='Trạng thái'
                        important
                        sx={{
                            width: '33%'
                        }}
                        name='isActive'
                        control={control}
                        options={isActive}
                        rules={{
                        required: 'Vui lòng chọn danh mục',
                        validate: (value) => {
                            if (value === 'electronics') return 'Không được chọn điện tử';
                            return true;
                        }
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <ProductInputTags
                        label='Tags'
                        important
                        placeholder='Nhập tags: phan bon, thong minh,...'
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        watch={watch}
                        id='tags'
                        validate={{
                            required: 'Vui lòng thêm ít nhất một tag',
                        }}
                        sx={{ width: '60%' }}
                        />
                    <Box sx={{
                    width: '40%',
                }}>
                    <ProductInputImage
                        id='thumb'
                        validate={{
                        required: 'Ảnh không được để trống',
                        }}
                        register={register}
                        errors={errors}
                        preview={preview}
                        setPreview={setPreview}
                        
                    />
                </Box>
                </Box>
                
            
                
                <Box sx={{ mt: 3 }}>
                    <Button 
                        name='Thêm sản phẩm'
                    />
                </Box>
            </form>
    )
}


const ProductManagementFormAddDescription = ({
  value,
  changeValue,
  handleUpdate,
}: MarkdownEditorProps) => {
  return (
    <>
      <Editor
        apiKey="6gmu62t9gmyhx5y2q16o4q6ac269ubj6ul5gd8106pux71jo"
        value={value}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
          ],
          toolbar:
            'undo redo | blocks | bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style:
            'body { font-family:UTM Avo; font-size:14px }',
        }}
        onEditorChange={(content) => changeValue(content)}
      />
      <Box
        sx={{
            pt: 2
        }}
      >
        <Button 
            name='Thêm bài viết'
            handleOnClick={handleUpdate}
        />
      </Box>
    </>
  );
};

export const ProductManagementFormAdd = () => {
    const {reset} = useForm<ProductData>();
    const theme = useTheme();
    const [payload, setPayload] = useState<{ description: string }>({
        description: '',
    });

    const [category, setCategory] = useState<Category[] | []>([]);
    const [specification, setSpecification] = useState<Specification[] | []>([]);
    const [productId, setProductId] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [tabIndex, setTabIndex] = useState<number>(0);

    // Hàm thay đổi giá trị bài viết mô tả
    const changeValue = useCallback((value: string) => {
        setPayload(prev => ({ ...prev, description: value }));
    }, []);

    // Hàm cập nhật bài viết mô tả
    const handleUpdate = async () => {
        if (!productId) {
            toast.error('Chưa có sản phẩm để cập nhật mô tả');
            return;
        }

        const response = await updateDescriptionProduct({
            description: payload.description,
            id: productId,
        });

        if (response.success) {
            toast.success(response.message);
            setPayload({description: ''});
        } else {
            toast.error(response.message);
            setPayload({description: ''});
        }
    };

    // Gọi API danh mục và quy cách
    const fetchCategory = async () => {
        const response = await getAllCategory();
        if (response.success) setCategory(response.data || []);
    };

    const fetchSpecification = async () => {
        const response = await getAllSpecification();
        if (response.success) setSpecification(response.data || []);
    };

    useEffect(() => {
        fetchCategory();
        fetchSpecification();
    }, []);

    useEffect(() => {
        console.log('productId:', productId);
    }, [productId]);

    // Hàm thêm sản phẩm
    const handleAddProduct = async (data: ProductData) => {
        try {
            const formData = new FormData();
            formData.append("name_vn", data.name_vn);
            formData.append("name_eng", data.name_eng);
            formData.append("name_short", data.name_short);
            formData.append("category", data.category);
            formData.append("code", data.code);
            formData.append("origin", data.origin);
            formData.append("isActive", data.isActive);
            formData.append("specification", data.specification);
            formData.append("tags", JSON.stringify(data.tags));
            formData.append("price_reference", data.price_reference?.toString() || "0");
            if (data.thumb && data.thumb.length > 0) {
                formData.append("thumb", data.thumb[0]);
            }

            const response = await createProduct(formData);
            if (!response.success) {
                toast.error(response.message);
                return;
            }

            toast.success(response.message);
            setPreview(null);
            reset();
            setProductId(response.data._id);
        } catch (error: unknown) {
            toast.error(`Lỗi: ${error}`);
            setPreview(null);
            reset();
        }
    };

    // Tab handler
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const getInfoTab = () => {
        switch (tabIndex) {
            case 0:
                return (
                    <ProductManagementFormAddInfo
                        category={category}
                        specification={specification}
                        preview={preview}
                        setPreview={setPreview}
                        handleAddProduct={handleAddProduct}
                    />
                );
            case 1:
                return (
                    <ProductManagementFormAddDescription
                        value={payload.description}
                        changeValue={changeValue}
                        handleUpdate={handleUpdate}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Paper sx={{ mb: 2, p: 2, borderRadius: 0, backgroundColor: theme.palette.background.default }}>
            <Box sx={{ py: 2 }}>
                <Typography variant='h6' sx={{ color: theme.palette.primary.main }}>
                    Thêm thông tin khách
                </Typography>

                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    sx={{ width: { xs: '100%', md: '30%' }, py: 2 }}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab sx={{color: theme.palette.text.primary}} label='Thông tin sản phẩm' />
                    <Tab sx={{color: theme.palette.text.primary}} label='Bài Viết' />
                </Tabs>
            </Box>
            <Box>{getInfoTab()}</Box>
        </Paper>
    );
};
