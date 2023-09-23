import FileManager from './file.manager.js';

export default class Ticket extends FileManager {
    constructor(filename = "./db.ticket.json") {
        super(filename)
    }

    getTicket = async () => { return await this.get() }

    createChat = async ({
        code,
        purchase_datetime,
        amount,
        purchaser
    }) => {
        const ticket = {
            code,
            purchase_datetime,
            amount,
            purchaser
        }
        await this.write([...await this.get(), ticket]);
        return ticket;
    }

}  