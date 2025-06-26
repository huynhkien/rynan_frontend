import { RegisterData } from "@/features/user/type/userTypes";
import { InvalidFieldProps } from "@/types/widgets/contact";

export const validateFormLoginAndRegister = (data: RegisterData, isRegister: boolean, setInValidFields: (fields: InvalidFieldProps[]) => void): InvalidFieldProps[] => {
    const invalids: InvalidFieldProps[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email) invalids.push({ name: 'email', message: 'Email không được để trống' });
    if (!emailRegex.test(data.email)) invalids.push({ name: 'email', message: 'Email không hợp lệ' });
    if (!data.password ) invalids.push({ name: 'password', message: 'Mật khẩu không được để trống' });
    if (isRegister) {
        if (!data.name) invalids.push({ name: 'name', message: 'Tên không được để trống' });
        if (!data.phone) {
            invalids.push({ name: 'phone', message: 'Số điện thoại không được để trống' });
        } else if (!/^\d{10}$/.test(data.phone)) {
            invalids.push({ name: 'phone', message: 'Số điện thoại phải gồm đúng 10 chữ số' });
            }
        if (data.password.length < 8) invalids.push({ name: 'password', message: 'Mật khẩu phải có ít nhất 8 ký tự' });
        if (data.password !== data.confirmPassword) {
            invalids.push({ name: 'confirmPassword', message: 'Mật khẩu nhập lại không khớp' });
        }
        }
    setInValidFields(invalids);
    if (invalids.length > 0) {
        setTimeout(() => setInValidFields([]), 500);
    }
    return invalids;
  };