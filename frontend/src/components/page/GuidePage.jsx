import { useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { 
  HelpCircle, 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  CreditCard, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  UserCheck, 
  CheckCircle2, 
  Info,
  MapPin,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AccordionItem = ({ title, children, isOpen, onClick }) => (
  <div className="border-b border-gray-100 last:border-0">
    <button 
      onClick={onClick}
      className="w-full py-6 flex items-center justify-between text-left group transition-all"
    >
      <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-[#1565C0]' : 'text-gray-700 group-hover:text-[#1565C0]'}`}>
        {title}
      </span>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-[#1565C0] text-white rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-[#1565C0]'}`}>
        <ChevronDown className="w-5 h-5" />
      </div>
    </button>
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
      <div className="text-gray-500 leading-relaxed">
        {children}
      </div>
    </div>
  </div>
);

const GuidePage = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      title: "Làm thế nào để tìm được phòng ưng ý nhanh nhất?",
      content: "Bạn nên sử dụng bộ lọc tìm kiếm chi tiết theo khu vực, mức giá, và loại hình phòng. Đừng quên đọc kỹ mô tả và xem đánh giá từ những người thuê trước đó để có cái nhìn khách quan nhất."
    },
    {
      title: "Việc đăng tin trên TroTốt có mất phí không?",
      content: "Hiện tại, TroTốt hỗ trợ đăng tin cơ bản hoàn toàn miễn phí cho tất cả chủ nhà. Chúng tôi cũng cung cấp các gói đẩy tin (VIP) để giúp tin đăng của bạn tiếp cận được nhiều khách hàng tiềm năng hơn."
    },
    {
      title: "Tôi có cần phải đặt cọc qua website không?",
      content: "Quy trình đặt cọc thường được thực hiện trực tiếp giữa chủ nhà và người thuê sau khi xem phòng. Tuy nhiên, chúng tôi khuyến khích bạn sử dụng tính năng 'Gửi yêu cầu đặt phòng' trên web để lưu lại lịch sử giao dịch và được hỗ trợ tốt nhất nếu có tranh chấp."
    },
    {
      title: "Làm sao để biết tin đăng là thật hay giả?",
      content: "TroTốt có đội ngũ duyệt tin 24/7. Những tin đăng có nhãn 'Đã xác minh' là những phòng đã được nhân viên của chúng tôi kiểm tra trực tiếp về địa chỉ và hình ảnh. Bạn nên ưu tiên những tin này."
    },
    {
      title: "Tôi muốn báo cáo một tin đăng lừa đảo?",
      content: "Ở mỗi trang chi tiết phòng đều có nút 'Báo cáo'. Bạn vui lòng cung cấp lý do và bằng chứng cụ thể, chúng tôi sẽ xử lý và khóa tài khoản vi phạm ngay lập tức để bảo vệ cộng đồng."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-[#1565C0] text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-white rounded-full blur-[100px]"></div>
            <div className="absolute top-1/2 -right-20 w-96 h-96 bg-[#FFA726] rounded-full blur-[120px]"></div>
          </div>
          
          <div className="max-w-[1200px] mx-auto px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-[#FFA726] text-xs font-bold uppercase tracking-wider mb-6 border border-white/10">
              <HelpCircle className="w-4 h-4" />
              Trung tâm hỗ trợ
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Chúng tôi có thể <span className="text-[#FFA726]">giúp gì</span> cho bạn?
            </h1>
            <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Tìm kiếm câu trả lời nhanh chóng cho các thắc mắc thường gặp hoặc tìm hiểu cách bắt đầu hành trình của bạn tại TroTốt.
            </p>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="max-w-[1200px] mx-auto px-4 -mt-10 mb-20 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-white group hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-blue-50 text-[#1565C0] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1565C0] group-hover:text-white transition-colors duration-500">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Dành cho Người thuê</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Tìm hiểu cách sử dụng bộ lọc, quy trình xem phòng và các lưu ý để thuê được phòng an toàn.
              </p>
              <button className="text-[#1565C0] font-bold text-sm flex items-center gap-2 group/btn">
                Xem chi tiết <ChevronDown className="w-4 h-4 group-hover/btn:translate-y-1 transition-transform" />
              </button>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-white group hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-orange-50 text-[#FFA726] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#FFA726] group-hover:text-white transition-colors duration-500">
                <PlusCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Dành cho Chủ nhà</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Hướng dẫn đăng tin hiệu quả, quản lý yêu cầu thuê và cách để tin đăng của bạn nổi bật hơn.
              </p>
              <button className="text-[#FFA726] font-bold text-sm flex items-center gap-2 group/btn">
                Xem chi tiết <ChevronDown className="w-4 h-4 group-hover/btn:translate-y-1 transition-transform" />
              </button>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-white group hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors duration-500">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">An toàn & Bảo mật</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Các quy tắc cộng đồng, mẹo phòng tránh lừa đảo và cách chúng tôi bảo vệ thông tin của bạn.
              </p>
              <button className="text-green-600 font-bold text-sm flex items-center gap-2 group/btn">
                Xem chi tiết <ChevronDown className="w-4 h-4 group-hover/btn:translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Guides */}
        <div className="max-w-[1200px] mx-auto px-4 py-10 space-y-32">
          
          {/* Step by Step Flow */}
          <section>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Quy trình thuê phòng tại TroTốt</h2>
              <p className="text-gray-500 max-w-xl mx-auto">Chỉ với 4 bước đơn giản, bạn sẽ tìm thấy nơi ở lý tưởng của mình một cách nhanh chóng và an toàn.</p>
            </div>

            <div className="relative">
              {/* Connection Line (Desktop) */}
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                {[
                  { step: "01", icon: <Search />, title: "Tìm kiếm", desc: "Sử dụng thanh công cụ để tìm theo quận, giá và tiện ích." },
                  { step: "02", icon: <MessageCircle />, title: "Liên hệ", desc: "Chat hoặc gọi điện trực tiếp cho chủ nhà để hỏi thêm thông tin." },
                  { step: "03", icon: <MapPin />, title: "Xem phòng", desc: "Đến xem trực tiếp để kiểm tra cơ sở vật chất và môi trường xung quanh." },
                  { step: "04", icon: <CheckCircle2 />, title: "Ký hợp đồng", desc: "Thỏa thuận các điều khoản và tiến hành ký kết để dời vào." }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center group">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-[#F8FAFC] shadow-lg mb-6 group-hover:border-[#1565C0] transition-colors duration-500">
                      <div className="text-[#1565C0]">
                        {item.icon}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#FFA726] text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {item.step}
                      </div>
                    </div>
                    <h4 className="text-lg font-extrabold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Safety Section */}
          <section className="bg-white rounded-[3rem] p-8 md:p-16 shadow-sm border border-gray-100 flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Mẹo thuê phòng an toàn</h2>
              <div className="space-y-4">
                {[
                  "Luôn xem phòng trực tiếp trước khi chuyển bất kỳ khoản tiền nào.",
                  "Kiểm tra kỹ hợp đồng thuê nhà: thời hạn, tiền cọc, giá điện nước.",
                  "Nên đi xem phòng cùng bạn bè hoặc người thân vào ban ngày.",
                  "Cẩn thận với những tin đăng có giá quá rẻ so với mặt bằng chung.",
                  "Chụp ảnh lại hiện trạng phòng khi mới nhận để đối chiếu khi trả phòng."
                ].map((text, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-1.5 shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-gray-600 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
              <Button className="mt-10 bg-[#1565C0] hover:bg-[#0D47A1] rounded-xl px-8 h-12 font-bold shadow-lg shadow-blue-100">
                Tìm hiểu thêm về an toàn
              </Button>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 blur-[80px] opacity-50 rounded-full"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold italic">T</div>
                    <div>
                      <h4 className="font-bold text-gray-900">TroTốt Verification</h4>
                      <p className="text-xs text-gray-400">Đội ngũ kiểm duyệt nội dung</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-3 bg-gray-100 rounded-full w-full"></div>
                    <div className="h-3 bg-gray-100 rounded-full w-5/6"></div>
                    <div className="h-3 bg-gray-100 rounded-full w-4/6"></div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                      <ShieldCheck className="w-5 h-5" /> Tin đăng đã xác minh
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Câu hỏi thường gặp</h2>
              <p className="text-gray-500">Mọi thứ bạn cần biết về cách vận hành của hệ thống.</p>
            </div>

            <div className="bg-white rounded-[2rem] px-8 py-4 shadow-sm border border-gray-100">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  title={faq.title} 
                  isOpen={openFaq === index}
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                >
                  {faq.content}
                </AccordionItem>
              ))}
            </div>
          </section>

          {/* Contact Support CTA */}
          <section className="text-center bg-[#1565C0] rounded-[3rem] py-16 px-8 relative overflow-hidden shadow-2xl shadow-blue-200">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold text-white mb-6">Vẫn chưa tìm thấy câu trả lời?</h2>
              <p className="text-blue-100 mb-10 max-w-xl mx-auto">
                Đội ngũ hỗ trợ khách hàng của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7. Hãy liên hệ ngay nếu bạn gặp bất kỳ khó khăn nào.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  onClick={() => window.open('https://m.me/trotot', '_blank')}
                  className="bg-[#FFA726] hover:bg-[#F57C00] text-white font-bold h-14 px-10 rounded-2xl shadow-lg shadow-orange-900/20"
                >
                  Liên hệ qua Messenger
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = 'mailto:support@trotot.vn'}
                  className="bg-transparent border-white/30 text-white hover:bg-white/10 h-14 px-10 rounded-2xl backdrop-blur-sm"
                >
                  Gửi Email hỗ trợ
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GuidePage;
