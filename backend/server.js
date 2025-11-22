const express=require("express");

const app=express();

app.use(express.json());

app.get("/health",(req,res)=>{
    res.status(200).send("Server is up and running");
})

const PORT=process.env.PORT;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})