'use client'
import { ButtonContact } from "@/shared/components";
import { InputForm } from "@/shared/components/ui/InputForm"
import { ContactFormProps, InvalidFieldProps } from "@/types/widgets/contact.types";
import { Email, LocationCity, Person, Phone } from "@mui/icons-material";
import { Box, Typography, useTheme } from "@mui/material"
import { useState } from "react";

export const ContactForm = () => {
    const theme = useTheme();
    const [payload, setPayload] = useState<ContactFormProps>({
        email: '',
        name: '',
        phone: '',
        address: '',
        message: ''
    });
    const [invalidFields, setInValidFields] = useState<InvalidFieldProps[]>([])
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
            <Box>
                <Box sx={{
                    display: 'flex',
                    gap: 3,
                    mb:3
                }}>
                    <InputForm
                        iconClass={<Person sx={{color: theme.palette.primary.main}} />}
                        value={payload.name || ''}
                        setValue={(value) => setPayload((prev) => ({ ...prev, name: value }))}
                        nameKey="name"
                        placeholder="Tên"
                        invalidFields={invalidFields}
                        setInValidFields={setInValidFields}
                    />
                    <InputForm
                        iconClass={<Email sx={{color: theme.palette.primary.main}} />}
                        value={payload.email || ''}
                        setValue={(value) => setPayload((prev) => ({ ...prev, name: value }))}
                        nameKey="email"
                        placeholder="Email"
                        invalidFields={invalidFields}
                        setInValidFields={setInValidFields}
                    />
                </Box>
                <Box sx={{
                    display: 'flex',
                    gap: 3,
                    mb:2
                }}>
                    <InputForm
                        iconClass={<Phone sx={{color: theme.palette.primary.main}} />}
                        value={payload.phone || ''}
                        setValue={(value) => setPayload((prev) => ({ ...prev, name: value }))}
                        nameKey="phone"
                        placeholder="Điện thoại"
                        invalidFields={invalidFields}
                        setInValidFields={setInValidFields}
                    />
                    <InputForm
                        iconClass={<LocationCity sx={{color: theme.palette.primary.main}} />}
                        value={payload.address || ''}
                        setValue={(value) => setPayload((prev) => ({ ...prev, name: value }))}
                        nameKey="address"
                        placeholder="Địa chỉ"
                        invalidFields={invalidFields}
                        setInValidFields={setInValidFields}
                    />
                </Box>
                <Box>
                    <InputForm
                        value={payload.message || ''}
                        setValue={(value) => setPayload((prev) => ({ ...prev, name: value }))}
                        nameKey="message"
                        placeholder="Nội dung"
                        invalidFields={invalidFields}
                        setInValidFields={setInValidFields}
                        multiline
                        rows={14}
                    />
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'flex-end',mt:2}}>
                    <ButtonContact text='Liên Hệ'/>
                </Box>
            </Box>
        </Box>
    )
}