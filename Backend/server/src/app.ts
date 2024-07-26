import express, { Application } from 'express';

class ExpressServerInstance {
  private app: Application;
  private port = process.env.PORT || 3008;

  constructor() {
    this.app = express();
  }

  public startServer() {
    this.app.listen(this.port, () => {
      console.log(`⚡Server is Running on PORT ${this.port}`);
    });
  }
}

export default ExpressServerInstance;
