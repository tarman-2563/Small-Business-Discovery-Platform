const mongoose=require("mongoose");

const businessSchema=new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    businessName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true,
        enum:["Restaurant","Retail","Service","Entertainment","Health","Education","Others"]
    },
    images:[{
        type:String
    }],
    location:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        },
        address:{
            type:String,
            required:true
        }
    },
    contactInfo:{
        phone:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        website:{
            type:String,
            default:""
        }
    },
    operatingHours:{
        monday:{
            open:{type:String, default:"09:00"},
            close:{type:String, default:"17:00"}
        },
        tuesday:{
            open:{type:String, default:"09:00"},
            close:{type:String, default:"17:00"}
        },
        wednesday:{
            open:{type:String, default:"09:00"},
            close:{type:String, default:"17:00"}
        },
        thursday:{
            open:{type:String, default:"09:00"},
            close:{type:String, default:"17:00"}
        },
        friday:{
            open:{type:String, default:"09:00"},
            close:{type:String, default:"17:00"}
        },
        saturday:{
            open:{type:String, default:"10:00"},
            close:{type:String, default:"16:00"}
        },
        sunday:{
            open:{type:String, default:"Closed"},
            close:{type:String, default:"Closed"}
        }
    },
    rating:{
        type:Number,
        default:0,
        min:0,
        max:5
    },
    reviews:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        enum:["pending","approved","rejected"],
        default:"pending"
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true
})

businessSchema.index({ location: '2dsphere' });

const Business=mongoose.model("Business",businessSchema);
module.exports=Business;