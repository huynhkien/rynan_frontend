'use client';

import { getAllProduct } from '@/features/product/api/productApi';
import { Product } from '@/features/product/type/productType';
import { getQuoteById } from '@/features/quote/api/quoteApi';
import { QuoteData } from '@/features/quote/type/quoteType';
import { getAllSpecification } from '@/features/specification/api/specificationApi';
import { Specification } from '@/features/specification/type/specificationType';
import { getAllUser } from '@/features/user/api/userApis';
import { UserData } from '@/features/user/type/userTypes';
import { PictureAsPdfOutlined } from '@mui/icons-material';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { useEffect, useState } from 'react';


// Gắn font mặc định
pdfMake.vfs = pdfFonts.vfs;

// Hàm chuyển ảnh thành base64
const getBase64ImageFromURL = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      } else {
        reject(new Error('Không tìm thấy context'));
      }
    };
    img.onerror = () => reject(new Error('Không thể load ảnh'));
    img.src = url;
  });
};

export const ExportToPDF = ({qid}: {qid: string}) => {
  const [quote, setQuote] = useState<QuoteData>();
  const [quoteProducts, setQuoteProducts] = useState<Product[]>();
  const [specifications, setSpecification] = useState<Specification[]>();
  const [user, setUser] = useState<UserData>();
  
  // hiển thị thông tin phiếu báo giá
  useEffect(() => {
    if(!qid) return;
    const fetchQuote = async () => {
      const response = await getQuoteById(qid);
      if(response.success) setQuote(response.data);
    }
    fetchQuote();
  }, [qid]);
  // Hiển thị thông tin sản phẩm
  useEffect(() => {
    if(!quote) return;
    const fetchQuoteProduct = async() => {
      const response = await getAllProduct();
      if(response.success && response.data){
        const quoteProductIds = quote.products.map((el) => el.pid);
        const filteredProduct = response.data.filter((el) => quoteProductIds.includes(el._id));
        if(filteredProduct) setQuoteProducts(filteredProduct);
      }
    }
    fetchQuoteProduct();
  }, [quote]);
  // Hiển thị thông tin khách hàng
  useEffect(() => {
    if(!quote) return;
    const fetchQuoteUser = async() => {
      const response = await getAllUser();
      if(response.success && response.data){
        const findUser = response.data.find((el) => el._id === quote.client);
        if(findUser) setUser(findUser); 
      }
    }
    fetchQuoteUser();
  },[quote]);
  // Hiển thị thông tin quy cách
  useEffect(() => {
    const fetchSpecification = async () => {
      const response = await getAllSpecification();
      if(response.success) setSpecification(response.data)
    }
    fetchSpecification();
  },[]);
  // Xử lý tạo table sản phẩm
  const createProductRows = async () => {
    if (!quoteProducts || !quote) return [];
    
    const rows = [];
    
    // Header row
    rows.push([
      { text: 'STT', fontSize: 6, bold: true, fillColor: '#e0e0e0', style: 'tableHeader' },
      { text: 'Mã sản phẩm', fontSize: 6, bold: true, fillColor: '#e0e0e0', style: 'tableHeader' },
      { text: 'Mô tả hàng hóa / dịch vụ', fontSize: 6, bold: true, fillColor: '#e0e0e0', style: 'tableHeader' },
      { text: 'Cung cấp dinh dưỡng', fontSize: 6, bold: true, fillColor: '#e0e0e0', style: 'tableHeader' },
      { text: 'Cây trồng/Giai đoạn', fontSize: 6, bold: true, fillColor: '#e0e0e0', style: 'tableHeader' },
      { text: 'Quy cách/thùng', fontSize: 6, bold: true, fillColor: '#e0e0e0', style: 'tableHeader' },
      { text: 'ĐVT', fontSize: 6, bold: true, fillColor: '#e0e0e0', style: 'tableHeader' },
      { text: 'Hình ảnh sản phẩm', fontSize: 6, bold: true, fillColor: '#e0e0e0', style: 'tableHeader' },
      {
        stack: [
          { text: 'Giá bán lẻ', bold: true },
          { text: '(VNĐ/ĐVT)', fontSize: 6 }
        ],
        alignment: 'center',
        fontSize: 6,
        fillColor: '#e0e0e0',
        style: 'tableHeader'
      },
      {
        stack: [
          { text: 'Giá sỉ', bold: true },
          { text: '(VNĐ/ĐVT)', fontSize: 6 }
        ],
        alignment: 'center',
        fontSize: 6,
        fillColor: '#e0e0e0',
        style: 'tableHeader'
      },
      {
        stack: [
          { text: 'Giá đại lý', bold: true },
          { text: '(VNĐ/ĐVT)', fontSize: 6 }
        ],
        alignment: 'center',
        fontSize: 6,
        fillColor: '#e0e0e0',
        style: 'tableHeader'
      },
      {
        stack: [
          { text: 'Giá NPP', bold: true },
          { text: '(VNĐ/ĐVT)', fontSize: 6 }
        ],
        alignment: 'center',
        fontSize: 6,
        fillColor: '#e0e0e0',
        style: 'tableHeader'
      },
    ]);

    // Data rows
    for (let i = 0; i < quoteProducts.length; i++) {
      const product = quoteProducts[i];
      
      // Lấy ảnh sản phẩm nếu có
      let productImage = '';
      if (product.thumb.url) {
        try {
          productImage = await getBase64ImageFromURL(product.thumb.url);
        } catch (error: unknown) {
          console.error('Không thể load ảnh sản phẩm:', error);
        }
      }

      rows.push([
        { text: (i + 1).toString(), fontSize: 6 },
        { text: product.code || '', fontSize: 6 },
        { text: product.name_vn || '', fontSize: 6 },
        { text: product.provide_nutrition || 'Chưa thêm', fontSize: 6 },
        { text: `${product.crop}/${product.stage}` || 'Chưa thêm', fontSize: 6 },
        { text: specifications?.find((el) => el._id === product.specifications)?.name || 'Chưa thêm', fontSize: 6 },
        { text: specifications?.find((el) => el._id === product.specifications)?.name || 'Chưa thêm', fontSize: 6 },
        productImage ? {
          image: productImage,
          width: 100,
          alignment: 'center',
        } : { text: '', fontSize: 6 },
        { text: product.prices.find((el) => el.priceType === 'offeringPrice')?.price.toLocaleString() || 'Chưa thêm' , fontSize: 6 },
        { text: product.prices.find((el) => el.priceType === 'dealerPrice')?.price.toLocaleString() || 'Chưa thêm', fontSize: 6 },
        { text: product.prices.find((el) => el.priceType === 'storePrice')?.price.toLocaleString() || 'Chưa thêm', fontSize: 6 },
        { text: product.prices.find((el) => el.priceType === 'referencePrice')?.price.toLocaleString() || 'Chưa thêm', fontSize: 6 }
      ]);
    }

    return rows;
  };
  const handleExportPDF = async () => {
    if (!quoteProducts || !quote || !user) {
      alert('Dữ liệu chưa được tải đầy đủ. Vui lòng thử lại.');
      return;
    }

    const logo = await getBase64ImageFromURL('/logo/letterhead_2024-RYNAN AGRICULTURE- dung.png');
    const tableRows = await createProductRows();
    const docDefinition: TDocumentDefinitions = {
      pageSize: 'A4',
      pageMargins: [40, 70, 40, 20],

      header: {
        image: logo,
        width: 350,
        alignment: 'center',
        margin: [0, 15, 0, 0],
      },

      footer: (currentPage, pageCount) => ({
        columns: [
          {
            text: `Trang ${currentPage} / ${pageCount}`,
            alignment: 'center',
            fontSize: 6,
          },
        ],
        margin: [0, 0, 0, 5],
      }),

      content: [
        {
          text: 'BẢNG BÁO GIÁ',
          fontSize: 7,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          table: {
            widths: ['*', 'auto'],
            body: [
              [
                {
                  stack: [
                    {
                      columns: [
                        { text: 'Kính gửi:', fontSize: 6, width: 'auto' },
                        { text: `${user?.name}`, fontSize: 6, bold: true, width: '*' , marginLeft: 40 }
                      ],
                      marginBottom: 3
                    },
                    {
                      columns: [
                        { text: 'Địa chỉ:', fontSize: 6, width: 'auto' },
                        { text: `${user?.address?.detail}`, fontSize: 6, bold: true, width: '*', marginLeft: 44 }
                      ],
                      marginBottom: 3
                    },
                    {
                      columns: [
                        { text: 'Số điện thoại:', fontSize: 6, width: 'auto' },
                        { text: `${user?.phone}`, fontSize: 6, bold: true, width: '*', marginLeft: 27 }
                      ],
                      marginBottom: 3
                    },
                    {
                      columns: [
                        { text: 'Email:', fontSize: 6, width: 'auto' },
                        { text: `${user?.email}`, fontSize: 6, bold: true, width: '*',marginLeft: 47 }
                      ],
                      marginBottom: 3
                    },
                    {
                      text: 'Công ty xin gửi đến Quý khách Hàng báo giá mới cho các sản phẩm và dịch vụ như sau:',
                      fontSize: 6,
                      marginBottom: 3
                    }
                  ],
                  border: [false, false, false, false],
                },
                {
                  stack: [
                    {
                      text: [
                        { text: 'Số: ', fontSize: 6 },
                        { text: 'RSA251', fontSize: 6, bold: true, marginLeft: 5 },
                      ],
                      marginBottom: 3,
                      alignment: 'right'
                    },
                    {
                      text: [
                        { text: 'Ngày: ', fontSize: 6 },
                        { text: '14/06/2025', fontSize: 6, bold: true, marginLeft: 5 },
                      ],
                      alignment: 'right'
                    },
                  ],
                  border: [false, false, false, false],
                },
              ],
            ],
          },
          layout: 'noBorders',
          margin: [10, 0, 10, 0],
        },
        {
          text: '1. Chi tiết giá sản phẩm',
          fontSize: 6,
          bold: true,
          marginBottom: 3
        },
        {
          table: {
            widths: [15, 32, 57, 30, 45, 28, 25, 60, 28, 28, 28, 28],
            heights: Array(tableRows.length).fill(45),
            body: tableRows,
          },
          layout: 'grid',
        },
        {
          text: '2. Ghi chú',
          marginTop: 5,
          marginBottom: 3,
          bold: true,
          fontSize: 6
        },
        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  stack: [
                    {
                      columns: [
                        { text: 'Địa điểm giao, nhận hàng: ', fontSize: 6, width: 'auto' },
                        { text: 'Thỏa thuận', fontSize: 6, bold: true, width: '*', marginLeft: 33 },
                      ],
                      marginBottom: 3
                    },
                    {
                      columns: [
                        { text: 'Thời gian giao hàng: ', fontSize: 6, width: 'auto' },
                        { text:  'sau 7-10 ngày kể từ ngày nhận được thanh toán', fontSize: 6, bold: true, marginLeft: 49, width: '*' },
                      ],
                      marginBottom: 3
                    },
                    {
                      columns: [
                        { text: 'Phương thức thanh toán: ', fontSize: 6, width: 'auto' },
                        { text: 'chuyển khoản 100% trị giá đơn hàng vào tài khoản của công ty chúng tôi trước khi nhận hàng', fontSize: 6, bold: true, width: '*', marginLeft: 36 },
                      ],
                      marginBottom: 3,
                    },
                    {
                      text: 'CÔNG TY CỔ PHẦN RYNAN SMART AGRICULTURE',
                      fontSize: 6,
                      bold: true,
                      marginBottom: 3,
                      marginLeft: 40
                    },
                    {
                      text: 'Ngân hàng TMCP Quân Đội - Chi nhánh Trà Vinh',
                      fontSize: 6,
                      bold: true,
                      marginBottom: 3,
                      marginLeft: 40
                    },
                    {
                      text: 'STK: 112 111 678 9999',
                      fontSize: 6,
                      marginBottom: 3,
                      marginLeft: 40,
                      bold: true
                    },
                    {
                      text: 'Báo giá sẽ được cập nhật theo giá thị trường và sẽ thông báo đến Quý khách hàng khi có sự thay đổi.',
                      fontSize: 6,
                      fillColor: '#FF0000' ,
                      bold: true,
                      marginBottom: 3,
                    },
                    {
                      text: 'Cảm ơn quý khách hàng đã quan đến báo giá của Công ty. Xin vui lòng liên hệ với chúng tôi qua số điện thoại 0287 1099 389 để có thêm thông tin.',
                      fontSize: 6,
                      marginBottom: 3,
                    },
                    {
                      text: 'Kính chức Quý Hàng thành công và nhiều sức khỏe. Trân trọng!!!',
                      fontSize: 6,marginBottom: 3,
                    },
                    {
                      text: 'BỘ PHẬN KINH DOANH',
                      fontSize: 6,
                      bold: true,
                      marginTop: 5,
                      marginLeft: 360
                    }
                  ],
                  border: [false, false, false, false],
                },
              ],
            ],
          },
          layout: 'noBorders',
        },
      ],

      styles: {
        tableHeader: {
          bold: true,
          fontSize: 6,
          alignment: 'center',
        },
      },

    };

    pdfMake.createPdf(docDefinition).download('bao_gia.pdf');
  };

  return (
    <PictureAsPdfOutlined
      onClick={handleExportPDF}
      style={{
        cursor: 'pointer',
        fontSize: 24,
        color: '#e64c3c',
      }}
    />
  );
};
