const Favorite = require('../models/favorite/favorite');

// Thêm sản phẩm vào mục yêu thích
const addFavorite = async (req, res) => {
    const { userId, productId } = req.body;
    try {
    let favorite = await Favorite.findOne({ userId });
    
    if (!favorite) {
      // Nếu người dùng chưa có danh sách yêu thích, tạo mới
      favorite = new Favorite({ userId, productIds: [productId] });
    } else {
      // Nếu người dùng đã có danh sách yêu thích, thêm sản phẩm vào
      if (!favorite.productIds.includes(productId)) {
        favorite.productIds.push(productId);
      }
    }

    await favorite.save();
    res.status(200).json({ message: 'Sản phẩm đã được thêm vào yêu thích' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm vào yêu thích', error });
    }
};

// Lấy danh sách sản phẩm yêu thích
const getFavoriteByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const favorite = await Favorite.findOne({ userId }).populate('productIds');
        if (!favorite) {
            return res.status(404).json({ message: 'Không tìm thấy danh sách yêu thích' });
        }

        const activeProducts = favorite.productIds.filter(product => product.isDeleted === false);
        res.status(200).json(activeProducts);
    } catch (error) {
        console.error(error);  // In ra log chi tiết lỗi
        res.status(500).json({ message: 'Lỗi khi lấy danh sách yêu thích', error });
    }
};
  
// Xóa sản phẩm khỏi danh sách yêu thích
const removeFromFavorites = async (req, res) => {
    const { userId, productId } = req.body;
    try {
      let favorite = await Favorite.findOne({ userId });
      if (favorite) {
        favorite.productIds = favorite.productIds.filter(id => id.toString() !== productId);
        await favorite.save();
        return res.status(200).json({ message: 'Đã xóa khỏi yêu thích', favorite });
      }
      res.status(404).json({ message: 'Không tìm thấy sản phẩm trong danh sách yêu thích' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa khỏi yêu thích', error });
    }
};

module.exports = { addFavorite, getFavoriteByUserId, removeFromFavorites };
