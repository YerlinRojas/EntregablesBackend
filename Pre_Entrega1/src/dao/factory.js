import configMongo from "../config/mongo.config.js";
import mongoose from "mongoose";

//import ProductFile from "../dao/manager/product.file.js"
//import http from "http";
//import { Server } from 'socket.io'
//const productFile = new ProductFile ()

export let User
export let Cart
export let Product
export let Chat

console.log(`Persistence with ${configMongo.PERSISTENCE}`);

(async () => {
    switch (configMongo.PERSISTENCE) {
        case "MONGO":
            try {
                mongoose
                    .connect(configMongo.URL,
                        {
                            useNewUrlParser: true,
                            useUnifiedTopology: true,
                            dbName: configMongo.dbName
                        })
                //.then(() => {
                //configuracion socket io
                //  const httpServer = http.createServer(app);
                // const io = new Server(httpServer);
                // const messages = [];
                //socket-------------
                /* io.on("connection", (socket) => {
                    socket.on("new", (user) =>
                        console.log(`${user} se acaba de conectar`)
                    );

                    //chat
                    socket.on("message", (data) => {
                        messages.push(data);
                        io.emit("logs", messages);
                    });

                    //Agrega producto por el productManager import
                    socket.on("addProduct", async (data) => {
                        await productFile.create(data);
                        const get = await productFile.getList();
                        io.emit("productAdded", get);
                    });

                    //Delete product
                    socket.on("deleteProduct", async (id) => {
                        await productFile.deleteProduct(id);
                        const get = await productFile.getList();
                        console.log(get);
                        io.emit("productDeleted", get);
                    });

                    socket.on("disconnect", () => {
                        console.log("Client disconnected");
                    });
                }); */

                const { default: ProductMongo } = await import("./mongo/product.mongo.js");
                const { default: CartMongo } = await import("./mongo/cart.mongo.js");
                const { default: UserMongo } = await import("./mongo/user.mongo.js");
                const { default: ChatMongo } = await import("./mongo/chat.mongo.js");

                User = UserMongo;
                Cart = CartMongo;
                Product = ProductMongo;
                Chat = ChatMongo;
            } catch (error) {
                console.error("Error connecting to MongoDB:", error);
            }


            break;


        case "FILE":
            try {
                const { default: ProductFile } = await import("./manager/product.file.js");
                const { default: CartFile } = await import("./manager/cart.file.js");
                const { default: UserFile } = await import("./manager/user.file.js");
                const { default: ChatFile } = await import("./manager/chat.file.js");

                User = UserFile;
                Cart = CartFile;
                Product = ProductFile;
                Chat = ChatFile;

                break
            
            } catch (error) {
        console.error("Error importing file-based modules:", error);
    }
        
    default:
    break;
}
}) ();
