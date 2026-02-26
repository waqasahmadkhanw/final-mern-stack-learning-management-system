import mongoose from "mongoose"
import { Schema } from "mongoose"

const courseSchema=new Schema({
title:{

},
des:{

},
category:{

},
instrutor:{

},
price:{

}
},{timestamps:true})
export const Course=mongoose.model("Course",courseSchema)