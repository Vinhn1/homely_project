import { useState, useEffect } from "react";
import { usePropertyStore } from "@/store/usePropertyStore";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
    Upload, 
    X, 
    MapPin, 
    Home, 
    PlusCircle,
    DollarSign, 
    Maximize, 
    Info, 
    CheckCircle2,
    Loader2
} from "lucide-react";

export default function ListPropertyPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const { 
        categories, 
        amenities, 
        districts, 
        fetchMetadata, 
        createProperty, 
        updateProperty,
        fetchPropertyById,
        currentProperty,
        loading 
    } = usePropertyStore();
    
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        area: "",
        category: "",
        district: "",
        address: "",
        amenities: [],
    });

    const [existingImages, setExistingImages] = useState([]); // Ảnh từ DB
    const [newImages, setNewImages] = useState([]); // File objects mới
    const [newImagePreviews, setNewImagePreviews] = useState([]); // Preview của ảnh mới

    useEffect(() => {
        fetchMetadata();
        if (isEditMode) {
            fetchPropertyById(id);
        }
    }, [fetchMetadata, fetchPropertyById, id, isEditMode]);

    useEffect(() => {
        if (isEditMode && currentProperty) {
            setFormData({
                title: currentProperty.title || "",
                description: currentProperty.description || "",
                price: currentProperty.price || "",
                area: currentProperty.area || "",
                category: currentProperty.category?._id || currentProperty.category || "",
                district: currentProperty.district?._id || currentProperty.district || "",
                address: currentProperty.address || "",
                amenities: currentProperty.amenities?.map(a => a._id || a) || [],
            });
            
            if (currentProperty.images) {
                setExistingImages(currentProperty.images);
            }
        }
    }, [currentProperty, isEditMode]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAmenityToggle = (amenityId) => {
        setFormData(prev => {
            const current = prev.amenities;
            if (current.includes(amenityId)) {
                return { ...prev, amenities: current.filter(id => id !== amenityId) };
            }
            return { ...prev, amenities: [...current, amenityId] };
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + existingImages.length + newImages.length > 10) {
            alert("Bạn chỉ có thể tải lên tối đa 10 hình ảnh");
            return;
        }

        setNewImages(prev => [...prev, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setNewImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeExistingImage = (url) => {
        setExistingImages(prev => prev.filter(item => item !== url));
    };

    const removeNewImage = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
        // Revoke URL để giải phóng bộ nhớ
        URL.revokeObjectURL(newImagePreviews[index]);
        setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        
        // Append basic fields
        Object.keys(formData).forEach(key => {
            if (key === 'amenities') {
                formData.amenities.forEach(id => data.append('amenities', id));
            } else {
                data.append(key, formData[key]);
            }
        });

        // Append images logic
        newImages.forEach(image => data.append('images', image));
        
        // Gửi danh sách ảnh cũ còn giữ lại dưới dạng JSON string
        data.append('existingImages', JSON.stringify(existingImages));

        try {
            if (isEditMode) {
                await updateProperty(id, data);
            } else {
                await createProperty(data);
            }
            navigate("/profile");
        } catch (error) {
            console.error("Submit error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            
            <main className="flex-1 py-10 px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-[#1565C0] p-8 text-white">
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <PlusCircle className="w-8 h-8 text-[#FFA726]" />
                            {isEditMode ? "Cập nhật tin đăng" : "Đăng tin cho thuê mới"}
                        </h1>
                        <p className="text-blue-100 mt-2">
                            {isEditMode ? "Chỉnh sửa các thông tin cần thiết để tin đăng của bạn luôn mới nhất." : "Cung cấp thông tin chính xác giúp tin đăng của bạn thu hút nhiều khách hàng hơn."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-10">
                        {/* 1. Thông tin cơ bản */}
                        <section className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 pb-2 border-b">
                                <Info className="w-5 h-5 text-[#1565C0]" />
                                Thông tin cơ bản
                            </h2>
                            
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title" className="font-semibold">Tiêu đề tin đăng <span className="text-red-500">*</span></Label>
                                    <Input 
                                        id="title"
                                        name="title"
                                        placeholder="Ví dụ: Cho thuê phòng trọ cao cấp gần ĐH Sư Phạm Kỹ Thuật"
                                        required
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="h-12 border-gray-200 focus:ring-[#1565C0]"
                                    />
                                    <p className="text-xs text-gray-500">Tiêu đề nên chứa ít nhất 30 ký tự để đạt hiệu quả SEO tốt nhất.</p>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description" className="font-semibold">Nội dung mô tả <span className="text-red-500">*</span></Label>
                                    <Textarea 
                                        id="description"
                                        name="description"
                                        placeholder="Mô tả chi tiết về phòng trọ, căn hộ của bạn (giá cả, điện nước, an ninh, tiện ích...)"
                                        required
                                        rows={6}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="border-gray-200 focus:ring-[#1565C0]"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 2. Loại hình và Vị trí */}
                        <section className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 pb-2 border-b">
                                <MapPin className="w-5 h-5 text-[#1565C0]" />
                                Đặc điểm và Vị trí
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label className="font-semibold">Loại bất động sản <span className="text-red-500">*</span></Label>
                                    <select 
                                        name="category"
                                        required
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="h-12 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                                    >
                                        <option value="">Chọn loại hình</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid gap-2">
                                    <Label className="font-semibold">Khu vực <span className="text-red-500">*</span></Label>
                                    <select 
                                        name="district"
                                        required
                                        value={formData.district}
                                        onChange={handleInputChange}
                                        className="h-12 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                                    >
                                        <option value="">Chọn Quận/Huyện (Vĩnh Long)</option>
                                        {districts.map(dist => (
                                            <option key={dist._id} value={dist._id}>{dist.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid gap-2 md:col-span-2">
                                    <Label htmlFor="address" className="font-semibold">Địa chỉ chi tiết <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input 
                                            id="address"
                                            name="address"
                                            placeholder="Số nhà, tên đường, phường/xã..."
                                            required
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="h-12 pl-10 border-gray-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. Giá và Diện tích */}
                        <section className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 pb-2 border-b">
                                <DollarSign className="w-5 h-5 text-[#1565C0]" />
                                Giá và Diện tích
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="price" className="font-semibold">Giá cho thuê (VND/tháng) <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input 
                                            id="price"
                                            name="price"
                                            type="number"
                                            placeholder="Ví dụ: 3000000"
                                            required
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className="h-12 pl-10 border-gray-200"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="area" className="font-semibold">Diện tích (m²) <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input 
                                            id="area"
                                            name="area"
                                            type="number"
                                            placeholder="Ví dụ: 25"
                                            required
                                            value={formData.area}
                                            onChange={handleInputChange}
                                            className="h-12 pl-10 border-gray-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 4. Tiện ích */}
                        <section className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 pb-2 border-b">
                                <CheckCircle2 className="w-5 h-5 text-[#1565C0]" />
                                Tiện ích đi kèm
                            </h2>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {amenities.map(amenity => (
                                    <div 
                                        key={amenity._id}
                                        onClick={() => handleAmenityToggle(amenity._id)}
                                        className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                                            formData.amenities.includes(amenity._id)
                                            ? "border-[#1565C0] bg-blue-50 text-[#1565C0] font-medium shadow-sm"
                                            : "border-gray-200 hover:border-[#1565C0]/50 text-gray-600"
                                        }`}
                                    >
                                        <div className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                                            formData.amenities.includes(amenity._id)
                                            ? "bg-[#1565C0] border-[#1565C0]"
                                            : "border-gray-300"
                                        }`}>
                                            {formData.amenities.includes(amenity._id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className="text-sm truncate">{amenity.name}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 5. Hình ảnh */}
                        <section className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 pb-2 border-b">
                                <Upload className="w-5 h-5 text-[#1565C0]" />
                                Hình ảnh thực tế <span className="text-red-500">*</span>
                            </h2>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                {/* Ảnh cũ từ Database */}
                                {existingImages.map((url, index) => (
                                    <div key={`existing-${index}`} className="relative aspect-square rounded-xl overflow-hidden group border shadow-sm ring-2 ring-blue-100">
                                        <img src={url} alt="Existing" className="w-full h-full object-cover" />
                                        <div className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold shadow-sm">ĐÃ ĐĂNG</div>
                                        <button 
                                            type="button"
                                            onClick={() => removeExistingImage(url)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                {/* Ảnh mới chọn */}
                                {newImagePreviews.map((url, index) => (
                                    <div key={`new-${index}`} className="relative aspect-square rounded-xl overflow-hidden group border shadow-sm ring-2 ring-orange-100">
                                        <img src={url} alt="New Preview" className="w-full h-full object-cover" />
                                        <div className="absolute top-1 left-1 bg-[#FFA726] text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold shadow-sm">MỚI</div>
                                        <button 
                                            type="button"
                                            onClick={() => removeNewImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                
                                {(existingImages.length + newImages.length) < 10 && (
                                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 hover:border-[#1565C0] cursor-pointer transition-all">
                                        <Upload className="w-8 h-8 text-gray-400" />
                                        <span className="text-xs text-gray-500 font-medium text-center px-2">Tải ảnh lên<br/>(Tối đa {10 - existingImages.length - newImages.length})</span>
                                        <input 
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 italic">Lưu ý: Hình ảnh rõ ràng, sắc nét sẽ giúp tin đăng được duyệt nhanh hơn và thu hút nhiều lượt xem hơn.</p>
                        </section>

                        {/* Submit Button */}
                        <div className="pt-8 border-t flex justify-end gap-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => navigate("/")}
                                className="h-12 px-8 rounded-xl"
                            >
                                Hủy bỏ
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="h-12 px-10 bg-[#FFA726] hover:bg-[#F57C00] text-white font-bold rounded-xl shadow-lg shadow-orange-900/10"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    isEditMode ? "Lưu thay đổi" : "Đăng tin ngay"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
