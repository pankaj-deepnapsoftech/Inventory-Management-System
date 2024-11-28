exports.globalErrorHandler = (err, req, res, next)=>{
    err.message ||= "Internal Server Error";
    err.statusCode ||= 500

    // TODO - HANDLE COMMON TYPES OF ERROR AND THEIR MESSAGES WITH STATUS CODE MANUALLY
    if (err.name === 'ValidationError') {
        const errorMessages = Object.values(err.errors).map(err => err.message);
        const errorMessage = errorMessages.join(', ');
        return res.status(400).json({
            status: 400,
            success: false,
            message: errorMessage
        });
    }
    else if(err.name === "MongoServerError" && err.code === 11000){
        let message = '';
        if(err.message.includes('email')){
            message = "Email Id is already registered";
        }
        else if(err.message.includes('phone')){
            message = "Phone No. is already registered";
        }
        else if(err.message.includes('product_id')){
            message = "Product Id is already used";
        }
        else if(err.message.includes('company_email')){
            message = "Company Email Id is already registered";
        }
        else if(err.message.includes('company_phone')){
            message = "Company Phone No. is already registered";
        }
        else if(err.message.includes('role')){
            message = "Role is already created";
        }
        else{
            message = "A unique constraint error occurred";
        }

        return res.status(400).json({
            status: 400,
            success: false,
            message: message
        });
    }

    return res.status(err.statusCode).json({
        status: err.statusCode,
        success: false,
        message: err.message
    })
}