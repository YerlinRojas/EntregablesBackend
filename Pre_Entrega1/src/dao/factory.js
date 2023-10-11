import config from "../config/config.js";
import mongoose from "mongoose";
import {logger} from '../logger.js'

export let User
export let Cart
export let Product
export let Chat
export let Ticket
export let Recovery

logger.debug(`Persistence with  ${config.PERSISTENCE}`);

switch (config.PERSISTENCE) {
    case "MONGO":
        mongoose
            .connect(config.URL,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    dbName: config.dbName
                })

                const { default: ProductMongo } = await import("./mongo/product.mongo.js");
                const { default: CartMongo } = await import("./mongo/cart.mongo.js");
                const { default: UserMongo } = await import("./mongo/user.mongo.js");
                const { default: ChatMongo } = await import("./mongo/chat.mongo.js");
                const {default: TicketMongo} = await import ("./mongo/tiket.mongo.js")
                const  {default: RecoveryMongo} = await import ("./mongo/recovery.mongo.js")
                
                Recovery = RecoveryMongo;
                User = UserMongo;
                Cart = CartMongo;
                Product = ProductMongo;
                Chat = ChatMongo;
                Ticket = TicketMongo
          
            
        
        break;

    case "FILE":
        
            const { default: ProductFile } = await import("./manager/product.file.js");
            const { default: CartFile } = await import("./manager/cart.file.js");
            const { default: UserFile } = await import("./manager/user.file.js");
            const { default: ChatFile } = await import("./manager/chat.file.js");
            const { default: TicketFile } = await import("./manager/ticket.file.js");

            User = UserFile;
            Cart = CartFile;
            Product = ProductFile;
            Chat = ChatFile;
            Ticket = TicketFile


            break

       
    default:
        break;
}
