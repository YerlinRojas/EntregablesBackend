import { User, Chat, Cart, Product } from '../dao/factory.js'
import UserRepository from './user.repository.js'
import ProductRepository from './product.repository.js'
import CartRepository from './cart.repository.js'
import ChatRepository from './chat.repository.js'

export const userService = new UserRepository(new User())
export const productService = new ProductRepository(new Product())
export const chatService = new ChatRepository(new Chat())
export const cartService = new CartRepository(new Cart())