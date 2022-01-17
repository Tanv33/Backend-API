import mongoose from "mongoose";

const connectWithDataBase = () => {
  mongoose.connect(
    "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false",
    () => {
      console.log("connected to mongoDB Database");
    }
  );
  mongoose.connection.on("error", (err) => {
    console.log(err);
  });
};
export default connectWithDataBase;
