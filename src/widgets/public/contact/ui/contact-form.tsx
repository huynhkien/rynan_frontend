'use client'
import { createContact } from "@/features/contact/api/contactApi";
import ContactFormInput from "@/features/contact/components/ContactFormInput";
import { ContactData } from "@/features/contact/type/contactType";
import { ButtonContact } from "@/shared/components";
import { Box, Typography, useTheme } from "@mui/material"
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { toast } from "react-toastify";

export const ContactForm = () => {
    const theme = useTheme();
    const { register, formState: { errors }, handleSubmit, reset} = useForm<ContactData>();
    const handleAddContact = async(data: ContactData) => {
        const contactData = {
            name: data.name,
            email: data.email,
            address: data.address,
            phone: data.phone,
            message: data.message
        }
        const response = await createContact(contactData);
        if(response.success){
            toast.success(response.message);
            reset();
        }else{
            toast.error(response.message);
        }
    }
    return (
        <Box sx={{zIndex:10}}>
            <Box
                sx={{
                    mb:3
                }}
            >
                <Typography
                    sx={{
                        color: theme.palette.primary.light
                    }}
                >
                    Bạn cần hỗ trợ?
                </Typography>
                <Typography
                    variant='h4'
                    sx={{
                        py:1,
                        color: theme.palette.primary.main,
                        fontWeight: theme.typography.fontWeightBold
                    }}
                >
                    Liên hệ với chúng tôi
                </Typography>
                <Typography>Vui lòng điền thông tin, Rynan Smart Agriculture sẽ nhanh chóng hỗ trợ bạn.</Typography>
            </Box>
            <form onSubmit={handleSubmit(handleAddContact)}>
                <Box sx={{
                    display: 'flex',
                    gap: 3,
                    mb:3,
                    width: '100%'
                }}>
                    <ContactFormInput
                        label="Tên người liên hệ"
                        important
                        placeholder='Nhập tên người liên hệ'
                        register={register as UseFormRegister<ContactData>}
                        errors={errors as FieldErrors<ContactData>}
                        id='name'
                        sx={{width: '50%'}}
                        validate={{
                            required: 'Tên người liên hệ không được để trống',
                            minLength: {
                                value: 5,
                                message: 'Tên người liên hệ phải có ít nhất 5 ký tự'
                            }
                        }}
                    />
                    <ContactFormInput
                        label="Email"
                        important
                        placeholder='Nhập email'
                        register={register as UseFormRegister<ContactData>}
                        errors={errors as FieldErrors<ContactData>}
                        id='email'
                        sx={{width: '50%'}}
                        validate={{
                            required: 'Email không được để trống',
                            minLength: {
                                value: 10,
                                message: 'Email phải có ít nhất 10 ký tự'
                            },
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Email không hợp lệ'
                            }
                        }}
                    />
                </Box>
                <Box sx={{
                    display: 'flex',
                    gap: 3,
                    mb:3,
                    width: '100%'
                }}>
                    <ContactFormInput
                        label="Số điện thoại"
                        important
                        placeholder='Nhập số điện thoại'
                        register={register as UseFormRegister<ContactData>}
                        errors={errors as FieldErrors<ContactData>}
                        id='phone'
                        sx={{width: '50%'}}
                        validate={{
                            required: 'Số điện thoại không được để trống',
                            minLength: {
                                value: 10,
                                message: 'Số điện thoại phải có ít nhất 10 ký tự'
                            },
                            pattern: {
                                value: /^[0-9]{10,11}$/,
                                message: 'Số điện thoại phải có 10-11 chữ số'
                            }
                        }}
                    />
                    <ContactFormInput
                        label="Địa chỉ"
                        important
                        placeholder='Nhập Địa chỉ'
                        register={register as UseFormRegister<ContactData>}
                        errors={errors as FieldErrors<ContactData>}
                        id='address'
                        sx={{width: '50%'}}
                        validate={{
                            required: 'Địa chỉ không được để trống',
                            minLength: {
                                value: 5,
                                message: 'Địa chỉ phải có ít nhất 5 ký tự'
                            }
                        }}
                    />
                </Box>
                <ContactFormInput
                        label="Tin nhắn"
                        important
                        placeholder='Nhập tin nhắn'
                        register={register as UseFormRegister<ContactData>}
                        errors={errors as FieldErrors<ContactData>}
                        id='message'
                        sx={{width: '100%'}}
                        multiline
                        rows={12.5}
                        validate={{
                            required: 'Tin nhắn không được để trống',
                            minLength: {
                                value: 15,
                                message: 'Tin nhắn phải có ít nhất 15 ký tự'
                            }
                        }}
                    />
                <Box sx={{display: 'flex', justifyContent: 'flex-end',mt:2}}>
                    <ButtonContact text='Liên Hệ'/>
                </Box>
            </form>
        </Box>
    )
}