import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image as ImagePDF, Font } from '@react-pdf/renderer';
import { Product } from '@/features/product/type/productType';
import { QuoteData } from '@/features/quote/type/quoteType';
import { UserData } from '@/features/user/type/userTypes';
import { Specification } from '@/features/specification/type/specificationType';
import { getAllUser } from '@/features/user/api/userApis';
import { getAllSpecification } from '@/features/specification/api/specificationApi';
import { getAllProduct } from '@/features/product/api/productApi';
import { getQuoteById } from '@/features/quote/api/quoteApi';
import { Error, PictureAsPdf, RestartAlt } from '@mui/icons-material';
import theme from '@/shared/configs/theme';

// Đăng ký font UTM AVO với file bold riêng
Font.register({
  family: 'UTM-Avo',
  fonts: [{ src: '/fonts/UTM Avo.ttf', fontWeight: 'normal' }],
});

Font.register({
  family: 'UTM-Avo-Bold',
  fonts: [{ src: '/fonts/UTM AvoBold.ttf', fontWeight: 'bold' }],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'UTM-Avo',
    fontSize: 10,
    paddingTop: 80,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 40,
  },
  header: {
    position: 'absolute',
    top: 15,
    left: 135,
    right: 0,
  },
  logo: {
    width: 350,
    height: 'auto',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'UTM-Avo-Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    width: '100%'
  },
  infoLeft: {
    width: '80%'
  },
  infoRight: {
    width: '20%',
    textAlign: 'right',
    marginLeft: 100
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 15
  },
  // Label thường
  label: {
    width: 80,
    fontSize: 6,
    fontFamily: 'UTM-Avo',
    fontWeight: 'normal',
  },
  value: {
    fontSize: 6,
    fontWeight: 'bold',
    fontFamily: 'UTM-Avo',
    flex: 1,
  },
  value1: {
    fontSize: 6,
    fontWeight: 'bold',
    fontFamily: 'UTM-Avo-Bold',
    flex: 1,
  },
  boldText: {
    fontWeight: 'bold',
    fontFamily: 'UTM-Avo',
  },
  normalText: {
    fontWeight: 'normal',
    fontFamily: 'UTM-Avo',
  },
  description: {
    fontSize: 6,
    fontFamily: 'UTM-Avo',
  },
  sectionTitle: {
    fontSize: 6,
    fontWeight: 'bold',
    fontFamily: 'UTM-Avo-Bold',
    marginBottom: 3,
    marginTop: 3,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#cccccc',
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
    textAlign: 'center',
  },
  // Header columns với background và text bold
  tableColHeader1: {
    width: '4%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'UTM-Avo-Bold',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    backgroundColor: '#e0e0e0',
  },
  tableColHeader2: {
    width: '8%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'UTM-Avo-Bold',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    backgroundColor: '#e0e0e0',
  },
  tableColHeader3: {
    width: '8%',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'UTM-Avo-Bold',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    backgroundColor: '#e0e0e0',
  },
  tableColHeader4: {
    width: '8%',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'UTM-Avo-Bold',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    backgroundColor: '#e0e0e0',
  },
  tableColHeader5: {
    width: '8%',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'UTM-Avo-Bold',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    backgroundColor: '#e0e0e0',
  },
  tableColHeader6: {
    width: '8%',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'UTM-Avo-Bold',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    backgroundColor: '#e0e0e0',
  },
  tableColHeader7: {
    width: '8%',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'UTM-Avo-Bold',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    backgroundColor: '#e0e0e0',
  },
  tableColHeader8: {
    width: '16%',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'UTM-Avo-Bold',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    backgroundColor: '#e0e0e0',
  },
  tableColHeader9: {
    width: '8%',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'UTM-Avo-Bold',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    backgroundColor: '#e0e0e0',
  },
  tableColHeader10: {
    width: '8%',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'UTM-Avo-Bold',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    backgroundColor: '#e0e0e0',
  },
  tableColHeader11: {
    width: '8%',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'UTM-Avo-Bold',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    backgroundColor: '#e0e0e0',
  },
  tableColHeader12: {
    width: '8%',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'UTM-Avo-Bold',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    backgroundColor: '#e0e0e0',
  },
  // Data columns
  tableCol1: {
    width: '4%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCol2: {
    width: '8%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCol3: {
    width: '8%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCol4: {
    width: '8%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCol5: {
    width: '8%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCol6: {
    width: '8%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCol7: {
    width: '8%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCol8: {
    width: '16%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCol9: {
    width: '8%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCol10: {
    width: '8%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCol11: {
    width: '8%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCol12: {
    width: '8%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Table cell header - bold và đen
  tableCellHeader: {
    margin: 'auto',
    marginTop: 3,
    marginBottom: 3,
    fontSize: 6,
    fontWeight: 'bold',
    fontFamily: 'UTM-Avo-Bold',
    textAlign: 'center',
  },
  // Table cell thường
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    marginBottom: 5,
    fontSize: 6,
    fontFamily: 'UTM-Avo',
    textAlign: 'center',
  },
  tableCellLeft: {
    margin: 5,
    fontSize: 6,
    fontFamily: 'UTM-Avo',
    textAlign: 'left',
  },
  tableCellRight: {
    margin: 5,
    fontSize: 6,
    fontFamily: 'UTM-Avo',
    textAlign: 'right',
  },
  productImage: {
    width: 30,
    height: 34.5,
    margin: 5,
  },
  noteItem: {
    fontSize: 6,
    marginBottom: 3,
    flexDirection: 'row',
    fontFamily: 'UTM-Avo',
  },
  noteItemMargin: {
    fontSize: 6,
    marginBottom: 3,
    marginLeft: 40,
    fontFamily: 'UTM-Avo',
  },
  noteItemMargin1: {
    fontSize: 6,
    marginBottom: 3,
    marginLeft: 40,
    fontFamily: 'UTM-Avo-Bold',
  },
  // Note item bold
  noteItemBold: {
    fontSize: 8,
    marginBottom: 3,
    fontWeight: 'bold',
    fontFamily: 'UTM-Avo',
  },
  // Text highlight với màu đỏ và bold
  highlight: {
    color: '#FF0000',
    fontWeight: 'bold',
    fontFamily: 'UTM-Avo-Bold',
  },
  // Chữ ký - bold và đen
  signature: {
    textAlign: 'right',
    fontSize: 6,
    fontWeight: 'bold',
    fontFamily: 'UTM-Avo-Bold',
    marginTop: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 6,
    fontFamily: 'UTM-Avo',
  },
  // Style cho số báo giá và ngày
  quotationInfo: {
    fontSize: 6,
    fontWeight: 'bold',
    fontFamily: 'UTM-Avo',
  },
  quotationInfoText: {
    fontSize: 6,
    fontWeight: 'bold',
    fontFamily: 'UTM-Avo-Bold',
  },
});

