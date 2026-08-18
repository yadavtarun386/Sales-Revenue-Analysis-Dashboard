import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

const initialFilters = {
  date_start: '',
  date_end: '',
  product: 'All',
  category: 'All',
  region: 'All',
  customer: 'All',
  sales_channel: 'All',
  payment_method: 'All',
  time_grain: 'Monthly'
};

export function useSalesData() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filters, setFilters] = useState(initialFilters);
  const [filterOptions, setFilterOptions] = useState({
    categories: ['All'],
    products: ['All'],
    regions: ['All'],
    customers: ['All'],
    sales_channels: ['All'],
    payment_methods: ['All'],
    min_date: '',
    max_date: ''
  });

  const [kpiData, setKpiData] = useState(null);
  const [trendsData, setTrendsData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState({ top_revenue: [], top_quantity: [], top_profit: [], bottom_performers: [] });
  const [regionData, setRegionData] = useState([]);
  const [channelData, setChannelData] = useState({ channels: [], payments: [] });
  const [customerData, setCustomerData] = useState([]);
  const [edaData, setEdaData] = useState({ statistics: [], histograms: {} });
  const [insightsData, setInsightsData] = useState([]);
  const [qualityReport, setQualityReport] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch filter options once or when dataset changes
  const fetchOptions = useCallback(async () => {
    try {
      const opts = await apiService.getFilters();
      setFilterOptions(opts);
    } catch (err) {
      console.error("Failed to load filter options", err);
    }
  }, []);

  // Fetch all analytics for current filter selection
  const fetchAllAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        kpis, trends, categories, products, regions, channels, customers, eda, insights, quality
      ] = await Promise.all([
        apiService.getKPIs(filters),
        apiService.getTrends(filters),
        apiService.getCategories(filters),
        apiService.getProducts(filters),
        apiService.getRegions(filters),
        apiService.getChannels(filters),
        apiService.getCustomers(filters),
        apiService.getEDA(filters),
        apiService.getInsights(filters),
        apiService.getQuality()
      ]);

      setKpiData(kpis);
      setTrendsData(trends);
      setCategoryData(categories);
      setProductData(products);
      setRegionData(regions);
      setChannelData(channels);
      setCustomerData(customers);
      setEdaData(eda);
      setInsightsData(insights);
      setQualityReport(quality);
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    fetchAllAnalytics();
  }, [fetchAllAnalytics]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const reloadSampleData = async () => {
    setLoading(true);
    try {
      await apiService.reloadSample();
      await fetchOptions();
      await fetchAllAnalytics();
    } catch (err) {
      setError(err.message || 'Failed to reload sample dataset');
    } finally {
      setLoading(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    filters,
    updateFilter,
    resetFilters,
    filterOptions,
    kpiData,
    trendsData,
    categoryData,
    productData,
    regionData,
    channelData,
    customerData,
    edaData,
    insightsData,
    qualityReport,
    loading,
    error,
    refreshData: fetchAllAnalytics,
    reloadSampleData,
    fetchOptions
  };
}
