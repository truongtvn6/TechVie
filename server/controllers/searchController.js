/**
 * Lấy danh sách tìm kiếm phổ biến
 */
const getPopularSearches = (req, res) => {
  res.json({
    success: true,
    popular: ["TechVie Ultra v1", "ZenBoard v2", "Sound Buds Pro", "Laptop Book Pro X"]
  });
};

/**
 * Lấy lịch sử tìm kiếm
 */
const getSearchHistory = (req, res) => {
  res.json({
    success: true,
    history: ["TechVie Book Pro X", "Tai nghe sound buds"]
  });
};

module.exports = {
  getPopularSearches,
  getSearchHistory,
};
