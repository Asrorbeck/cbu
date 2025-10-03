import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/ui/Navbar";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import NewsSearch from "./components/NewsSearch";
import NewsFilters from "./components/NewsFilters";
import FeaturedNews from "./components/FeaturedNews";
import NewsGrid from "./components/NewsGrid";
import NewsStats from "./components/NewsStats";

const NewsArticlesHub = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Mock news data
  const mockArticles = [
    {
      id: 1,
      title: "Central Bank Announces New Digital Currency Initiative",
      description:
        "The Central Bank has unveiled plans for a comprehensive digital currency program aimed at modernizing the financial infrastructure and enhancing payment systems across the country.",
      content: `The Central Bank today announced a groundbreaking digital currency initiative that will transform the way citizens interact with financial services. This comprehensive program represents a significant step forward in modernizing our financial infrastructure.\n\nThe digital currency will offer enhanced security features, faster transaction processing, and improved accessibility for all citizens. The initiative is part of our broader strategy to embrace technological innovation while maintaining the stability and security that our customers expect.\n\nImplementation will begin with a pilot program in major cities, gradually expanding nationwide over the next 18 months. Citizens will be able to access digital currency services through secure mobile applications and authorized banking partners.`,
      image:
        "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=600&fit=crop",
      category: "Policy",
      author: "Dr. Sarah Johnson",
      publishedAt: "2025-01-15T10:00:00Z",
      readTime: 5,
      featured: true,
      tags: ["Digital Currency", "Innovation", "Policy"],
    },
    {
      id: 2,
      title: "Interest Rate Adjustments to Support Economic Growth",
      description:
        "Following comprehensive economic analysis, the Central Bank has decided to adjust key interest rates to stimulate economic growth while maintaining price stability.",
      content: `After careful consideration of current economic indicators and market conditions, the Central Bank has announced strategic adjustments to key interest rates. This decision reflects our commitment to supporting sustainable economic growth while maintaining price stability.\n\nThe new rates will take effect immediately and are expected to provide additional liquidity to the banking system, encouraging lending and investment activities. Small and medium enterprises are expected to benefit significantly from these changes.\n\nOur monetary policy committee will continue to monitor economic developments closely and stands ready to take additional measures as needed to support the economy.`,
      image:
        "https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?w=800&h=600&fit=crop",
      category: "Economy",
      author: "Michael Chen",
      publishedAt: "2025-01-14T14:30:00Z",
      readTime: 4,
      featured: true,
      tags: ["Interest Rates", "Economic Policy", "Growth"],
    },
    {
      id: 3,
      title: "New Banking Regulations Enhance Customer Protection",
      description:
        "Enhanced regulatory framework introduces stronger consumer protection measures and improved transparency requirements for all financial institutions.",
      content: `The Central Bank has implemented comprehensive new regulations designed to enhance customer protection and improve transparency across the financial sector. These measures represent our ongoing commitment to safeguarding consumer interests.\n\nKey provisions include enhanced disclosure requirements, stronger data protection measures, and improved dispute resolution mechanisms. Financial institutions will be required to provide clearer information about fees, terms, and conditions.\n\nThe new regulations also establish stricter oversight mechanisms and regular compliance audits to ensure all institutions meet the highest standards of customer service and protection.`,
      image:
        "https://images.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg?w=800&h=600&fit=crop",
      category: "Regulation",
      author: "Lisa Rodriguez",
      publishedAt: "2025-01-13T09:15:00Z",
      readTime: 6,
      featured: true,
      tags: ["Regulation", "Consumer Protection", "Compliance"],
    },
    {
      id: 4,
      title: "Mobile Banking Security Enhancements Launched",
      description:
        "Advanced security features including biometric authentication and AI-powered fraud detection are now available across all mobile banking platforms.",
      content: `The Central Bank has launched comprehensive security enhancements for mobile banking platforms, introducing cutting-edge technologies to protect customer accounts and transactions.\n\nNew features include advanced biometric authentication, real-time fraud detection using artificial intelligence, and enhanced encryption protocols. These improvements significantly strengthen the security of digital banking services.\n\nCustomers can now enjoy peace of mind knowing their financial transactions are protected by the latest security technologies while maintaining the convenience and accessibility they expect from modern banking services.`,
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
      category: "Technology",
      author: "David Kim",
      publishedAt: "2025-01-12T16:45:00Z",
      readTime: 3,
      featured: false,
      tags: ["Mobile Banking", "Security", "Technology"],
    },
    {
      id: 5,
      title: "Financial Literacy Program Reaches 100,000 Citizens",
      description:
        "The Central Bank's comprehensive financial education initiative has successfully reached its milestone of educating 100,000 citizens across the country.",
      content: `The Central Bank's financial literacy program has achieved a significant milestone, successfully educating over 100,000 citizens about personal finance management, investment strategies, and banking services.\n\nThe program includes workshops, online courses, and educational materials designed to improve financial knowledge and decision-making skills. Participants have shown remarkable improvement in their understanding of financial concepts and banking services.\n\nBuilding on this success, the program will expand to reach an additional 200,000 citizens over the next year, with special focus on underserved communities and young adults entering the workforce.`,
      image:
        "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?w=800&h=600&fit=crop",
      category: "Banking",
      author: "Emma Thompson",
      publishedAt: "2025-01-11T11:20:00Z",
      readTime: 4,
      featured: false,
      tags: ["Education", "Financial Literacy", "Community"],
    },
    {
      id: 6,
      title: "Green Finance Initiative Supports Sustainable Development",
      description:
        "New green finance programs offer preferential rates for environmentally sustainable projects and renewable energy investments.",
      content: `The Central Bank has launched an innovative green finance initiative to support sustainable development and environmental protection through targeted financial incentives and programs.\n\nThe initiative offers preferential interest rates for renewable energy projects, sustainable agriculture, and environmentally friendly business practices. This program aligns with national environmental goals and international sustainability commitments.\n\nBusinesses and individuals can access special financing options for solar installations, energy-efficient equipment, and other green technologies. The program is expected to accelerate the transition to a more sustainable economy.`,
      image:
        "https://images.pixabay.com/photo/2017/05/09/13/33/money-2298477_1280.jpg?w=800&h=600&fit=crop",
      category: "Policy",
      author: "James Wilson",
      publishedAt: "2025-01-10T13:00:00Z",
      readTime: 5,
      featured: false,
      tags: ["Green Finance", "Sustainability", "Environment"],
    },
    {
      id: 7,
      title: "Cross-Border Payment System Modernization Complete",
      description:
        "The upgraded international payment system reduces transaction times and costs while improving security for cross-border financial transfers.",
      content: `The Central Bank has successfully completed the modernization of its cross-border payment system, delivering faster, more secure, and cost-effective international financial transfers.\n\nThe new system reduces average transaction processing time from several days to just hours, while significantly lowering fees for international transfers. Enhanced security protocols ensure the highest level of protection for cross-border transactions.\n\nThis modernization strengthens our country's position in the global financial system and provides businesses and individuals with improved access to international markets and opportunities.`,
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      category: "Technology",
      author: "Anna Martinez",
      publishedAt: "2025-01-09T08:30:00Z",
      readTime: 4,
      featured: false,
      tags: ["International", "Payments", "Technology"],
    },
    {
      id: 8,
      title: "Small Business Support Program Expands Nationwide",
      description:
        "Enhanced lending programs and business advisory services are now available to small and medium enterprises across all regions.",
      content: `The Central Bank has expanded its small business support program nationwide, providing enhanced lending opportunities and comprehensive advisory services to small and medium enterprises.\n\nThe program offers competitive interest rates, flexible repayment terms, and expert business guidance to help entrepreneurs grow their businesses. Special provisions support startups and businesses in underserved areas.\n\nSince its launch, the program has supported over 5,000 small businesses, creating thousands of jobs and contributing significantly to economic growth and development across the country.`,
      image:
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=800&h=600&fit=crop",
      category: "Banking",
      author: "Robert Taylor",
      publishedAt: "2025-01-08T15:15:00Z",
      readTime: 3,
      featured: false,
      tags: ["Small Business", "Lending", "Economic Development"],
    },
  ];

  useEffect(() => {
    // Simulate API loading
    setLoading(true);
    setTimeout(() => {
      setArticles(mockArticles);
      setFeaturedArticles(mockArticles?.filter((article) => article?.featured));
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterAndSortArticles();
  }, [articles, searchQuery, selectedCategory, sortBy]);

  const filterAndSortArticles = () => {
    let filtered = [...articles];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered?.filter(
        (article) =>
          article?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          article?.description
            ?.toLowerCase()
            ?.includes(searchQuery?.toLowerCase()) ||
          article?.content
            ?.toLowerCase()
            ?.includes(searchQuery?.toLowerCase()) ||
          article?.tags?.some((tag) =>
            tag?.toLowerCase()?.includes(searchQuery?.toLowerCase())
          )
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered?.filter(
        (article) => article?.category === selectedCategory
      );
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.publishedAt) - new Date(b.publishedAt);
        case "popular":
          return (b?.featured ? 1 : 0) - (a?.featured ? 1 : 0);
        case "newest":
        default:
          return new Date(b.publishedAt) - new Date(a.publishedAt);
      }
    });

    setFilteredArticles(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSortBy("newest");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setCurrentPage((prev) => prev + 1);
      setLoading(false);
    }, 1000);
  };

  const handleBackToDashboard = () => {
    navigate("/home-dashboard");
  };

  const articlesPerPage = 6;
  const displayedArticles = filteredArticles?.slice(
    0,
    currentPage * articlesPerPage
  );
  const hasMoreArticles = filteredArticles?.length > displayedArticles?.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={handleBackToDashboard}
                  iconName="ArrowLeft"
                  iconPosition="left"
                  iconSize={16}
                >
                  Back to Dashboard
                </Button>
                <div className="h-8 w-px bg-border" />
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon name="Newspaper" size={24} className="text-accent" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">
                      News Articles Hub
                    </h1>
                    <p className="text-muted-foreground">
                      Stay informed with the latest banking news and updates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <NewsSearch
            onSearch={handleSearch}
            searchQuery={searchQuery}
            onClearSearch={handleClearSearch}
          />

          {/* Filters Section */}
          <NewsFilters
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            onClearFilters={handleClearFilters}
          />

          {/* Stats Section */}
          <NewsStats
            totalArticles={articles?.length}
            filteredCount={filteredArticles?.length}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
          />

          {/* Featured News Section */}
          {!searchQuery && selectedCategory === "all" && (
            <FeaturedNews featuredArticles={featuredArticles} />
          )}

          {/* News Grid Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {searchQuery || selectedCategory !== "all"
                  ? "Search Results"
                  : "Latest Articles"}
              </h2>
              <div className="text-sm text-muted-foreground">
                Showing {displayedArticles?.length} of{" "}
                {filteredArticles?.length} articles
              </div>
            </div>

            <NewsGrid
              articles={displayedArticles}
              loading={loading}
              hasMore={hasMoreArticles}
              onLoadMore={handleLoadMore}
            />
          </div>
        </div>
      </main>
      {/* Bottom navigation spacing - mobile only */}
      <div className="h-20 md:h-0"></div>
    </div>
  );
};

export default NewsArticlesHub;
