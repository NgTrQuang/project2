const Cart = require('../models/Carts');
const Product = require('../models/products');


// Lấy giỏ hàng của người dùng
const getCart = async (req, res) => {
  const { userId } = req.params; // userId được truyền qua params

  try {
    const cart = await Cart.findOne({ user: userId }).populate('products.product');
    if (!cart) {
      return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
    }

    const activeProducts = cart.products.filter(item => item.product.isDeleted === false);

    const updatedCart = {
      ...cart._doc,  // Lấy tất cả thông tin của giỏ hàng hiện tại
      products: activeProducts // Thay thế danh sách sản phẩm bằng danh sách đã lọc
    };
    
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng', error });
  }
};

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
  const { userId, productId, quantity, color, size } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Số lượng sản phẩm không hợp lệ' });
  }

  try {
    let cart = await Cart.findOne({ user: userId });

    // Nếu không có cart, tạo mới
    if (!cart) {
      cart = new Cart({ user: userId, products: [] });
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    const existingProduct = cart.products.find(item => 
      item.product.toString() === productId && 
      item.color === color && 
      item.size === size
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;  // Tăng số lượng nếu sản phẩm đã có trong giỏ
    } else {
      cart.products.push({ product: productId, quantity: quantity, color, size }); // Thêm sản phẩm mới vào giỏ
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thêm vào giỏ hàng', error });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = async (req, res) => {
  const { userId, cartId } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
    }

    cart.products = cart.products.filter(item => item._id.toString() !== cartId);
    
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng', error });
  }
};

const updateCartItem  = async (req, res) => {
  const {userId, cartItemId, color, size, quantity } = req.body;
    console.log(userId);
    console.log(cartItemId);
    console.log(color);
    console.log(size);
    console.log(quantity);
    try {
      // Lấy thông tin sản phẩm từ cart
      const cartItem = await Cart.findOne({
        'products._id': cartItemId,
        user: userId
        }, { 'products.$': 1 }
      );

      console.log('cartItem tìm được ', cartItem);

      if (!cartItem) {
          return res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
      }

      // Kiểm tra nếu sản phẩm tồn kho đủ số lượng
      const product = await Product.findById(cartItem.products[0].product);
      
      console.log('product tìm được', product);

      if (!product) {
          return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }

      // Kiểm tra nếu sản phẩm có đủ số lượng tồn kho
      // const selectedProduct = product.variants.find(
      //   variant => variant.color === cartItem.products[0].color && variant.size === cartItem.products[0].size
      // );
      const selectedProduct = product.variants.find(
        variant => variant.color === color && variant.size === size
      );

      console.log('selectedProduct tìm được ', selectedProduct);

      // Kiểm tra số lượng tồn kho
      if (!selectedProduct || selectedProduct.stock < quantity) { //cartItem.products[0].quantity
        return res.status(400).json({ message: 'Số lượng sản phẩm không đủ trong kho' });
      }

      // Kiểm tra xem sản phẩm với cùng color và size đã tồn tại trong giỏ hàng chưa
      const existingCartItem = await Cart.findOne({
        user: userId,
        products: {
          $elemMatch: {
            product: product._id, //cartItem.products[0].product
            color: color,
            size: size,
            _id: { $ne: cartItemId } // Loại trừ sản phẩm đang được cập nhật
          }
        }
      });

      console.log('sản phẩm tồn tại', existingCartItem);

      if (existingCartItem) {
        // Nếu sản phẩm với cùng color và size đã tồn tại, gộp số lượng lại
        const existingProduct = existingCartItem.products.find(
          item => item.product.equals(product._id) &&  //cartItem.products[0].product
                  item.color === color && 
                  item.size === size
        );
        
        const newQuantity = existingProduct.quantity + quantity;

        // Kiểm tra nếu số lượng mới không vượt quá số lượng tồn kho
        if (selectedProduct.stock < newQuantity) {
          return res.status(400).json({ message: 'Số lượng sản phẩm không đủ trong kho để gộp' });
        }

        // Cập nhật sản phẩm hiện có với số lượng mới
        const response = await Cart.updateOne(
          { user: userId, 'products._id': existingProduct._id },
          {
            $set: {
              'products.$.quantity': newQuantity
            }
          }
        );
        // Xóa sản phẩm cũ (đang được cập nhật)
        await Cart.updateOne(
          { user: userId },
          { $pull: { products: { _id: cartItemId } } }
        );
        console.log('CartItem đã cập nhật cộng gộp ', response);
        // Lấy lại danh sách giỏ hàng đã cập nhật
        const updatedCartItems = await Cart.findOne({ user: userId }).populate('products.product');

        res.status(200).json({ message: 'Sản phẩm đã được gộp và cập nhật thành công', cartItems: updatedCartItems })
      } else {
        // Nếu sản phẩm chưa tồn tại, chỉ cần cập nhật thông thường
        const updatedCartItem = await Cart.updateOne(
          { user: userId, 'products._id': cartItemId },
          {
            $set: {
              'products.$.color': color,
              'products.$.size': size,
              'products.$.quantity': quantity
            }
          }
        );

        if (updatedCartItem.matchedCount === 0) {
          return res.status(400).json({ message: "Không thể cập nhật sản phẩm trong giỏ hàng" });
        }

        console.log('CartItem đã cập nhật không gộp', cartItem);

        // Lấy lại danh sách giỏ hàng đã cập nhật
        const updatedCartItems = await Cart.findOne({ user: userId }).populate('products.product');

        res.status(200).json({ message: 'Giỏ hàng đã được cập nhật', cartItems: updatedCartItems });
      }        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật giỏ hàng' });
    }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
};
