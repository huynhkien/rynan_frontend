import axios from 'axios';

// Kiểu dữ liệu chung cho option
export interface BaseOption {
  _id: number;
  name: string;
  name_vn?: string;
}

// Kiểu dữ liệu cho API trả về
export interface AddressOption {
  code: number;
  name: string;
  name_vn?: string;
}

// Helper function để convert AddressOption thành BaseOption
export const convertToOption = (address: AddressOption): BaseOption => ({
  _id: address.code,
  name: address.name,
  name_vn: address.name_vn,
});

// Kiểu cho API trả về nhiều tỉnh
export type ProvinceResponse = AddressOption[];

// Kiểu cho response khi gọi `depth=2`
interface District {
  code: number;
  name: string;
  wards?: Ward[];
}

interface Ward {
  code: number;
  name: string;
}

interface ProvinceWithDistricts {
  code: number;
  name: string;
  districts: District[];
}

interface DistrictWithWards {
  code: number;
  name: string;
  wards: Ward[];
}

// Lấy danh sách tỉnh/thành phố
export const fetchProvinces = async (): Promise<BaseOption[]> => {
  const res = await axios.get<ProvinceResponse>('https://provinces.open-api.vn/api/p/');
  return res.data.map(convertToOption);
};

// Lấy danh sách quận/huyện theo mã tỉnh
export const fetchDistricts = async (provinceCode: number): Promise<BaseOption[]> => {
  const res = await axios.get<ProvinceWithDistricts>(
    `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
  );
  return res.data.districts.map(d => convertToOption({
    code: d.code,
    name: d.name
  }));
};

// Lấy danh sách phường/xã theo mã quận
export const fetchWards = async (districtCode: number): Promise<BaseOption[]> => {
  const res = await axios.get<DistrictWithWards>(
    `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
  );
  return res.data.wards.map(w => convertToOption({
    code: w.code,
    name: w.name
  }));
};