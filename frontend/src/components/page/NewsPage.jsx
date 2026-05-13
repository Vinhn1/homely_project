import { useState, useEffect } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { fetchNews } from '@/api/news.api';
import { BookOpen, Calendar, ChevronRight, Search, Clock, ArrowUpRight, Newspaper, TrendingUp, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [visibleCount, setVisibleCount] = useState(7); // Show 1 featured + 6 grid items initially

  useEffect(() => {
    const getNews = async () => {
      setLoading(true);
      const data = await fetchNews();
      if (data && data.items) {
        setNews(data.items);
      }
      setLoading(false);
    };
    getNews();
  }, []);

  const categories = ['Tất cả', 'Thị trường', 'Quy hoạch', 'Tư vấn', 'Xu hướng'];

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === 'Tất cả') return matchesSearch;
    
    // Simple keyword mapping for categories since RSS feed is generic
    const categoryKeywords = {
      'Thị trường': ['thị trường', 'giá', 'bất động sản', 'nhà đất', 'mua bán'],
      'Quy hoạch': ['quy hoạch', 'dự án', 'hạ tầng', 'xây dựng', 'đô thị'],
      'Tư vấn': ['tư vấn', 'kinh nghiệm', 'mẹo', 'hướng dẫn', 'lưu ý', 'cẩm nang'],
      'Xu hướng': ['xu hướng', 'tương lai', 'mới nhất', 'hot', 'coliving']
    };

    const keywords = categoryKeywords[selectedCategory] || [];
    const matchesCategory = keywords.some(kw => 
      item.title.toLowerCase().includes(kw) || 
      item.description.toLowerCase().includes(kw)
    );

    return matchesSearch && matchesCategory;
  });

  const featuredArticle = filteredNews[0];
  const otherArticles = filteredNews.slice(1, visibleCount);
  const hasMore = filteredNews.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      toast.success('Đăng ký nhận tin thành công! Cảm ơn bạn đã quan tâm.');
      e.target.reset();
    } else {
      toast.error('Vui lòng nhập địa chỉ email.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-[#1565C0] text-white py-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FFA726] rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[#FFA726] text-xs font-bold mb-4 border border-white/10 uppercase tracking-widest">
                  <Newspaper className="w-3 h-3" />
                  Tin tức & Xu hướng
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                  Cập nhật thông tin <br />
                  <span className="text-[#FFA726]">Bất động sản</span> mới nhất
                </h1>
                <p className="text-blue-100 text-lg mb-8 leading-relaxed max-w-xl">
                  Tổng hợp các tin tức nóng hổi, phân tích thị trường và cẩm nang thuê phòng từ những nguồn uy tín nhất Việt Nam.
                </p>
                
                {/* Search Bar */}
                <div className="relative max-w-md group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 group-focus-within:text-[#FFA726] transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm tin tức..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white text-gray-900 h-12 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA726] shadow-xl"
                  />
                </div>
              </div>
              
              <div className="hidden lg:block w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="text-[#FFA726] w-6 h-6" />
                    <h3 className="font-bold text-xl">Thị trường nổi bật</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      "Giá thuê căn hộ tại Hà Nội tăng 15%",
                      "Quy hoạch vành đai 4 ảnh hưởng gì?",
                      "Xu hướng 'Coliving' lên ngôi 2026",
                      "Luật Đất đai mới có lợi gì cho người thuê?"
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 group cursor-pointer">
                        <div className="w-2 h-2 bg-[#FFA726] rounded-full mt-2 group-hover:scale-150 transition-transform"></div>
                        <p className="text-sm text-blue-100 group-hover:text-white transition-colors">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
          
          {/* Category Filter */}
          <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
            <div className="flex items-center gap-2 mr-4 shrink-0">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Danh mục:</span>
            </div>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap shadow-sm ${
                  selectedCategory === cat 
                  ? 'bg-[#1565C0] text-white shadow-[#1565C0]/30' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-md animate-pulse border border-gray-100">
                  <div className="h-56 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-6 bg-gray-200 rounded w-full"></div>
                    <div className="h-6 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mt-6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredNews.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-600 mb-2">Không tìm thấy tin tức</h3>
                  <p className="text-gray-400">Thử tìm kiếm với từ khóa khác hoặc quay lại sau.</p>
                  <Button 
                    onClick={() => setSearchTerm('')} 
                    variant="outline" 
                    className="mt-6 border-blue-200 text-[#1565C0] hover:bg-blue-50"
                  >
                    Xóa tìm kiếm
                  </Button>
                </div>
              ) : (
                <div className="space-y-12">
                  {/* Featured Article */}
                  {featuredArticle && !searchTerm && (
                    <div className="group relative bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 transition-all hover:shadow-blue-200/50 flex flex-col lg:flex-row">
                      <div className="lg:w-3/5 h-[300px] lg:h-[500px] overflow-hidden relative">
                        <img 
                          src={featuredArticle.thumbnail || featuredArticle.enclosure?.link} 
                          alt={featuredArticle.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-6 left-6">
                          <span className="bg-[#FFA726] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-orange-500/30">
                            Nổi bật
                          </span>
                        </div>
                      </div>
                      <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-4 text-gray-400 text-sm mb-6">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {new Date(featuredArticle.pubDate).toLocaleDateString('vi-VN')}
                          </span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            5 phút đọc
                          </span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6 leading-tight group-hover:text-[#1565C0] transition-colors">
                          <a href={featuredArticle.link} target="_blank" rel="noopener noreferrer">
                            {featuredArticle.title}
                          </a>
                        </h2>
                        <div 
                          className="text-gray-500 text-lg mb-8 line-clamp-3 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: featuredArticle.description.split('</a>')[1] || featuredArticle.description }}
                        />
                        <div className="mt-auto">
                          <a 
                            href={featuredArticle.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[#1565C0] font-bold text-lg group/btn"
                          >
                            Đọc chi tiết
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center group-hover/btn:bg-[#1565C0] group-hover/btn:text-white transition-all">
                              <ChevronRight className="w-5 h-5" />
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* News Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherArticles.map((item, index) => (
                      <div 
                        key={index} 
                        className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col h-full hover:-translate-y-2"
                      >
                        <div className="relative h-56 overflow-hidden">
                          <img 
                            src={item.thumbnail || item.enclosure?.link || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000'} 
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="absolute top-4 left-4">
                            <span className="bg-white/90 backdrop-blur-md text-[#1565C0] px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm">
                              Thị trường
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex items-center gap-3 text-gray-400 text-[11px] mb-4 font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(item.pubDate).toLocaleDateString('vi-VN')}
                            </span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              3 phút đọc
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug group-hover:text-[#1565C0] transition-colors line-clamp-2">
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                              {item.title}
                            </a>
                          </h3>
                          
                          <div 
                            className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: item.description.includes('</a>') ? item.description.split('</a>')[1] : item.description }}
                          />
                          
                          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                            <a 
                              href={item.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs font-bold text-gray-900 hover:text-[#1565C0] flex items-center gap-1 transition-colors group/link"
                            >
                              Đọc tiếp
                              <ArrowUpRight className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                            </a>
                            <button className="text-gray-300 hover:text-[#FFA726] transition-colors">
                              <BookOpen className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination or Load More */}
                  {hasMore && (
                    <div className="flex justify-center mt-16">
                      <Button 
                        onClick={handleLoadMore}
                        className="bg-[#1565C0] hover:bg-[#0D47A1] text-white font-bold px-10 py-6 rounded-2xl shadow-xl shadow-blue-200 transform hover:scale-105 transition-all"
                      >
                        Xem thêm tin tức
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Newsletter Section */}
        <div className="bg-white border-y border-gray-100 py-20 mt-20">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
            <div className="bg-gradient-to-r from-[#1565C0] to-[#1E88E5] rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl shadow-blue-200">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFA726]/10 rounded-full -ml-20 -mb-20 blur-3xl"></div>
              
              <div className="max-w-3xl relative z-10">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                  Đừng bỏ lỡ bất kỳ cơ hội nào!
                </h2>
                <p className="text-blue-100 text-lg mb-10">
                  Đăng ký nhận bản tin để cập nhật những căn phòng giá tốt và tin tức thị trường sớm nhất mỗi tuần.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl">
                  <input 
                    name="email"
                    type="email" 
                    placeholder="Địa chỉ email của bạn..."
                    className="flex-grow bg-white/10 border border-white/20 text-white placeholder:text-blue-200 h-14 px-6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FFA726] backdrop-blur-sm"
                  />
                  <Button type="submit" className="bg-[#FFA726] hover:bg-[#F57C00] text-white font-bold h-14 px-8 rounded-2xl shadow-lg shadow-orange-900/20 whitespace-nowrap">
                    Đăng ký ngay
                  </Button>
                </form>
                <p className="text-blue-200 text-xs mt-6 opacity-70">
                  Bằng cách đăng ký, bạn đồng ý với các Điều khoản & Chính sách của TroTốt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NewsPage;
