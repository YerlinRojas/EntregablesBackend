
export default class TicketDTO {
    constructor(code, amount, purchaser, purchaseDatetime) {
      this.code = code; // va a ser el codigo de mongo
      this.amount = amount; // Monto total de la compra
      this.purchaser = purchaser; // Nombre del comprador
      this.purchaseDatetime = purchaseDatetime; // Fecha y hora de la compra
    }
  }
  
