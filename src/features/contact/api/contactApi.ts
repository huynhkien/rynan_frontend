import axiosInstance from "@/shared/configs/axios";
import { ContactEndpoints } from "./contactEndpoints";
import { ContactData, ContactResponse, ContactResponseById, MailData } from "../type/contactType";


// Thêm liên hệ
export const createContact = async (data: ContactData): Promise<ContactResponse> => 
  axiosInstance.post(ContactEndpoints.CREATE, data, {
    withCredentials: true,
    
});
// Gửi mail
export const sendMail = async (data: MailData): Promise<ContactResponse> => 
  axiosInstance.post(ContactEndpoints.SEND_MAIL, data, {
    withCredentials: true,
});
// Hiển thị tất cả liên hệ
export const getAllContact = async(): Promise<ContactResponse> => 
    axiosInstance.get(ContactEndpoints.GET_ALL);
// Lấy liên hệ theo id
export const getContactById = async(id: string): Promise<ContactResponseById> => 
    axiosInstance.get(ContactEndpoints.GET_BY_ID(id));
// Xóa liên hệ
export const deleteContact = async(id: string): Promise<ContactResponse> => 
    axiosInstance.delete(ContactEndpoints.DELETE(id))