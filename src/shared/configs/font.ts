import localFont from 'next/font/local';

// Cấu hình font chữ cho website
const utmAvo = localFont({
  src: '../../../public/fonts/UTM Avo.ttf', 
  variable: '--font-utm-avo',
  display: 'swap',
});

export default utmAvo;
