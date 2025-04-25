import { useState, useEffect, useContext } from 'react';
import { Typography, Input, Select, Empty, Spin, Button, message } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import LiquorCard from '../components/LiquorCard';
import { useAdmin } from "../context/AdminContext"

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [filteredLiquors, setFilteredLiquors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('default');
    const [messageApi, contextHolder] = message.useMessage();

    // Use AdminContext to get products and categories
    const { products, categories, getProducts, getCategories } = useAdmin()

    // Fetch products and categories when component mounts
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    getProducts,
                    getCategories
                ]);
                setLoading(false);
            } catch (error) {
                messageApi.error('Error loading data:', error);
                setLoading(false);
            }
        };

        loadData();
    }, [getProducts, getCategories]);

    // Apply filters and sorting to products
    useEffect(() => {
        if (!products) {
            setFilteredLiquors([]);
            return;
        }

        let result = [...products];

        // Search filter
        if (searchTerm) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort order
        if (sortOrder === 'price-asc') {
            result = [...result].sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'price-desc') {
            result = [...result].sort((a, b) => b.price - a.price);
        } else if (sortOrder === 'name-asc') {
            result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        }

        setFilteredLiquors(result);
    }, [searchTerm, sortOrder, products]);

    const handleSearch = value => {
        setSearchTerm(value);
    };

    const handleSortChange = value => {
        setSortOrder(value);
    };

    // Category videos mapping - keep videos but use real category names
    const categoryVideos = {
        0: 'https://v1.pinimg.com/videos/mc/expMp4/3b/7a/e9/3b7ae90a855580dac73fb0cfa7380d1e_t1.mp4',
        1: 'https://v1.pinimg.com/videos/mc/expMp4/5e/b1/c6/5eb1c643ae875ce6b47f56f8bc2c00f9_t1.mp4',
        2: 'https://v1.pinimg.com/videos/mc/expMp4/d2/62/3f/d2623f15806c91baa32bdc87a6833fbc_t1.mp4',
        3: 'https://v1.pinimg.com/videos/mc/expMp4/fd/69/ce/fd69ce70dadfc312ced4f969d779deb6_t1.mp4',
    };

    // Get video for category by index or default to first video
    const getCategoryVideo = (index) => {
        return categoryVideos[index] || categoryVideos[0];
    };

    return (
        <div className="min-h-screen pt-16">
            {contextHolder}
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#722F37] to-[#2C1315] text-white py-20 px-4">
                <div className="container mx-auto">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Premium Liquor Delivered to Your Door</h1>
                        <p className="text-lg mb-8">
                            Discover our extensive collection of premium spirits, wines, and beers from around the world.
                        </p>
                        <Search
                            placeholder="Search for your favorite drink..."
                            enterButton={<SearchOutlined />}
                            size="large"
                            onSearch={handleSearch}
                            className="max-w-md"
                        />
                    </div>
                </div>
            </div>

            {/* Featured Categories */}
            <div className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <Title level={2} className="text-center mb-8">Featured Categories</Title>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {!loading && categories && categories.length > 0 ? (

                            categories.slice(0, 4).map((category, index) => (
                                <div
                                    key={category.id || index}
                                    className="bg-white rounded-lg shadow-md overflow-hidden transition transform hover:scale-105"
                                >
                                    {console.log("category data", category)}
                                    <div className="h-40 bg-gray-200 flex items-center justify-center">
                                        <video
                                            src={getCategoryVideo(index)}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4 text-center">
                                        <h3 className="font-medium text-lg">{category}</h3>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-4 flex justify-center py-10">
                                <Spin size="large" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <Title level={2}>Our Collection</Title>

                    <div className="flex flex-col sm:flex-row w-full md:w-auto space-y-4 sm:space-y-0 sm:space-x-4 mt-4 md:mt-0">
                        <Search
                            placeholder="Search products..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            onSearch={handleSearch}
                            style={{ width: '100%', maxWidth: '300px' }}
                        />

                        <Select
                            defaultValue="default"
                            style={{ width: '100%', maxWidth: '180px' }}
                            onChange={handleSortChange}
                            prefix={<FilterOutlined />}
                        >
                            <Option value="default">Default Sorting</Option>
                            <Option value="price-asc">Price: Low to High</Option>
                            <Option value="price-desc">Price: High to Low</Option>
                            <Option value="name-asc">Name: A to Z</Option>
                        </Select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Spin size="large" />
                    </div>
                ) : !filteredLiquors || filteredLiquors.length === 0 ? (
                    <Empty
                        description="No products found"
                        className="my-12"
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredLiquors.map(liquor => (
                            <LiquorCard key={liquor.id} liquor={liquor} />
                        ))}
                    </div>
                )}
            </div>

            {/* Special Offers */}
            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <Title level={2} className="text-center mb-8">Special Offers</Title>

                    <div className="bg-[#722F37] text-white rounded-lg overflow-hidden shadow-lg">
                        <div className="grid md:grid-cols-2">
                            <div className="p-8 flex flex-col justify-center">
                                <h3 className="text-2xl font-bold mb-4">Weekend Special</h3>
                                <p className="text-lg mb-6">
                                    Get 15% off on all premium whisky brands this weekend! Use code WHISKY15 at checkout.
                                </p>
                                <Button size="large" className="max-w-xs bg-white text-[#722F37] border-none hover:bg-gray-100">
                                    Shop Now
                                </Button>
                            </div>
                            <div className="hidden md:block h-64 rounded-2xl overflow-hidden shadow-xl">
                                <img
                                    src="https://i.pinimg.com/736x/6f/a4/4c/6fa44cc272e2de5187c1e2421a275b77.jpg"
                                    alt="Weekend Special"
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;