const QuotePDFDocument = ({ 
  quote, 
  quoteProducts, 
  user, 
  specifications 
}: {
  quote: QuoteData;
  quoteProducts: Product[];
  user: UserData;
  specifications: Specification[];
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header với logo */}
      <View style={styles.header}>
        <ImagePDF 
          style={styles.logo} 
          src='/logo/letterhead_2024-RYNAN AGRICULTURE- dung.png' 
        />
      </View>

      {/* Tiêu đề chính - tô đen */}
      <Text style={styles.title}>BẢNG BÁO GIÁ</Text>

      {/* Thông tin khách hàng */}
      <View style={styles.infoSection}>
        <View style={styles.infoLeft}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Kính gửi:</Text>
            <Text style={styles.value1}>{user.name || ''} </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Địa chỉ:</Text>
            <Text style={styles.value}>{user.address?.detail || ''}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Số điện thoại:</Text>
            <Text style={styles.value}>{user.phone || ''}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email || ''}</Text>
          </View>
        </View>
        <View style={styles.infoRight}>
          <View style={styles.infoRow}>
            <Text style={styles.quotationInfo}>Số: <Text style={styles.quotationInfoText}>{quote.quotation || ''}</Text></Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.quotationInfo}>Ngày: <Text style={styles.quotationInfoText}>{new Date(quote.createdAt as Date).toLocaleDateString('vi-VN') || ''}</Text></Text>
          </View>
        </View>
      </View>

      <Text style={styles.description}>
        Công ty xin gửi đến Quý khách Hàng báo giá mới cho các sản phẩm và dịch vụ như sau:
      </Text>

      {/* Bảng sản phẩm */}
      <Text style={styles.sectionTitle}>1. Chi tiết giá sản phẩm</Text>
      
      <View style={styles.table}>
        {/* Header */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader1}>
            <Text style={styles.tableCellHeader}>STT</Text>
          </View>
          <View style={styles.tableColHeader2}>
            <Text style={styles.tableCellHeader}>Mã sản phẩm</Text>
          </View>
          <View style={styles.tableColHeader3}>
            <Text style={styles.tableCellHeader}>Mô tả hàng hóa/dịch vụ</Text>
          </View>
          <View style={styles.tableColHeader4}>
            <Text style={styles.tableCellHeader}>Cung cấp dinh dưỡng</Text>
          </View>
          <View style={styles.tableColHeader5}>
            <Text style={styles.tableCellHeader}>Cây trồng/Giai đoạn</Text>
          </View>
          <View style={styles.tableColHeader6}>
            <Text style={styles.tableCellHeader}>Quy cách/thùng</Text>
          </View>
          <View style={styles.tableColHeader7}>
            <Text style={styles.tableCellHeader}>ĐVT</Text>
          </View>
          <View style={styles.tableColHeader8}>
            <Text style={styles.tableCellHeader}>Hình ảnh sản phẩm</Text>
          </View>
          <View style={styles.tableColHeader9}>
            <Text style={styles.tableCellHeader}>Giá bán lẻ (VNĐ/ĐVT)</Text>
          </View>
          <View style={styles.tableColHeader10}>
            <Text style={styles.tableCellHeader}>Giá đại lý (VNĐ/ĐVT)</Text>
          </View>
          <View style={styles.tableColHeader11}>
            <Text style={styles.tableCellHeader}>Giá cửa hàng (VNĐ/ĐVT)</Text>
          </View>
          <View style={styles.tableColHeader12}>
            <Text style={styles.tableCellHeader}>Giá lẽ tham khảo (VNĐ/ĐVT)</Text>
          </View>
        </View>

        {/* Data rows */}
        {quoteProducts.map((product, index) => (
          <View style={styles.tableRow} key={product._id}>
            <View style={styles.tableCol1}>
              <Text style={styles.tableCell}>{index + 1}</Text>
            </View>
            <View style={styles.tableCol2}>
              <Text style={styles.tableCell}>{product.code || ''}</Text>
            </View>
            <View style={styles.tableCol3}>
              <Text style={styles.tableCellLeft}>{product.name_vn || ''}</Text>
            </View>
            <View style={styles.tableCol4}>
              <Text style={styles.tableCellLeft}>{product.provide_nutrition || 'Chưa thêm'}</Text>
            </View>
            <View style={styles.tableCol5}>
              <Text style={styles.tableCellLeft}>{`${product.crop}/${product.stage}` || 'Chưa thêm'}</Text>
            </View>
            <View style={styles.tableCol6}>
              <Text style={styles.tableCell}>
                {specifications?.find(el => el._id === product.specifications)?.name || 'Chưa thêm'}
              </Text>
            </View>
            <View style={styles.tableCol7}>
              <Text style={styles.tableCell}>
                {specifications?.find(el => el._id === product.specifications)?.name || 'Chưa thêm'}
              </Text>
            </View>
            <View style={styles.tableCol8}>
              {product.thumb.url ? (
                <ImagePDF style={styles.productImage} src={product.thumb.url} />
              ) : (
                <Text style={styles.tableCell}>Không có ảnh</Text>
              )}
            </View>
            <View style={styles.tableCol9}>
              <Text style={styles.tableCellRight}>
                {product.prices.find(el => el.priceType === 'offeringPrice')?.price.toLocaleString() || 'Chưa thêm'}
              </Text>
            </View>
            <View style={styles.tableCol10}>
              <Text style={styles.tableCellRight}>
                {product.prices.find(el => el.priceType === 'dealerPrice')?.price.toLocaleString() || 'Chưa thêm'}
              </Text>
            </View>
            <View style={styles.tableCol11}>
              <Text style={styles.tableCellRight}>
                {product.prices.find(el => el.priceType === 'storePrice')?.price.toLocaleString() || 'Chưa thêm'}
              </Text>
            </View>
            <View style={styles.tableCol12}>
              <Text style={styles.tableCellRight}>
                {product.prices.find(el => el.priceType === 'referencePrice')?.price.toLocaleString() || 'Chưa thêm'}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Ghi chú */}
      <View>
        <Text style={styles.sectionTitle}>2. Ghi chú</Text>
        <Text style={styles.noteItem}>
          <Text style={{paddingRight: 40}}>Địa điểm giao, nhận hàng:</Text> 
          <Text style={styles.boldText}>          Thỏa thuận</Text>
        </Text>
        <Text style={styles.noteItem}>
          <Text style={{paddingRight: 65}}>Thời gian giao hàng:</Text> <Text style={styles.boldText}>                    sau 7-10 ngày kể từ ngày nhận được thanh toán</Text>
        </Text>
        <Text style={styles.noteItem}>
          <Text style={{paddingRight: 45}}>Phương thức thanh toán: </Text> <Text style={styles.boldText}>           chuyển khoản 100% trị giá đơn hàng</Text>
        </Text>
        <Text style={styles.noteItemMargin1}>CÔNG TY CỔ PHẦN RYNAN SMART AGRICULTURE</Text>
        <Text style={styles.noteItemMargin1}>Ngân hàng TMCP Quân Đội - Chi nhánh Trà Vinh</Text>
        <Text style={styles.noteItemMargin}>STK: 112 111 678 9999</Text>
        <Text style={[styles.noteItem, styles.highlight]}>
          Báo giá sẽ được cập nhật theo giá thị trường và sẽ thông báo đến Quý khách hàng khi có sự thay đổi.
        </Text>
        <Text style={styles.noteItem}>
          Cảm ơn quý khách hàng đã quan tâm đến báo giá của Công ty.
        </Text>
        <Text style={styles.noteItem}>
          Kính chúc Quý Khách thành công và nhiều sức khỏe. Trân trọng!!!
        </Text>
        <Text style={styles.signature}>BỘ PHẬN KINH DOANH</Text>
      </View>

      {/* Footer */}
      <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
        `Trang ${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);

// Component sử dụng
export const ExportToPDF = ({ qid }: { qid: string }) => {
  const [quote, setQuote] = useState<QuoteData>();
  const [quoteProducts, setQuoteProducts] = useState<Product[]>();
  const [specifications, setSpecification] = useState<Specification[]>();
  const [user, setUser] = useState<UserData>();

  // Lấy thông tin báo giá
  useEffect(() => {
    if (!qid) return;
    const fetchQuote = async () => {
      try {
        const response = await getQuoteById(qid);
        if (response.success) setQuote(response.data);
      } catch (error) {
        console.error('Lỗi khi tải báo giá:', error);
      }
    };
    fetchQuote();
  }, [qid]);

  // Lấy sản phẩm từ báo giá
  useEffect(() => {
    if (!quote) return;
    const fetchQuoteProduct = async () => {
      try {
        const response = await getAllProduct();
        if (response.success && response.data) {
          const quoteProductIds = quote.products.map(el => el.pid);
          const filteredProducts = response.data.filter(el =>
            quoteProductIds.includes(el._id)
          );
          setQuoteProducts(filteredProducts);
        }
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
      }
    };
    fetchQuoteProduct();
  }, [quote]);

  // Lấy thông tin người dùng
  useEffect(() => {
    if (!quote) return;
    const fetchQuoteUser = async () => {
      try {
        const response = await getAllUser();
        if (response.success && response.data) {
          const findUser = response.data.find(el => el._id === quote.client);
          if (findUser) setUser(findUser);
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin khách hàng:', error);
      }
    };
    fetchQuoteUser();
  }, [quote]);

  // Lấy quy cách
  useEffect(() => {
    const fetchSpecification = async () => {
      try {
        const response = await getAllSpecification();
        if (response.success) setSpecification(response.data);
      } catch (error) {
        console.error('Lỗi khi tải quy cách:', error);
      }
    };
    fetchSpecification();
  }, []);

  // Kiểm tra dữ liệu đã sẵn sàng
  const isDataReady = qid && quote && quoteProducts && user && specifications;

  return (
    <div>
      {isDataReady ? (
        <PDFDownloadLink
          document={
            <QuotePDFDocument
              quote={quote as QuoteData}
              quoteProducts={quoteProducts as Product[]}
              user={user as UserData}
              specifications={specifications as Specification[]}
            />
          }
          fileName={`bao_gia_${quote.quotation}.pdf`}
          className="pdf-download-link"
        >
          {({ loading, error }) => {
            if (loading) return <PictureAsPdf style={{color: theme.palette.error.main}}/>;
            if (error) return <Error style={{color: theme.palette.error.main}}/>;
            return <PictureAsPdf style={{color: theme.palette.error.main}}/>;
          }}
        </PDFDownloadLink>
      ) : (
        <RestartAlt/>
      )}
    </div>
  );
};