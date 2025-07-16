'use client'
import { sendMail } from "@/features/contact/api/contactApi";
import MailFormInput from "@/features/contact/components/MailFormInput";
import { MailData } from "@/features/contact/type/contactType";
import { Button } from "@/shared/components";
import { useAppDispatch } from "@/shared/hooks/useAppHook";
import { showModal } from "@/shared/store/appSlice";
import { Box, Typography, useTheme } from "@mui/material"
import { Editor } from "@tinymce/tinymce-react";
import { useCallback, useState } from "react";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { toast } from "react-toastify";
export const ContactManagementFormSendMail = ({email, render} : {email: string; render: () => void;}) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const { register, handleSubmit,  formState: { errors }, reset} = useForm<MailData>();
    const [payload, setPayload] = useState<{ description: string }>({
            description: '',
        });
    // Hàm thay đổi giá trị bài viết mô tả
    const changeValue = useCallback((value: string) => {
        setPayload(prev => ({ ...prev, description: value }));
    }, []);
    // Xử lý gửi mail
    const handleSendMail = async(data: MailData) => {
        const mailData = {
            email: email,
            subject: data.subject,
            html: payload.description
        }
        dispatch(showModal({ isShowModal: true, modalType: 'loading' }));
        const response = await sendMail(mailData)
        dispatch(showModal({ isShowModal: false, modalType: null }));
        if(response.success) {toast.success(response.message); reset(); render();}
        else{ toast.error(response.message);}
    }
    return (
        <Box
            sx={{
                width: '100%',
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
                    Phản hồi mail
                </Typography>
            </Box>
            
            <form onSubmit={handleSubmit(handleSendMail)}
                style={{
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                }}
            >
                <MailFormInput
                    label='Tiêu đề mail'
                    important
                    placeholder='Thêm tiều đề mail'
                    register={register as UseFormRegister<MailData>}
                    errors={errors as FieldErrors<MailData>}
                    id='subject'
                    validate={{
                        required: 'Tên tiều đề không được để trống',
                        minLength: {
                            value: 10,
                            message: 'Tên tiều đề phải có ít nhất 10 ký tự'
                        }
                    }}
                />
                <MailFormInput
                    label='Người nhận'
                    important
                    placeholder='Người nhận'
                    register={register as UseFormRegister<MailData>}
                    errors={errors as FieldErrors<MailData>}
                    id='email'
                    defaultValue={email}
                    
                />
                <Box sx={{backgroundColor: theme.palette.secondary.dark}}>
                    <Editor
                            apiKey="6gmu62t9gmyhx5y2q16o4q6ac269ubj6ul5gd8106pux71jo"
                            value={payload.description}
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
                </Box>
                <Box sx={{ pt: 0.5 }}>
                    <Button 
                        name='Gửi mail'
                    />
                </Box>
            </form>
        </Box>
    )
}